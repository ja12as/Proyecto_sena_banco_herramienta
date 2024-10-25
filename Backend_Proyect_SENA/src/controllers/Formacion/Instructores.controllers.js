import Estado from "../../models/Estado.js";
import Usuario from "../../models/Usuario.js";
import { Op } from "sequelize";
import Instructores from "../../models/Instructores.js";
import { createNotification } from "../../helpers/Notificacion.helpers.js";
import Historial from "../../models/Historial.js";

export const crearInstructor = async (req, res) => {
  try {
    const { nombre, correo, celular, EstadoId } = req.body;
    const UsuarioId = req.usuario.id;
    const usuarioNombre = req.usuario.nombre; 

    const consultaCorreo = await Instructores.findOne({ where: { correo } });
    if (consultaCorreo) {
      return res.status(400).json({ message: "El instructor con ese correo ya existe" });
    }

    const consultaCelular = await Instructores.findOne({
      where: {
        celular: celular,
      },
    });
    if (consultaCelular) {
      return res
        .status(400)
        .json({ message: "El celular ya está usado por otro usuario" });
    }
    const consultaEstado = await Estado.findByPk(EstadoId);
    if (!consultaEstado) {
      return res
        .status(400)
        .json({ message: "El estado especificado no existe" });
    }
    const estadoNombre = consultaEstado.estadoName; 

    const nuevoInstructor = { nombre, correo, celular, EstadoId, UsuarioId};
    const instructorCreado = await Instructores.create(nuevoInstructor);

    const mensajeNotificacion = `El usuario ${usuarioNombre} agregó un nuevo instructor (${instructorCreado.nombre}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);

    const descripcionHistorial = `El usuario ${usuarioNombre} creó un instructor con los siguientes datos: 
    Nombre: ${instructorCreado.nombre}, 
    Correo: ${instructorCreado.correo}, 
    Celular: ${instructorCreado.celular}, 
    Estado: ${estadoNombre}.`;

  await Historial.create({
    tipoAccion: "CREAR",
    descripcion: descripcionHistorial,
    UsuarioId: UsuarioId
  });

    res.status(201).json(instructorCreado);
  } catch (error) {
    console.error("Error al crear el instructor", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllInstructores = async (req, res) => {
  try {
    let instructores = await Instructores.findAll({
      atributes: null,
      include: [
        {
          model: Estado,
          attributes: ["estadoName"],
        },
        {
          model: Usuario,
          attributes: ["nombre"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(instructores);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getInstructor = async (req, res) => {
  try {
    let instructor = await Instructores.findByPk(req.params.id);

    if (!instructor) {
      return res.status(404).json({ message: "No se encontró el instructor" });
    }

    res.status(200).json(instructor);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const actualizarInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, celular, EstadoId } = req.body;
    const UsuarioId = req.usuario.id;
    const usuarioNombre = req.usuario.nombre; 

    const instructor = await Instructores.findByPk(id);

    if (!instructor) {
      return res.status(404).json({ message: "No se encontró el instructor" });
    }

    const oldValues = {
      nombre: instructor.nombre,
      correo: instructor.correo,
      celular: instructor.celular,
      EstadoId: instructor.EstadoId
    };
    const oldEstado = await Estado.findByPk(oldValues.EstadoId);
    let oldEstadoName = oldEstado ? oldEstado.estadoName : "N/A";

    if (correo) {
      const consultaCorreo = await Instructores.findOne({
        where: { correo, id: { [Op.ne]: id } },
      });
      if (consultaCorreo) {
        return res
          .status(400)
          .json({ message: "El instructor con ese correo ya existe" });
      }
    }

    if (celular && celular !== instructor.celular) {
      const consultaCelular = await Instructores.findOne({
        where: { celular, id: { [Op.ne]: id } },
      });
      if (consultaCelular) {
        return res
          .status(400)
          .json({ message: "El celular ya está usado por otro usuario" });
      }
    }

    let newEstadoName = oldEstadoName; // Por defecto es el mismo
    if (EstadoId) {
      const consultaestado = await Estado.findByPk(EstadoId);
      if (!consultaestado) {
        return res
          .status(400)
          .json({ message: "El estado especificado no existe" });
      }
      newEstadoName = consultaestado.estadoName; // Actualizar con el nuevo nombre
    }

    if (nombre) instructor.nombre = nombre;
    if (correo) instructor.correo = correo;
    if (celular) instructor.celular = celular;
    if (EstadoId) instructor.EstadoId = EstadoId;
    instructor.UsuarioId = UsuarioId;

    await instructor.save();
    const mensajeNotificacion = `El usuario ${usuarioNombre} edito el instructor (${instructor.nombre}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'UPDATE', mensajeNotificacion);


    // Crear descripción detallada de los cambios
    let cambiosRealizados = [];
    
    if (oldValues.nombre !== instructor.nombre) {
      cambiosRealizados.push(`Nombre: de "${oldValues.nombre}" a "${instructor.nombre}"`);
    }
    if (oldValues.correo !== instructor.correo) {
      cambiosRealizados.push(`Correo: de "${oldValues.correo}" a "${instructor.correo}"`);
    }
    if (oldValues.celular !== instructor.celular) {
      cambiosRealizados.push(`Celular: de "${oldValues.celular}" a "${instructor.celular}"`);
    }
    if (oldValues.EstadoId !== instructor.EstadoId) {
      cambiosRealizados.push(`Estado: de "${oldEstadoName}" a "${newEstadoName}"`);
    }
    const descripcionHistorial = `El usuario ${usuarioNombre} actualizó el instructor ${instructor.nombre} con los siguientes cambios: ${cambiosRealizados.join(', ')}`;

    // Registrar en el historial
    await Historial.create({
      tipoAccion: "ACTUALIZAR",
      descripcion: descripcionHistorial,
      UsuarioId: UsuarioId
    });
    
    res.status(200).json(instructor);
  } catch (error) {
    console.error("Error al actualizar el instructor", error);
    res.status(500).json({ message: error.message });
  }
};
