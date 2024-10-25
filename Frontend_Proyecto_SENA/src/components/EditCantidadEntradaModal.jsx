import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCantidadEntradaModal = ({ isOpen, onClose, product }) => {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cantidadEntrada: "", // Cambia a 'cantidadEntrada' según el backend
  });

  useEffect(() => {
    if (isOpen && product) {
      setFormData({ cantidadEntrada: product.cantidadEntrada || "" }); // Cambia aquí también
    }
  }, [isOpen, product]);

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "cantidadEntrada") { // Actualiza el nombre del campo aquí
      if (isNaN(value) || value <= 0) {
        errorMessage = "La cantidad de entrada debe ser un número positivo.";
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

  const handleUpdate = async () => {
    const { cantidadEntrada } = formData; // Usa 'cantidadEntrada'

    if (!cantidadEntrada) {
      toast.error("El campo de cantidad de entrada es obligatorio.", {
        position: "top-right",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.put(
        `/producto/${product.id}/cantidad`, // Ruta actualizada para coincidir con el backend
        { cantidadEntrada }, // Asegúrate de que envíes 'cantidadEntrada'
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Cantidad de entrada actualizada exitosamente", {
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
        console.error("Error updating product:", response.data.message);
        toast.error("Error al actualizar la cantidad de entrada.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.response && error.response.status === 401) {
        setTimeout(() => {
          navigate("/");
        });
      } else {
        toast.error("Error al actualizar la cantidad de entrada.", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fondo bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg sm:w-full md:w-1/4 mt-4 max-h-screen overflow-y-auto">
        <div className="flex justify-end p-2">
          <button onClick={onClose}>
            <FaTimes className="text-black w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center justify-center space-y-2 md:space-y-0 mb-2">
          <div className="w-full md:w-3/4">
            <div className="font-inter ml-1">
              <div className="space-y-1 md:space-y-1 text-left">
                <h6 className="font-bold text-center text-lg mb-1">
                  Editar Cantidad de Entrada
                </h6>
                {loading ? (
                  <p className="text-center text-xs">Cargando información...</p>
                ) : (
                  <div className="space-y-1">
                    <div className="flex flex-col">
                      <label className="mb-0.5 font-bold text-xs">
                        Cantidad de Entrada *
                      </label>
                      <input
                        className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                        type="number"
                        name="cantidadEntrada" // Actualiza el nombre del input
                        value={formData.cantidadEntrada} // Usa 'cantidadEntrada'
                        onChange={handleInputChange}
                      />
                      {formErrors.cantidadEntrada && (
                        <div className="text-red-400 text-xs mt-0.5">
                          {formErrors.cantidadEntrada}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="sm:w-full md:w-full flex flex-col justify-end">
          <div className="flex justify-center mb-2 mx-1">
            <button className="btn-danger2 mx-1 text-xs" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn-primary2 mx-1 text-xs"
              onClick={handleUpdate}
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditCantidadEntradaModal;
