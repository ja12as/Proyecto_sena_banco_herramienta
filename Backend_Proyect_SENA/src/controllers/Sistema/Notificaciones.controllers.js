
import Notificacion from "../../models/Notificaciones.js";
import UsuarioNotificacion from "../../models/NotificacionesUsuarios.js";
import Usuario from "../../models/Usuario.js";


export const getAllNotifications = async (req, res) => {
  try {
    const UsuarioId = req.usuario.id; // Obtener el ID del usuario actual
    console.log("UsuarioId obtenido:", UsuarioId);

    // Buscar notificaciones asociadas al UsuarioId y que estén en estado 'leida: false'
    const notificaciones = await Notificacion.findAll({
      include: [
        {
          model: Usuario,
          through: {
            model: UsuarioNotificacion,
            where: {
              UsuarioId: UsuarioId, // Filtrar por el usuario actual
              leida: false,         // Solo las no leídas
            },
            attributes: ["leida"], // Incluir el estado 'leida'
          },
          as: "usuarios",
          required: true, // Solo incluir notificaciones que tengan usuarios asociados
        },
      ],
      order: [["createdAt", "DESC"]], // Ordenar por la fecha de creación, más reciente primero
    });

    // Transformar las notificaciones para hacerlas más legibles
    const response = notificaciones.map(noti => ({
      ...noti.toJSON(),
      usuarios: noti.usuarios.map(u => ({
        leida: u.UsuarioNotificacion.leida,
        UsuarioId: u.id, // Incluir el UsuarioId asociado
      })),
    }));

    console.log("Notificaciones obtenidas:", response);
    res.status(200).json(response); // Enviar la respuesta al cliente
  } catch (error) {
    console.error("Error al obtener las notificaciones:", error.message);
    res.status(500).json({ message: "Error al obtener las notificaciones." });
  }
};






// Marcar notificación como leída
export const putNotificaciones = async (req, res) => {
  try {
    const { id } = req.params; // ID de la notificación
    
    // Verifica si req.usuario y su id existen
    if (!req.usuario || !req.usuario.id) {
      return res.status(400).json({ message: "Usuario no autenticado o ID de usuario no definido" });
    }
    
    const UsuarioId = req.usuario.id; // Usuario que hace la solicitud

    console.log("ID de la notificación:", id);
    console.log("ID del usuario:", UsuarioId);

    const usuarioNotificacion = await UsuarioNotificacion.findOne({
      where: { NotificacionId: id, UsuarioId },
    });

    if (!usuarioNotificacion) {
      return res.status(404).json({ message: "Relación no encontrada" });
    }

    usuarioNotificacion.leida = true; // Marcamos como leída
    await usuarioNotificacion.save(); // Aseguramos que se guarde

    res.status(200).json({ message: "Notificación marcada como leída" });
  } catch (error) {
    console.error("Error al marcar la notificación como leída:", error);
    res.status(500).json({ message: error.message });
  }
};


// Marcar notificación como no leída
export const putNotificacionNoLeida = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica si req.usuario y su id existen
    if (!req.usuario || !req.usuario.id) {
      return res.status(400).json({ message: "Usuario no autenticado o ID de usuario no definido" });
    }

    const UsuarioId = req.usuario.id;

    console.log("ID de la notificación:", id);
    console.log("ID del usuario:", UsuarioId);

    const usuarioNotificacion = await UsuarioNotificacion.findOne({
      where: { NotificacionId: id, UsuarioId },
    });

    if (!usuarioNotificacion) {
      return res.status(404).json({ message: "Relación no encontrada" });
    }

    usuarioNotificacion.leida = false; // Marcamos como no leída
    await usuarioNotificacion.save();

    res.status(200).json({ message: "Notificación marcada como no leída" });
  } catch (error) {
    console.error("Error al marcar la notificación como no leída:", error);
    res.status(500).json({ message: error.message });
  }
};
