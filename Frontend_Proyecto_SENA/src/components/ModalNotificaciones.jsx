import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { api } from "../api/token";
import "react-toastify/dist/ReactToastify.css";

const ModalNotificaciones = ({ isOpen, onClose, onNewNotifications }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotificaciones();
    }
  }, [isOpen]);

  const fetchNotificaciones = async () => {
    setLoading(true);
    try {
      const response = await api.get("/notificaciones");
      if (response.status === 200) {
        setNotificaciones(response.data);

        // Calcular cuántas notificaciones son nuevas
        const nuevas = response.data.filter((n) => n.nueva).length;
        onNewNotifications(nuevas); // Actualizamos el número de notificaciones nuevas
      } else {
        console.error("Error al cargar las notificaciones:", response.data.message);
      }
    } catch (error) {
      console.error("Error al cargar las notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-opacity-50 bg-gray-500">
      <div className="bg-white rounded-lg shadow-2xl sm:w-full md:w-1/3 mt-4 max-h-screen overflow-y-auto mr-4 border border-gray-200 relative">
        <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
          <div>
            <h2 className="font-bold text-2xl mb-1">Notificaciones</h2>
            <p className="text-lg text-gray-600">Nuevas Notificaciones</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-black w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4 mb-4">
          <div className="overflow-y-auto max-h-60">
            {loading ? (
              <p className="text-lg text-center text-gray-700">
                Cargando notificaciones...
              </p>
            ) : notificaciones.length === 0 ? (
              <p className="text-lg text-center text-gray-700">
                No hay notificaciones.
              </p>
            ) : (
              notificaciones.map((notificacion) => (
                <div
                  key={notificacion.id}
                  className="border-b border-gray-200 py-2 flex items-center"
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-4 ${
                      notificacion.nueva ? "bg-blue-500" : "bg-transparent"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-lg">{notificacion.message}</p>
                    <p className="text-base text-gray-500">
                      {new Date(notificacion.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ModalNotificaciones;
