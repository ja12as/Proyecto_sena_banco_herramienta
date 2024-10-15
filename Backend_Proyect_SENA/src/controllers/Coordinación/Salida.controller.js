import { Op, ValidationError } from "sequelize";
import Producto from "../../models/Producto.js";
import Pedido from "../../models/Pedido.js";
import PedidoProducto from "../../models/PedidoProducto.js";
import nodemailer from "nodemailer";
import Estado from "../../models/Estado.js";

export const actualizarSalidaProducto = async (req, res) => {
  const { id } = req.params; 
  const { productos } = req.body; 

  console.log("Datos recibidos para actualizar salida:", req.body);

  try {
    const pedido = await Pedido.findByPk(id, {
      include: [{ model: Producto, through: { attributes: ['cantidadSalida', 'cantidadSolicitar'] } }],
    });

    if (!pedido) {
      return res.status(404).json({ message: `Pedido con id ${id} no encontrado.`});
    }
    for (const producto of productos) {
      if (typeof producto.cantidadSalida !== 'number' || isNaN(producto.cantidadSalida) || producto.cantidadSalida < 0) {
          return res.status(400).json({ message: `La cantidad de salida para el producto ${producto.ProductoId} no es válida.` });
      }
  }

    for (const producto of productos) {
      const pedidoProducto = await PedidoProducto.findOne({
        where: {
          PedidoId: pedido.id,
          ProductoId: producto.ProductoId,
        },
      });

      if (!pedidoProducto) {
        return res.status(404).json({ message: `El producto con id ${producto.ProductoId} no está asociado a este pedido.` });
      }

      const cantidadSolicitar = pedidoProducto.cantidadSolicitar - pedidoProducto.cantidadSalida;
      if (producto.cantidadSalida > cantidadSolicitar) {
        return res.status(400).json({ message: `La cantidad solicitada para el producto ${producto.ProductoId} excede la cantidad disponible.` });
      }

      pedidoProducto.cantidadSalida += producto.cantidadSalida;
      await pedidoProducto.save();

      const productoData = await Producto.findByPk(producto.ProductoId);
      if (!productoData) {
        return res.status(404).json({ message: `Producto con id ${producto.ProductoId} no encontrado.` });
      }

      if (productoData.cantidadActual < producto.cantidadSalida) {
        return res.status(400).json({ message: `No hay suficiente cantidad en inventario para el producto ${producto.ProductoId}.` });
      }

      productoData.cantidadActual -= producto.cantidadSalida; 
      productoData.cantidadSalida = (productoData.cantidadSalida || 0) + producto.cantidadSalida; 
      
      if (productoData.cantidadActual <= 2) {
        const estadoAgotado = await Estado.findOne({ where: { estadoName: "AGOTADO" } });
        if (estadoAgotado) {
          productoData.EstadoId = estadoAgotado.id; 
        }
      }

      await productoData.save();
    }

    try {
      console.log("Enviando correo de notificación para el pedido:", pedido);
      console.log("Correo del pedido:", pedido.correo); 
      await enviarCorreoNotificacion(pedido);
      console.log("Correo enviado exitosamente");
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
  // Obtener los productos del pedido junto con la información de la tabla intermedia
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

  // Construir el contenido HTML del correo
  let tablaProductos = `
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad Solicitada</th>
          <th>Cantidad Entregada</th>
          <th>Observaciones</th>
        </tr>
      </thead>
      <tbody>`;

  // Agregar una fila para cada producto
  pedidoConProductos.Productos.forEach((producto) => {
    const { nombre } = producto; // Nombre del producto
    const { cantidadSolicitar, cantidadSalida, observaciones} = producto.PedidoProducto; // Cantidad solicitada y entregada

    tablaProductos += `
      <tr>
        <td>${nombre}</td>
        <td>${cantidadSolicitar}</td>
        <td>${cantidadSalida}</td>
        <td>${observaciones}</td>
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
  // Contenido HTML del correo
  const mailOptions = {
    from: 'inventariodelmobiliario@gmail.com',
    to: pedido.correo, 
    subject: 'Notificación de salida de productos',
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #007BFF;">¡Hola ${pedido.servidorAsignado}!</h2>
      <p>
        Nos complace informarte que tu pedido del día <strong>${pedido.createdAt.toLocaleDateString()}</strong> para la ficha 
        <strong>${pedido.codigoFicha}</strong> ya está listo para ser recogido.
      </p>
      <p>
        Puedes pasar por el en horario del personal del banco de herramientas. 
      </p>
      <p style="font-weight: bold; color: #28A745;">
        ¡Gracias por tu confianza!
      </p>
    </div>
    <p>A continuación se muestran los detalles de los productos:</p>
    ${tablaProductos}
  `,
  };

  // Enviar el correo
  await transporter.sendMail(mailOptions);
}; 
