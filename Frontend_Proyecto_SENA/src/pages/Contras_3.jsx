import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import fondo from "/logoSena.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { api } from "../api/token";

const Contras_3 = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const savedCorreo = Cookies.get("correo");
    if (savedCorreo) {
      setCorreo(savedCorreo);
    }
  }, []);

  const mensajeExito = () => {
    toast.success("¡Cambio de contraseña correcto!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setTimeout(() => {
      Cookies.remove("cambiopass");
      Cookies.remove("correo");
      Cookies.remove("recuperacion");
      navigate("/");
    }, 2000);
  };

  const mensajeError = (mensaje) => {
    toast.error(mensaje, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleLogin = async () => {
    try {
      const response = await api.put(
        "/nuevo-password",
        { correo, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        mensajeExito();
      } else {
        mensajeError("Error al actualizar la contraseña");
      }
    } catch (error) {
      console.error("Error en handleLogin:", error);
      if (error.response) {
        console.error("Detalles del error:", error.response);
        if (error.response.data.message) {
          mensajeError(error.response.data.message);
        } else {
          mensajeError("Error al actualizar la contraseña");
        }
      } else {
        mensajeError("Error al actualizar la contraseña");
      }
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    if (value.length <= 20) {
      setPassword(value);

      const errors = [];

      if (value.length < 6) {
        errors.push("La contraseña debe tener mínimo 6 caracteres");
      } else if (value.length > 20) {
        errors.push("La contraseña debe tener máximo 20 caracteres");
      }

      if (!/[\W_]/.test(value)) {
        errors.push(
          "La contraseña debe contener al menos un carácter especial"
        );
      }

      if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) {
        errors.push(
          "La contraseña debe contener al menos una letra minúscula y una mayúscula"
        );
      }

      if (errors.length > 0) {
        setPasswordError(errors[0]);
      } else {
        setPasswordError("");
      }
    }
  };

  const handleEmailChange = (e) => {
    setCorreo(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-fondo">
      <div className="w-full md:w-1/2 bg-negro flex justify-center items-center md:clip-path md:clip-polygon h-full md:h-auto">
        <div className="main w-3/4 md:w-1/2 text-center text-sm md:text-lg">
          <div className="letras font-inter mb-4 md:mb-6">
            <h3 className="text-white font-normal text-xl md:text-4xl lg:text-4xl mt-2 md:mt-4">
              Nueva contraseña
            </h3>
          </div>
          <div className="space-y-4 text-center mb-6 mt-4">
            <h1 className="text-white font-normal text-xs md:text-lg lg:text-lg mt-2 md:mt-4">
              Por favor escriba su nueva contraseña.
            </h1>
          </div>
          <div className="space-y-4 text-left">
            <div className="input w-full mb-4 relative">
              <label className="text-xs text-white block mb-1">
                Correo electrónico
              </label>
              <div className="relative flex items-center border-b-2 border-white">
                <input
                  type="text"
                  className="flex-1 p-2 bg-transparent text-white focus:outline-none pr-10 text-sm w-full min-w-0 overflow-x-auto"
                  value={correo}
                  readOnly
                  onChange={handleEmailChange}
                />
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className={`absolute right-2 text-white ml-2 transition-opacity duration-300 ${
                    correo ? "opacity-0" : "opacity-100"
                  }`}
                />
              </div>
            </div>
            <div className="input w-full mb-4 relative">
              <label className="text-xs text-white block mb-1">
                Contraseña
              </label>
              <div className="flex items-center border-b-2 border-white">
                <input
                  type="password"
                  className="flex-1 p-2 bg-transparent text-white focus:outline-none pr-10 text-sm"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <FontAwesomeIcon
                  icon={faKey}
                  className="absolute right-2 text-white ml-2"
                />
              </div>
              {passwordError && (
                <div className="text-red-400 text-xs mt-1">{passwordError}</div>
              )}
            </div>
          </div>
          <button className="btn-primary mt-8 mb-2" onClick={handleLogin}>
            Confirmar contraseña
          </button>
        </div>
      </div>
      <div className="hidden md:flex items-center justify-center md:w-1/2 bg-fondo">
        <div className="w-3/4">
          <img className="w-80 h-80 object-cover" src={fondo} alt="logoSena" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Contras_3;
