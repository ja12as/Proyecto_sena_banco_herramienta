import Permiso from "../models/Permiso.js";
import DetallePermiso from "../models/DetallePermiso.js";


export const validarPermiso = (nombrePermiso) => {
    return async (req, res, next) => {
      try {
        console.log('Usuario:', req.usuario); 
        const usuarioId = req.usuario.id;
  
        const permiso = await Permiso.findOne({ where: { nombrePermiso } });
        if (!permiso) {
          return res.status(404).json({ msg: 'Permiso no encontrado' });
        }
  
        const detallePermiso = await DetallePermiso.findOne({
          where: { UsuarioId: usuarioId, PermisoId: permiso.id },
        });
  
        if (!detallePermiso) {
          return res.status(403).json({ msg: 'No tienes permiso para realizar esta acción' });
        }
  
        next(); 
      } catch (error) {
        console.error("Error al verificar permiso:", error);
        res.status(500).json({ message: 'Error al verificar permiso', error });
      }
    };
  };
  