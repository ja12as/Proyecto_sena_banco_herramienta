import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Producto from "./Producto.js";
import Estado from "./Estado.js";

const Pedido = conexion.define(
  "Pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    codigoFicha: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El código de ficha no puede estar vacío",
        },
      },
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El área no puede estar vacía",
        },
      },
    },
    jefeOficina: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre del jefe de oficina no puede estar vacío",
        },
      },
    },
    cedulaJefeOficina: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La cédula del jefe de oficina no puede estar vacía",
        },
      },
    },
    servidorAsignado: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre del servidor asignado no puede estar vacío",
        },
      },
    },
    cedulaServidor: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La cédula del servidor no puede estar vacía",
        },
      },
    },
    firma: {
      type: DataTypes.STRING, // Guardará el path del archivo de la firma
      allowNull: true,
    },
    correo: {
      // Nuevo campo para almacenar el correo
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Pedidos",
    timestamps: true,
  }
);

Pedido.belongsTo(Estado, { foreignKey: "EstadoId" }); 

export default Pedido;
