import express from 'express';
import upload from '../middlewares/UploadPePres.js'; 
import { crearPrestamo, getAllPrestamos, getPrestamo, actualizarPrestamo } from '../controllers/Productos/prestamos.controller.js'; 

const PrestamoRouter = express.Router();

PrestamoRouter.get('/prestamos', getAllPrestamos); 
PrestamoRouter.get('/prestamos/:id', getPrestamo); 
PrestamoRouter.post('/prestamos', crearPrestamo); 
PrestamoRouter.put('/prestamos/:id', upload.single("firma"), actualizarPrestamo);

export default PrestamoRouter;
