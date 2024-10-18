import { Op } from "sequelize"; 
import Producto from "../../models/Producto.js";
import Usuario from "../../models/Usuario.js";
import Subcategoria from "../../models/Subcategoria.js";
import Estado from "../../models/Estado.js";
import UnidadDeMedida from "../../models/UnidadMedida.js";
import { createNotification } from "../../helpers/Notificacion.helpers.js";

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
        const { nombre, descripcion, cantidadEntrada, volumen, marca, UnidadMedidaId, SubcategoriaId, EstadoId } = req.body;
        const UsuarioId = req.usuario.id;
        const usuarioNombre = req.usuario.nombre; 

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (nombre && nombre !== producto.nombre) {
            const existingProductoNombre = await Producto.findOne({ where: { nombre } });
            if (existingProductoNombre) {
                return res.status(400).json({ error: 'El nombre del producto ya existe' });
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
        }

        if (SubcategoriaId) {
            const subcategoria = await Subcategoria.findByPk(SubcategoriaId);
            if (!subcategoria) {
                return res.status(400).json({ error: 'El SubcategoriaId no existe' });
            }
        }

        if (EstadoId) {
            const estado = await Estado.findByPk(EstadoId);
            if (!estado) {
                return res.status(400).json({ error: 'El EstadoId no existe' });
            }
        }

        // Actualizar cantidad y estado
        if (cantidadEntrada !== undefined) {
            producto.cantidadEntrada = cantidadEntrada;
            producto.cantidadSalida = 0;
            producto.cantidadActual = cantidadEntrada;

            // Determinar el nuevo estado
            let estadoIdActual;
            if (cantidadEntrada < 2) {
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
            producto.EstadoId = estadoIdActual; // Actualizar estado
        }

        producto.nombre = nombre !== undefined ? nombre : producto.nombre;
        producto.volumen = volumen !== undefined ? volumen : producto.volumen;
        producto.descripcion = descripcion !== undefined ? descripcion : producto.descripcion;
        producto.marca = marca !== undefined ? marca : producto.marca;
        producto.UnidadMedidaId = UnidadMedidaId !== undefined ? UnidadMedidaId : producto.UnidadMedidaId;
        producto.SubcategoriaId = SubcategoriaId !== undefined ? SubcategoriaId : producto.SubcategoriaId;
        producto.UsuarioId = UsuarioId;

        await producto.save(); // Guardar los cambios en el producto
        const mensajeNotificacion = `El usuario ${usuarioNombre} edito el  producto (${producto.nombre}, con el codigo: ${producto.codigo}) el ${new Date().toLocaleDateString()}.`;
        await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);
    

        // Verificar si hay otros productos con cantidad actual < 2 y actualizar su estado a AGOTADO
        const productosAgotados = await Producto.findAll({
            where: {
                cantidadActual: {
                    [Op.lt]: 2,
                },
                EstadoId: {
                    [Op.ne]: estadoIdActual, // No modificar el estado del producto que acabamos de actualizar
                },
            },
        });

        const estadoAgotado = await Estado.findOne({ where: { estadoName: "AGOTADO" } });
        if (estadoAgotado) {
            await Promise.all(productosAgotados.map(async (prod) => {
                prod.EstadoId = estadoAgotado.id;
                await prod.save();
            }));
        }

        res.json(producto);
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