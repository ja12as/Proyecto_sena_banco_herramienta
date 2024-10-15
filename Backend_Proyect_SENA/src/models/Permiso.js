import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";


const Permiso = conexion.define("Permiso",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nombrePermiso: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
              notEmpty: {
                msg: "No puedes dejar este campo vacio",
              },
            },
        }
    },{
        tableName: "Permisos",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields:[
                    "nombrePermiso"
                ]
            }
        ]
    });

    const datosPermisos = [
      // Usuario
      { nombrePermiso: "Crear Usuario" },
      { nombrePermiso: "Obtener Usuarios" },
      { nombrePermiso: "Modificar Usuario" },
      { nombrePermiso: "Vista Usuario" },

      // Rol
      { nombrePermiso: "Crear Rol" },
      { nombrePermiso: "Modificar Rol" },

      // Permiso
      //Valdiacion que solo el admin pueda hacerlo
      { nombrePermiso: "Mostrar Permisos" },
      { nombrePermiso: "Asignar Permisos" },

      //Fichas E Instructores
      { nombrePermiso: "Actualizacion de trimestres" },
      { nombrePermiso: " Mostrar actualizacion trimestres" },

      // Categoria
      { nombrePermiso: "Crear Categoria" },
      { nombrePermiso: "Obtener Categorias" },
      { nombrePermiso: "Modificar Categoria" },
      { nombrePermiso: "Vista Categorias" },

      // subcategoria
      { nombrePermiso: "Crear Subcategoria" },
      { nombrePermiso: "Obtener Subcategorias" },
      { nombrePermiso: "Modificar Sucategoria" },
      { nombrePermiso: "Vista Subcategorias" },
      { nombrePermiso: "Subcategorias activas" },
      //Falta un permiso

      // Instructor
      { nombrePermiso: "Crear Instructor" },
      { nombrePermiso: "Obtener Instructores" },
      { nombrePermiso: "Modificar Intructor" },
      { nombrePermiso: "Vista Instructores" },

      // ficha
      { nombrePermiso: "Crear Ficha" },
      { nombrePermiso: "Obtener Fichas" },
      { nombrePermiso: "Modificar Ficha" },
      { nombrePermiso: "Vista Fichas" },

      // Producto
      { nombrePermiso: "Crear Producto" },
      { nombrePermiso: "Obtener Productos" },
      { nombrePermiso: "Modificar Producto" },
      { nombrePermiso: "vista Productos" },

      // Herramienta
      { nombrePermiso: "Crear Herramienta" },
      { nombrePermiso: "Obtener Herramientas" },
      { nombrePermiso: "Modificar Herramienta" },
      { nombrePermiso: "vista Herramientas" },

      // Prestamo
      { nombrePermiso: "Crear Prestamo" },
      { nombrePermiso: "Obtener Prestamos" },
      { nombrePermiso: "Modificar Prestamo" },
      { nombrePermiso: "vista Prestamos" },

      // Pedido
      { nombrePermiso: "Crear Pedido" },
      { nombrePermiso: "Obtener Pedidos" },
      { nombrePermiso: "Modificar Pedido" },
      { nombrePermiso: "vista Pedidos" },

      // Unidad medida
      { nombrePermiso: "Crear Unidad medida" },
      { nombrePermiso: "Obtener Unidades medida" },
      { nombrePermiso: "Modificar Unidad medida" },
      { nombrePermiso: "vista Unidades medida" },

      // Historial
      { nombrePermiso: "Obtener Historial" },
      { nombrePermiso: "vista Historial" },

      // Notificaciones
      { nombrePermiso: "Obtener Notificaciones" },
      { nombrePermiso: "vista notificaciones" },

      // Dashboard
      { nombrePermiso: "Generar Reporte General del Dashboard" },
      { nombrePermiso: "vista Dashboard" },
    ];
    const guardarPermisos = async () => {
        try {
          await Permiso.sync();
          const permisos = await Permiso.findAll();
          if (permisos.length === 0) {
            await Permiso.bulkCreate(datosPermisos);
          }
        } catch (error) {
          throw new Error(error.message);
        }
      };
      setTimeout(() => {
        guardarPermisos();
      }, 2500);

    export default Permiso;