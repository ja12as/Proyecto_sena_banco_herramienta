import cron from "node-cron";
import Notificacion from "../models/Notificaciones.js";
import { Op } from "sequelize";

// Función para calcular la fecha de eliminación
const calcularFechaEliminacion = (fechaCreacion, diasHabiles) => {
    let fechaEliminacion = new Date(fechaCreacion);
    let diasContados = 0;

    while (diasContados < diasHabiles) {
        fechaEliminacion.setDate(fechaEliminacion.getDate() + 1);
        // Comprobar si es un día hábil (lunes a viernes)
        if (fechaEliminacion.getDay() !== 0 && fechaEliminacion.getDay() !== 6) {
            diasContados++;
        }
    }

    return fechaEliminacion;
};

// Crear Notificación
export const createNotification = async (UsuarioId, actionType, message, fechaCreacion = new Date(), diasHabiles = 3) => {
    try {
        const fechaEliminacion = calcularFechaEliminacion(fechaCreacion, diasHabiles);
        await Notificacion.create({
            UsuarioId,
            actionType,
            message,
            fechaEliminacion, // Agrega la fecha de eliminación
        });
    } catch (error) {
        console.error("Error creando notificación:", error);
    }
};

// Programar la eliminación de notificaciones
cron.schedule("0 0 * * *", async () => {
    try {
        const fechaActual = new Date();
        const notificacionesAEliminar = await Notificacion.findAll({
            where: {
                fechaEliminacion: { [Op.lt]: fechaActual },
            },
        });

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

