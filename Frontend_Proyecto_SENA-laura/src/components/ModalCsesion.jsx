import React, { useEffect, useState } from "react";
import { FaTimes, FaUserCircle } from "react-icons/fa";
import { api } from "../api/token";

const ModalCsesion = ({ isOpen, onClose, children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const fetchUserProfile = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      const response = await api.get("/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUserInfo(response.data.perfil);
        setError(null);
      } else {
        console.error("Error fetching user profile:", response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Error al cargar la información del usuario.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-start justify-end bg-fondo bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-72 mt-4 mr-4 max-h-screen overflow-y-auto">
        <div className="flex justify-end p-2">
          <button onClick={onClose}>
            <FaTimes className="text-black w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center px-4">
          <FaUserCircle className="text-black w-10 h-10 mr-4" />
          <div>
            {loading ? (
              <p>Cargando información...</p>
            ) : error ? (
              <p>{error}</p>
            ) : userInfo ? (
              <div className="font-inter font-bold">
                <p>{userInfo.nombre}</p>
                <p>{userInfo.Documento}</p>
              </div>
            ) : (
              <p>Error al cargar la información del usuario.</p>
            )}
          </div>
        </div>
        {children && <div className="px-4">{children}</div>}
      </div>
    </div>
  );
};

export default ModalCsesion;
