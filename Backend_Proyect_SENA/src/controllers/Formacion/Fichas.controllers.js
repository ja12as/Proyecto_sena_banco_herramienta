import { Op } from "sequelize";
import Estado from "../../models/Estado.js";
import Ficha from "../../models/Fichas.js";
import Usuario from "../../models/Usuario.js";
import { createNotification } from "../../helpers/Notificacion.helpers.js";
import Historial from "../../models/Historial.js";

export const crearFicha = async (req, res) => {
  try {
    const { EstadoId, NumeroFicha, Programa, Jornada } = req.body;
    const UsuarioId = req.usuario.id;
    const usuarioNombre = req.usuario.nombre; 

    const consultaId = await Ficha.findOne({
      where: { NumeroFicha },
    });
    if (consultaId) {
      return res.status(400).json({ message: "La ficha ya existe" });
    }

    const consultaUsuario = await Usuario.findByPk(UsuarioId);
    if (!consultaUsuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const consultaEstado = await Estado.findByPk(EstadoId);
    if (!consultaEstado) {
      return res
        .status(400)
        .json({ message: "El estado especificado no existe" });
    }
    const estadoNombre = consultaEstado.estadoName; 
    const nuevaFicha = { NumeroFicha, Programa, Jornada, EstadoId, UsuarioId: UsuarioId, };

    const fichaCreada = await Ficha.create(nuevaFicha);

    const mensajeNotificacion = `El usuario ${usuarioNombre} agregó una nueva ficha (${fichaCreada.NumeroFicha}, del programa: ${fichaCreada.Programa}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);

    const descripcionHistorial = `El usuario ${usuarioNombre} creó una ficha con los siguientes datos: 
    Nombre: ${fichaCreada.NumeroFicha}, 
    Programa: ${fichaCreada.Programa}, 
    Jornada: ${fichaCreada.Jornada}, 
    Estado: ${estadoNombre}.`;

  await Historial.create({
    tipoAccion: "CREAR",
    descripcion: descripcionHistorial,
    UsuarioId: UsuarioId
  });
    res.status(200).json(fichaCreada);
  } catch (error) {
    console.error("Error al crear la ficha", error);
    res.status(500).json({ message: error.message });
  }
};


export const getAllFichas = async (req, res) => {
  try {
    let Fichas = await Ficha.findAll({
      attributes: null,
      include: [
        {
          model: Usuario,
          attributes: ["nombre"],  // corregido 'atributes' a 'attributes'
        },
        {
          model: Estado,
          attributes: ["estadoName"],
        },
      ],
      order: [["createdAt", "DESC"]], // Cambiar a 'DESC' para ordenar por fecha de creación descendente
    });

    res.status(200).json(Fichas);
  } catch (error) {
    res.status(500).json(error);
  }
};


export const getFicha = async (req, res) => {
  try {
    let Fichas = await Ficha.findByPk(req.params.id);

    if (!Fichas) {
      return res.status(404).json({ mensaje: "No se encontró la ficha" });
    }

    res.status(200).json(Fichas);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateFicha = async (req, res) => {
  try {
    const { id } = req.params;
    const { EstadoId, NumeroFicha, Programa, Jornada } = req.body;
    const UsuarioId = req.usuario.id;
    const usuarioNombre = req.usuario.nombre; 

    const ficha = await Ficha.findByPk(id);
    if (!ficha) {
      return res.status(404).json({ message: "No se encontró ninguna ficha" });
    }
    const oldValues = {
      NumeroFicha: ficha.NumeroFicha,
      Programa: ficha.Programa,
      Jornada: ficha.Jornada,
      EstadoId: ficha.EstadoId
    };
    const oldEstado = await Estado.findByPk(oldValues.EstadoId);
    let oldEstadoName = oldEstado ? oldEstado.estadoName : "N/A";

    if (NumeroFicha) {
      const consultaId = await Ficha.findOne({
        where: {
          NumeroFicha,
          id: { [Op.ne]: ficha.id },
        },
      });
      if (consultaId) {
        return res
          .status(400)
          .json({ message: "La ficha con el mismo NumeroFicha ya existe" });
      }
      ficha.NumeroFicha = NumeroFicha;
    }

    let newEstadoName = oldEstadoName; 
    if (EstadoId) {
      const consultaestado = await Estado.findByPk(EstadoId);
      if (!consultaestado) {
        return res
          .status(400)
          .json({ message: "El estado especificado no existe" });
      }
      newEstadoName = consultaestado.estadoName;
    }


    ficha.UsuarioId = UsuarioId;

    if (Programa !== undefined) {
      ficha.Programa = Programa;
    }
    if (Jornada !== undefined) {
      ficha.Jornada = Jornada;
    }

    await ficha.save();
    const mensajeNotificacion = `El usuario ${usuarioNombre} edito la ficha (${ficha.NumeroFicha}, del programa: ${ficha.Programa}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'UPDATE', mensajeNotificacion);

    let cambiosRealizados = [];
    
    if (oldValues.NumeroFicha !== ficha.NumeroFicha) {
      cambiosRealizados.push(`Ficha: de "${oldValues.NumeroFicha}" a "${ficha.NumeroFicha}"`);
    }
    if (oldValues.Programa !== ficha.Programa) {
      cambiosRealizados.push(`Programa: de "${oldValues.Programa}" a "${ficha.Programa}"`);
    }
    if (oldValues.Jornada !== ficha.Jornada) {
      cambiosRealizados.push(`Jornada: de "${oldValues.Jornada}" a "${ficha.Jornada}"`);
    }
    if (oldValues.EstadoId !== ficha.EstadoId) {
      cambiosRealizados.push(`Estado: de "${oldEstadoName}" a "${newEstadoName}"`);
    }

    const descripcionHistorial = `El usuario ${usuarioNombre} actualizó la ficha  ${ ficha.NumeroFicha} con los siguientes cambios: ${cambiosRealizados.join(', ')}`;

    // Registrar en el historial
    await Historial.create({
      tipoAccion: "ACTUALIZAR",
      descripcion: descripcionHistorial,
      UsuarioId: UsuarioId
    });

    res.status(200).json(ficha);
  } catch (error) {
    console.error("Error al actualizar la ficha", error);
    res.status(500).json({ message: error.message });
  }
}