import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Fichas from "./Fichas.js";
import Instructores from "./Instructores.js";
import Usuario from "./Usuario.js";

const FichaInstructor = conexion.define(
  "FichaInstructor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    semestre: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "FichasInstructores",
    timestamps: true,
  }
);

FichaInstructor.belongsTo(Fichas, { foreignKey: "FichaId" });
FichaInstructor.belongsTo(Instructores, { foreignKey: "InstructorId" });
FichaInstructor.belongsTo(Usuario, { foreignKey: "UsuarioId" });

export default FichaInstructor;
