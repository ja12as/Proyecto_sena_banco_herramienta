import Permiso from "../../models/Permiso.js";

export const getAllPermisos = async (req, res )=> {
    try {
        let permiso = await Permiso.findAll({
            atributes: null,
        });
        res.status(200).json(permiso);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}
