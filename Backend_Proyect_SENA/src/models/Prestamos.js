// Importaciones
import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Estado from "./Estado.js"; // Importa el modelo de Estado

// Modelo de la tabla Prestamos
const Prestamo = conexion.define(
  "Prestamo",
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
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    jefeOficina: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cedulaJefeOficina: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    servidorAsignado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cedulaServidor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fechaDevolucion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    EstadoId: {
      // Agrega el campo para el estado
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Estado, // Relaciona con el modelo Estado
        key: "id",
      },
    },
    firma: {
      type: DataTypes.STRING, // Cambia el tipo si necesitas algo diferente
      allowNull: true, // Puede ser nulo hasta que se firme
    },
  },
  {
    tableName: "Prestamos",
    timestamps: true,
  }
);

// Relación con el modelo Estado
Prestamo.belongsTo(Estado, { foreignKey: "EstadoId" });

export default Prestamo;
