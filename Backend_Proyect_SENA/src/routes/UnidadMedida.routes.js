import express from "express";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { validarPermiso } from "../middlewares/ValiadarPermisos.js";
import { getAllUnits, getUnitById } from '../controllers/Productos/UnidaddeMedida.controllers.js';

const UnidadMedidaRouter = express.Router();

UnidadMedidaRouter.get('/units',  rutaProtegida,validarPermiso('Obtener Unidades medida'),getAllUnits);
UnidadMedidaRouter.get('/units/:id', rutaProtegida,validarPermiso('Obtener Unidades medida'), getUnitById);

export default UnidadMedidaRouter;