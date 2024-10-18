
import Notificacion from "../../models/Notificaciones.js";
import Usuario from "../../models/Usuario.js";


export const getAllNotifications = async (req, res) => {
    try {
      // Obtener todas las notificaciones incluyendo el nombre del usuario
      const notificaciones = await Notificacion.findAll({
        order: [['createdAt', 'DESC']], 
        include: [
          {
            model: Usuario,
            attributes: ['id','nombre'], 
          },
        ],
      });
  
      res.status(200).json(notificaciones);
    } catch (error) {
      console.error('Error al obtener las notificaciones:', error);
      res.status(500).json({ message: 'Error al obtener las notificaciones' });
    }
};

export const putNotificaciones = async (req, res) => {
  try {
      const { id } = req.params;
      const notificacion = await Notificacion.findByPk(id);

      if (!notificacion) {
          return res.status(404).json({ message: "Notificación no encontrada" });
      }

      notificacion.nueva = false; // Marcamos como leída
      await notificacion.save();
      res.status(200).json({ message: "Notificación marcada como leída" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const putNotificacionNoLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificacion.findByPk(id);

    if (!notificacion) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    notificacion.nueva = true; // Marcamos como no leída
    await notificacion.save();
    res.status(200).json({ message: "Notificación marcada como no leída" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
