
import { Router } from 'express';
import { herramientasEnMalEstado, herramientasMasSolicitadas, pedidosPorCoordinador, productosAgotados, productosMasSolicitados, productosNuevos, productosSolicitadosPorFicha, productosSolicitadosPorInstructor } from '../controllers/Sistema/reportes.controller.js';


const Reportesrouter = Router();

Reportesrouter.get('/reportes/productos-solicitados-por-ficha', productosSolicitadosPorFicha);
Reportesrouter.get('/reportes/productos-solicitados-por-instructor', productosSolicitadosPorInstructor);
Reportesrouter.get('/reportes/productos-mas-solicitados', productosMasSolicitados);
Reportesrouter.get('/reportes/herramientas-mas-solicitadas', herramientasMasSolicitadas);
Reportesrouter.get('/reportes/productos-agotados', productosAgotados);
Reportesrouter.get('/reportes/herramientas-en-mal-estado', herramientasEnMalEstado);
Reportesrouter.get('/reportes/pedidos-por-coordinador', pedidosPorCoordinador);
Reportesrouter.get('/reportes/productos-nuevos', productosNuevos);

export default Reportesrouter;