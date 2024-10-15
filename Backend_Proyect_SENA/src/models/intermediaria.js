// Importaciones
import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Herramienta from "./Herramientas.js"; // Importa el modelo de Herramienta
import Prestamo from "./Prestamos.js"; // Importa el modelo de Prestamo

// Modelo de la tabla PrestamosHerramientas (tabla intermedia)
const PrestamoHerramienta = conexion.define(
  "PrestamoHerramienta",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "PrestamosHerramientas",
    timestamps: true,
  }
);

// Relaciones para la tabla intermedia
Prestamo.belongsToMany(Herramienta, { through: PrestamoHerramienta });
Herramienta.belongsToMany(Prestamo, { through: PrestamoHerramienta });

export default PrestamoHerramienta;
