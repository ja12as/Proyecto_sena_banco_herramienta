import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const EditCategModal = ({ isOpen, onClose, categoria }) => {
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoriaName: "",
    EstadoId: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && categoria) {
      fetchRolDetails(categoria.id);
    }
  }, [isOpen, categoria]);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await api.get("/Estado");
        setEstados(response.data);
      } catch (error) {
        toast.error("Error al cargar los estados", { position: "top-right" });
      }
    };
    fetchEstados();
  }, []);

  const fetchRolDetails = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/categorias/${id}`);
      if (response.status === 200) {
        const { categoriaName, EstadoId } = response.data;
        setFormData({
          categoriaName: categoriaName || "",
          EstadoId: EstadoId || "",
        });
        setLoading(false);
      } else {
        console.error(
          "Error fetching categoria details:",
          response.data.message
        );
        toast.error("Error al cargar la información de la categoria.", {
          position: "top-right",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching rol details:", error);
      toast.error("Error al cargar la información de la categoria.", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "categoriaName") {
      const nameRegex = /^[A-Za-z\s-_\u00C0-\u017F]+$/;
      if (!nameRegex.test(value) || /\d/.test(value)) {
        errorMessage = "El nombre no puede contener caracteres especiales.";
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
    const { categoriaName, EstadoId } = formData;

    if (!categoriaName || !EstadoId) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(
        `/categorias/${categoria.id}`,
        {
          categoriaName,
          EstadoId: EstadoId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Categoria actualizada exitosamente", {
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
        console.error("Error updating categorias:", response.data.message);
        toast.error("Error al actualizar la información de la categoria.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating categoria:", error);
      if (error.response && error.response.status === 401) {
        setTimeout(() => {
          navigate("/");
        });
      } else {
        toast.error("Error al actualizar la información de la categoria.", {
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
                  Editar Categoria
                </h6>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Categoria *</label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="categoriaName"
                    value={formData.categoriaName}
                    onChange={handleInputChange}
                  />
                  {formErrors.categoriaName && (
                    <div className="text-red-400 text-sm mt-1 px-2">
                      {formErrors.categoriaName}
                    </div>
                  )}
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
          {hasPermission("Modificar Categoria") && (
            <div className="flex justify-center mb-4 mx-2">
              <button className="btn-danger2 mx-2" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="btn-primary2 mx-2"
                onClick={handleUpdate}
                disabled={loading}
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

export default EditCategModal;
