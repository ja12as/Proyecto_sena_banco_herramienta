import { Router } from "express";
import { crearSubcategoria, getallSubcategoria, getallSubcategoriaACTIVO, getSubcategoria, putSubcategoria } from "../controllers/Productos/Subcategoria.controllers.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import validarSchemas from "../middlewares/ValidarSchemas.js";
import { validarPermiso } from "../middlewares/ValiadarPermisos.js";
import {SubcategoriaSchema} from "../schemas/Subcategoria.schemas.js"


const  SubcategoriaRouter = Router()

SubcategoriaRouter.get("/subcategoria", rutaProtegida,validarPermiso('Vista Subcategorias'), getallSubcategoria);
SubcategoriaRouter.get("/subcategoria/estado", rutaProtegida,validarPermiso('Subcategorias activas'), getallSubcategoriaACTIVO);
SubcategoriaRouter.get("/subcategoria/:id", rutaProtegida,validarPermiso('Obtener Subcategorias'), getSubcategoria);
SubcategoriaRouter.post("/subcategoria", rutaProtegida,validarPermiso('Crear Subcategoria'), validarSchemas(SubcategoriaSchema), crearSubcategoria);
SubcategoriaRouter.put("/subcategoria/:id", rutaProtegida,validarPermiso('Modificar Sucategoria'), putSubcategoria);

export default SubcategoriaRouter; 