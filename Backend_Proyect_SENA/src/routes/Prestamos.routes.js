import express from 'express';
import upload from '../middlewares/UploadPePres.js'; 
import { crearPrestamo, getAllPrestamos, getPrestamo, actualizarPrestamo, entregarHerramientas } from '../controllers/Productos/prestamos.controller.js'; 
import { rutaProtegida } from '../middlewares/ValidarToken.js';

const PrestamoRouter = express.Router();

PrestamoRouter.get('/prestamos', rutaProtegida, getAllPrestamos); 
PrestamoRouter.get('/prestamos/:id', rutaProtegida, getPrestamo); 
PrestamoRouter.post('/prestamos', crearPrestamo); 
PrestamoRouter.put('/prestamos/:id', rutaProtegida, upload.single("firma"), actualizarPrestamo);
PrestamoRouter.put('/prestamos/:id/entrega', rutaProtegida, entregarHerramientas);

export default PrestamoRouter;
