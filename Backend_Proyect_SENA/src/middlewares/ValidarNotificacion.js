import { createNotification } from "../helpers/Notificacion.helpers.js";

export const notifyAction = (actionType) => {
    return async (req, res, next) => {
        try {
            const UsuarioId = req.usuario.id; // Obtén el ID del usuario autenticado
            const usuarioNombre = req.usuario.nombre; // Asegúrate de que el nombre esté disponible

            // Asegúrate de que el nombre no sea undefined
            if (!usuarioNombre) {
                throw new Error("Nombre de usuario no disponible");
            }

            // Crear el mensaje que incluirá el nombre del usuario
            const message = `El usuario ${usuarioNombre} ha realizado la acción: ${actionType}.`;
            await createNotification(UsuarioId, actionType, message);
        } catch (error) {
            console.error("Error creando la notificación:", error.message);
        }
        next();
    };
};
