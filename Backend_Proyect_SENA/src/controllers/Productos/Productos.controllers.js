import { Op } from "sequelize"; 
import Producto from "../../models/Producto.js";
import Usuario from "../../models/Usuario.js";
import Subcategoria from "../../models/Subcategoria.js";
import Estado from "../../models/Estado.js";
import UnidadDeMedida from "../../models/UnidadMedida.js";
import { createNotification } from "../../helpers/Notificacion.helpers.js";
import Historial from "../../models/Historial.js";

export const crearProductos = async (req, res) => {
    try {
        const {
            nombre,
            codigo,
            descripcion,
            cantidadEntrada,
            marca,
            EstadoId,
            SubcategoriaId,
            UnidadMedidaId,
        } = req.body;

        const UsuarioId = req.usuario.id;
        const usuarioNombre = req.usuario.nombre; 

        const consultaCodigo = await Producto.findOne({
            where: { [Op.or]: [{ codigo }] },
        });
        if (consultaCodigo) {
            return res.status(400).json({ error: "El código del producto ya existe" });
        }

        const consultaUsuario = await Usuario.findByPk(UsuarioId);
        if (!consultaUsuario) {
            return res.status(400).json({ message: "El usuario especificado no existe" });
        }

        const consultaUnidad = await UnidadDeMedida.findByPk(UnidadMedidaId);
        if (!consultaUnidad) {
            return res.status(400).json({ message: "La unidad de medida especificada no existe" });
        }

        const consultaSubcategoria = await Subcategoria.findByPk(SubcategoriaId);
        if (!consultaSubcategoria) {
            return res.status(400).json({ message: "La subcategoría especificada no existe" });
        }

        const consultaEstado = await Estado.findByPk(EstadoId);
        if (!consultaEstado) {
            return res.status(400).json({ message: "El estado especificado no existe" });
        }

        const cantidadSalida = 0;
        const cantidadActual = cantidadEntrada;
        let estadoIdActual;

        // Determinar el estado inicial basado en la cantidad actual
        if (cantidadActual < 2) {
            const estadoAgotado = await Estado.findOne({ where: { estadoName: "AGOTADO" } });
            if (estadoAgotado) {
                estadoIdActual = estadoAgotado.id; 
            }
        } else {
            const estadoActivo = await Estado.findOne({ where: { estadoName: "ACTIVO" } });
            if (estadoActivo) {
                estadoIdActual = estadoActivo.id; 
            }
        }

        const volumenTotalCalculado = `${cantidadActual} ${consultaUnidad.sigla}`;

        const unidadNombre = consultaUnidad.sigla;
        const subcategoriaNombre = consultaSubcategoria.subcategoriaName;
        const estadoNombre = consultaEstado.estadoName; 

        const producto = await Producto.create({
            nombre,
            codigo,
            descripcion,
            cantidadEntrada,
            cantidadSalida,
            cantidadActual,
            marca,
            VolumenTotal: volumenTotalCalculado,
            UsuarioId: UsuarioId,
            UnidadMedidaId,
            SubcategoriaId,
            EstadoId: estadoIdActual || EstadoId, 
        });
        const mensajeNotificacion = `El usuario ${usuarioNombre} agregó un nuevo producto (${producto.nombre}, con el codigo: ${producto.codigo}) el ${new Date().toLocaleDateString()}.`;
        await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);
        
        const descripcionHistorial = `El usuario ${usuarioNombre} creó un Producto con los siguientes datos: 
        Nombre: ${producto.nombre}, 
        Codigo: ${producto.codigo}, 
        Descripcion: ${producto.descripcion}, 
        cantidadEntrada: ${producto.cantidadEntrada},
        Marca: ${producto.marca}, 
        Volumen: ${producto.VolumenTotal}, 
        Unidad Medida: ${unidadNombre},
        Subcategoria: ${subcategoriaNombre}, 
        Estado: ${estadoNombre}.`;
    
      await Historial.create({
        tipoAccion: "CREAR",
        descripcion: descripcionHistorial,
        UsuarioId: UsuarioId
      });


        res.status(201).json({
            ...producto.toJSON(),
            unidadDeMedida: consultaUnidad.nombre,
            cantidadActual,
        });
    } catch (error) {
        console.error("Error al crear el producto", error);
        res.status(500).json({ message: error.message });
    }
}

export const getAllProductos = async (req, res) => {
    try {
        let consultaProducto = await Producto.findAll({
            attributes: null,
            include: [
                { model: Usuario, attributes: ["nombre"] },
                { model: Subcategoria, attributes: ["subcategoriaName"] },
                { model: Estado, attributes: ["estadoName"] },
                { model: UnidadDeMedida, attributes: ["nombre"] },
            ],
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json(consultaProducto);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

export const getProductos = async (req, res) => {
    try {
        let consultaProducto = await Producto.findByPk(req.params.id);

        if(!consultaProducto){
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json(consultaProducto)
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

export const putProductos = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion,cantidadEntrada, codigo, volumen, marca, UnidadMedidaId, SubcategoriaId, EstadoId } = req.body;
        const UsuarioId = req.usuario.id;
        const usuarioNombre = req.usuario.nombre; 

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const oldValues = {
            nombre: producto.nombre,
            codigo: producto.codigo,
            descripcion: producto.descripcion,
            cantidadEntrada: producto.cantidadEntrada,
            volumen: producto.volumen,
            marca: producto.marca,
            UnidadMedidaId: producto.UnidadMedidaId,
            SubcategoriaId: producto.SubcategoriaId,
            EstadoId: producto.EstadoId
        };

        const oldUnidad = await UnidadDeMedida.findByPk(oldValues.UnidadMedidaId);
        const oldSubcategoria = await Subcategoria.findByPk(oldValues.SubcategoriaId);
        const oldEstado = await Estado.findByPk(oldValues.EstadoId);

        let oldUnidadName = oldUnidad ? oldUnidad.nombre : "N/A";
        let oldSubcategoriaName = oldSubcategoria ? oldSubcategoria.subcategoriaName : "N/A";
        let oldEstadoName = oldEstado ? oldEstado.estadoName : "N/A";

        let newUnidadName = oldUnidadName;
        let newSubcategoriaName = oldSubcategoriaName;
        let newEstadoName = oldEstadoName;



        if (nombre && nombre !== producto.nombre) {
            const existingProductoNombre = await Producto.findOne({ where: { nombre } });
            if (existingProductoNombre) {
                return res.status(400).json({ error: 'El nombre del producto ya existe' });
            }
        }


        if (codigo) {
            const consultaCodigo = await Herramienta.findOne({ where: { codigo, id: { [Op.ne]: id } } });
            if (consultaCodigo) {
                return res.status(400).json({ error: 'El código del producto ya existe' });
            }
        }

        if (descripcion && descripcion.trim() === '') {
            return res.status(400).json({ error: 'La descripción no puede estar vacía' });
        }

        if (UsuarioId) {
            const usuario = await Usuario.findByPk(UsuarioId);
            if (!usuario) {
                return res.status(400).json({ error: 'El UsuarioId no existe' });
            }
        }

        if (UnidadMedidaId) {
            const unidadMedida = await UnidadDeMedida.findByPk(UnidadMedidaId);
            if (!unidadMedida) {
                return res.status(400).json({ error: 'El UnidadMedidaId no existe' });
            }
            newUnidadName = unidadMedida.nombre;
        }

        
        if (SubcategoriaId) {
            const subcategoria = await Subcategoria.findByPk(SubcategoriaId);
            if (!subcategoria) {
                return res.status(400).json({ error: 'El SubcategoriaId no existe' });
            }
            newSubcategoriaName = subcategoria.subcategoriaName;
        }

        
        if (EstadoId) {
            const estado = await Estado.findByPk(EstadoId);
            if (!estado) {
                return res.status(400).json({ error: 'El EstadoId no existe' });
            }
            newEstadoName = estado.estadoName;
        }

        if (cantidadEntrada !== undefined) {
            producto.cantidadEntrada = cantidadEntrada;
            producto.cantidadSalida = 0;
            producto.cantidadActual = cantidadEntrada;
        

            let estadoIdActual = producto.EstadoId;
        

            if (cantidadEntrada < 2) {
                const estadoAgotado = await Estado.findOne({ where: { estadoName: "AGOTADO" } });
                if (estadoAgotado) {
                    estadoIdActual = estadoAgotado.id;
                } else {
                    console.error('Estado AGOTADO no encontrado');
                }
            } else {
                const estadoActivo = await Estado.findOne({ where: { estadoName: "ACTIVO" } });
                if (estadoActivo) {
                    estadoIdActual = estadoActivo.id; 
                } else {
                    console.error('Estado ACTIVO no encontrado');
                }
            }
        
            producto.EstadoId = estadoIdActual; 
        
            const productosAgotados = await Producto.findAll({
                where: {
                    cantidadActual: {
                        [Op.lt]: 2,
                    },
                    EstadoId: {
                        [Op.ne]: estadoIdActual, 
                    },
                },
            });
        

            if (productosAgotados.length > 0) {
                const estadoAgotado = await Estado.findOne({ where: { estadoName: "AGOTADO" } });
                if (estadoAgotado) {
                    for (let prod of productosAgotados) {
                        prod.EstadoId = estadoAgotado.id;
                        await prod.save();
                    }
                } else {
                    console.error('Estado AGOTADO no encontrado');
                }
            }
        }
        

        producto.nombre = nombre !== undefined ? nombre : producto.nombre;
        producto.volumen = volumen !== undefined ? volumen : producto.volumen;
        producto.descripcion = descripcion !== undefined ? descripcion : producto.descripcion;
        producto.marca = marca !== undefined ? marca : producto.marca;
        producto.UnidadMedidaId = UnidadMedidaId !== undefined ? UnidadMedidaId : producto.UnidadMedidaId;
        producto.SubcategoriaId = SubcategoriaId !== undefined ? SubcategoriaId : producto.SubcategoriaId;
        producto.UsuarioId = UsuarioId;

        console.log(`Estado anterior: ${producto.EstadoId}`);
        producto.EstadoId = EstadoId;
        await producto.save();
        console.log(`Nuevo Estado: ${producto.EstadoId}`);

        const mensajeNotificacion = `El usuario ${usuarioNombre} edito el  producto (${producto.nombre}, con el codigo: ${producto.codigo}) el ${new Date().toLocaleDateString()}.`;
        await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);

        let cambiosRealizados = [];

        if (oldValues.nombre !== producto.nombre) {
            cambiosRealizados.push(`Nombre: de "${oldValues.nombre}" a "${producto.nombre}"`);
        }
        if (oldValues.descripcion !== producto.descripcion) {
            cambiosRealizados.push(`Descripción: de "${oldValues.descripcion}" a "${producto.descripcion}"`);
        }
        if (oldValues.cantidadEntrada !== producto.cantidadEntrada) {
            cambiosRealizados.push(`Cantidad de entrada: de "${oldValues.cantidadEntrada}" a "${producto.cantidadEntrada}"`);
        }
        if (oldValues.volumen !== producto.volumen) {
            cambiosRealizados.push(`Volumen: de "${oldValues.volumen}" a "${producto.volumen}"`);
        }
        if (oldValues.marca !== producto.marca) {
            cambiosRealizados.push(`Marca: de "${oldValues.marca}" a "${producto.marca}"`);
        }
        if (oldValues.UnidadMedidaId !== producto.UnidadMedidaId) {
            cambiosRealizados.push(`Unidad de Medida: de "${oldUnidadName}" a "${newUnidadName}"`);
        }
        if (oldValues.SubcategoriaId !== producto.SubcategoriaId) {
            cambiosRealizados.push(`Subcategoría: de "${oldSubcategoriaName}" a "${newSubcategoriaName}"`);
        }
        if (oldValues.EstadoId !== producto.EstadoId) {
            cambiosRealizados.push(`Estado: de "${oldEstadoName}" a "${newEstadoName}"`);
        }


        const descripcionHistorial = `El usuario ${usuarioNombre} actualizó el producto ${producto.codigo} con los siguientes cambios: ${cambiosRealizados.join(', ')}`;

        // Registrar en el historial
        await Historial.create({
            tipoAccion: "ACTUALIZAR",
            descripcion: descripcionHistorial,
            UsuarioId: UsuarioId
        });
        

        res.status(200).json(producto, );
    } catch (error) {
        console.error("Error al actualizar el producto", error);
        res.status(500).json({ error: 'Error al actualizar el producto'});
    }
}

// Propiedad de Valentina
export const BusquedaProductos = async (req, res) => {
    try {
        const { query } = req.query; 

        if (!query || query.trim() === "") {
        return res.status(400).json({ message: "Debe ingresar un término de búsqueda." });
        }

        const productos = await Producto.findAll({
            where: {
                nombre: {
                [Op.like]:`%${query}%`,
                },
                EstadoId: 1 
            },
            attributes: ["id", "nombre", "marca"],
        });

        if (productos.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos." });
        }

        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener sugerencias de productos", error);
        res.status(500).json({ message: "Error al obtener sugerencias de productos" });
    }
};



export const actualizarCantidadEntrada = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidadEntrada } = req.body;
        const UsuarioId = req.usuario.id;
        const usuarioNombre = req.usuario.nombre;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (cantidadEntrada === undefined || isNaN(cantidadEntrada)) {
            return res.status(400).json({ error: 'La cantidad de entrada es requerida y debe ser un número' });
        }

        if (producto.cantidadActual === 0) {
            producto.cantidadSalida += producto.cantidadEntrada;
        }

        producto.cantidadActual += Number(cantidadEntrada);
        producto.cantidadEntrada = cantidadEntrada;


        producto.cantidadSalida = 0;


        let estadoIdActual = producto.EstadoId;

        if (producto.cantidadActual < 2) {
            const estadoAgotado = await Estado.findOne({ where: { estadoName: "AGOTADO" } });
            if (estadoAgotado) {
                estadoIdActual = estadoAgotado.id;
            } else {
                console.error('Estado AGOTADO no encontrado');
            }
        } else {
            const estadoActivo = await Estado.findOne({ where: { estadoName: "ACTIVO" } });
            if (estadoActivo) {
                estadoIdActual = estadoActivo.id;
            } else {
                console.error('Estado ACTIVO no encontrado');
            }
        }


        producto.EstadoId = estadoIdActual;


        const productosAgotados = await Producto.findAll({
            where: {
                cantidadActual: {
                    [Op.lt]: 2,
                },
                EstadoId: {
                    [Op.ne]: estadoIdActual,
                },
            },
        });

        if (productosAgotados.length > 0) {
            const estadoAgotado = await Estado.findOne({ where: { estadoName: "AGOTADO" } });
            if (estadoAgotado) {
                for (let prod of productosAgotados) {
                    prod.EstadoId = estadoAgotado.id;
                    await prod.save();
                }
            } else {
                console.error('Estado AGOTADO no encontrado');
            }
        }


        await producto.save();


        const mensajeNotificacion = `El usuario ${usuarioNombre} actualizó la cantidad de entrada del producto (${producto.nombre}, con el código: ${producto.codigo}) el ${new Date().toLocaleDateString()}.`;
        await createNotification(UsuarioId, 'UPDATE', mensajeNotificacion);

        const descripcionHistorial = `El usuario ${usuarioNombre} actualizó la cantidad de entrada del producto ${producto.codigo} a ${producto.cantidadEntrada}.`;
        await Historial.create({
            tipoAccion: "ACTUALIZAR",
            descripcion: descripcionHistorial,
            UsuarioId: UsuarioId
        });

        res.json({ mensaje: 'Cantidad de entrada actualizada correctamente', producto });
    } catch (error) {
        console.error("Error al actualizar la cantidad de entrada", error);
        res.status(500).json({ error: 'Error al actualizar la cantidad de entrada' });
    }
};
