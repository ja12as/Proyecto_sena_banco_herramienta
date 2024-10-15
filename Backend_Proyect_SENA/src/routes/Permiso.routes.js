import { Router } from "express";
import { getAllPermisos } from "../controllers/Usuarios/Permisos.controllers.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { validarPermisosAdmin } from "../middlewares/ValidacionAdmin.js";

const permisoRouter = Router()

permisoRouter.get("/permisos",rutaProtegida, validarPermisosAdmin, getAllPermisos)

export default permisoRouter;
