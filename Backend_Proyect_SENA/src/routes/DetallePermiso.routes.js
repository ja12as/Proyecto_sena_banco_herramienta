import { Router } from "express";
import { crearUsuarioConPermisos, deletePermiso, getPermisosUsuario, putPermisosUsuario } from "../controllers/Usuarios/DetallePermiso.controllers.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";

const detaleePermisoRouter = Router()

detaleePermisoRouter.post("/detalle-permisos",rutaProtegida, crearUsuarioConPermisos);
detaleePermisoRouter.get("/detalle-permisos/:UsuarioId", rutaProtegida, getPermisosUsuario);

detaleePermisoRouter.put("/detalle-permisos",rutaProtegida, putPermisosUsuario);
detaleePermisoRouter.delete("/detalle-permisos",rutaProtegida, deletePermiso);

export default detaleePermisoRouter;