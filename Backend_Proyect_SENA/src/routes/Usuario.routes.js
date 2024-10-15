import { Router } from "express";
import validarSchemas from "../middlewares/ValidarSchemas.js";
import { crearUsuario , getAllusuario, getUsuario, Putusuario } from "../controllers/Usuarios/Usuario.controllers.js";
import { usuarioSchemas } from "../schemas/Usuario.schemas.js";
import { rutaProtegida} from "../middlewares/ValidarToken.js";
import { validarPermiso } from "../middlewares/ValiadarPermisos.js";

const UsuarioRouter = Router();

UsuarioRouter.get("/usuarios", rutaProtegida,validarPermiso('Obtener Usuarios'), getAllusuario);
UsuarioRouter.get("/usuarios/:id", rutaProtegida, getUsuario);
UsuarioRouter.post(
  "/usuarios",
  rutaProtegida,
  validarPermiso("Crear Usuario"),
  validarSchemas(usuarioSchemas),
  crearUsuario
);
UsuarioRouter.put("/usuarios/:id",rutaProtegida, validarPermiso('Modificar Usuario'),Putusuario);

export default UsuarioRouter;
