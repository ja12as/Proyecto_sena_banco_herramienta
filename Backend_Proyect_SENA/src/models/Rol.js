import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";

const Rol = conexion.define(
  "Rol",
  {
    // ID automático
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false,
    },
    rolName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "El valor no puede estar vacío",
        },
      },
    },
  },
  {
    tableName: "Roles",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["rolName"],
      },
    ],
    hooks: {
      beforeSave: (rol) => {
        rol.rolName = rol.rolName.toUpperCase();
      },
    },
  }
);

const insertarRoles = async (datos) => {
  try {
    await Rol.sync();

    for (const rol of datos) {
      const rolNameUpper = rol.rolName.toUpperCase();

      const [created] = await Rol.findOrCreate({
        where: { rolName: rolNameUpper }, 
        defaults: { ...rol, rolName: rolNameUpper }, 
      });

      if (!created) {
        console.log(`El rol ${rolNameUpper} ya existe.`);
      } else {
        console.log(`Rol ${rolNameUpper} insertado correctamente.`);
      }
    }
  } catch (error) {
    console.error("Error al insertar roles:", error.message);
    throw new Error(error.message);
  }
};

insertarRoles([
  { rolName: "ADMIN" },
  { rolName: "USUARIO" },
  { rolName: "COORDINADOR" },
]);

export default Rol;
