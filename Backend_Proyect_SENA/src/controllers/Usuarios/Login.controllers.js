import { crearToken, verificarToken } from "../../libs/token.js";
import Estado from "../../models/Estado.js";
import Rol from "../../models/Rol.js";
import Usuario from "../../models/Usuario.js";
import DetallePermiso from "../../models/DetallePermiso.js"
import Permiso from "../../models/Permiso.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  try {
    const { Documento, password } = req.body;

    const usuario = await Usuario.findOne({
      where: { Documento },
      include: [
        { model: Rol },
        { model: Estado },
        {
          model: DetallePermiso,
          include: [{ model: Permiso }],
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Credenciales inválidas",
      });
    }

    if (usuario.Estado.estadoName !== "ACTIVO") {
      return res.status(400).json({
        message: "Estado no activo",
      });
    }

    const esPasswordValido = await bcrypt.compare(password, usuario.password);
    if (!esPasswordValido) {
      return res.status(404).json({
        message: "Credenciales inválidas",
      });
    }

    if (!usuario.DetallePermisos || usuario.DetallePermisos.length === 0) {
      return res.status(403).json({
        message: "El usuario no tiene permisos asignados",
      });
    }

    const token = await crearToken({ Documento: usuario.Documento });

    res.cookie("token", token).status(200).json({
      message: "Inicio de sesión exitoso",
      role: usuario.Rol.rolName,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const logout = async (req, res)=> {
    try {
        res.cookie("token", "",{
            expires: new Date(0),
        });
        res.status(200).json({message: "Sesión terminada"});
    } catch (error) {
        res.status(500).json();
    }
};

export const perfil = async ( req, res)=> {
    try {
        let accessToken = req.headers["authorization"];
        if (!accessToken) {
            return res.status(401).json({ message: "Acceso denegado" });
        }

        const token = accessToken.split(" ")[1];
        const data = await verificarToken (token);

        const consultarUsuario = await Usuario.findOne({
            where:{
                Documento: data.usuario.Documento,
            },
        });

        if(!consultarUsuario){
            return res.status(404).json({message: "Usuario no encontrado"});
        }

        const userInfo = {
            ...consultarUsuario.dataValues,
            id: consultarUsuario.id,
            username: consultarUsuario.username,
        };

        res.status(200).json({perfil: userInfo});
    } catch (error) {
        res.status(500).json({
            message: error.message,
          });
    }
};