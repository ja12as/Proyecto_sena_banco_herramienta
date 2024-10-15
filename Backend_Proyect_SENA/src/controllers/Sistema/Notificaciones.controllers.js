
import Notificacion from "../../models/Notificaciones.js";
import Usuario from "../../models/Usuario.js";

export const getNotifications = async (req, res) => {
    const { UsuarioId } = req.params;
    try {
        const notifications = await Notificacion.findAll({
            where: { UsuarioId },
            order: [['createdAt', 'DESC']], // Ordenar por fecha
        });
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener notificaciones." });
    }
};

export const getAllNotifications = async (req, res) => {
    try {
      // Obtener todas las notificaciones incluyendo el nombre del usuario
      const notificaciones = await Notificacion.findAll({
        order: [['createdAt', 'DESC']], // Ordena por createdAt en orden descendente
        include: [
          {
            model: Usuario,
            attributes: ['nombre'], // Incluir solo el nombre del usuario
          },
        ],
      });
  
      res.status(200).json(notificaciones);
    } catch (error) {
      console.error('Error al obtener las notificaciones:', error);
      res.status(500).json({ message: 'Error al obtener las notificaciones' });
    }
};
