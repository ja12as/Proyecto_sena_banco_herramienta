import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Usuario from "./Usuario.js";
import Estado from "./Estado.js";
import Subcategoria from "./Subcategoria.js";
import UnidadMedida from "./UnidadMedida.js";

const Producto = conexion.define(
  "Producto",
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
      unique: true,
      validate: {
        notEmpty: {
          msg: "El nombre del producto no puede estar vacío",
        },
      },
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "El código del producto no puede estar vacío",
        },
      },
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La descripción del producto no puede estar vacía",
        },
      },
    },
    cantidadEntrada: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La cantidad de entrada del producto no puede estar vacía",
        },
      },
    },
    cantidadSalida: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    cantidadActual: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    VolumenTotal: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La marca del producto no puede estar vacía",
        },
      },
    },
  },
  {
    tableName: "Productos",
    timestamps: true,
  }
);


Producto.belongsTo(Usuario, { foreignKey: "UsuarioId" });
Producto.belongsTo(Estado, { foreignKey: "EstadoId" });
Producto.belongsTo(Subcategoria, { foreignKey: "SubcategoriaId" });
Producto.belongsTo(UnidadMedida, { foreignKey: "UnidadMedidaId" });

export default Producto;
