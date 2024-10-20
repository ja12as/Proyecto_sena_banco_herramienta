import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Usuario from "./Usuario.js";
import Notificacion from "./Notificaciones.js";


const UsuarioNotificacion = conexion.define(
    "UsuarioNotificacion",
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        },
        UsuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: "id",
        },
        },
        NotificacionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Notificacion,
            key: "id",
        },
        },
        leida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Por defecto, no leída
        },
    },
    {
        tableName: "UsuarioNotificacion",
        timestamps: true,
    }
);

// Definimos las relaciones en el modelo
// Modelo de Notificación
Notificacion.belongsToMany(Usuario, {
    through: UsuarioNotificacion,
    as: 'usuarios', // Alias de la relación
    foreignKey: 'NotificacionId',
  });
  
  // Modelo de Usuario
  Usuario.belongsToMany(Notificacion, {
    through: UsuarioNotificacion,
    as: 'notificaciones', // Alias de la relación
    foreignKey: 'UsuarioId',
  });

export default UsuarioNotificacion;
