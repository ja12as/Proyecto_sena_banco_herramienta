import { verificarToken } from "../libs/token.js";

//Opcion 1
export const rutaProtegida = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({
          message: "No autorizado: Token no proporcionado o formato incorrecto",
        });
    }

    const token = authorizationHeader.split(" ")[1];

    const data = await verificarToken(token);

    if (!data || !data.usuario) {
      return res
        .status(401)
        .json({
          message: "Token inválido o no contiene información de usuario",
        });
    }

    req.usuario = data.usuario;
    console.log("Usuario autenticado asignado:", req.usuario);

    next();
  } catch (error) {
    console.error("Error en la autenticación:", error.message);
    return res
      .status(500)
      .json({ message: "Error de autenticación: " + error.message });
  }
};



// Opcion 2

/* import { verificarToken } from "../libs/token.js";

export const urlProtegida = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "No autorizado. No se proporcionó un token.",
      });
    }

    try {
      const data = await verificarToken(token);
      req.usuario = data;
      next();
    } catch (verificationError) {
      return res.status(401).json({
        message: "No autorizado. Token inválido o expirado.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Ocurrió un error en el servidor.",
      error: error.message,
    });
  }
};
 */
