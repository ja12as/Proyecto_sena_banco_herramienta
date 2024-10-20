import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";

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
        type: DataTypes.STRING,
        allowNull: false,
        },
        message: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "Notificaciones",
        timestamps: true,
    }
);



export default Notificacion;
