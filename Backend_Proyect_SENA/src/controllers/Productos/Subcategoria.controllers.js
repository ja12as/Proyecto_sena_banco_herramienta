import Subcategoria from "../../models/Subcategoria.js";
import Categoria from "../../models/Categoria.js";
import Estado from "../../models/Estado.js";
import { Op } from "sequelize";
import { createNotification } from "../../helpers/Notificacion.helpers.js";
import Historial from "../../models/Historial.js";

export const crearSubcategoria = async (req, res) => {
  try {
    const { CategoriaId, EstadoId, subcategoriaName } = req.body;
    const UsuarioId = req.usuario.id;
    const usuarioNombre = req.usuario.nombre;

    // Verificar que la categoría existe
    const consultacategoria = await Categoria.findByPk(CategoriaId);
    if (!consultacategoria) {
      return res.status(400).json({ message: "La categoría especificada no existe" });
    }

    // Verificar que el estado existe
    const consultaEstado = await Estado.findByPk(EstadoId);
    if (!consultaEstado) {
      return res.status(400).json({ message: "El estado especificado no existe" });
    }

    // Normalizar el nombre de la subcategoría
    const normalizedSubcategoriaName = subcategoriaName.trim().toUpperCase(); // Eliminar espacios y convertir a mayúsculas

    // Verificar que el nombre de la subcategoría no exista en la misma categoría
    const consultaNombre = await Subcategoria.findOne({
      where: {
        subcategoriaName: normalizedSubcategoriaName,
        CategoriaId: CategoriaId,  // Asegurarse de que se verifique en la misma categoría
      },
    });
    if (consultaNombre) {
      return res.status(400).json({ message: "El nombre de la subcategoría ya existe en esta categoría" });
    }

    // Crear la subcategoría
    const crearSubcategorias = await Subcategoria.create({
      ...req.body,
      subcategoriaName: normalizedSubcategoriaName, // Usar el nombre normalizado
    });

    const mensajeNotificacion = `El usuario ${usuarioNombre} agregó una nueva subcategoría (${crearSubcategorias.subcategoriaName}, de la categoría: ${consultacategoria.categoriaName}) el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);

    const descripcionHistorial = `El usuario ${usuarioNombre} creó una subcategoría con los siguientes datos: 
    Nombre: ${crearSubcategorias.subcategoriaName}, 
    Categoría: ${consultacategoria.categoriaName}, 
    Estado: ${consultaEstado.estadoName}.`;

    await Historial.create({
      tipoAccion: "CREAR",
      descripcion: descripcionHistorial,
      UsuarioId: UsuarioId,
    });

    res.status(201).json(crearSubcategorias);
  } catch (error) {
    console.error("Error al crear la subcategoría", error);
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
          CategoriaId: oldValues.CategoriaId, // Verificar en la categoría actual
          id: {
            [Op.ne]: subcategId,
          },
        },
      });

      if (consultaNombre) {
        return res.status(400).json({ message: "El nombre de la subcategoría ya existe en esta categoría" });
      }
      consultaId.subcategoriaName = subcategoriaName;
    }

    // Actualizar la categoría si es necesario
    let newCategoriaName = oldCategoriaName; // Por defecto es el mismo
    if (CategoriaId) {
      const consultacategoria = await Categoria.findByPk(CategoriaId);
      if (!consultacategoria) {
        return res.status(400).json({ message: "La categoría especificada no existe" });
      }
      consultaId.CategoriaId = CategoriaId;
      newCategoriaName = consultacategoria.categoriaName; // Actualizar con el nuevo nombre
    }

    // Actualizar el estado si es necesario
    let newEstadoName = oldEstadoName; // Por defecto es el mismo
    if (EstadoId) {
      const consultaestado = await Estado.findByPk(EstadoId);
      if (!consultaestado) {
        return res.status(400).json({ message: "El estado especificado no existe" });
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

