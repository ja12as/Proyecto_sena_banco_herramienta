import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Estado from "./Estado.js";
import Usuario from "./Usuario.js";

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
      type: DataTypes.INTEGER,  // Cambiado a INTEGER para reflejar la FK al ID de Usuario
      allowNull: false,
      references: {
        model: Usuario,
        key: "id",
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
Pedido.belongsTo(Usuario, { foreignKey: "jefeOficina", as: "coordinador" });
Usuario.hasMany(Pedido, { foreignKey: "jefeOficina", as: "pedidos" });

export default Pedido;
