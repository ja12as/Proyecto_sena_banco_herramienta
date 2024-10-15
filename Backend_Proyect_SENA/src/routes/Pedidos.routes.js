import express from 'express';
import upload from '../middlewares/UploadPePres.js'; 
import { 
  actualizarPedido, 
  crearPedido, 
  getPedido, 
  getAllPedidos 
} from '../controllers/Productos/Pedido.controllers.js';
import { actualizarSalidaProducto } from '../controllers/Coordinación/Salida.controller.js';

const PedidoRouter = express.Router();

PedidoRouter.get('/pedido', getAllPedidos);
PedidoRouter.get("/pedido/:id", getPedido);
PedidoRouter.post("/pedido", crearPedido);
PedidoRouter.put("/pedido/:id", upload.single("firma"), actualizarPedido);
PedidoRouter.put("/pedido/:id/salida", actualizarSalidaProducto);

export default PedidoRouter;