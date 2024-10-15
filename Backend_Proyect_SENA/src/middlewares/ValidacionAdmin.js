import Usuario from '../models/Usuario.js'; // Asegúrate de que la ruta sea correcta
import { config } from 'dotenv';

config();

export const validarPermisosAdmin = async (req, res, next) => {
  try {
    // Obtener el UsuarioId del objeto req.usuario
    const { id: UsuarioId } = req.usuario;

    // Obtener el usuario desde la base de datos
    const usuario = await Usuario.findByPk(UsuarioId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario es el administrador con ID 1
    if (usuario.id !== 1) {
      return res.status(403).json({ message: 'Acceso denegado, el usuario no es el administrador principal' });
    }

    next();
  } catch (error) {
    console.error('Error en la validación de permisos de administrador:', error);
    return res.status(500).json({ message: 'Error en la validación de permisos de administrador' });
  }
};