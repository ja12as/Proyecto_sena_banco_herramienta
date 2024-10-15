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
      const firmaPath = path.join(__dirname, "../../uploads", filename);
      prestamo.firma = firmaPath;
    } else {
      console.log("No se ha subido ningún archivo de firma.");
    }

    // Actualizar el estado a "EN PROCESO"
    prestamo.EstadoId = estadoEnProceso.id;

    // Guardar los cambios
    await prestamo.save();

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
