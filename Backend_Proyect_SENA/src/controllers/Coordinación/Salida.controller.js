import { Op, ValidationError } from "sequelize";
import Producto from "../../models/Producto.js";
import Pedido from "../../models/Pedido.js";
import PedidoProducto from "../../models/PedidoProducto.js";
import nodemailer from "nodemailer";
import Estado from "../../models/Estado.js";
import Historial from "../../models/Historial.js";
import { createNotification } from "../../helpers/Notificacion.helpers.js";

export const actualizarSalidaProducto = async (req, res) => {
  const { id } = req.params; 
  const { productos } = req.body; 

  try {
    const UsuarioId = req.usuario.id;
    const usuarioNombre = req.usuario.nombre;

    const pedido = await Pedido.findByPk(id, {
      include: [{ model: Producto, through: { attributes: ['cantidadSalida', 'cantidadSolicitar', 'observaciones'] } }],
    });

    if (!pedido) {
      return res.status(404).json({ message: `Pedido con id ${id} no encontrado.` });
    }

    for (const producto of productos) {

      const productoData = await Producto.findByPk(producto.ProductoId);

      if (!productoData) {
        return res.status(404).json({ message: `Producto con id ${producto.ProductoId} no encontrado.` });
      }

      const cantidadDisponible = productoData.cantidadActual;

      if (producto.cantidadSalida > cantidadDisponible) {
        return res.status(400).json({
          message: `La cantidad solicitada para el producto ${producto.ProductoId} excede la cantidad disponible. Cantidad disponible: ${cantidadDisponible}.`
        });
      }

      const pedidoProducto = await PedidoProducto.findOne({
        where: {
          PedidoId: pedido.id,
          ProductoId: producto.ProductoId,
        },
      });

      if (!pedidoProducto) {
        return res.status(404).json({ message: `El producto con id ${producto.ProductoId} no está asociado a este pedido.` });
      }

      pedidoProducto.observaciones = (producto.observaciones && typeof producto.observaciones === "string" && producto.observaciones.trim() !== "") 
      ? producto.observaciones.trim() 
      : "N/A";

      // Actualizar la cantidad de salida y la cantidad en inventario
      pedidoProducto.cantidadSalida += producto.cantidadSalida;
      await pedidoProducto.save();

      productoData.cantidadActual -= producto.cantidadSalida;
      productoData.cantidadSalida = (productoData.cantidadSalida || 0) + producto.cantidadSalida;

      // Verificar si la cantidad restante es baja y cambiar el estado a "AGOTADO" si es necesario
      if (productoData.cantidadActual <= 2) {
        const estadoAgotado = await Estado.findOne({ where: { estadoName: "AGOTADO" } });
        if (estadoAgotado) {
          productoData.EstadoId = estadoAgotado.id;
        }
      }

      await productoData.save();
    }

    const descripcionHistorial = `El usuario ${usuarioNombre} realizó la entrega de productos para el pedido con servidor asignado: ${pedido.servidorAsignado}, jefe de oficina: ${pedido.jefeOficina}, código de ficha: ${pedido.codigoFicha}.`;

    await Historial.create({
      UsuarioId: UsuarioId,
      tipoAccion: 'ENTREGA',
      descripcion: descripcionHistorial,
    });

    const mensajeNotificacion = `El Usuario ${usuarioNombre} entregó el pedido para el servidor ${pedido.servidorAsignado} (Ficha: ${pedido.codigoFicha}, Jefe de Oficina: ${pedido.jefeOficina})`;
    await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);

    const estadoEntregado = await Estado.findByPk(7);
    if (!estadoEntregado) {
      return res.status(400).json({ message: "El estado de 'Entregado' no existe." });
    }

    pedido.EstadoId = estadoEntregado.id;
    await pedido.save();

    try {
      await enviarCorreoNotificacion(pedido, mensajeNotificacion);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }

    return res.status(200).json({ message: "Salida de productos actualizada con éxito", pedido });

  } catch (error) {
    console.error("Error al actualizar la salida de productos:", error);
    return res.status(500).json({ message: "Error al actualizar la salida de productos." });
  }
};







const enviarCorreoNotificacion = async (pedido) => {

  const pedidoConProductos = await Pedido.findByPk(pedido.id, {
    include: [
      {
        model: Producto,
        through: {
          attributes: ['cantidadSalida', 'cantidadSolicitar', 'observaciones'],
        },
      },
    ],
  });

  const formatFecha = (fecha) =>
    fecha ? fecha.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Sin fecha';

  let tablaProductos = `
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad Solicitada</th>
          <th>Cantidad Entregada</th>
          <th>Observaciones</th>
          <th>Fecha Entrega</th>
        </tr>
      </thead>
      <tbody>`;

  pedidoConProductos.Productos.forEach((producto) => {
    const { nombre } = producto;
    const { cantidadSolicitar, cantidadSalida, observaciones} = producto.PedidoProducto; 

    tablaProductos += `
      <tr>
        <td>${nombre}</td>
        <td>${cantidadSolicitar}</td>
        <td>${cantidadSalida}</td>
        <td>${observaciones || 'N/A'}</td>
        <td>${formatFecha(pedido.updatedAt)}</td>
      </tr>`;
  });

  tablaProductos += `
      </tbody>
    </table>`;

    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: "inventariodelmobiliario@gmail.com",
        pass: "xieo yngh kruv rsta", 
      },
    });

  const mailOptions = {
    from: 'inventariodelmobiliario@gmail.com',
    to: pedido.correo, 
    subject: 'Notificación de salida de productos',
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #007BFF;">¡Hola ${pedido.servidorAsignado}!</h2>
      <p>
        Nos complace informarte que tu pedido del día <strong>${formatFecha(pedido.createdAt)}</strong> para la ficha 
        <strong>${pedido.codigoFicha}</strong> ya está listo para ser recogido.
      </p>
      <p>
        Puedes pasar por el banco de herramientas en horario de atención. 
      </p>
      <p style="font-weight: bold; color: #28A745;">
        ¡Gracias por tu confianza!
      </p>
    </div>
    <p>A continuación se muestran los detalles de los productos:</p>
    ${tablaProductos}
  `,
  };


  await transporter.sendMail(mailOptions);
}; 
