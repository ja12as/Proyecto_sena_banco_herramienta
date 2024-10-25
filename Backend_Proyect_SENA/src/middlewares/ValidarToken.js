import { verificarToken } from "../libs/token.js";

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
   /*  console.log("Usuario autenticado asignado:", req.usuario); */

    next();
  } catch (error) {
/*     console.error("Error en la autenticación:", error.message); */
    return res
      .status(500)
      .json({ message: "Error de autenticación: " + error.message });
  }
};
