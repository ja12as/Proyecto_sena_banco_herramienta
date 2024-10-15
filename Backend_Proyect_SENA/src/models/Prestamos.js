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
      allowNull: true,
    },
    fechaEntrega: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fechaPrestamos: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
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
