import { Router } from "express";
import { getAllEstado, getEstado } from "../controllers/Estado.controllers.js";

const EstadoRouter = Router();

EstadoRouter.get("/Estado", getAllEstado);
EstadoRouter.get("/Estado/:id", getEstado);

export default EstadoRouter;
