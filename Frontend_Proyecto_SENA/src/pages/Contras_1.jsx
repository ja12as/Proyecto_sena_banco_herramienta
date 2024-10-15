import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fondo from "/logoSena.png";
import { api } from "../api/token";
import Cookies from "js-cookie";

const Contras_1 = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const mensajeExito = () => {
    toast.success("¡Código de recuperación enviado!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setTimeout(() => navigate("/contras_2"), 2000);
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

  const handleEmail = async () => {
    const errorMessage = validateInput("correo", correo);
    if (errorMessage) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        correo: errorMessage,
      }));
      mensajeError(errorMessage);
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post("/crear-codigo", { correo });
      if (response.status === 200) {
        Cookies.set("recuperacion", response.data.recuperacion);
        Cookies.set("correo", correo);
        mensajeExito();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        mensajeError(error.response.data.message);
      } else {
        mensajeError("Error al enviar el correo");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setCorreo(value);

    const errorMessage = validateInput(name, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "correo") {
      const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!correoRegex.test(value)) {
        errorMessage = "El correo debe ser un correo válido.";
      }
    }
    return errorMessage;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-fondo">
      <div className="w-full md:w-1/2 bg-negro flex justify-center items-center md:clip-path md:clip-polygon h-full md:h-auto">
        <div className="main w-3/4 md:w-1/2 text-center text-sm md:text-lg">
          <div className="letras font-inter mb-4 md:mb-6">
            <h3 className="text-white font-normal text-xl md:text-4xl lg:text-4xl mt-2 md:mt-4">
              ¿Has olvidado
            </h3>
            <h3 className="text-white font-normal text-xl md:text-4xl lg:text-4xl mt-2 md:mt-4">
              tu contraseña?
            </h3>
          </div>
          <div className="space-y-4 text-center mb-6 mt-4">
            <h1 className="text-white font-normal text-xs md:text-lg lg:text-lg mt-2 md:mt-4">
              Escriba su correo electrónico para recibir un código de
              confirmación para establecer una nueva contraseña.
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
                  name="correo"
                  className="flex-1 p-2 bg-transparent text-white focus:outline-none pr-10 text-sm w-full min-w-0"
                  value={correo}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                />
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className={`absolute right-2 text-white ml-2 transition-opacity duration-300 ${
                    correo ? "opacity-0" : "opacity-100"
                  }`}
                />
              </div>
              {formErrors.correo && (
                <div className="text-red-400 text-sm mt-1 px-2 min-w-[200px]">
                  {formErrors.correo}
                </div>
              )}
            </div>
          </div>
          <button
            className="btn-primary mt-8 mb-2"
            onClick={handleEmail}
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Confirmar correo"}
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

export default Contras_1;
