import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Usuario from "./Usuario.js";

const Notificacion = conexion.define(
    "Notificacion",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        actionType: {
            type: DataTypes.STRING, // e.g., 'CREATE', 'UPDATE', 'DELETE'
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nueva: { // Campo para indicar si es nueva
            type: DataTypes.BOOLEAN,
            defaultValue: true, // Por defecto, las notificaciones son nuevas
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },{
        tableName: "Notificaciones",
        timestamps: true,
    }
)

export default Notificacion;

Notificacion.belongsTo(Usuario, {foreignKey: "UsuarioId"});