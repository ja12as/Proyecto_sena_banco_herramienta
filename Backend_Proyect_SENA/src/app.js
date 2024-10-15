import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';
import UsuarioRouter from "./routes/Usuario.routes.js";
import RolRouter from "./routes/Rol.routes.js";
import EstadoRouter from "./routes/Estado.routes.js";
import LoginRouter from "./routes/Login.routes.js";
import recuperacionRouter from "./routes/Olvidarcontrasena.routes.js";
import permisoRouter from "./routes/Permiso.routes.js";
import FichaRouter from "./routes/Fichas.routes.js";
import InstructorRouter from "./routes/Instructores.routes.js";
import Relacion from "./routes/Relacion.routes.js";
import CategoriaRouter from "./routes/Categoria.routes.js"
import SubcategoriaRouter from "./routes/Subcategoria.routes.js";
import ProductoRouter from "./routes/Producto.routes.js";
import UnidadMedidaRouter from "./routes/UnidadMedida.routes.js";
import Pedido from "./routes/Pedidos.routes.js";
import PedidoRouter from "./routes/Pedidos.routes.js";
import HerramientaRouter from "./routes/Herramienta.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(
  UsuarioRouter,
  RolRouter,
  EstadoRouter,
  LoginRouter,
  recuperacionRouter,
  permisoRouter,
  FichaRouter,
  InstructorRouter,
  Relacion,
  CategoriaRouter,
  SubcategoriaRouter,
  ProductoRouter,
  UnidadMedidaRouter,
  Pedido,
  PedidoRouter,
  HerramientaRouter
);

export default app;
