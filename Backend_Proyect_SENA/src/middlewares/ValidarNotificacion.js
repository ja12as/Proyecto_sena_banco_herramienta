import { createNotification } from "../helpers/Notificacion.helpers.js";

export const notifyAction = (actionType) => {
    return async (req, res, next) => {
      try {
        // Asegúrate de que el campo 'nombre' esté presente
        const usuarioId = req.usuario.id;
        const usuarioNombre = req.usuario.nombre; // <-- Asegurar que el nombre esté disponible
  
        if (!usuarioNombre) {
          throw new Error("Nombre de usuario no disponible");
        }
  
        // Construir mensaje con el nombre del usuario correctamente
        const message = `El usuario ${usuarioNombre} ha realizado la acción: ${actionType}.`;
  
        console.log("Mensaje de notificación:", message); // Log para depurar el mensaje
  
        // Crear la notificación
        await createNotification(usuarioId, actionType, message);
      } catch (error) {
        console.error("Error creando la notificación:", error.message);
      }
      next();
    };
  };
  