
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Op, ValidationError } from "sequelize";
import Producto from "../../models/Producto.js";
import Estado from "../../models/Estado.js";
import Pedido from "../../models/Pedido.js";
import PedidoProducto from "../../models/PedidoProducto.js";
import cronJob from "node-cron";
import { createNotification } from "../../helpers/Notificacion.helpers.js";
import Historial from "../../models/Historial.js";
import Usuario from "../../models/Usuario.js";

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
      return res.status(404).json({ message: "El estado 'PENDIENTE' no existe." });
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

    const mensajeNotificacion = `El Servidor público: ${nuevoPedido.servidorAsignado} ha solicitado un pedido para la ficha(${nuevoPedido.codigoFicha}, con el coordinador: ${nuevoPedido.jefeOficina}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(servidorAsignado, 'CREATE', mensajeNotificacion);


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
          .json({ message: `Producto con id ${producto.ProductoId} no encontrado.` });
      }

      await PedidoProducto.create({
        PedidoId: nuevoPedido.id,
        ProductoId: producto.ProductoId,
        cantidadSolicitar: producto.cantidadSolicitar,
        cantidadSalida: producto.cantidadSalida || 0,
        observaciones: producto.observaciones || null,
      });
    }


    // Configurar una tarea con cronJob para eliminar pedidos sin firma después de 3 días
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



export const getPedidosPorCoordinador = async (req, res) => {
  try {
    const { id: UsuarioId, RolId } = req.usuario;

    if (RolId !== 3) {
      return res.status(403).json({ message: "Acceso denegado. Solo los coordinadores pueden ver estos pedidos." });
    }

    const pedidos = await Pedido.findAll({
      where: { jefeOficina: UsuarioId }, 
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
        {
          model: Usuario,
          attributes: ["nombre"], 
          as: "coordinador",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (pedidos.length === 0) {
      return res.status(404).json({ message: "No se encontraron pedidos para este coordinador." });
    }

    const result = pedidos.map((pedido) => ({
      ...pedido.toJSON(), 
      jefeOficina: pedido.coordinador?.nombre || null,
      jefeOficina: undefined,
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener los pedidos del coordinador:", error);
    return res.status(500).json({ message: "Error al obtener los pedidos." });
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
        {
          model: Estado,
        },
        {
          model: Usuario,
          attributes: ["nombre"],
          as: "coordinador", 
        },
      ],
      order: [["createdAt", "DESC"]],
    });


    const result = pedidos.map((pedido) => ({
      ...pedido.toJSON(),
      jefeOficina: pedido.coordinador?.nombre || null, 
    }));

    return res.status(200).json(result);
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
        {
          model: Usuario,
          attributes: ["nombre"], 
          as: "coordinador", 
        },
      ],
    });

    if (!pedido) {
      return res
        .status(404)
        .json({ message: `Pedido con id ${id} no encontrado.` });
    }

    const pedidoJSON = pedido.toJSON();
    pedidoJSON.jefeOficinaNombre = pedido.coordinador?.nombre || null;
    pedidoJSON.jefeOficina = undefined;

    return res.status(200).json(pedidoJSON);
  } catch (error) {
    console.error("Error al obtener el pedido:", error);
    return res.status(500).json({ message: "Error al obtener el pedido." });
  }
};



export const actualizarPedido = async (req, res) => {
  const { id } = req.params;
  const { filename } = req.file || {}; 

  console.log("Datos recibidos para actualizar:", req.body);
  console.log("Archivo subido:", req.file); 

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

    await pedido.save();

    const mensajeNotificacion = `El Coordinador ${usuarioNombre} firmo el pedido del servicor público: (${pedido.servidorAsignado}, para la ficha: ${pedido.codigoFicha}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);

  
    const descripcionHistorial = `El coordinador ${usuarioNombre} ha autorizado el pedido del servidor público ${pedido.servidorAsignado} asignado a la ficha ${pedido.codigoFicha} el ${new Date().toLocaleDateString()}.`;

    await Historial.create({
      tipoAccion: "AUTORIZAR",
      descripcion: descripcionHistorial,
      UsuarioId: UsuarioId, // ID del coordinador que está autorizando
    });
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