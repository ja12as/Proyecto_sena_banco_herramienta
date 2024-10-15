import React, { useEffect, useState } from "react";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRolModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    rolName: "",
  });

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen]);

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
      rolName: "",
    });
  };

  const handleCreate = async () => {
    const { rolName } = formData;

    if (!rolName) {
      showToastError("El campo es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const response = await api.post("/Rol", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("Rol agregado exitosamente", {
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
        showToastError("Ocurrió un error!, por favor intenta de nuevo.");
      }
    } catch (error) {
      showToastError("Ocurrió un error!, por favor intenta de nuevo.");
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
                  Agregar Rol
                </h6>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Rol *</label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="rolName"
                    value={formData.rolName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rolName: e.target.value.toUpperCase(),
                      })
                    }
                    onKeyPress={(e) => {
                      if (/\d/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
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

export default AddRolModal;
