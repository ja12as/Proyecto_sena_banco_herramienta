import { Router } from 'express';
import { getAllNotifications, getNotifications } from '../controllers/Sistema/Notificaciones.controllers.js';

const NotificacionRouter = Router();

// Obtener notificaciones de un usuario
NotificacionRouter.get('/notificaciones/:UsuarioId', getNotifications);
NotificacionRouter.get('/notificaciones', getAllNotifications);


export default NotificacionRouter;
