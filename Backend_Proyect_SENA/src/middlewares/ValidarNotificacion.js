import { createNotification } from "../helpers/Notificacion.helpers.js";

export const notifyAction = (actionType) => {
  return async (req, res, next) => {
    try {
      const usuarioId = req.usuario.id;
      const usuarioNombre = req.usuario.nombre;

      if (!usuarioNombre) {
        throw new Error("Nombre de usuario no disponible");
      }

      // Construir mensaje con el nombre del usuario
      const message = `El usuario ${usuarioNombre} ha realizado la acción: ${actionType}.`;

      // Crear la notificación
      await createNotification(usuarioId, actionType, message);
    } catch (error) {
      console.error("Error creando la notificación:", error.message);
    }
    next();
  };
};
