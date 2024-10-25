import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Usuario from "./Usuario.js";

const Historial = conexion.define("Historial", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    tipoAccion: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT, 
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
    }, {
        tableName: "Historial",
        timestamps: true,
    }
);

Historial.belongsTo(Usuario, { foreignKey: "UsuarioId" }); 

export default Historial;