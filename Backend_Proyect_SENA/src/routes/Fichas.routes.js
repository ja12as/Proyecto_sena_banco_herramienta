import { Router } from "express";
import { getAllFichas, getFicha, crearFicha, updateFicha, BusquedaFichas } from "../controllers/Formacion/Fichas.controllers.js";
import validarSchemas from "../middlewares/ValidarSchemas.js";
import { FichaSchemas } from "../schemas/Ficha.schemas.js"
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { validarPermiso } from "../middlewares/ValiadarPermisos.js";


const FichaRouter = Router()
FichaRouter.get("/Fichas/busqueda", BusquedaFichas);
FichaRouter.get("/Fichas", rutaProtegida, validarPermiso('Vista Fichas'), getAllFichas);
FichaRouter.get("/Fichas/:id", rutaProtegida,validarPermiso('Obtener Fichas'), getFicha);
FichaRouter.post("/Fichas",rutaProtegida, validarPermiso('Crear Ficha'), validarSchemas(FichaSchemas), crearFicha);
FichaRouter.put("/Fichas/:id", rutaProtegida, validarPermiso('Modificar Ficha'), updateFicha); 


export default FichaRouter;
