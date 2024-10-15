import React, { useEffect, useState } from "react";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddFichasModal = ({ isOpen, onClose, ficha }) => {
  const [estados, setEstados] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    NumeroFicha: "",
    Programa: "",
    Jornada: "",
    EstadoId: "",
  });

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (ficha) {
      setFormData({
        NumeroFicha: ficha.NumeroFicha || "",
        Programa: ficha.Programa || "",
        Jornada: ficha.Jornada || "",
        EstadoId: ficha.EstadoId || "",
      });
    }
  }, [ficha]);

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
  
  
  const showToastError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const resetForm = () => {
    setFormData({
      NumeroFicha: "",
      Programa: "",
      Jornada: "",
      EstadoId: "",
    });
  };

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "NumeroFicha") {
      const numberRegex = /^[0-9]+$/;
      if (!numberRegex.test(value)) {
        errorMessage = "El Numero Ficha solo puede contener números.";
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
    const processedValue =
      name === "UsuarioId" || name === "EstadoId"
        ? Number(value)
        : value.toUpperCase();

    const errorMessage = validateInput(name, processedValue);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue,
    }));
  };

  const handleCreate = async () => {
    const { NumeroFicha, Jornada, Programa, EstadoId } = formData;
    const NumeroFichaError = validateInput("NumeroFicha", NumeroFicha);
    const JornadaError = validateInput("Jornada", Jornada);
    const ProgramaError = validateInput("Programa", Programa);

    if (NumeroFichaError || JornadaError || ProgramaError) {
      setFormErrors({
        NumeroFicha: NumeroFichaError,
        Jornada: JornadaError,
        Programa: ProgramaError,
      });
      showToastError("Por favor, corrige los errores antes de agregar.");
      return;
    }

    if (!NumeroFicha || !Programa || !Jornada || !EstadoId) {
      showToastError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const response = await api.post("/Fichas", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Ficha agregada exitosamente", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        resetForm();
        setTimeout(() => {
          onClose(response.data);
        }, 2000);
      } else {
        showToastError(
          "Ocurrió un error!, por favor intenta con un Programa o Jornada diferente."
        );
      }
    } catch (error) {
      showToastError(
        "Ocurrió un error!, por favor intenta con un Programa o Jornada diferente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-fondo bg-opacity-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
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
                  Registro Fichas
                </h6>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">
                    Numero de Ficha *
                  </label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="NumeroFicha"
                    value={formData.NumeroFicha}
                    onChange={handleInputChange}
                    maxLength={7}
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
                    name="EstadoId"
                    value={formData.EstadoId}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione un estado</option>
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
              <div className="sm:w-full md:w-full flex flex-col justify-end">
                <div className="flex justify-center mt-4 mb-4 mx-2">
                  <button className="btn-danger2 mx-2" onClick={onClose}>
                    Cancelar
                  </button>
                  <button className="btn-primary2 mx-2" onClick={handleCreate}>
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddFichasModal;
