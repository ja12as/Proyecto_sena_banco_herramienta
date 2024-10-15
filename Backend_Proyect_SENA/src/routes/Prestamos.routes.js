import express from 'express';
import upload from '../middlewares/UploadPePres.js'; 
import { crearPrestamo, getAllPrestamos, getPrestamo, actualizarPrestamo, entregarHerramientas } from '../controllers/Productos/prestamos.controller.js'; 

const PrestamoRouter = express.Router();

PrestamoRouter.get('/prestamos', getAllPrestamos); 
PrestamoRouter.get('/prestamos/:id', getPrestamo); 
PrestamoRouter.post('/prestamos', crearPrestamo); 
PrestamoRouter.put('/prestamos/:id', upload.single("firma"), actualizarPrestamo);
PrestamoRouter.put('/prestamos/:id/entrega', entregarHerramientas);

export default PrestamoRouter;
