import { Router } from "express";
import { crearRol, getAllRol, getRol, putRoles } from "../controllers/Usuarios/Rol.controllers.js";
import validarSchemas from "../middlewares/ValidarSchemas.js";
import {rutaProtegida} from "../middlewares/ValidarToken.js"
import { rolSchemas } from "../schemas/Rol.schemas.js";
import { validarPermiso } from "../middlewares/ValiadarPermisos.js";

const RolRouter = Router();

RolRouter.get("/Rol", getAllRol);
RolRouter.get("/Rol/:id", getRol);
RolRouter.post("/Rol",rutaProtegida,validarPermiso('Crear Rol'), validarSchemas(rolSchemas), crearRol);
RolRouter.put("/Rol/:id", rutaProtegida, validarPermiso("Modificar Rol"), putRoles);

export default RolRouter;
