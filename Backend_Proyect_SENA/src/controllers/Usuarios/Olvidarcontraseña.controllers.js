import { enviarCorreo } from "../../libs/nodemailer.js";
import bcrypt from "bcryptjs";
import Usuario from "../../models/Usuario.js";
import { crearToken, verificarTokenRecupercion } from "../../libs/token.js";
import {generarCodigo,validarCorreo,} from "../../helpers/OlvidarContrasena.js";

export const validarEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
};

export const postCrearCodigo = async (req, res) => {
  try {
    const { correo } = req.body;

    const encontrarUser = await Usuario.findOne({
      where: { correo },
    });

    if (!encontrarUser) {
      return res.status(400).json({
        ok: false,
        message:
          "El correo electrónico no está registrado en nuestra base de datos",
      });
    }

    if (!validarCorreo(correo)) {
      return res.status(400).json({
        ok: false,
        message: "Correo inválido, solo se aceptan correos de gmail",
      });
    }

    if (!validarEmail(correo)) {
      return res.status(400).json({
        ok: false,
        message: "Correo inválido, solo se aceptan correos de Gmail",
      });
    }

    const dataToken = generarCodigo();
    const salt = bcrypt.genSaltSync(10);
    const tokenEncrypt = bcrypt.hashSync(dataToken, salt);

    const messageEmail = `
      <h2 style="color: #333;">Recuperación de Cuenta</h2>
      <p>Hola,</p>
      <p>Has solicitado recuperar tu contraseña. Aquí tienes tu código de recuperación:</p>
      <h3 style="color: #4CAF50; font-size: 24px;">${dataToken}</h3>
      <p>Introduce este código en el sistema para completar el proceso.</p>
      <p style="color: #555;">Si encuentras algún problema, puedes intentar nuevamente o contactarnos para recibir ayuda.</p>
      <br/>
      <p>Atentamente,</p>
      <p><strong>Sistema de Inventario Mobiliario SENA</strong></p>
    `;

    await enviarCorreo(
      messageEmail,
      correo,
      "Recuperación de Contraseña - Sistema de Inventario Mobiliario SENA"
    );

    res.cookie("recuperacion", tokenEncrypt, { httpOnly: true, secure: true })
      .status(200)
      .json({
        message: "Revisa tu correo, el código de recuperación se ha enviado exitosamente.",
        recuperacion: tokenEncrypt,
      });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Ocurrió un error al enviar el código de recuperación.",
    });
  }
};

export const postValidarCodigo = async (req, res) => {
  try {
    const { token } = req.body;
    const recuperacion = req.cookies["recuperacion"];

    if (!recuperacion) {
      return res.status(400).json({
        ok: false,
        message: "No se encontró el código de recuperación en los headers",
      });
    }

    const isMatch = await bcrypt.compare(token, recuperacion);

    if (!isMatch) {
      return res.status(400).json({
        ok: false,
        message: "Código inválido",
      });
    }

    const generateCookie = await crearToken({ isMatch }, "24h");

    res
      .cookie("cambiopass", generateCookie, {
        httpOnly: true, // 1 hora en milisegundos
      })
      .status(200)
      .json({
        ok: true,
        message: "Insertar nueva contraseña",
        tokenvalidate: generateCookie,
      });
  } catch (error) {
    console.error("Error al validar código:", error);
    res.status(500).json({
      ok: false,
      message: "Error interno del servidor al validar el código",
      error: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    let cambiopass = req.cookies["cambiopass"];
    const { password, correo } = req.body;

    console.log("Cookie cambiopass:", cambiopass);
    console.log("Correo:", correo);
    console.log("Password:", password);

    if (!cambiopass) {
      return res.status(400).json({
        message: "Tiempo expirado, intenta de nuevo",
      });
    }

    if (!correo) {
      return res.status(400).json({
        message: "Correo obligatorio",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Contraseña obligatoria",
      });
    }

    await verificarTokenRecupercion(cambiopass);

    var salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const actualizarUsuario = await Usuario.findOne({
      where: { correo: correo },
    });

    if (!actualizarUsuario) {
      return res.status(400).json({
        message: "Usuario no encontrado",
      });
    }

    await actualizarUsuario.update({ password: passwordHash });

    res
      .cookie("cambiopass", "", {
        expires: new Date(0),
      })
      .status(200)
      .json({
        message: "Usuario actualizado",
      });
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    res.status(500).json({
      message: "Error interno del servidor al actualizar la contraseña",
      error: error.message,
    });
  }
};

/* 
export const updatePassword = async (req, res) => {
  try {
    let cambiopass = req.headers["tokenvalidate"];
    const { password, correo } = req.body;

    if (!cambiopass) {
      return res.status(400).json({
        message: "Tiempo expirado, intenta de nuevo",
      });
    }

    let valueToken = cambiopass;

    if (!correo) {
      return res.status(400).json({
        message: "Correo obligatorio",
      });
    }

    await verificarTokenRecupercion(valueToken);
    const salt = bcrypt.genSaltSync(10);
    const passwordHast = bcrypt.hashSync(password, salt);

    const actualizarUsuario = await Usuario.findOne({
      where: { Documento: Documento },
    });

    await actualizarUsuario.update({ password: passwordHast });

    res
      .cookie("cambiopass", "", {
        expires: new Date(0),
      })
      .json({
        message: "usuario actualizado",
      })
      .status(200);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

 */
