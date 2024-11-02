import express from 'express';
import upload from '../middlewares/UploadPePres.js'; 
import { crearPrestamo, getAllPrestamos, getPrestamo, actualizarPrestamo, entregarHerramientas, devolverHerrammientasPrestamo, getPrestamoPorCoordinador } from '../controllers/Productos/prestamos.controller.js'; 
import { rutaProtegida } from '../middlewares/ValidarToken.js';
import { validarPermiso } from '../middlewares/ValiadarPermisos.js';

const PrestamoRouter = express.Router();

PrestamoRouter.get('/prestamos', rutaProtegida, getAllPrestamos); 
PrestamoRouter.get('/prestamo', rutaProtegida, getPrestamoPorCoordinador);
PrestamoRouter.get('/prestamos/:id', rutaProtegida, getPrestamo); 
PrestamoRouter.post('/prestamos', crearPrestamo); 
PrestamoRouter.put('/prestamos/:id', rutaProtegida, validarPermiso('Autorizar prestamos'), upload.single("firma"), actualizarPrestamo);
PrestamoRouter.put('/prestamos/:id/entrega', rutaProtegida, entregarHerramientas);
PrestamoRouter.put('/prestamos/:id/devolver', rutaProtegida, devolverHerrammientasPrestamo);

export default PrestamoRouter;
