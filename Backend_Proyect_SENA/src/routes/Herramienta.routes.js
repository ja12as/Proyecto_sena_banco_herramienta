import  { Router } from 'express';
import { crearHerramienta, getAllHerramienta, getHerramienta, putHerramienta } from '../controllers/Productos/Herrramientas.controller.js';
import { rutaProtegida } from '../middlewares/ValidarToken.js';
import { validarPermiso } from '../middlewares/ValiadarPermisos.js';
import { HerramientaSchemas } from '../schemas/Herramienta.schemas.js';
import validarSchemas from '../middlewares/ValidarSchemas.js';


const HerramientaRouter = Router()

HerramientaRouter.get("/herramienta", rutaProtegida, validarPermiso('vista Herramientas'), getAllHerramienta);
HerramientaRouter.get("/herramienta/:id", rutaProtegida, validarPermiso('Obtener Herramientas'),getHerramienta);
HerramientaRouter.post("/herramienta", rutaProtegida, validarPermiso('Crear Herramienta'), validarSchemas(HerramientaSchemas),crearHerramienta);
HerramientaRouter.put("/herramienta/:id", rutaProtegida, validarPermiso('Modificar Herramienta'), putHerramienta);
/* HerramientaRouter.get("/herramienta/busqueda", buscarHerramientas); */

export default HerramientaRouter;
