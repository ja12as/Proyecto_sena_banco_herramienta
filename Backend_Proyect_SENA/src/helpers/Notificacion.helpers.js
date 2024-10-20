import Notificacion from "../models/Notificaciones.js";
import cron from "node-cron";
import { Op } from "sequelize";
import UsuarioNotificacion from "../models/NotificacionesUsuarios.js";
import Usuario from "../models/Usuario.js"; // Asegúrate de importar el modelo de Usuario

// Función para calcular la fecha de eliminación en días hábiles
const calcularFechaEliminacion = (fechaCreacion, diasHabiles) => {
  let fechaEliminacion = new Date(fechaCreacion);
  let diasContados = 0;

  while (diasContados < diasHabiles) {
    fechaEliminacion.setDate(fechaEliminacion.getDate() + 1);
    if (fechaEliminacion.getDay() !== 0 && fechaEliminacion.getDay() !== 6) { // Excluye fines de semana
      diasContados++;
    }
  }

  return fechaEliminacion;
};

// Crear Notificación y asociarla a todos los usuarios
export const createNotification = async (
  UsuarioId,
  actionType,
  message,
  fechaCreacion = new Date(),
  diasHabiles = 3
) => {
  try {
    const fechaEliminacion = calcularFechaEliminacion(fechaCreacion, diasHabiles);
    
    // Crear la notificación en la tabla Notificacion
    const notificacion = await Notificacion.create({
      UsuarioId,
      actionType,
      message,
      fechaEliminacion, // Fecha calculada de eliminación
    });

    // Obtener todos los usuarios de la base de datos
    const usuarios = await Usuario.findAll(); // Ajusta el filtro según tus necesidades
    
    // Asociar la notificación con cada usuario
    const promises = usuarios.map(usuario => {
      return UsuarioNotificacion.create({
        UsuarioId: usuario.id, // Asociar la notificación con cada usuario
        NotificacionId: notificacion.id,
        leida: false, // Por defecto, la notificación es no leída
      });
    });

    // Ejecutar todas las promesas de asociación de usuarios
    await Promise.all(promises);
    console.log("Notificación creada y asociada a todos los usuarios.");
    
  } catch (error) {
    console.error("Error creando notificación:", error);
  }
};

// Programar la eliminación de notificaciones una vez al día (a medianoche)
cron.schedule("0 0 * * *", async () => {
  try {
    const fechaActual = new Date();
    
    // Buscar notificaciones que deben ser eliminadas
    const notificacionesAEliminar = await Notificacion.findAll({
      where: {
        fechaEliminacion: { [Op.lt]: fechaActual }, // Si la fecha de eliminación ya ha pasado
      },
    });

    // Si hay notificaciones para eliminar
    if (notificacionesAEliminar.length > 0) {
      await Notificacion.destroy({
        where: { id: notificacionesAEliminar.map(n => n.id) },
      });
      console.log("Notificaciones eliminadas:", notificacionesAEliminar.length);
    }
  } catch (error) {
    console.error("Error al eliminar notificaciones:", error);
  }
});
