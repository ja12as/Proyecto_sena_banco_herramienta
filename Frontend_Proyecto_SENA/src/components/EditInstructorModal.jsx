import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const EditinstructorModal = ({ isOpen, onClose, instructor }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    celular: "",
    usuarioId: "",
    EstadoId: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && instructor) {
      fetchInstructorDetails(instructor.id);
    }
  }, [isOpen, instructor]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get("/Estado");
        const filteredEstados = response.data.filter(
          (estado) => estado.id === 1 || estado.id === 2
        );
        setEstados(filteredEstados);
      } catch (error) {
        showToastError("Error al cargar los estados");
      }
    };

    fetchStates();
  }, []);

  const fetchInstructorDetails = async (instructorId) => {
    setLoading(true);
    try {
      const response = await api.get(`/Instructor/${instructorId}`);
      if (response.status === 200) {
        const { nombre, correo, celular, EstadoId } = response.data;
        setFormData({
          nombre: nombre || "",
          correo: correo || "",
          celular: celular || "",
          EstadoId: EstadoId || "",
        });
        setLoading(false);
      } else {
        console.error(
          "Error fetching instructor details:",
          response.data.message
        );
        toast.error("Error al cargar la información del instructor.", {
          position: "top-right",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching instructor details:", error);
      toast.error("Error al cargar la información del instructor.", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const validateInputInstructor = (name, value) => {
    let errorMessage = "";
    if (name === "nombre") {
      const nameRegex = /^[A-Za-z\s-_\u00C0-\u017F]+$/;
      if (!nameRegex.test(value) || /\d/.test(value)) {
        errorMessage = "El nombre no puede contener caracteres especiales.";
      }
    } else if (name === "correo") {
      const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!correoRegex.test(value)) {
        errorMessage = "El correo debe ser un correo válido.";
      }
    }
    return errorMessage;
  };
  
  const handleInputChangeInstructor = (e) => {
    const { name, value } = e.target;
  
    // Procesar valor según el campo
    let processedValue = value;
    if (name === "EstadoId") {
      processedValue = Number(value); // Convertir estadoId a número
    } else if (name === "nombre") {
      processedValue = value.toUpperCase(); // Convertir nombre a mayúsculas
    }
  
    // Validar el input
    const errorMessage = validateInputInstructor(name, processedValue);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  
    // Actualizar el estado del formulario
    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue,
    }));
  };
  

  const handleUpdateInstructor = async () => {
    const { nombre, correo, celular, EstadoId } = formData;

    if (!nombre || !correo || !celular || !EstadoId) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(
        `/Instructor/${instructor.id}`,
        {
          nombre,
          correo,
          celular,
          EstadoId: EstadoId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Instructor actualizado exitosamente", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          onClose(response.data);
        }, 2000);
      } else {
        console.error(
          "Error updating instructor profile:",
          response.data.message
        );
        toast.error("Error al actualizar la información del instructor.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating instructor profile:", error);
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error al actualizar la información del instructor.", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permissionName) => {
    return user.DetallePermisos.some(
      (permiso) => permiso.Permiso.nombrePermiso === permissionName
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fondo bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg sm:w-full md:w-1/4 mt-4 mb-4 max-h-screen overflow-y-auto">
        <div className="flex justify-end p-2">
          <button onClick={onClose}>
            <FaTimes className="text-black w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-center space-y-4 md:space-y-0 mb-4">
          <div className="w-full md:w-3/4">
            <div className="font-inter ml-2">
              <div className="space-y-2 md:space-y-2 text-left">
                <h6 className="font-bold text-center text-2xl mb-2">
                  Editar Instructor
                </h6>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">
                    Nombres y Apellidos *
                  </label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChangeInstructor}
                    onKeyPress={(e) => {
                      if (/\d/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {formErrors.nombre && (
                    <div className="text-red-400 text-sm mt-1 px-2">
                      {formErrors.nombre}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Correo *</label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChangeInstructor}
                  />
                  {formErrors.correo && (
                    <div className="text-red-400 text-sm mt-1">
                      {formErrors.correo}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Telefono *</label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="celular"
                    value={formData.celular}
                    onChange={handleInputChangeInstructor}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    maxLength={10}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Estado *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="EstadoId"
                    value={formData.EstadoId}
                    onChange={handleInputChangeInstructor}
                  >
                    <option value="">Seleccionar Estado</option>
                    {estados.map((estado) => (
                      <option
                        key={estado.id}
                        value={estado.id}
                        style={{
                          color:
                            estado.estadoName === "ACTIVO"
                              ? "green"
                              : estado.estadoName === "INACTIVO"
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {estado.estadoName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:w-full md:w-full flex flex-col justify-end">
          {hasPermission("Modificar Intructor") && (
            <div className="flex justify-center mb-4 mx-2">
              <button className="btn-danger2 mx-2" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="btn-primary2 mx-2"
                onClick={handleUpdateInstructor}
              >
                Actualizar
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditinstructorModal;
