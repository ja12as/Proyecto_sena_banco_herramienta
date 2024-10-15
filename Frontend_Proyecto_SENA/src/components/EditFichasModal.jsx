import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext"; 
import "react-toastify/dist/ReactToastify.css";

const EditFichasModal = ({ isOpen, onClose, ficha }) => {
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    NumeroFicha: "",
    Programa: "",
    Jornada: "",
    estadoId: "",
  });

  const { user } = useAuth();
  
  useEffect(() => {
    if (isOpen && ficha) {
      fetchUserDetails(ficha.id);
    }
  }, [isOpen, ficha]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get("/Estado");
        const filteredEstados = response.data.filter(
          estado => estado.id === 1 || estado.id === 2
        );
        setEstados(filteredEstados);
      } catch (error) {
        showToastError("Error al cargar los estados");
      }
    };
  
    fetchStates();
  }, []);

  const fetchUserDetails = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get(`/Fichas/${userId}`);
      if (response.status === 200) {
        const { NumeroFicha, Programa, Jornada, EstadoId } =
          response.data;
        setFormData({
          NumeroFicha: NumeroFicha || "",
          Programa: Programa || "",
          Jornada: Jornada || "",
          estadoId: EstadoId || "",
        });
        setLoading(false);
      } else {
        console.error("Error fetching ficha details:", response.data.message);
        toast.error("Error al cargar la información de la ficha.", {
          position: "top-right",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching ficha details:", error);
      toast.error("Error al cargar la información de la ficha.", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "NumeroFicha") {
      const numberRegex = /^[0-9]+$/;
      if (!numberRegex.test(value)) {
        errorMessage = "El NumeroFicha solo puede contener números.";
      }
    } else if (name === "Jornada") {
      const jornadaRegex = /^[A-Za-z\s-_\u00C0-\u017F]+$/;
      if (!jornadaRegex.test(value) || /\d/.test(value)) {
        errorMessage = "La Jornada  no puede contener caracteres especiales.";
      }
    } else if (name === "Programa") {
      const programaRegex = /^[A-Za-z\s-_\u00C0-\u017F]+$/;
      if (!programaRegex.test(value) || /\d/.test(value)) {
        errorMessage = "El Programa no puede contener caracteres especiales.";
      }
    }
    return errorMessage;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateInput(name, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.toUpperCase(),
    }));
  };

  const handleUpdate = async () => {
    const { NumeroFicha, Jornada, Programa, estadoId } = formData;

    if (!NumeroFicha || !Jornada || !Programa ||!estadoId) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(
        `/Fichas/${ficha.id}`,
        {
          NumeroFicha,
          Jornada,
          Programa,
          EstadoId: estadoId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Ficha actualizada exitosamente", {
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
        console.error("Error updating ficha profile:", response.data.message);
        toast.error("Error al actualizar la información de la ficha.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      if (error.response && error.response.status === 401) {
        setTimeout(() => {
          navigate("/");
        });
      } else {
        toast.error("Error al actualizar la información de la ficha.", {
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
      <div className="bg-white rounded-lg shadow-lg sm:w-full md:w-1/4 mt-4 max-h-screen overflow-y-auto">
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
                  Editar Ficha
                </h6>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">
                    Numero Ficha*
                  </label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="NumeroFicha"
                    value={formData.NumeroFicha}
                    onChange={handleInputChange}
                  />
                  {formErrors.NumeroFicha && (
                    <div className="text-red-400 text-sm mt-1 px-2">
                      {formErrors.NumeroFicha}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Programa *</label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="Programa"
                    value={formData.Programa}
                    onChange={handleInputChange}
                  />
                  {formErrors.Programa && (
                    <div className="text-red-400 text-sm mt-1">
                      {formErrors.Programa}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Jornada *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="Jornada"
                    value={formData.Jornada}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione una Jornada</option>
                    <option value="MAÑANA">MAÑANA</option>
                    <option value="TARDE">TARDE</option>
                    <option value="NOCHE">NOCHE</option>
                  </select>
                </div>


                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Estado *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="estadoId"
                    value={formData.estadoId}
                    onChange={handleInputChange}
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
          {hasPermission("Modificar Ficha") && (
            <div className="flex justify-center mb-4 mx-2">
              <button className="btn-danger2 mx-2" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn-primary2 mx-2" onClick={handleUpdate}>
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

export default EditFichasModal;
