import express from "express";
import { asignarInstructorAFichas, obtenerRelaciones } from "../controllers/Formacion/Relacion.controllers.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";

const Relacion = express.Router();


Relacion.post("/asignar-fichas",rutaProtegida, asignarInstructorAFichas);
Relacion.get("/obtener-relaciones", rutaProtegida, obtenerRelaciones);


export default Relacion;
