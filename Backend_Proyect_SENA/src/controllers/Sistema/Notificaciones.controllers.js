
import Notificacion from "../../models/Notificaciones.js";
import UsuarioNotificacion from "../../models/NotificacionesUsuarios.js";
import Usuario from "../../models/Usuario.js";


export const getAllNotifications = async (req, res) => {
  try {
    const UsuarioId = req.usuario.id;
    console.log("UsuarioId obtenido:", UsuarioId);

    const notificaciones = await Notificacion.findAll({
      include: [
        {
          model: Usuario,
          through: {
            model: UsuarioNotificacion,
            where: {
              UsuarioId: UsuarioId, 
              leida: false,   
            },
            attributes: ["leida"], 
          },
          as: "usuarios",
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]], 
    });


    const response = notificaciones.map(noti => ({
      ...noti.toJSON(),
      usuarios: noti.usuarios.map(u => ({
        leida: u.UsuarioNotificacion.leida,
        UsuarioId: u.id, 
      })),
    }));


    res.status(200).json(response); 
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las notificaciones." });
  }
};






// Marcar notificación como leída
export const putNotificaciones = async (req, res) => {
  try {
    const { id } = req.params; 
    
    if (!req.usuario || !req.usuario.id) {
      return res.status(400).json({ message: "Usuario no autenticado o ID de usuario no definido" });
    }
    
    const UsuarioId = req.usuario.id; 


    const usuarioNotificacion = await UsuarioNotificacion.findOne({
      where: { NotificacionId: id, UsuarioId },
    });

    if (!usuarioNotificacion) {
      return res.status(404).json({ message: "Relación no encontrada" });
    }

    usuarioNotificacion.leida = true; 
    await usuarioNotificacion.save(); 

    res.status(200).json({ message: "Notificación marcada como leída" });
  } catch (error) {
    console.error("Error al marcar la notificación como leída:", error);
    res.status(500).json({ message: error.message });
  }
};



export const putNotificacionNoLeida = async (req, res) => {
  try {
    const { id } = req.params;


    if (!req.usuario || !req.usuario.id) {
      return res.status(400).json({ message: "Usuario no autenticado o ID de usuario no definido" });
    }

    const UsuarioId = req.usuario.id;


    const usuarioNotificacion = await UsuarioNotificacion.findOne({
      where: { NotificacionId: id, UsuarioId },
    });

    if (!usuarioNotificacion) {
      return res.status(404).json({ message: "Relación no encontrada" });
    }

    usuarioNotificacion.leida = false; 
    await usuarioNotificacion.save();

    res.status(200).json({ message: "Notificación marcada como no leída" });
  } catch (error) {
    console.error("Error al marcar la notificación como no leída:", error);
    res.status(500).json({ message: error.message });
  }
};
