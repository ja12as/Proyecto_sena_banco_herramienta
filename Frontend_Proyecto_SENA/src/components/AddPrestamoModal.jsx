import React, { useEffect, useState } from "react";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPrestamoModal = ({ isOpen, onClose, prestamo }) => {
  const [formData, setFormData] = useState({
    id: "",
    idFicha: "",
    idUsuario: "",
    idInstructor: "",
    idHerramienta: "",
    cantidad: "",
    fechaPrestamo: "",
    fechaDevolucion: "",
    estado: "",
    observaciones: "",
  });
  const [usuarios, setUsuarios] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [herramientas, setHerramientas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (prestamo) {
        fetchPrestamoProfile();
      } else {
        resetForm();
      }
    }
  }, [isOpen, prestamo]);
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/usuarios");
        setUsuarios(response.data);
      } catch (error) {
        showToastError("Error al cargar los usuarios");
      }
    };
    const fetchInstructores = async () => {
      try {
        const response = await api.get("/instructores");
        setInstructores(response.data);
      } catch (error) {
        showToastError("Error al cargar los instructores");
      }
    };
    const fetchHerramientas = async () => {
      try {
        const response = await api.get("/herramientas");
        setHerramientas(response.data);
      } catch (error) {
        showToastError("Error al cargar las herramientas");
      }
    };
    const fetchEstados = async () => {
      try {
        const response = await api.get("/estados");
        setEstados(response.data);
      } catch (error) {
        showToastError("Error al cargar los estados");
      }
    };
    fetchUsuarios();
    fetchInstructores();
    fetchHerramientas();
    fetchEstados();
  }, []);
  const fetchPrestamoProfile = async () => {
    if (!prestamo) return;
    setLoading(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const response = await api.get(`/prestamos/${prestamo.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setFormData(response.data);
      } else {
        setFormErrors({ fetch: response.data.message });
      }
    } catch (error) {
      setFormErrors({ fetch: "Error al cargar la información del préstamo." });
    } finally {
      setLoading(false);
    }
  };
  const validarInput = (name, value) => {
    let errorMessage = "";
    if (name === "fechaDevolucion" && new Date(value) <= new Date(formData.fechaPrestamo)) {
      errorMessage = "La fecha de devolución debe ser posterior a la fecha de préstamo.";
    }
    if (name === "cantidad" && value <= 0) {
      errorMessage = "La cantidad debe ser mayor que cero.";
    }
    return errorMessage;
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = validarInput(name, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const showToastError = (mensaje) => {
    toast.error(mensaje, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const handleCreate = async () => {
    const {
      id,
      idFicha,
      idUsuario,
      idInstructor,
      idHerramienta,
      cantidad,
      fechaPrestamo,
      fechaDevolucion,
      estado,
      observaciones,
    } = formData;
    if (
      !idFicha ||
      !idUsuario ||
      !idInstructor ||
      !idHerramienta ||
      !cantidad ||
      !fechaPrestamo ||
      !fechaDevolucion ||
      !estado
    ) {
      showToastError("Todos los campos obligatorios deben ser completados.");
      return;
    }
    setLoading(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const response = await api.post("/prestamos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        toast.success("Préstamo agregado exitosamente", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          resetForm();
          onClose();
        }, 2000);
      } else {
        showToastError("Ocurrió un error, por favor intenta nuevamente.");
      }
    } catch (error) {
      showToastError("Ocurrió un error, por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      id: "",
      idFicha: "",
      idUsuario: "",
      idInstructor: "",
      idHerramienta: "",
      cantidad: "",
      fechaPrestamo: "",
      fechaDevolucion: "",
      estado: "",
      observaciones: "",
    });
    setFormErrors({});
  };
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg sm:w-full md:w-1/4 mt-4 max-h-screen overflow-y-auto">
        <div className="flex justify-end p-1">
          <button onClick={onClose}>
            <FaTimes className="text-black w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center justify-center space-y-1 md:space-y-0 mb-2">
          <div className="w-full md:w-3/4">
            <div className="font-inter ml-1">
              <div className="space-y-1 md:space-y-0.5 text-left">
                <h6 className="font-bold text-center text-lg mb-1">
                  Registro Préstamo
                </h6>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">ID *</label>
                  <input
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">ID-Ficha *</label>
                  <input
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    type="text"
                    name="idFicha"
                    value={formData.idFicha}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">ID-Usuario *</label>
                  <input
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    type="text"
                    name="idUsuario"
                    value={formData.idUsuario}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">ID-Instructor *</label>
                  <input
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    type="text"
                    name="idInstructor"
                    value={formData.idInstructor}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">ID-Herramienta *</label>
                  <input
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    type="text"
                    name="idHerramienta"
                    value={formData.idHerramienta}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Cantidad *</label>
                  <input
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    type="number"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleInputChange}
                  />
                  {formErrors.cantidad && (
                    <p className="text-red-500 text-xs">{formErrors.cantidad}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Fecha Préstamo *</label>
                  <input
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    type="date"
                    name="fechaPrestamo"
                    value={formData.fechaPrestamo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Fecha Devolución *</label>
                  <input
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    type="date"
                    name="fechaDevolucion"
                    value={formData.fechaDevolucion}
                    onChange={handleInputChange}
                  />
                  {formErrors.fechaDevolucion && (
                    <p className="text-red-500 text-xs">{formErrors.fechaDevolucion}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Estado *</label>
                  <select
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar</option>
                    {estados.map((estado) => (
                      <option key={estado.id} value={estado.nombre}>
                        {estado.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Observaciones</label>
                  <textarea
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex justify-center mt-2 mb-2">
                  <button
                    className="btn-danger2 mx-2 text-xs py-2 px-4 rounded"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn-primary2 mx-2 text-xs py-2 px-4 rounded"
                    onClick={handleCreate}
                    disabled={loading}
                  >
                    {loading ? "Cargando..." : "Agregar"}
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
export default AddPrestamoModal;