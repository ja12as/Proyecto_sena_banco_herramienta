import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/token";

const FirmasDos = ({ accordionStates, onFirmaChange }) => {
  const [firmaImagen, setFirmaImagen] = useState(null);
  const [firmaExistente, setFirmaExistente] = useState(null);
  const location = useLocation();
  const { pedidoId } = location.state || {};
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFirmaImagen(URL.createObjectURL(file));
      onFirmaChange(true, file);
    } else {
      onFirmaChange(false, null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (pedidoId) {
        try {
          const response = await api.get(`/pedido/${pedidoId}`);
          const data = response.data;
  
          if (data.firma) {
            const firmaUrl = `http://localhost:9100${data.firma}`;
            setFirmaExistente(firmaUrl);
            if (onFirmaChange) {
              onFirmaChange(false, null);
            }
          }
        } catch (error) {
          console.error("Error fetching pedido data:", error);
        }
      }
      setLoading(false);
    };
  
    fetchData();
  }, [pedidoId, onFirmaChange]);
  

  const canUpload =
    user?.Rol?.RolId === 3 || user?.Rol?.rolName === "COORDINADOR";

  return (
    <div>
      {accordionStates.firmas && (
        <div className="flex flex-col rounded-lg w-full">
          <div className="flex flex-col">
            <div>
              <label className="mb-2 font-bold text-xs">
                Firma de quien aprueba el pedido:*
              </label>
            </div>
            {firmaExistente ? (
              <div className="mt-2">
                <p className="font-bold text-xs mb-2">Firma existente:</p>
                <img
                  src={firmaExistente}
                  alt="Firma existente"
                  className="h-24 w-auto border border-black rounded"
                />
              </div>
            ) : null}

            {canUpload ? (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="font-inter text-xs ml-2 mb-4"
              />
            ) : (
              <p className="text-xs text-gray-500 mt-2">
                No tienes permiso para subir una firma.
              </p>
            )}

            {firmaImagen && (
              <div className="mt-2">
                <p className="font-bold text-xs mb-2">Vista previa:</p>
                <img
                  src={firmaImagen}
                  alt="Firma"
                  className="h-24 w-auto border border-black rounded"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FirmasDos;
