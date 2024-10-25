import { Router } from "express";
import { actualizarCantidadEntrada, BusquedaProductos, crearProductos, getAllProductos, getProductos, putProductos } from  "../controllers/Productos/Productos.controllers.js";
import validarSchemas from "../middlewares/ValidarSchemas.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { ProductoSchemas } from "../schemas/Producto.schemas.js";
import { validarPermiso } from "../middlewares/ValiadarPermisos.js";
import { buscarHerramientas } from "../controllers/Productos/Herrramientas.controller.js";



const ProductoRouter = Router()

ProductoRouter.get("/producto", rutaProtegida, getAllProductos);
ProductoRouter.get("/producto/busqueda", BusquedaProductos);
ProductoRouter.get("/producto/:id", rutaProtegida, getProductos );
ProductoRouter.post("/producto", rutaProtegida, validarPermiso('Crear Producto') ,validarSchemas(ProductoSchemas), crearProductos);
ProductoRouter.put("/producto/:id", rutaProtegida, validarPermiso('Modificar Producto'),  putProductos);
ProductoRouter.put("/producto/:id/cantidad", rutaProtegida, validarPermiso('Modificar Producto'), actualizarCantidadEntrada); 
ProductoRouter.get("/herramienta/busqueda", buscarHerramientas);

export default ProductoRouter; 