import React, { useEffect, useState } from "react";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { FormControlLabel, Checkbox } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const AddUserModal = ({ isOpen, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [permisos, setPermisos] = useState([]);
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    Documento: "",
    correo: "",
    password: "",
    RolId: "",
    EstadoId: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([api.get("/Rol"), api.get("/Estado/1"), api.get("/Estado/2")])
        .then(
          ([
            rolesResponse,
            estado1Response,
            estado2Response,
            permisosResponse,
          ]) => {
            setRoles(rolesResponse.data);
            setEstados([estado1Response.data, estado2Response.data]);
            setPermisos(permisosResponse.data);
          }
        )
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await api.get("/permisos");
        setPermisos(response.data);
      } catch (error) {}
    };
    fetchPermisos();
  }, []);

  const validateInput = (name, value) => {
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
    } else if (name === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[a-zA-Z0-9!@#$%^&*?]{8,}$/;
      if (!passwordRegex.test(value)) {
        errorMessage =
          "La contraseña debe contener una mayúscula, una minúscula, un carácter especial, y entre 8 a 20 caracteres.";
      }
    }
    return errorMessage;
  };

  const handleCheckboxChange = (permisoId) => (event) => {
    if (event.target.checked) {
      setSelectedPermisos([...selectedPermisos, permisoId]);
    } else {
      setSelectedPermisos(selectedPermisos.filter((id) => id !== permisoId));
    }
  };

  const isAllSelected = selectedPermisos.length === permisos.length;

  const isIndeterminate =
    selectedPermisos.length > 0 && selectedPermisos.length < permisos.length;

  const handleSelectAllChange = (event) => {
    if (event.target.checked) {
      setSelectedPermisos(permisos.map((permiso) => permiso.id));
    } else {
      setSelectedPermisos([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convertir el nombre a mayúsculas si es el campo de nombre
    const newValue = name === "nombre" ? value.toUpperCase() : value;
    const errorMessage = validateInput(name, newValue);
  
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
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
      Documento: "",
      correo: "",
      password: "",
      RolId: "",
      EstadoId: "",
    });
  };

  const handleCreate = async () => {
    const { nombre, correo, password, Documento, RolId, EstadoId } = formData;
  
    // Verifica si alguno de los campos obligatorios está vacío
    const requiredFields = { nombre, Documento, correo, password, RolId, EstadoId };
    const emptyFields = Object.keys(requiredFields).filter(
      (field) => !requiredFields[field] || requiredFields[field].trim() === ""
    );
  
    // Si hay campos vacíos, muestra un error
    if (emptyFields.length > 0) {
      showToastError("Todos los campos son obligatorios. Los campos vacíos son: " + emptyFields.join(", "));
      return;
    }
  
    // Validaciones individuales (por ejemplo, validación de formato)
    const nombreError = validateInput("nombre", nombre);
    const correoError = validateInput("correo", correo);
    const passwordError = validateInput("password", password);
  
    if (nombreError || correoError || passwordError) {
      setFormErrors({
        nombre: nombreError,
        correo: correoError,
        password: passwordError,
      });
      showToastError("Por favor, corrige los errores antes de agregar.");
      return;
    }
  
    setLoading(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const response = await api.post(
        "/usuarios",
        {
          ...formData,
          permisos: selectedPermisos.length ? selectedPermisos : [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        toast.success("Usuario agregado exitosamente", {
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
          "Ocurrió un error!, por favor intenta con un documento o correo diferente."
        );
      }
    } catch (error) {
      showToastError(
        "Ocurrió un error!, por favor intenta con un documento o correo diferente."
      );
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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-fondo bg-opacity-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg sm:w-full md:w-3/4 mt-4 max-h-screen overflow-y-auto">
        <div className="flex justify-end p-2">
          <button onClick={onClose}>
            <FaTimes className="text-black w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-center space-y-4 md:space-y-0">
          <div className="w-full md:w-11/12">
            <div className="font-inter ml-2">
              <div className="space-y-2 md:space-y-2 text-left">
                <h6 className="font-bold text-center text-2xl mb-2">
                  Registro Usuario
                </h6>

                <div className="flex flex-row justify-between gap-x-4">
                  <div className="flex flex-col min-w-[200px] w-1/2">
                    <label className="mb-1 font-bold text-sm">
                      Nombre Completo *
                    </label>
                    <input
                      className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      onKeyPress={(e) => {
                        if (/\d/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      style={{ textTransform: 'uppercase' }}
                    />
                    {formErrors.nombre && (
                      <div className="text-red-400 text-sm mt-1 px-2 min-w-[200px]">
                        {formErrors.nombre}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col min-w-[200px] w-1/2">
                    <label className="mb-1 font-bold text-sm">
                      Documento *
                    </label>
                    <input
                      className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                      type="text"
                      name="Documento"
                      value={formData.Documento}
                      onChange={handleInputChange}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="flex flex-row justify-between gap-x-4">
                  <div className="flex flex-col min-w-[200px] w-1/2">
                    <label className="mb-1 font-bold text-sm">Correo *</label>
                    <input
                      className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                      type="text"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                    />
                    {formErrors.correo && (
                      <div className="text-red-400 text-sm mt-1 px-2">
                        {formErrors.correo}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col min-w-[200px] w-1/2">
                    <label className="mb-1 font-bold text-sm">
                      Contraseña *
                    </label>
                    <input
                      className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    {formErrors.password && (
                      <div className="text-red-400 text-sm mt-1 px-2">
                        {formErrors.password}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-row justify-between gap-x-4">
                  <div className="flex flex-col min-w-[200px] w-1/2">
                    <label className="mb-1 font-bold text-sm">Rol *</label>
                    <select
                      className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                      name="RolId"
                      value={formData.RolId}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione un rol</option>
                      {roles.map((rol) => (
                        <option key={rol.id} value={rol.id}>
                          {rol.rolName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col min-w-[200px] w-1/2 mb-4">
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

                {/* {(hasPermission("Mostrar Permisos") || hasPermission("Asignar Permisos")) && ( */}
                <>
                  <h6 className="font-bold text-center text-xl mb-2">
                    Permisos
                  </h6>

                  <div>
                    <div className="text-center">
                      {user.id === 1 ? (
                        <FormControlLabel
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "0.775rem",
                              fontWeight: "bold",
                            },
                          }}
                          control={
                            <Checkbox
                              checked={isAllSelected}
                              indeterminate={isIndeterminate}
                              onChange={handleSelectAllChange}
                            />
                          }
                          label="Seleccionar todos"
                        />
                      ) : (
                        <p className="text-red-500 font-bold">
                          Para asignar permisos, comunicarse con el
                          administrador.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-1">
                      {permisos.map((permiso) => (
                        <FormControlLabel
                          key={permiso.id}
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "0.675rem",
                            },
                          }}
                          control={
                            <Checkbox
                              checked={selectedPermisos.includes(permiso.id)}
                              onChange={handleCheckboxChange(permiso.id)}
                              name={permiso.nombrePermiso}
                            />
                          }
                          label={permiso.nombrePermiso}
                        />
                      ))}
                    </div>
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
                </>
                {/* )} */}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddUserModal;
