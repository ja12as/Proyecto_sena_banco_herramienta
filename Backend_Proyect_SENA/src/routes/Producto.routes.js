import { Router } from "express";
import { BusquedaProductos, crearProductos, getAllProductos, getProductos, putProductos } from  "../controllers/Productos/Productos.controllers.js";
import validarSchemas from "../middlewares/ValidarSchemas.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { ProductoSchemas } from "../schemas/Producto.schemas.js";
import { validarPermiso } from "../middlewares/ValiadarPermisos.js";


const ProductoRouter = Router()

ProductoRouter.get("/producto", rutaProtegida, getAllProductos);
ProductoRouter.get("/producto/busqueda", BusquedaProductos);
ProductoRouter.get("/producto/:id", rutaProtegida, getProductos );
ProductoRouter.post("/producto", rutaProtegida, validarPermiso('Crear Producto') ,validarSchemas(ProductoSchemas), crearProductos);
ProductoRouter.put("/producto/:id", rutaProtegida, validarPermiso('Modificar Producto'),  putProductos);

export default ProductoRouter; 