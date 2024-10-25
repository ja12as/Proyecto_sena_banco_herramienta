import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Fichas from "../../models/Fichas.js";
import Instructores from "../../models/Instructores.js";
import FichaInstructor from "../../models/FI_IN.js";
import parseExcel from "../../helpers/parseExcel.js";
import Usuario from "../../models/Usuario.js";
import Historial from "../../models/Historial.js";
import { createNotification } from "../../helpers/Notificacion.helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "../../upload");

export const uploadFichasInstructores = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo." });
    }

    const filePath = req.file.path;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: `El archivo no fue encontrado en la ruta: ${filePath}` });
    }

    const excelData = parseExcel(filePath);

    if (excelData.length <= 1) {
      return res.status(400).json({ message: "El archivo no contiene suficientes datos." });
    }

    const dataRows = excelData.slice(1);
    const UsuarioId = req.usuario.id;
    const usuarioNombre = req.usuario.nombre;

    let registrosCreados = 0; // Contador de registros nuevos

    for (const [index, row] of dataRows.entries()) {
      try {
        const { NumeroFicha, Programa, Jornada, InstructorNombre, semestre, celularInstructor, correoInstructor } = row;

        // Verificación de datos requeridos
        const missingFields = [];
        if (!NumeroFicha) missingFields.push("NumeroFicha");
        if (!Programa) missingFields.push("Programa");
        if (!Jornada) missingFields.push("Jornada");
        if (!InstructorNombre) missingFields.push("InstructorNombre");
        if (!semestre) missingFields.push("semestre");
        if (!celularInstructor) missingFields.push("celularInstructor");
        if (!correoInstructor) missingFields.push("correoInstructor");

        if (missingFields.length > 0) {
          throw new Error(`Faltan los siguientes campos requeridos en la fila ${index + 2}: ${missingFields.join(", ")}`);
        }

        const fichaNumero = String(NumeroFicha);

        // Verifica y crea la ficha
        let [fichaInstance, fichaCreada] = await Fichas.findOrCreate({
          where: { NumeroFicha: fichaNumero },
          defaults: {
            Programa,
            Jornada,
            EstadoId: 1,
            UsuarioId: UsuarioId,
          },
        });

        let mensajeFicha = fichaCreada
          ? `Se añadió la ficha con número ${fichaNumero} para el programa ${Programa} en la jornada ${Jornada}.`
          : `La ficha con número ${fichaNumero} ya existía en el sistema.`;

        // Verifica y crea el instructor
        let [instructorInstance, instructorCreado] = await Instructores.findOrCreate({
          where: { nombre: InstructorNombre },
          defaults: {
            correo: correoInstructor,
            celular: celularInstructor,
            EstadoId: 1,
            UsuarioId: UsuarioId,
          },
        });

        let mensajeInstructor = instructorCreado
          ? `Se añadió el instructor ${InstructorNombre} con el correo ${correoInstructor} y celular ${celularInstructor}.`
          : `El instructor ${InstructorNombre} ya existía en el sistema.`;

        // Verifica si ya existe la combinación de FichaId, InstructorId y semestre
        const existingRecord = await FichaInstructor.findOne({
          where: {
            FichaId: fichaInstance.id,
            InstructorId: instructorInstance.id,
            semestre: semestre,
          },
        });

        let mensajeRelacion;
        if (!existingRecord) {
          // Solo se inserta si no existe
          await FichaInstructor.create({
            FichaId: fichaInstance.id,
            InstructorId: instructorInstance.id,
            semestre,
            EstadoId: 1,
            UsuarioId: UsuarioId,
          });

          mensajeRelacion = `Se añadió la relación de la ficha ${fichaNumero} con el instructor ${InstructorNombre} para el semestre ${semestre}.`;
          registrosCreados++; // Aumentar el contador si se creó un nuevo registro
        } else {
          mensajeRelacion = `La relación de la ficha ${fichaNumero} con el instructor ${InstructorNombre} para el semestre ${semestre} ya existía.`;
        }

        const mensajeFila = `${mensajeFicha} ${mensajeInstructor} ${mensajeRelacion}`;

        // Crear registro en el historial por fila procesada
        await Historial.create({
          tipoAccion: "CREAR",
          descripcion: `El usuario ${usuarioNombre} realizó las siguientes acciones: ${mensajeFila}`,
          UsuarioId: UsuarioId,
        });

      } catch (error) {
        console.error(`Error en la fila ${index + 2}:`, error.message);
        console.log("Datos de la fila con error:", row);
        return res.status(400).json({ message: `Error en la fila ${index + 2}: ${error.message}` });
      }
    }

    fs.unlinkSync(filePath);
    const mensajeNotificacion = `El usuario ${usuarioNombre} subió un archivo Excel al sistema el ${new Date().toLocaleDateString()}.`;
    await createNotification(UsuarioId, 'UPLOAD', mensajeNotificacion);


    res.status(200).json({ message: "Fichas e instructores procesados exitosamente." });

  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({ message: "Error al procesar el archivo: " + error.message });
  }
};



export const getFichasInstructores = async (req, res) => {
  try {
    const fichasInstructores = await FichaInstructor.findAll({
      include: [
        { model: Fichas, as: "Ficha", attributes: ["NumeroFicha", "Programa", "Jornada"] },
        { model: Instructores, as: "Instructore", attributes: ["nombre", "correo", "celular"] },
        { model: Usuario, as: "Usuario", attributes: ["nombre"] }, 
      ],
      order: [["createdAt", "DESC"]], // Ordenar por fecha de creación en orden descendente
    });
    res.status(200).json(fichasInstructores);
  } catch (error) {
    console.error("Error al obtener fichas e instructores:", error.message);
    res.status(500).json({ message: "Error al obtener fichas e instructores: " + error.message });
  }
};
