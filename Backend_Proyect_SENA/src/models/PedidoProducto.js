import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Producto from "./Producto.js";
import Pedido from "./Pedido.js";


const PedidoProducto = conexion.define(
  "PedidoProducto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cantidadSolicitar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidadSalida: {
      type: DataTypes.INTEGER, // Cantidad que se retira del inventario
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "PedidosProductos",
    timestamps: true,
  }
);

Producto.belongsToMany(Pedido, { through: PedidoProducto });
Pedido.belongsToMany(Producto, { through: PedidoProducto });

export default PedidoProducto
