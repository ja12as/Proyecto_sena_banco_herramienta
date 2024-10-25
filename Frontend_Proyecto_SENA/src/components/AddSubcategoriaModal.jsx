import React, { useEffect, useState } from "react";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSubcategoriaModal = ({ isOpen, onClose }) => {
  const [categorias, setCategorias] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [estados, setEstados] = useState([]);
  const [formData, setFormData] = useState({
    subcategoriaName: "",
    CategoriaId: "",
    EstadoId: "",
  });

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchcategorias = async () => {
      try {
        const response = await api.get("/categorias");
        setCategorias(response.data);
      } catch (error) {
        showToastError("Error al cargar categorias");
      }
    };
    fetchcategorias();
  }, []);

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

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "subcategoriaName") {
      const nameRegex = /^[A-Za-z\s-_\u00C0-\u017F]+$/;
      if (!nameRegex.test(value) || /\d/.test(value)) {
        errorMessage =
          "El subcategoria no puede contener caracteres especiales.";
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
      subcategoriaName: "",
      CategoriaId: "",
      EstadoId: "",
    });
  };

  const handleCreate = async () => {
    const { subcategoriaName, CategoriaId, EstadoId } = formData;
    const subcategoriaNameError = validateInput(
      "subcategoriaName",
      subcategoriaName
    );

    if (subcategoriaNameError) {
      setFormErrors({
        subcategoriaName: subcategoriaNameError,
      });
      showToastError("Por favor, corrige los errores antes de agregar.");
      return;
    }

    if (!subcategoriaName || !CategoriaId || !EstadoId) {
      showToastError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const response = await api.post("/subcategoria", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("Subcategoria agregada exitosamente", {
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
        showToastError("Ocurrió un error!, por favor intenta con otro nombre.");
      }
    } catch (error) {
      showToastError("Ocurrió un error!, por favor intenta con otro nombre.");
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
                  Registro Subcategoria
                </h6>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">
                    Subcategoria *
                  </label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="subcategoriaName"
                    value={formData.subcategoriaName}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (/\d/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {formErrors.subcategoriaName && (
                    <div className="text-red-400 text-sm mt-1 px-2">
                      {formErrors.subcategoriaName}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Categoria *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="CategoriaId"
                    value={formData.CategoriaId}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar Categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.categoriaName}
                      </option>
                    ))}
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

export default AddSubcategoriaModal;
