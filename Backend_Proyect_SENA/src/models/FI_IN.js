import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Instructores from "./Instructores.js";
import Fichas from "./Fichas.js";
import Usuario from "./Usuario.js";

const InstructorFicha = conexion.define(
  "InstructorFicha",
  {
    id: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    semestre: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El semestre no puede estar vacío",
        },
      },
    },
  },
  {
    tableName: "InstructorFicha",
    timestamps: true,
    indexes: [
      {
        fields: ["InstructorId", "FichaId", "semestre", "UsuarioId"],
        unique: true,
      },
    ],
  }
);

InstructorFicha.belongsTo(Instructores, { foreignKey: "InstructorId" });
InstructorFicha.belongsTo(Fichas, { foreignKey: "FichaId" });
InstructorFicha.belongsTo(Usuario, { foreignKey: "UsuarioId" });

export default InstructorFicha;
