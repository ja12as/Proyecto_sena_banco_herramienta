import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Subcategoria from "./Subcategoria.js";
import Estado from "./Estado.js";
import Usuario from "./Usuario.js";

const Herramienta = conexion.define(
  "Herramienta",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre de la herramienta no puede estar vacío",
        },
      },
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "El código de la herramienta no puede estar vacío",
        },
      },
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La marca de la herramienta no puede estar vacía",
        },
      },
    },
    condicion: {
      type: DataTypes.ENUM("BUENO", "REGULAR", "MALO"),
      allowNull: false,
      defaultValue: "BUENO",
      validate: {
        notEmpty: {
          msg: "La condición de la herramienta no puede estar vacía",
        },
        isIn: {
          args: [["BUENO", "REGULAR", "MALO"]],
          msg: "La condición debe ser 'BUENO', 'REGULAR' o 'MALO'",
        },
      },
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaDeIngreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Herramientas",
    timestamps: true,
  }
);

// Definición de relaciones
Herramienta.belongsTo(Subcategoria, { foreignKey: "SubcategoriaId" });
Herramienta.belongsTo(Estado, { foreignKey: "EstadoId" });
Herramienta.belongsTo(Usuario, { foreignKey: "UsuarioId" });

export default Herramienta;