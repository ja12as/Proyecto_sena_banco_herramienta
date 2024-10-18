import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Op, ValidationError } from "sequelize";
import Producto from "../../models/Producto.js";
import Estado from "../../models/Estado.js";
import Pedido from "../../models/Pedido.js";
import PedidoProducto from "../../models/PedidoProducto.js";
import cronJob from "node-cron";
import { createNotification } from "../../helpers/Notificacion.helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const crearPedido = async (req, res) => {
  const {
    codigoFicha,
    area,
    correo,
    jefeOficina,
    cedulaJefeOficina,
    servidorAsignado,
    cedulaServidor,
    productos,
  } = req.body;

  console.log("Datos recibidos para crear el pedido:", req.body);

  try {
    const estadoPendiente = await Estado.findOne({
      where: { estadoName: "PENDIENTE" },
    });
    if (!estadoPendiente) {
      return res
        .status(404)
        .json({ message: "El estado 'PENDIENTE' no existe." });
    }

    const nuevoPedido = await Pedido.create({
      codigoFicha,
      area,
      jefeOficina,
      cedulaJefeOficina,
      servidorAsignado,
      cedulaServidor,
      correo,
      EstadoId: estadoPendiente.id,
      firma: null,
    });

    for (const producto of productos) {
      if (!producto.cantidadSolicitar || producto.cantidadSolicitar <= 0) {
        return res.status(400).json({
          message: `La cantidad solicitada para el producto con id ${producto.ProductoId} no puede ser nula o cero.`,
        });
      }

      const productoData = await Producto.findByPk(producto.ProductoId);
      if (!productoData) {
        return res
          .status(404)
          .json({
            message: `Producto con id ${producto.ProductoId} no encontrado.`,
          });
      }

      await PedidoProducto.create({
        PedidoId: nuevoPedido.id,
        ProductoId: producto.ProductoId,
        cantidadSolicitar: producto.cantidadSolicitar,
        cantidadSalida: producto.cantidadSalida || 0,
        observaciones: producto.observaciones || null,
      });
    }

    cronJob.schedule("0 0 * * *", async () => {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - 3);

      const pedidosPendientes = await Pedido.findAll({
        where: {
          firma: null,
          createdAt: { [Op.lt]: fechaLimite },
        },
      });

      if (pedidosPendientes.length > 0) {
        await Pedido.destroy({
          where: { id: { [Op.in]: pedidosPendientes.map((p) => p.id) } },
        });
      }
    });

    return res
      .status(201)
      .json({ message: "Pedido creado con éxito", pedido: nuevoPedido });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: "Error de validación",
        details: error.errors.map((err) => err.message),
      });
    }
    console.error("Error al crear el pedido:", error);
    return res.status(500).json({ message: "Error al crear el pedido." });
  }
};



export const getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Producto,
          through: {
            attributes: [
              "cantidadSolicitar",
              "cantidadSalida",
              "observaciones",
            ],
          },
        },
        { model: Estado },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(pedidos);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    return res.status(500).json({ message: "Error al obtener los pedidos." });
  }
};

export const getPedido = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await Pedido.findByPk(id, {
      include: [
        {
          model: Producto,
          through: {
            attributes: [
              "cantidadSolicitar",
              "cantidadSalida",
              "observaciones",
            ],
          },
        },
        { model: Estado },
      ],
    });

    if (!pedido) {
      return res
        .status(404)
        .json({ message: `Pedido con id ${id} no encontrado.` });
    }

    return res.status(200).json(pedido);
  } catch (error) {
    console.error("Error al obtener el pedido:", error);
    return res.status(500).json({ message: "Error al obtener el pedido." });
  }
};



export const actualizarPedido = async (req, res) => {
  const { id } = req.params;
  const { filename } = req.file || {}; // Manejo seguro de filename

  console.log("Datos recibidos para actualizar:", req.body);
  console.log("Archivo subido:", req.file); // Verificar si el archivo se está recibiendo

  try {
    const UsuarioId = req.usuario.id;
    const usuarioNombre = req.usuario.nombre; 

    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res
        .status(404)
        .json({ message: `Pedido con id ${id} no encontrado.` });
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
      pedido.firma = firmaPath;
    } else {
      console.log("Ruta de la firma guardada:", firmaPath);
    }

    // Actualizar el estado a "EN PROCESO"
    pedido.EstadoId = estadoEnProceso.id;

    // Guardar los cambios
    await pedido.save();

    const mensajeNotificacion = `El Coordinador ${usuarioNombre} firmo el pedido del servicor (${pedido.servidorAsignado}, para la ficha: ${pedido.codigoFicha}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);


    return res
      .status(200)
      .json({ message: "Pedido actualizado con éxito", pedido });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: "Error de validación",
        details: error.errors.map((err) => err.message),
      });
    }
    console.error("Error al actualizar el pedido:", error);
    return res.status(500).json({ message: "Error al actualizar el pedido." });
  }
};