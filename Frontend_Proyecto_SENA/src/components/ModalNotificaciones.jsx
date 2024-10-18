import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { api } from "../api/token";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ModalNotificaciones = ({ isOpen, onClose, onNewNotifications }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotificaciones();
      const interval = setInterval(() => {
        fetchNotificaciones(); // Repite la llamada cada 30 segundos
      }, 30000);
      
      return () => clearInterval(interval); // Limpia el intervalo cuando se cierre el modal
    }
  }, [isOpen]);

  const fetchNotificaciones = async () => {
    setLoading(true);
    try {
      const response = await api.get("/notificaciones");
      if (response.status === 200) {
        const noLeidas = response.data.filter(n => n.nueva); // Filtrar las no leídas
        setNotificaciones(noLeidas);

        // Calcular cuántas notificaciones son nuevas
        const nuevas = noLeidas.length;
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

  const handleNotificationClick = async (id, redirectionPath) => {
    try {
      // Marcar la notificación como leída en el backend
      await api.put(`/notificaciones/${id}/leida`);
      
      // Actualizar estado local
      setNotificaciones((prev) =>
        prev.map((notificacion) =>
          notificacion.id === id
            ? { ...notificacion, nueva: false }
            : notificacion
        )
      );

      // Redirigir a la página correspondiente si redirectionPath existe
      if (redirectionPath) {
        navigate(redirectionPath);
      }
      onNewNotifications(notificaciones.filter(n => n.nueva).length - 1);
    } catch (error) {
      console.error("Error al marcar la notificación como leída:", error);
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      // Marcar la notificación como no leída en el backend
      await api.put(`/notificaciones/${id}/no-leida`);

      // Actualizar estado local
      setNotificaciones((prev) =>
        prev.map((notificacion) =>
          notificacion.id === id
            ? { ...notificacion, nueva: true }
            : notificacion
        )
      );

      onNewNotifications(notificaciones.filter(n => n.nueva).length + 1);
    } catch (error) {
      console.error("Error al marcar la notificación como no leída:", error);
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
                  className={`border-b border-gray-200 py-2 flex flex-col p-4 mb-2 rounded-lg ${
                    notificacion.nueva ? "bg-green-200" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg">{notificacion.message}</p>
                      <p className="text-base text-gray-500">
                        {new Date(notificacion.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                    <button
                        onClick={() => handleNotificationClick(notificacion.id, "/historial")}
                        className="text-white bg-green-700 hover:bg-green-800 rounded px-2 py-1 text-sm"
                      >
                        Detalles
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      notificacion.nueva
                        ? handleNotificationClick(notificacion.id)
                        : handleMarkAsUnread(notificacion.id)
                    }
                    className="text-sm text-blue-500 mt-2"
                  >
                    {notificacion.nueva ? "Marcar como leída" : "Marcar como no leída"}
                  </button>
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
