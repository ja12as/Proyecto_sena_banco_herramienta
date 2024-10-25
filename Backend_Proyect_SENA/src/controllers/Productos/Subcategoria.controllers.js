import Subcategoria from "../../models/Subcategoria.js";
import Categoria from "../../models/Categoria.js";
import Estado from "../../models/Estado.js";
import { Op } from "sequelize";
import { createNotification } from "../../helpers/Notificacion.helpers.js";
import Historial from "../../models/Historial.js";

export const crearSubcategoria = async (req, res) => {
  try {
    const { CategoriaId, EstadoId } = req.body;
    const UsuarioId = req.usuario.id;
    const usuarioNombre = req.usuario.nombre; 

    const consultaId = await Subcategoria.findByPk(req.body.id);
    if (consultaId) {
      return res.status(400).json({ message: "Subcategoria no encontrada" });
    }

    const consultaNombre = await Subcategoria.findOne({
      where: { subcategoriaName: req.body.subcategoriaName },
    });
    if (consultaNombre) {
      return res
        .status(400)
        .json({ message: "El nombre de la Subcategoria ya existe" });
    }

    const consultacategoria = await Categoria.findByPk(CategoriaId);
    if (!consultacategoria) {
      return res
        .status(400)
        .json({ message: "La categoría especificada no existe" });
    }

    const consultaEstado = await Estado.findByPk(EstadoId);
    if (!consultaEstado) {
      return res
        .status(400)
        .json({ message: "El estado especificado no existe" });
    }

    const categoriaNombre = consultacategoria.categoriaName; 
    const estadoNombre = consultaEstado.estadoName; 

    let data = req.body;
    const crearSubcategorias = await Subcategoria.create(data);
    const response = await crearSubcategorias.save();

    const mensajeNotificacion = `El usuario ${usuarioNombre} agregó una nueva subcategoria (${response.subcategoriaName}, de la categoria: ${categoriaNombre}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);

    const descripcionHistorial = `El usuario ${usuarioNombre} creó una subcategoria con los siguientes datos: 
    Nombre: ${response.subcategoriaName}, 
    Categoria: ${categoriaNombre}, 
    Estado: ${estadoNombre}.`; 

    await Historial.create({
      tipoAccion: "CREAR",
      descripcion: descripcionHistorial,
      UsuarioId: UsuarioId
    });

    res.status(201).json(response);
  } catch (error) {
    console.error("Error al crear la Subcategoria", error);
    res.status(500).json({ message: error.message });
  }
};



export const getallSubcategoria = async (req, res) => {
  try {
    let subcategorias = await Subcategoria.findAll({
      attributes: null,
      include: [
        {
          model: Categoria,
          attributes: ["categoriaName"],
        },
        {
          model: Estado,
          attributes: ["estadoName"],
        },
      ],
    });

    res.status(200).json(subcategorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubcategoria = async (req, res) => {
  try {
    let subcategorias = await Subcategoria.findByPk(req.params.id);

    if (!subcategorias) {
      return res.status(404).json({ message: "Subcategoría no encontrada" });
    }

    res.status(200).json(subcategorias);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getallSubcategoriaACTIVO = async (req, res) => {
  try {
    const estadoActivo = await Estado.findOne({
      where: { estadoName: "ACTIVO" },
    });

    if (!estadoActivo) {
      return res.status(404).json({ message: "Estado 'ACTIVO' no encontrado" });
    }
    let subcategorias = await Subcategoria.findAll({
      where: { EstadoId: estadoActivo.id },
      include: [
        {
          model: Categoria,
          attributes: ["categoriaName"],
        },
        {
          model: Estado,
          attributes: ["estadoName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(subcategorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const putSubcategoria = async (req, res) => {
  try {
    const { CategoriaId, subcategoriaName, EstadoId } = req.body;
    const UsuarioId = req.usuario.id;
    const usuarioNombre = req.usuario.nombre; 
    const subcategId = req.params.id;

    const consultaId = await Subcategoria.findByPk(subcategId);
    if (!consultaId) {
      return res.status(400).json({ message: "Subcategoría no encontrada" });
    }

    // Guardar los valores anteriores
    const oldValues = {
      subcategoriaName: consultaId.subcategoriaName,
      CategoriaId: consultaId.CategoriaId,
      EstadoId: consultaId.EstadoId
    };

    // Obtener los nombres antiguos de la categoría y el estado
    const oldCategoria = await Categoria.findByPk(oldValues.CategoriaId);
    const oldEstado = await Estado.findByPk(oldValues.EstadoId);

    let oldCategoriaName = oldCategoria ? oldCategoria.categoriaName : "N/A";
    let oldEstadoName = oldEstado ? oldEstado.estadoName : "N/A";

    // Actualizar el nombre de la subcategoría si es necesario
    if (subcategoriaName) {
      const consultaNombre = await Subcategoria.findOne({
        where: {
          subcategoriaName: subcategoriaName,
          id: {
            [Op.ne]: subcategId,
          },
        },
      });

      if (consultaNombre) {
        return res
          .status(400)
          .json({ message: "El nombre de la subcategoría ya existe" });
      }
      consultaId.subcategoriaName = subcategoriaName;
    }

    // Actualizar la categoría si es necesario
    let newCategoriaName = oldCategoriaName; // Por defecto es el mismo
    if (CategoriaId) {
      const consultacategoria = await Categoria.findByPk(CategoriaId);
      if (!consultacategoria) {
        return res
          .status(400)
          .json({ message: "La categoría especificada no existe" });
      }
      consultaId.CategoriaId = CategoriaId;
      newCategoriaName = consultacategoria.categoriaName; // Actualizar con el nuevo nombre
    }

    // Actualizar el estado si es necesario
    let newEstadoName = oldEstadoName; // Por defecto es el mismo
    if (EstadoId) {
      const consultaestado = await Estado.findByPk(EstadoId);
      if (!consultaestado) {
        return res
          .status(400)
          .json({ message: "El estado especificado no existe" });
      }
      consultaId.EstadoId = EstadoId;
      newEstadoName = consultaestado.estadoName; // Actualizar con el nuevo nombre
    }

    await consultaId.save();

    const mensajeNotificacion = `El usuario ${usuarioNombre} editó la subcategoría (${consultaId.subcategoriaName}, de la categoría: ${newCategoriaName}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'UPDATE', mensajeNotificacion);

    // Crear descripción detallada de los cambios
    let cambiosRealizados = [];

    if (oldValues.subcategoriaName !== consultaId.subcategoriaName) {
      cambiosRealizados.push(`Nombre: de "${oldValues.subcategoriaName}" a "${consultaId.subcategoriaName}"`);
    }
    if (oldValues.CategoriaId !== consultaId.CategoriaId) {
      cambiosRealizados.push(`Categoría: de "${oldCategoriaName}" a "${newCategoriaName}"`);
    }
    if (oldValues.EstadoId !== consultaId.EstadoId) {
      cambiosRealizados.push(`Estado: de "${oldEstadoName}" a "${newEstadoName}"`);
    }

    const descripcionHistorial = `El usuario ${usuarioNombre} actualizó la subcategoría ${consultaId.subcategoriaName} con los siguientes cambios: ${cambiosRealizados.join(', ')}.`;

    // Registrar en el historial
    await Historial.create({
      tipoAccion: "ACTUALIZAR",
      descripcion: descripcionHistorial,
      UsuarioId: UsuarioId
    });

    res.status(200).json({
      message: "Subcategoría actualizada con éxito",
      subcategoria: consultaId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar la subcategoría",
      error: error.message,
    });
  }
};
