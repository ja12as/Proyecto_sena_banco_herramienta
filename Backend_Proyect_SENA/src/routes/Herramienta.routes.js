import  { Router } from 'express';
import { crearHerramienta, getAllHerramienta, getHerramienta, buscarHerramientas, putHerramienta } from '../controllers/Productos/Herrramientas.controller.js';
/* import validarSchemas from '../middlewares/ValidarSchemas.js';
import { HerramientaSchemas } from '../schemas/Herramientas.schemas.js' */;
import { rutaProtegida } from '../middlewares/ValidarToken.js';


const HerramientaRouter = Router()

HerramientaRouter.get("/herramienta", rutaProtegida, getAllHerramienta);
HerramientaRouter.get("/herramienta/:id", rutaProtegida, getHerramienta);
HerramientaRouter.post("/herramienta", rutaProtegida, crearHerramienta);
HerramientaRouter.put("/herramienta/:id", rutaProtegida, putHerramienta);
/* HerramientaRouter.get("/herramienta/busqueda", buscarHerramientas); */

export default HerramientaRouter;
