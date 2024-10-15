import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { FormControlLabel, Checkbox } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext"; 
import "react-toastify/dist/ReactToastify.css";

const EditUserModal = ({ isOpen, onClose, selectedUser }) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [permisos, setPermisos] = useState([]);
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    Documento: "",
    correo: "",
    RolId: "",
    EstadoId: "",
    DetallePermisos: [],
  });

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && selectedUser) {
      fetchUserDetails(selectedUser.id);
    }
  }, [isOpen, selectedUser]);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([api.get("/Rol"), api.get("/Estado/1"), api.get("/Estado/2")])
        .then(([rolesResponse, estado1Response, estado2Response, permisosResponse]) => {
          setRoles(rolesResponse.data);
          setEstados([estado1Response.data, estado2Response.data]);
          setPermisos(permisosResponse.data);
        })
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
      } catch (error) {
      }
    };
    fetchPermisos();
  }, []);



  const fetchUserDetails = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get(`/usuarios/${userId}`);
      if (response.status === 200) {
        const { nombre, Documento, correo, RolId, EstadoId, DetallePermisos } = response.data;
        setFormData({
          nombre: nombre || "",
          Documento: Documento || "",
          correo: correo || "",
          RolId: RolId || "",
          EstadoId: EstadoId || "",
          DetallePermisos: DetallePermisos || [],
        });

        if (DetallePermisos && DetallePermisos.length > 0) {
          const permisoIds = DetallePermisos.map((detalle) => detalle.PermisoId);
          setSelectedPermisos(permisoIds);
        } else {
          setSelectedPermisos([]);
        }
        setLoading(false);
      } else {
        toast.error("Error al cargar la información del usuario.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error al cargar la información del usuario.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && permisos.length > 0 && formData.DetallePermisos.length > 0) {
      const permisoIds = formData.DetallePermisos.map((detalle) => detalle.PermisoId);
      setSelectedPermisos(permisoIds);
    }
  }, [permisos, formData.DetallePermisos]);
  
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

  const handleUpdate = async () => {
    const { nombre, correo, Documento, RolId, EstadoId } = formData;
  
    // Validar campos obligatorios
    if (!nombre || !correo || !Documento || !RolId || !EstadoId) {
      toast.error("Todos los campos son obligatorios.", { position: "top-right" });
      return;
    }
  
    // Validar permisos seleccionados
    if (!selectedPermisos || selectedPermisos.length === 0) {
      toast.error("Debe seleccionar al menos un permiso.", { position: "top-right" });
      return;
    }
  
    setLoading(true);
    try {
      // Aquí se preparan los datos que serán enviados en la petición
      const updatedFormData = {
        ...formData,
        permisos: selectedPermisos, // Enviar permisos en el campo 'permisos'
      };
  
      // Hacemos la llamada API para actualizar el usuario
      const response = await api.put(
        `/usuarios/${selectedUser.id}`, // Reemplaza user.id con el ID del usuario que estás editando
        updatedFormData, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("Usuario actualizado exitosamente", {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => {
          onClose(response.data); 
        }, 2000);
      } else {
        console.error("Error updating user profile:", response.data.message);
        toast.error("Error al actualizar la información del usuario.", {
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
        toast.error("Error al actualizar la información del usuario.", {
          position: "top-right",
        });
      }    
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
                  Editar Usuario
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
                    <label className="mb-1 font-bold text-sm">
                      Correo *
                    </label>
                    <input
                      className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                      type="text"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                    />
                    {formErrors.correo && (
                      <div className="text-red-400 text-sm mt-1">
                        {formErrors.correo}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col min-w-[200px] w-1/2">
                    <label className="mb-1 font-bold text-sm">
                      Rol *
                    </label>
                    <select
                      className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                      name="RolId"
                      value={formData.RolId}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccionar Rol</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.rolName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col min-w-[200px] w-1/2 mb-4">
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
                
                <h6 className="font-bold text-center text-xl mb-2">Permisos</h6>
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
                          Para editar permisos, comunicarse con el administrador.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-1">
                      {permisos.map((permiso) => (
                        <FormControlLabel
                          key={permiso.id}
                          control={
                            <Checkbox
                              checked={selectedPermisos.includes(permiso.id)}
                              onChange={handleCheckboxChange(permiso.id)}
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
                    <button className="btn-primary2 mx-2" onClick={handleUpdate}>
                      Actualizar
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

export default EditUserModal;
