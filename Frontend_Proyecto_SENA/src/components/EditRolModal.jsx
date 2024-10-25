import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const EditRolModal = ({ isOpen, onClose, rol }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rolName: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && rol) {
      fetchRolDetails(rol.id);
    }
  }, [isOpen, rol]);

  const fetchRolDetails = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/Rol/${id}`);
      if (response.status === 200) {
        const { rolName } = response.data;
        setFormData({
          rolName: rolName || "",
        });
        setLoading(false);
      } else {
        console.error("Error fetching rol details:", response.data.message);
        toast.error("Error al cargar la información del rol.", {
          position: "top-right",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching rol details:", error);
      toast.error("Error al cargar la información del rol.", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.toUpperCase(),
    });
  };

  const handleUpdate = async () => {
    const { rolName } = formData;

    if (!rolName) {
      toast.error("El campo es obligatorio.", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(
        `/Rol/${rol.id}`,
        {
          rolName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Rol actualizado exitosamente", {
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
        console.error("Error updating rol:", response.data.message);
        toast.error("Error al actualizar la información del rol.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating rol:", error);
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error al actualizar la información del rol.", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
                  Editar Rol
                </h6>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Rol *</label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="rolName"
                    value={formData.rolName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:w-full md:w-full flex flex-col justify-end">
          {hasPermission("Modificar Rol") && (
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

export default EditRolModal;
