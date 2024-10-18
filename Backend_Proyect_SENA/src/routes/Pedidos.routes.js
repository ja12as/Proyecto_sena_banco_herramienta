import express from 'express';
import upload from '../middlewares/UploadPePres.js'; 
import { 
  actualizarPedido, 
  crearPedido, 
  getPedido, 
  getAllPedidos 
} from '../controllers/Productos/Pedido.controllers.js';
import { actualizarSalidaProducto } from '../controllers/Coordinación/Salida.controller.js';
import { rutaProtegida } from '../middlewares/ValidarToken.js';

const PedidoRouter = express.Router();

PedidoRouter.get('/pedido', rutaProtegida, getAllPedidos);
PedidoRouter.get("/pedido/:id", rutaProtegida, getPedido);
PedidoRouter.post("/pedido",  rutaProtegida, crearPedido);
PedidoRouter.put("/pedido/:id", rutaProtegida, upload.single("firma"), actualizarPedido);
PedidoRouter.put("/pedido/:id/salida", rutaProtegida, actualizarSalidaProducto);

export default PedidoRouter;