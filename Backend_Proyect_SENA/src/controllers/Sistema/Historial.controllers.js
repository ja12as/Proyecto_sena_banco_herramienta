import Historial from "../../models/Historial.js";
import Usuario from "../../models/Usuario.js";



export const obtenerHistorial = async (req, res) => {
    try {
        const historial = await Historial.findAll({
        include: [{
            model: Usuario,
            attributes: ['nombre'],
        }],
        order: [['createdAt', 'DESC']],
        });

        res.status(200).json(historial);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el historial" });
    }
};