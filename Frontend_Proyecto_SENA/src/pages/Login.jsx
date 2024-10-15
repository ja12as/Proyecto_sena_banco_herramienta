import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import fondo from "/logoSena.png";
import { api } from "../api/token";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [Documento, setDocumento] = useState("");
  const [password, setPassword] = useState("");
  const [rolName, setRolName] = useState("");
  const [roles, setRoles] = useState([]);
  const [passwordError, setPasswordError] = useState("");
  const { signin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/Rol");
        setRoles(response.data);
      } catch (error) {
        toast.error("Error al cargar roles", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };

    fetchRoles();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!Documento) {
      toast.error("El documento es requerido", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!password) {
      toast.error("La contraseña es requerida", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!rolName) {
      toast.error("El rol es requerido", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (Documento && password && rolName) {
      localStorage.setItem("Documento", Documento);

      try {
        const body = { Documento, password };
        const response = await api.post("/login", body);
        if (response.data) {
          const { token, role } = response.data;
          localStorage.setItem("token", token);
          Cookies.set("token", token);

          if (role !== rolName) {
            toast.error(
              "Acceso denegado. El rol seleccionado no es correcto.",
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );
            return;
          }

          await signin({ Documento, password });
          toast.success("Inicio de sesión exitoso.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            if (role.toUpperCase() === "COORDINADOR") {
              navigate("/homecoord"); 
            } else {
              navigate("/dashboard");  
            }
          }, 2000);
        }
      } catch (error) {
             // Verificar si es un error específico del estado o los permisos
      const errorMessage = error.response?.data?.message || "Error al iniciar sesión";

      if (errorMessage === "Estado no activo") {
        toast.error("Su cuenta no está activa. Por favor, contacte al administrador.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (errorMessage === "El usuario no tiene permisos asignados") {
        toast.error("No tiene permisos asignados. Contacte al administrador.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Credenciales inválidas", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      }
    }
  };

  const handleDocumentoChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value) && value.length <= 10) {
      setDocumento(value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setPassword(value);
      const errors = [];
      if (value.length < 6) {
        errors.push("La contraseña debe tener mínimo 6 caracteres");
      }
      if (value.length > 20) {
        errors.push("La contraseña debe tener máximo 20 caracteres");
      }
      if (!/[\W_]/.test(value)) {
        errors.push(
          "La contraseña debe tener un carácter especial"
        );
      }
      if (!/[a-z]/.test(value)) {
        errors.push(
          "La contraseña debe tener una letra minúscula"
        );
      }
      if (!/[A-Z]/.test(value)) {
        errors.push(
          "La contraseña debe tener una letra mayúscula"
        );
      }
      if (errors.length > 0) {
        setPasswordError(errors[0]);
      } else {
        setPasswordError("");
      }
    }
  };

  const handleNavigate = () => {
    navigate('/pedInstructores'); 
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-fondo">
      <div className="w-full md:w-1/2 bg-negro flex justify-center items-center md:clip-path h-full md:h-auto">
        <div className="main w-3/4 md:w-1/2 text-center text-lg">
          <div className="letras font-inter mb-4 md:mb-8">
            <h1 className="text-white font-normal text-2xl md:text-4xl lg:text-5xl mt-2 md:mt-4">
              Bienvenido a
            </h1>
            <h1 className="text-white font-semibold text-2xl md:text-4xl lg:text-5xl mt-2 md:mt-4">
              inventario del
            </h1>
            <h1 className="text-sena font-semibold text-2xl md:text-4xl lg:text-5xl mt-2 md:mt-4">
              Mobiliario
            </h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-2 md:space-y-4 text-left">
            <div className="input w-full mb-1 relative">
              <label className="text-sm text-white block mb-1">
                Identificación
              </label>
              <div className="flex items-center border-b-2 border-white">
                <input
                  type="text"
                  className="text flex-1 p-2 bg-transparent text-white focus:outline-none pr-10"
                  value={Documento}
                  onChange={handleDocumentoChange}
                />
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute right-2 text-white ml-2"
                />
              </div>
            </div>
            <div className="input w-full mb-1 relative">
              <label className="text-sm text-white block mb-1">
                Contraseña
              </label>
              <div className="flex items-center border-b-2 border-white">
                <input
                  type="password"
                  className="flex-1 p-2 bg-transparent text-white focus:outline-none pr-10"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <FontAwesomeIcon
                  icon={faKey}
                  className="absolute right-2 text-white ml-2"
                />
              </div>
              {password && (
                <div className="text-red-400 text-sm mt-1">{passwordError}</div>
              )}
            </div>
            <div className="input w-full mb-2 relative">
              <label className="text-sm text-white block mb-1">Rol</label>
              <div className="flex items-start border-b-2 border-white">
                <select
                  className="flex-1 h-8 p-2 bg-input text-white text-sm focus:outline-none appearance-none"
                  value={rolName}
                  onChange={(e) => setRolName(e.target.value)}
                >
                  <option value="">Seleccione su rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.rolName}>
                      {role.rolName.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-center mt-2 md:mt-6">
              <button
                type="submit"
                className="btn-primary"
              >
                Iniciar sesión
              </button>
            </div>
            <div className="mt-2 text-center">
              <NavLink
                to={"/contras_1"}
                className="text-white text-sm md:text-lg -mt-2"
              >
                Olvidé mi contraseña
              </NavLink>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center md:w-1/2 bg-fondo">
        <div className="w-3/4">
          <img className="w-80 h-80 object-cover" src={fondo} alt="logoSena" />
          <div className="w-80 h-20">
            <div className="flex justify-center mt-10">
              <button className="btn-black" onClick={handleNavigate}>
                Pedidos
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;