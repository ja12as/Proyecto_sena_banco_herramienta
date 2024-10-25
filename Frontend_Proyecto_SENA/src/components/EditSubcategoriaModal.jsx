import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const EditSubcategoriaModal = ({ isOpen, onClose, subcategoria }) => {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [estados, setEstados] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subcategoriaName: "",
    CategoriaId: "",
    EstadoId: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && subcategoria) {
      fetchsubcategoriaDetails(subcategoria.id);
    }
  }, [isOpen, subcategoria]);

  useEffect(() => {
    const fetchcategorias = async () => {
      try {
        const response = await api.get("/categorias");
        setCategorias(response.data);
      } catch (error) {
        toast.error("Error al cargar categorias", { position: "top-right" });
      }
    };
    fetchcategorias();
  }, []);

  useEffect(() => {
    const fetchEstados = async () => {
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

    fetchEstados();
  }, []);

  const fetchsubcategoriaDetails = async (subcategoriaId) => {
    setLoading(true);
    try {
      const response = await api.get(`/subcategoria/${subcategoriaId}`);
      if (response.status === 200) {
        const { subcategoriaName, CategoriaId, EstadoId } = response.data;
        setFormData({
          subcategoriaName: subcategoriaName || "",
          CategoriaId: CategoriaId || "",
          EstadoId: EstadoId || "",
        });
        setLoading(false);
      } else {
        console.error(
          "Error fetching subcategoria details:",
          response.data.message
        );
        toast.error("Error al cargar la información del subcategoria.", {
          position: "top-right",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching subcategoria details:", error);
      toast.error("Error al cargar la información del subcategoria.", {
        position: "top-right",
      });
      setLoading(false);
    }
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

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "subcategoriaName") {
      const nameRegex = /^[A-Za-z\s-_\u00C0-\u017F]+$/;
      if (!nameRegex.test(value) || /\d/.test(value)) {
        errorMessage =
          "El subcategoriaName no puede contener caracteres especiales.";
      }
    }
    return errorMessage;
  };

  const handleUpdate = async () => {
    const { subcategoriaName, CategoriaId, EstadoId } = formData;

    if (!subcategoriaName || !CategoriaId || !EstadoId) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(
        `/subcategoria/${subcategoria.id}`,
        {
          subcategoriaName,
          CategoriaId: CategoriaId,
          EstadoId: EstadoId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Subcategoria actualizada exitosamente", {
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
          "Error updating subcategoria profile:",
          response.data.message
        );
        toast.error("Error al actualizar la información del subcategoria.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating subcategoria profile:", error);
      if (error.response && error.response.status === 401) {
        setTimeout(() => {
          navigate("/");
        });
      } else {
        toast.error("Error al actualizar la información del subcategoria.", {
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
                  Editar Subcategoria
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
          {hasPermission("Modificar Sucategoria") && (
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

export default EditSubcategoriaModal;
