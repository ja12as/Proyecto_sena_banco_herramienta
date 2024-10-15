
import { Router } from "express";
import validarSchemas from "../middlewares/ValidarSchemas.js";
import { getAllInstructores,getInstructor,crearInstructor,actualizarInstructor } from "../controllers/Formacion/Instructores.controllers.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { validarPermiso } from "../middlewares/ValiadarPermisos.js";
import {InstructoresSchemas} from "../schemas/Instructores.schemas.js"

const InstructorRouter = Router()

InstructorRouter.get("/Instructor",rutaProtegida,validarPermiso('Vista Instructores'), getAllInstructores);
InstructorRouter.get("/Instructor/:id",rutaProtegida,validarPermiso('Obtener Instructores'), getInstructor);
InstructorRouter.post("/Instructor",rutaProtegida,validarPermiso('Crear Instructor'), validarSchemas(InstructoresSchemas), crearInstructor);
InstructorRouter.put("/Instructor/:id", rutaProtegida,validarPermiso('Modificar Intructor'), actualizarInstructor);



export default InstructorRouter;