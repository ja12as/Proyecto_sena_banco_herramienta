import Historial from "../models/Historial.js"; // Importar el modelo de Historial

export const registrarAcciones = async (req, res, next) => {
  try {
    const metodo = req.method;  // Método HTTP (POST, PUT, DELETE)
    const UsuarioId = req.usuario.id;  // Usuario autenticado
    const usuarioNombre = req.usuario.nombre;  // Nombre del usuario autenticado
    let tipoAccion = "";
    let descripcion = "";

    // Determinar el tipo de acción en base al método HTTP
    switch (metodo) {
      case "POST":
        tipoAccion = "CREAR";
        descripcion = `El usuario ${usuarioNombre} creó un recurso en ${req.originalUrl}`;
        break;
      case "PUT":
        tipoAccion = "ACTUALIZAR";
        descripcion = `El usuario ${usuarioNombre} actualizó un recurso en ${req.originalUrl}`;
        break;
      case "DELETE":
        tipoAccion = "ELIMINAR";
        descripcion = `El usuario ${usuarioNombre} eliminó un recurso en ${req.originalUrl}`;
        break;
      default:
        return next();  // Si no es una acción relevante, continuar sin registrar
    }

    // Registrar en la tabla Historial
    await Historial.create({
      tipoAccion,
      descripcion,
      UsuarioId: UsuarioId,
    });

    // Continuar con la ejecución de la ruta
    next();
  } catch (error) {
    console.error("Error al registrar en el historial", error);
    res.status(500).json({ message: "Error al registrar en el historial" });
  }
};
