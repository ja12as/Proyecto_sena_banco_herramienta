import { Op } from "sequelize";
import Herramienta from "../../models/Herramientas.js";
import Usuario from "../../models/Usuario.js";
import Subcategoria from "../../models/Subcategoria.js";
import Estado from "../../models/Estado.js";
import { createNotification } from "../../helpers/Notificacion.helpers.js";
import Historial from "../../models/Historial.js";

export const crearHerramienta = async (req, res) => {
    try {
        const { nombre, codigo, marca, condicion, observaciones, EstadoId, SubcategoriaId } = req.body;
        const UsuarioId = req.usuario.id;
        const usuarioNombre = req.usuario.nombre;

        // Verificar si el código de la herramienta ya existe
        const consultaCodigo = await Herramienta.findOne({ where: { codigo } });
        if (consultaCodigo) {
            return res.status(400).json({ error: 'El código de la herramienta ya existe' });
        }

        // Verificar si el usuario existe
        const consultaUsuario = await Usuario.findByPk(UsuarioId);
        if (!consultaUsuario) {
            return res.status(400).json({ message: "El usuario especificado no existe" });
        }

        // Verificar si la subcategoría existe y su estado
        const consultaSubcategoria = await Subcategoria.findByPk(SubcategoriaId, {
            include: [{ model: Estado, as: 'Estado' }]
        });
        if (!consultaSubcategoria) {
            return res.status(400).json({ message: "La subcategoría especificada no existe" });
        }

        if (consultaSubcategoria.Estado.estadoName !== 'ACTIVO') {
            return res.status(400).json({ error: 'La subcategoría no está en estado ACTIVO' });
        }

        // Verificar el estado según la condición de la herramienta
        let estadoId = EstadoId;
        let estadoNombre;

        if (condicion === 'MALO') {
            const estadoInactivo = await Estado.findOne({ where: { estadoName: 'INACTIVO' } });
            if (!estadoInactivo) {
                return res.status(500).json({ error: 'Estado INACTIVO no encontrado' });
            }
            estadoId = estadoInactivo.id;
            estadoNombre = estadoInactivo.estadoName;
        } else {
            const consultaEstado = await Estado.findByPk(EstadoId);
            if (!consultaEstado) {
                return res.status(400).json({ message: "El estado especificado no existe" });
            }
            estadoNombre = consultaEstado.estadoName;
        }

        const subcategoriaNombre = consultaSubcategoria.subcategoriaName;

        // Crear la herramienta
        const herramienta = await Herramienta.create({
            nombre,
            codigo,
            marca,
            condicion,
            observaciones,
            UsuarioId: UsuarioId,
            EstadoId: estadoId,
            SubcategoriaId
        });

        // Crear notificación
        const mensajeNotificacion = `El usuario ${usuarioNombre} agregó una nueva herramienta: (${herramienta.nombre}, con el código: ${herramienta.codigo}) el ${new Date().toLocaleDateString()}.`;
        await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);

        // Registrar en el historial
        const descripcionHistorial = `El usuario ${usuarioNombre} creó una herramienta con los siguientes datos: 
        Nombre: ${herramienta.nombre}, 
        Código: ${herramienta.codigo}, 
        Marca: ${herramienta.marca},
        Condición: ${herramienta.condicion}, 
        Observaciones: ${herramienta.observaciones}, 
        Estado: ${estadoNombre},
        Subcategoría: ${subcategoriaNombre}.`;

        await Historial.create({
            tipoAccion: "CREAR",
            descripcion: descripcionHistorial,
            UsuarioId: UsuarioId
        });

        res.status(201).json(herramienta);
    } catch (error) {
        console.error("Error al crear la herramienta", error);
        res.status(500).json({ message: error.message });
    }
};


export const getAllHerramienta = async (req, res) =>{
    try {
        let consultaHerramieta = await Herramienta.findAll({
            attributes: null,
            include: [
                { model: Usuario, attributes: ['nombre',] },
                { model: Subcategoria, attributes: ['subcategoriaName'] },
                { model: Estado, attributes: ['estadoName'] },
            ],
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json(consultaHerramieta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getHerramienta = async (req, res) =>{
    try {
        let consultaHerramieta = await Herramienta.findByPk(req.params.id);

        if(!consultaHerramieta){
            return res.status(404).json({ message: "Herramienta no encontrada" });
        }
        res.status(200).json(consultaHerramieta)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const putHerramienta = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, codigo, marca, condicion, observaciones, EstadoId, SubcategoriaId } = req.body;
        const UsuarioId = req.usuario.id;
        const usuarioNombre = req.usuario.nombre; 

        const herramienta = await Herramienta.findByPk(id);
        if (!herramienta) {
            return res.status(404).json({ message: "Herramienta no encontrada" });
        }

        const oldValues = {
            nombre: herramienta.nombre,
            codigo: herramienta.codigo,
            marca: herramienta.marca,
            condicion: herramienta.condicion,
            observaciones: herramienta.observaciones,
            SubcategoriaId: herramienta.SubcategoriaId,
            EstadoId: herramienta.EstadoId
        };

        // Obtener los nombres antiguos de la subcategoría y el estado
        const oldSubcategoria = await Subcategoria.findByPk(oldValues.SubcategoriaId);
        const oldEstado = await Estado.findByPk(oldValues.EstadoId);

        let oldSubcategoriaName = oldSubcategoria ? oldSubcategoria.subcategoriaName : "N/A";
        let oldEstadoName = oldEstado ? oldEstado.estadoName : "N/A";

        let newSubcategoriaName = oldSubcategoriaName;
        let newEstadoName = oldEstadoName;

        if (codigo) {
            const consultaCodigo = await Herramienta.findOne({ where: { codigo, id: { [Op.ne]: id } } });
            if (consultaCodigo) {
                return res.status(400).json({ error: 'El código de la herramienta ya existe' });
            }
        }

        if (UsuarioId) {
            const consultaUsuario = await Usuario.findByPk(UsuarioId);
            if (!consultaUsuario) {
                return res.status(400).json({ message: "El usuario especificado no existe" });
            }
        }

        // Actualizar subcategoría
        if (SubcategoriaId) {
            const consultaSubcategoria = await Subcategoria.findByPk(SubcategoriaId, {
                include: [{ model: Estado, as: 'Estado' }]
            });
            if (!consultaSubcategoria) {
                return res.status(400).json({ message: "La subcategoría especificada no existe" });
            }

            if (consultaSubcategoria.Estado.estadoName !== 'ACTIVO') {
                return res.status(400).json({ error: 'La subcategoría no está en estado ACTIVO' });
            }
            herramienta.SubcategoriaId = SubcategoriaId;
            newSubcategoriaName = consultaSubcategoria.subcategoriaName;
        }

        // Actualizar estado basado en la condición o en el EstadoId
        if (condicion === 'MALO') {
            const estadoInactivo = await Estado.findOne({ where: { estadoName: 'INACTIVO' } });
            if (!estadoInactivo) {
                return res.status(500).json({ error: 'Estado INACTIVO no encontrado' });
            }
            herramienta.EstadoId = estadoInactivo.id;
            newEstadoName = estadoInactivo.estadoName;

        } else if (EstadoId) {
            const consultaEstado = await Estado.findByPk(EstadoId);
            if (!consultaEstado) {
                return res.status(400).json({ message: "El estado especificado no existe" });
            }
            herramienta.EstadoId = EstadoId;
            newEstadoName = consultaEstado.estadoName;
        }

        // Actualizar los demás campos de la herramienta
        herramienta.nombre = nombre || herramienta.nombre;
        herramienta.codigo = codigo || herramienta.codigo;
        herramienta.marca = marca || herramienta.marca;
        herramienta.condicion = condicion || herramienta.condicion;
        herramienta.observaciones = observaciones || herramienta.observaciones;
        herramienta.UsuarioId = UsuarioId;

        await herramienta.save();

        const mensajeNotificacion = `El usuario ${usuarioNombre} editó la herramienta: (${herramienta.nombre}, con el código: ${herramienta.codigo}) el ${new Date().toLocaleDateString()}.`;
        await createNotification(UsuarioId, 'UPDATE', mensajeNotificacion);

        // Crear descripción detallada de los cambios
        let cambiosRealizados = [];

        if (oldValues.nombre !== herramienta.nombre) {
            cambiosRealizados.push(`Nombre: de "${oldValues.nombre}" a "${herramienta.nombre}"`);
        }
        if (oldValues.codigo !== herramienta.codigo) {
            cambiosRealizados.push(`Código: de "${oldValues.codigo}" a "${herramienta.codigo}"`);
        }
        if (oldValues.marca !== herramienta.marca) {
            cambiosRealizados.push(`Marca: de "${oldValues.marca}" a "${herramienta.marca}"`);
        }
        if (oldValues.condicion !== herramienta.condicion) {
            cambiosRealizados.push(`Condición: de "${oldValues.condicion}" a "${herramienta.condicion}"`);
        }
        if (oldValues.observaciones !== herramienta.observaciones) {
            cambiosRealizados.push(`Observaciones: de "${oldValues.observaciones}" a "${herramienta.observaciones}"`);
        }
        if (oldValues.SubcategoriaId !== herramienta.SubcategoriaId) {
            cambiosRealizados.push(`Subcategoría: de "${oldSubcategoriaName}" a "${newSubcategoriaName}"`);
        }
        if (oldValues.EstadoId !== herramienta.EstadoId) {
            cambiosRealizados.push(`Estado: de "${oldEstadoName}" a "${newEstadoName}"`);
        }

        const descripcionHistorial = `El usuario ${usuarioNombre} actualizó la herramienta ${herramienta.codigo} con los siguientes cambios: ${cambiosRealizados.join(', ')}`;

        // Registrar en el historial
        await Historial.create({
            tipoAccion: "ACTUALIZAR",
            descripcion: descripcionHistorial,
            UsuarioId: UsuarioId
        });

        res.status(200).json(herramienta);
    } catch (error) {
        console.error("Error al actualizar la herramienta", error);
        res.status(500).json({ message: error.message });
    }
};


export const buscarHerramientas = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Debe ingresar un término de búsqueda." });
        }

        const herramientas = await Herramienta.findAll({
            where: {
                nombre: {
                    [Op.like]:`%${query}%`,
                },
              EstadoId: 1, // Solo se debe buscar herramientas con EstadoId 1
            },
            attributes: ["id", "nombre", "codigo"],
        });

        if (herramientas.length === 0) {
            return res.status(404).json({ message: "No se encontraron herramientas." });
        }

        res.status(200).json(herramientas);
    } catch (error) {
        console.error("Error al obtener sugerencias de herramientas", error);
        res.status(500).json({ message: "Error al obtener sugerencias de herramientas" });
    }
};
