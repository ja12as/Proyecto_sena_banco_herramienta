import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Op, ValidationError } from "sequelize";
import Herramienta from "../../models/Herramientas.js";
import Estado from "../../models/Estado.js";
import Prestamo from "../../models/Prestamos.js";
import PrestamoHerramienta from "../../models/intermediaria.js";
import cronJob from "node-cron";
import nodemailer from "nodemailer";
import { createNotification } from "../../helpers/Notificacion.helpers.js";




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const crearPrestamo = async (req, res) => {
  const {
    codigoFicha,
    area,
    correo,
    jefeOficina,
    cedulaJefeOficina,
    servidorAsignado,
    cedulaServidor,
    herramientas,
  } = req.body;

  console.log("Datos recibidos para crear el préstamo:", req.body);

  try {
 /*    const UsuarioId = req.usuario.id; */

    const estadoPendiente = await Estado.findOne({ where: { estadoName: "PENDIENTE" } });
    if (!estadoPendiente) {
      return res.status(404).json({ message: "No se encontró el estado 'PENDIENTE'. Asegúrate de que esté creado en la base de datos." });
    }

    const nuevoPrestamo = await Prestamo.create({
      codigoFicha,
      area,
      correo,
      jefeOficina,
      cedulaJefeOficina,
      servidorAsignado,
      cedulaServidor,
      EstadoId: estadoPendiente.id,
    });
/*  const mensajeNotificacion = `El Servidor ${nuevoPrestamo.servidorAsignado} a solicitado un prestamo para la ficha(${nuevoPrestamo.codigoFicha}, con el coordinador: ${nuevoPrestamo.jefeOficina}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);
  */
    for (const herramienta of herramientas) {
      const herramientaData = await Herramienta.findByPk(herramienta.HerramientumId);
      if (!herramientaData) {
        return res.status(404).json({ message: `Herramienta con ID ${herramienta.HerramientumId} no encontrada. Verifica que el ID sea correcto.` });
      }

      try {
        await PrestamoHerramienta.create({
          PrestamoId: nuevoPrestamo.id,
          HerramientumId: herramienta.HerramientumId,
          observaciones: herramienta.observaciones || null,
        });
      } catch (error) {
        if (error.original && error.original.code === '23502') {
          return res.status(400).json({ message: 'Error al insertar en PrestamosHerramientas: Falta un campo requerido.' });
        }
        return res.status(500).json({ message: 'Error al agregar la herramienta al préstamo', error: error.message });
      }
    }

    cronJob.schedule("0 0 * * *", async () => {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - 3);

      const prestamoPendientes = await Prestamo.findAll({
        where: {
          firma: null,
          createdAt: { [Op.lt]: fechaLimite },
        },
      });

      if (prestamoPendientes.length > 0) {
        await Prestamo.destroy({
          where: { id: { [Op.in]: prestamoPendientes.map((p) => p.id) } },
        });
      }
    });

    return res.status(201).json({ message: "Préstamo creado con éxito", prestamo: nuevoPrestamo });
  } catch (error) {
    console.error('Error al crear préstamo:', error);
    return res.status(500).json({ message: 'Ocurrió un error inesperado.', error: error.message });
  }
};


export const getAllPrestamos = async (req, res) => {
  try {
    const prestamos = await Prestamo.findAll({
      include: [
        {
          model: Herramienta,
          through: {
            model: PrestamoHerramienta,
            attributes: ["observaciones",],
          },
        },
        { model: Estado },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(prestamos);
  } catch (error) {
    console.error("Error al obtener los préstamos:", error);
    return res.status(500).json({ message: "Error al obtener los préstamos." });
  }
};


// Obtener un préstamo específico
export const getPrestamo = async (req, res) => {
  const { id } = req.params;

  try {
    const prestamo = await Prestamo.findByPk(id, {
      include: [
        {
          model: Herramienta,
          through: {
            model: PrestamoHerramienta,
            attributes: ["observaciones"],
          },
        },
        { model: Estado },
      ],
    });

    if (!prestamo) {
      return res.status(404).json({ message: `Préstamo con id ${id} no encontrado.` });
    }

    return res.status(200).json(prestamo);
  } catch (error) {
    console.error("Error al obtener el préstamo:", error);
    return res.status(500).json({ message: "Error al obtener el préstamo." });
  }
};


// Actualizar un préstamo
export const actualizarPrestamo = async (req, res) => {
  const UsuarioId = req.usuario.id;
  const usuarioNombre = req.usuario.nombre; 
  const { id } = req.params;
  const { filename } = req.file || {}; // Manejo seguro de filename

  console.log("Datos recibidos para actualizar:", req.body);
  console.log("Archivo subido:", req.file); // Verificar si el archivo se está recibiendo

  try {
    const prestamo = await Prestamo.findByPk(id);
    if (!prestamo) {
      return res
        .status(404)
        .json({ message: `Préstamo con id ${id} no encontrado.` });
    }

    const estadoEnProceso = await Estado.findOne({
      where: { estadoName: "EN PROCESO" },
    });
    if (!estadoEnProceso) {
      return res
        .status(404)
        .json({ message: "El estado 'EN PROCESO' no existe." });
    }

    // Si se ha subido un archivo de firma, actualizar la ruta de la firma
    if (req.file && filename) {
      const firmaPath = `/uploads/${filename}`; 
      prestamo.firma = firmaPath;
    } else {
      console.log("No se ha subido ningún archivo de firma.");
    }

    // Actualizar el estado a "EN PROCESO"
    prestamo.EstadoId = estadoEnProceso.id;

    // Guardar los cambios
    await prestamo.save();
    const mensajeNotificacion = `El Coordinador ${usuarioNombre} firmo el prestamo del servidor (${prestamo.servidorAsignado}, para la ficha: ${prestamo.codigoFicha}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);

    return res
      .status(200)
      .json({ message: "Préstamo actualizado con éxito", prestamo });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: "Error de validación",
        details: error.errors.map((err) => err.message),
      });
    }
    console.error("Error al actualizar el préstamo:", error);
    return res.status(500).json({ message: "Error al actualizar el préstamo." });
  }
};


const enviarCorreoNotificacion = async (prestamo) => {
  try {
    // Obtener las herramientas asociadas al préstamo
    const prestamosHerramientas = await Prestamo.findByPk(prestamo.id, {
      include: [
        {
          model: Herramienta,
          through: {
            attributes: ['observaciones'],
          },
        },
      ],
    });

    // Verificar si se encontraron herramientas
    if (!prestamosHerramientas || !prestamosHerramientas.Herramienta || prestamosHerramientas.Herramienta.length === 0) {
      console.log('No se encontraron herramientas asociadas al préstamo.');
      return;
    }

    // Construcción de la tabla de herramientas en HTML
    let tablaHerramienta = `
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>Herramienta</th>
          <th>Código</th>
          <th>Fecha Entrega</th>
          <th>Observaciones</th>
        </tr>
      </thead>
      <tbody>`;

    prestamosHerramientas.Herramienta.forEach((herramienta) => {
      const { nombre, codigo } = herramienta;
      const { observaciones } = herramienta.PrestamoHerramienta;

      tablaHerramienta += `
        <tr>
          <td>${nombre}</td>
          <td>${codigo}</td>
          <td>${prestamo.fechaEntrega ? prestamo.fechaEntrega.toLocaleDateString() : 'Sin fecha'}</td>
          <td>${observaciones || 'N/A'}</td>
        </tr>`;
    });

    tablaHerramienta += `
      </tbody>
    </table>`;

    // Configuración del transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "inventariodelmobiliario@gmail.com",
        pass: "xieo yngh kruv rsta",
      },
      debug: true, // Activar depuración
      logger: true, // Activar logs detallados
    });

    // Opciones de envío del correo
    const mailOptions = {
      from: 'inventariodelmobiliario@gmail.com',
      to: prestamo.correo,
      subject: 'Notificación de entrega de herramientas',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #007BFF;">¡Hola ${prestamo.servidorAsignado}!</h2>
        <p>
          Nos complace informarte que tu préstamo del día <strong>${prestamo.fechaPrestamos.toLocaleDateString()}</strong> para la ficha 
          <strong>${prestamo.codigoFicha}</strong> ya está listo para ser recogido.
        </p>
        <p>Puedes pasar por el banco de herramientas en horario de atención.</p>
        <p style="font-weight: bold; color: #28A745;">¡Gracias por tu confianza!</p>
      </div>
      <p>A continuación se muestran los detalles de las herramientas:</p>
      ${tablaHerramienta}`,
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: %s', info.messageId);
  } catch (error) {
    console.error('Error al enviar el correo de notificación:', error);
  }
};


export const entregarHerramientas = async (req, res) => {
  const { id } = req.params;

  try {
    const UsuarioId = req.usuario.id;
    const usuarioNombre = req.usuario.nombre; 
    const prestamo = await Prestamo.findOne({
      where: { id },
      include: [
        {
          model: Herramienta,
          through: { attributes: [] },
        },
      ],
    });

    if (!prestamo) {
      return res.status(404).json({ mensaje: "Préstamo no encontrado" });
    }

    if (prestamo.EstadoId === 7) {
      return res.status(400).json({ mensaje: "El préstamo ya ha sido entregado" });
    }

    if (!prestamo.firma) {
      return res.status(400).json({ mensaje: "El préstamo aún no ha sido firmado por el coordinador" });
    }

    const herramientas = prestamo.Herramienta || [];

    if (herramientas.length === 0) {
      return res.status(400).json({ mensaje: "No hay herramientas asociadas a este préstamo" });
    }

    for (const herramienta of herramientas) {
      if (herramienta.estado === "EN USO") {
        return res.status(400).json({ mensaje: `La herramienta con ID ${herramienta.id} ya está en uso` });
      }

      await herramienta.update({ EstadoId: 4 }); // Cambia el estado a "EN USO"

      const existeRelacion = await PrestamoHerramienta.findOne({
        where: {
          PrestamoId: prestamo.id,
          HerramientumId: herramienta.id,
        },
      });

      if (!existeRelacion) {
        await PrestamoHerramienta.create({
          PrestamoId: prestamo.id,
          HerramientumId: herramienta.id,
        });
      }
    }
   // Crear mensaje de notificación usando los datos correctos del préstamo
    const mensajeNotificacion = `El Usuario ${usuarioNombre} entregó el préstamo del servidor (${prestamo.servidorAsignado}, para la ficha: ${prestamo.codigoFicha}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);


    // Actualizar el estado del préstamo a "ENTREGADO" (ID 7)
    prestamo.EstadoId = 7;
    prestamo.fechaEntrega = new Date(); // Añade la fecha de entrega actual
    await prestamo.save();

    // Enviar correo de notificación
    await enviarCorreoNotificacion(prestamo);

    res.status(200).json({ mensaje: "Herramientas entregadas con éxito" });
  } catch (error) {
    console.error("Error al entregar las herramientas:", error);
    return res.status(500).json({ mensaje: "Error al entregar las herramientas", error: error.message });
  }
};
