import React, { useEffect, useState } from "react";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddHerramientaModal = ({ isOpen, onClose, herramienta }) => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    marca: "",
    condicion: "",
    observaciones: "",
    EstadoId: "",
    SubcategoriaId: "",
  });

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (herramienta) {
      setFormData({
        nombre: herramienta.nombre || "",
        codigo: herramienta.codigo || "",
        marca: herramienta.marca || "",
        condicion: herramienta.condicion || "",
        observaciones: herramienta.observaciones || "",
        EstadoId: herramienta.EstadoId || "",
        SubcategoriaId: herramienta.SubcategoriaId || "",
        UsuarioId: herramienta.UsuarioId || "",
      });
    }
  }, [herramienta]);

  useEffect(() => {
    const fetchsubcategorias = async () => {
      try {
        const response = await api.get("/subcategoria/estado");
        const filteredSubcategorias = response.data.filter(
          (Categoria) => Categoria.CategoriaId === 2 
        );
        setSubcategorias(filteredSubcategorias);
      } catch (error) {
      }
    };

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

    fetchsubcategorias();
    fetchEstados();
  }, []);

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "nombre") {
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
      [name]: value,
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
      nombre: "",
      codigo: "",
      marca: "",
      condicion: "",
      observaciones: "",
      EstadoId: "",
      SubcategoriaId: "",
      UsuarioId: "",
    });
  };

  const handleCreate = async () => {
    const {
      nombre,
      codigo,
      marca,
      condicion,
      observaciones,
      EstadoId,
      SubcategoriaId,
    } = formData;

    const codigoError = validateInput("codigo", codigo);
    const nombreError = validateInput("nombre", nombre);
    const condicionError = validateInput("condicion", condicion);
    const observacionesError = validateInput("observaciones", observaciones);
    const marcaError = validateInput("marca", marca);

    if (
      codigoError ||
      nombreError ||
      condicionError ||
      observacionesError ||
      marcaError
    ) {
      setFormErrors({
        codigo: codigoError,
        nombre: nombreError,
        condicion: condicionError,
        observaciones: observacionesError,
        marca: marcaError,
      });

      if (codigoError) {
        showToastError("El código es inválido o está vacío.");
      }
      if (nombreError) {
        showToastError("El nombre es obligatorio y debe ser válido.");
      }
      if (condicionError) {
        showToastError("La condición es obligatoria.");
      }
      if (observacionesError) {
        showToastError("El campo de observaciones es obligatorio.");
      }
      if (marcaError) {
        showToastError("La marca es obligatoria.");
      }
      return;
    }

    if (
      !codigo ||
      !nombre ||
      !condicion ||
      !observaciones ||
      !marca ||
      !EstadoId ||
      !SubcategoriaId
    ) {
      if (!codigo) {
        showToastError("El campo 'Código' es obligatorio.");
      }
      if (!nombre) {
        showToastError("El campo 'Nombre' es obligatorio.");
      }
      if (!condicion) {
        showToastError("El campo 'Condición' es obligatorio.");
      }
      if (!observaciones) {
        showToastError("El campo 'Observaciones' es obligatorio.");
      }
      if (!marca) {
        showToastError("El campo 'Marca' es obligatorio.");
      }
      if (!EstadoId) {
        showToastError("El campo 'Estado' es obligatorio.");
      }
      if (!SubcategoriaId) {
        showToastError("El campo 'Subcategoría' es obligatorio.");
      }
      return;
    }

    setLoading(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const response = await api.post("/herramienta", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("Herramienta agregada exitosamente", {
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
          "Error al agregar la herramienta. Intenta con un código o nombre diferente."
        );
      }
    } catch (error) {
      showToastError(
        "Ocurrió un error al agregar la herramienta. Verifica los datos e intenta nuevamente."
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
                  Registro Herramienta
                </h6>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Nombre *</label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={(e) => {
                      const valorEnMayusculas = e.target.value.toUpperCase();
                      handleInputChange({ target: { name: "nombre", value: valorEnMayusculas } });
                    }}
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
                  <label className="mb-1 font-bold text-sm">Código *</label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                  />
                  {formErrors.codigo && (
                    <div className="text-red-400 text-sm mt-1 px-2">
                      {formErrors.codigo}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Marca *</label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                  />
                  {formErrors.marca && (
                    <div className="text-red-400 text-sm mt-1 px-2">
                      {formErrors.marca}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Condicion *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="condicion"
                    value={formData.condicion}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione una Condicion</option>
                    <option value="BUENO">BUENO</option>
                    <option value="REGULAR">REGULAR</option>
                    <option value="MALO">MALO</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">
                    Observaciones *
                  </label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                  />
                  {formErrors.observaciones && (
                    <div className="text-red-400 text-sm mt-1 px-2">
                      {formErrors.observaciones}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">
                    Subcategoría *
                  </label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="SubcategoriaId"
                    value={formData.SubcategoriaId}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione una Subcategoría</option>
                    {subcategorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.subcategoriaName}
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

                <div className="sm:w-full md:w-full flex flex-col justify-end">
                  <div className="flex justify-center mt-4 mb-4 mx-2">
                    <button className="btn-danger2 mx-2" onClick={onClose}>
                      Cancelar
                    </button>
                    <button
                      className="btn-primary2 mx-2"
                      onClick={handleCreate}
                    >
                      Agregar
                    </button>
                  </div>
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

export default AddHerramientaModal;
