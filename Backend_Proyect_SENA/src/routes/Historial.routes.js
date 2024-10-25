import { Router } from "express";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { obtenerHistorial } from "../controllers/Sistema/Historial.controllers.js";


const HistorialRouter = Router();

HistorialRouter.get("/historial", rutaProtegida, obtenerHistorial);

export default HistorialRouter;