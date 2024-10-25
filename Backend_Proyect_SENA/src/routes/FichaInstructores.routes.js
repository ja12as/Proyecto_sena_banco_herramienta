import { Router } from "express";
import { getFichasInstructores, uploadFichasInstructores } from './../controllers/Formacion/Relacion.controllers.js';
import upload from "../middlewares/upload.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { validarPermiso } from "../middlewares/ValiadarPermisos.js";

const FichaInstructorRouter = Router();

FichaInstructorRouter.post(
  "/upload-fichas-instructores", 
  rutaProtegida, 
  validarPermiso('Subir Fichas e Instructores'), 
  upload.single("file"), 
  uploadFichasInstructores
);

FichaInstructorRouter.get(
  "/fichas-instructores", 
  rutaProtegida, 
  validarPermiso('Obtener Fichas e Instructores'), 
  getFichasInstructores
);

export default FichaInstructorRouter;
