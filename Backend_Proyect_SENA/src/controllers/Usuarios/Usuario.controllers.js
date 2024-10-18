import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { Op } from "sequelize";
import Usuario from "../../models/Usuario.js";
import Rol from "../../models/Rol.js";
import Permiso from "../../models/Permiso.js";
import Estado from "../../models/Estado.js";
import DetallePermiso from "../../models/DetallePermiso.js";
import { createNotification } from "../../helpers/Notificacion.helpers.js";

config();

const DOCUMENTO_ADMIN = process.env.DOCUMENTO_ADMIN;

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, Documento, password, permisos, RolId, EstadoId } = req.body;
    const UsuarioId = req.usuario.id;
    const usuarioNombre = req.usuario.nombre; 

    const consultaId = await Usuario.findByPk(req.body.id);
    if (consultaId) {
      return res.status(400).json({ message: "El ID del usuario ya existe" });
    }

    const consultaNombre = await Usuario.findOne({ where: { nombre } });
    if (consultaNombre) {
      return res.status(400).json({ message: "El nombre ya existe" });
    }

    const consultaRol = await Rol.findByPk(RolId);
    if (!consultaRol) {
      return res.status(400).json({ message: "Rol no encontrado" });
    }

    const consultarEstado= await Estado.findByPk(EstadoId);
    if (!consultarEstado) {
      return res.status(400).json({ message: "Estado no encontrado" });
    }

    const consultaCorreo = await Usuario.findOne({ where: { correo } });
    if (consultaCorreo) {
      return res.status(400).json({ message: "El correo ya existe" });
    }

    const consultaDocumento = await Usuario.findOne({ where: { Documento } });
    if (consultaDocumento) {
      return res.status(400).json({ message: "El documento ya existe" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    const crearUser = await Usuario.create({
      ...req.body,
      password: hashedPassword,
    });

    await crearUser.save();

    const mensajeNotificacion = `El usuario ${usuarioNombre} agregó un nuevo usuario (${crearUser.nombre}, documento: ${crearUser.Documento}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);


    if (permisos && permisos.length > 0) {
      const permisosValidos = await Permiso.findAll({
        where: {
          id: permisos, 
        },
      });

      if (permisosValidos.length === 0) {
        return res.status(400).json({ message: 'Permisos no válidos' });
      }

      const detallePermisos = permisosValidos.map(permiso => ({
        UsuarioId: crearUser.id,
        PermisoId: permiso.id,
      }));

      await DetallePermiso.bulkCreate(detallePermisos); 
    }

    res.status(201).json({
      message: "Usuario creado exitosamente con permisos asignados",
      usuario: crearUser,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

export const getAllusuario = async (req, res) => {
  try {
    const consultarusuario = await Usuario.findAll({
      attributes: null,
      include: [
        {
          model: Rol,
          attributes: ["rolName"],
        },
        {
          model: Estado,
          attributes: ["estadoName"],
        },
      ],
    });
    res.status(200).json(consultarusuario);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getUsuario = async (req, res) => {
  try {
    const consultarusuario = await Usuario.findByPk(req.params.id, {
      include: [
        {
          model: Rol,
          attributes: ["rolName"],
        },
        {
          model: Estado,
          attributes: ["estadoName"],
        },
        {
          model: DetallePermiso,
          attributes: ["PermisoId"],
          include: [
            {
              model: Permiso,
              attributes: ["nombrePermiso"],
            },
          ],
        },
      ],
    });

    if (!consultarusuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(consultarusuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json(error.message);
  }
};

export const Putusuario = async (req, res) => {
  try {
    const { permisos } = req.body;
    const UsuarioId = req.usuario.id;
    const usuarioNombre = req.usuario.nombre; 

    const consultarusuario = await Usuario.findByPk(req.params.id);
    if (!consultarusuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (req.body.correo) {
      const emailExists = await Usuario.findOne({
        where: {
          correo: req.body.correo,
          id: { [Op.ne]: req.params.id },
        },
      });
      if (emailExists) {
        return res.status(400).json({ message: "El email ya está en uso por otro usuario" });
      }
    }

    if (req.body.Documento) {
      const documentoExists = await Usuario.findOne({
        where: {
          Documento: req.body.Documento,
          id: { [Op.ne]: req.params.id },
        },
      });
      if (documentoExists) {
        return res.status(400).json({ message: "El documento ya está en uso por otro usuario" });
      }
    }

    if (
      consultarusuario.correo === DOCUMENTO_ADMIN &&
      (req.body.RolId || req.body.EstadoId)
    ) {
      return res.status(403).json({
        message: "No se puede cambiar el rol o el estado del admin principal",
      });
    }

    if (req.params.id === process.env.DOCUMENT_ADMIN) {
      return res.status(404).json({
        message: "Usuario administrador no se puede cambiarle el rol",
      });
    }

    if (req.body.id === DOCUMENTO_ADMIN) {
      delete req.body.id; 
    }

    if (req.params.id === DOCUMENTO_ADMIN && req.body.RolId === 2) {
      delete req.body.RolId;
    }

    for (let key in req.body) {
      if (req.body[key] === null) {
        return res.status(400).json({ message: `El campo ${key} no puede ser nulo `});
      }
    }

    await consultarusuario.update(req.body);
    const mensajeNotificacion = `El usuario ${usuarioNombre} edito el usuario (${consultarusuario.nombre}, documento: ${consultarusuario.Documento}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'UPDATE', mensajeNotificacion);

    if (permisos && permisos.length > 0) {
      const permisosAsignados = await DetallePermiso.findAll({
        where: { UsuarioId: req.params.id },
        attributes: ["PermisoId"],
      });

      const permisosAsignadosIds = permisosAsignados.map(permiso => permiso.PermisoId);

      const permisosAEliminar = permisosAsignadosIds.filter(permisoId => !permisos.includes(permisoId));
      const permisosANuevos = permisos.filter(permisoId => !permisosAsignadosIds.includes(permisoId));

      if (permisosAEliminar.length > 0) {
        await DetallePermiso.destroy({
          where: {
            UsuarioId: req.params.id,
            PermisoId: permisosAEliminar,
          },
        });
      }

      if (permisosANuevos.length > 0) {
        const detallePermisos = permisosANuevos.map(permisoId => ({
          UsuarioId: req.params.id,
          PermisoId: permisoId,
        }));
        await DetallePermiso.bulkCreate(detallePermisos);
      }
    }

    return res.status(200).json({
      message: "Usuario actualizado correctamente con permisos asignados",
      usuario: consultarusuario,
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    return res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
}
