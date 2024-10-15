import Instructores from "../../models/Instructores.js";
import Fichas from "../../models/Fichas.js";
import InstructorFicha from "../../models/FI_IN.js";
import Usuario from "../../models/Usuario.js";

export const obtenerRelaciones = async (req, res) => {
  try {

    const relaciones = await InstructorFicha.findAll({
      include: [
        {
          model: Instructores,
          attributes: ["nombre", "correo", "celular"],
        },
        {
          model: Fichas,
          attributes: ["NumeroFicha", "Programa", "Jornada"],
        },
        {
          model: Usuario,
          attributes: ["nombre"], // Datos del usuario que realizó la acción
        },
      ],
    });

    if (relaciones.length === 0) {
      return res.status(404).json({
          message: "No se encontraron relaciones entre instructores y fichas",
        });
    }

    res.status(200).json(relaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({
        message: "Error al obtener las relaciones entre instructores y fichas",
      });
  }
};


export const asignarInstructorAFichas = async (req, res) => {
  try {
    const {
      nombreInstructor,
      correoInstructor,
      celularInstructor,
      fichas,
      semestre,
    } = req.body;

    const UsuarioId = req.usuario.id;
    let instructor = await Instructores.findOne({
      where: { correo: correoInstructor },
    });
    if (!instructor) {
      instructor = await Instructores.create({
        nombre: nombreInstructor,
        correo: correoInstructor,
        celular: celularInstructor,
        EstadoId: 1, 
        UsuarioId: UsuarioId,
      });
    }

    for (const fichaData of fichas) {
      const { numeroFicha, programaFicha, jornadaFicha } = fichaData;

      let ficha = await Fichas.findOne({ where: { NumeroFicha: numeroFicha } });
      if (!ficha) {

        ficha = await Fichas.create({
          NumeroFicha: numeroFicha,
          Programa: programaFicha,
          Jornada: jornadaFicha,
          EstadoId: 1, 
          UsuarioId: UsuarioId, 
        });
      }

      await InstructorFicha.findOrCreate({
        where: {
          InstructorId: instructor.id,
          FichaId: ficha.id,
          semestre: semestre,
          UsuarioId: UsuarioId,
        },
      });
    }

    res.status(200).json({ message: "Instructor y fichas relacionados correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocurrió un error al relacionar instructor y fichas" });
  }
};
