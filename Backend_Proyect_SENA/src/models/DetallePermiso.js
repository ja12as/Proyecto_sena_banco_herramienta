import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Usuario from "./Usuario.js";
import Permiso from "./Permiso.js";

// Definir el modelo DetallePermiso
const DetallePermiso = conexion.define(
  "DetallePermiso",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    tableName: "DetallePermisos",
    timestamps: true,
  }
);

  Usuario.hasMany(DetallePermiso, { foreignKey: "UsuarioId" });
  Permiso.hasMany(DetallePermiso, { foreignKey: "PermisoId" });
  DetallePermiso.belongsTo(Usuario, { foreignKey: "UsuarioId" });
  DetallePermiso.belongsTo(Permiso, { foreignKey: "PermisoId" });

DetallePermiso.afterSync(async () => {
  try {
    const permisosAdmin = await DetallePermiso.findOne({
      where: { UsuarioId: 1 },
    });

    if (!permisosAdmin) {
      const permisos = await Permiso.findAll();

      const permisosDetalle = permisos.map((permiso) => ({
        UsuarioId: 1,
        PermisoId: permiso.id, 
      }));

      await DetallePermiso.bulkCreate(permisosDetalle);

      console.log("Todos los permisos han sido asignados al administrador.");
    } else {
      console.log("El administrador ya tiene permisos asignados.");
    }
  } catch (error) {
    console.error("Error al asignar permisos al administrador:", error);
  }
});
  
export default DetallePermiso;
