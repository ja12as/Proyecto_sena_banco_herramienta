import { Router } from "express";
import { getAllCategoria, getCategoria } from  "../controllers/Productos/Categoria.controllers.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { validarPermiso } from "../middlewares/ValiadarPermisos.js";


const CategoriaRouter = Router()

CategoriaRouter.get("/categorias", rutaProtegida,validarPermiso('Vista Categorias'), getAllCategoria);
CategoriaRouter.get("/categorias/:id", rutaProtegida,validarPermiso('Obtener Categorias'), getCategoria);

export default CategoriaRouter;