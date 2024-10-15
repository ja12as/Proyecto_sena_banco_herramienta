import Categoria from "../../models/Categoria.js";
import Estado from "../../models/Estado.js";


export const getAllCategoria = async (req, res) => {
  try {
    let categorias = await Categoria.findAll({
      atributes: null,
      include: [
        {
          model: Estado,
          attributes: ["estadoName"],
        },
      ],
    });

    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoria = async (req, res) => {
  try {
    let categorias = await Categoria.findByPk(req.params.id);

    if (!categorias) {
      return res.status(404).json({ message: "No se encontró la categoria" });
    }

    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json(error);
  }
};

