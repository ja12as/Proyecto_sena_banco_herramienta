import { Router } from 'express';
import { getAllNotifications, putNotificaciones, putNotificacionNoLeida } from '../controllers/Sistema/Notificaciones.controllers.js';
import { rutaProtegida } from '../middlewares/ValidarToken.js';

const NotificacionRouter = Router();

NotificacionRouter.get("/notificaciones", rutaProtegida, getAllNotifications);
NotificacionRouter.put("/notificaciones/:id/leida", rutaProtegida, putNotificaciones);
NotificacionRouter.put("/notificaciones/:id/no-leida", rutaProtegida, putNotificacionNoLeida);


export default NotificacionRouter;
