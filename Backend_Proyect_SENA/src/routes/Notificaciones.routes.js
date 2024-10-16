import { Router } from 'express';
import { getAllNotifications, getNotifications } from '../controllers/Sistema/Notificaciones.controllers.js';
import { rutaProtegida } from '../middlewares/ValidarToken.js';

const NotificacionRouter = Router();

// Obtener notificaciones de un usuario
NotificacionRouter.get("/notificaciones/:UsuarioId",rutaProtegida,  getNotifications);
NotificacionRouter.get("/notificaciones", rutaProtegida, getAllNotifications);


export default NotificacionRouter;
