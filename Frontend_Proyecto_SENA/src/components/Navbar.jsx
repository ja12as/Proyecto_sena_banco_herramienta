import React, { useState, useEffect } from "react";
import { FaBars, FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import ModalCsesion from "./ModalCsesion";
import ModalPerfil from "./ModalPerfil";
import ConfirmLogoutModal from "./ConfirmLogoutModal";
import ModalNotificaciones from "./ModalNotificaciones";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { api } from "../api/token";

const Navbar  = ({ sidebarToggle, setSidebarToggle }) => {
  const { signout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPerfilOpen, setIsModalPerfilOpen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [isNotificacionesOpen, setIsNotificacionesOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]); 
  const [notificacionesNuevas, setNotificacionesNuevas] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notificaciones");
      setNotifications(response.data);
      // Contar notificaciones no leídas (cambiar a 'leida' si corresponde)
      const unreadCount = response.data.filter(notif => !notif.leida).length;
      setUnreadNotifications(unreadCount);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };
  
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 300000); // Cada 30 segundos
  
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 2500); // Cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setShowConfirmLogout(true);
  };

  const confirmLogout = async () => {
    const Documento = "Documento";
    const password = "password";

    const body = { Documento, password };
    const response = await api.post("/logout", body);
    if (response.data) {
      signout();
      Cookies.remove("token");
      navigate("/");
      setShowConfirmLogout(false);
    }
  };


  const handleOpenModalPerfil = () => {
    setIsModalPerfilOpen(true);
    setIsModalOpen(false);
  };

  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsModalPerfilOpen(false);
    setShowConfirmLogout(false);
    setIsNotificacionesOpen(false);
  };


  const handleNewNotifications = (count) => {
    setUnreadNotifications(prev => prev + count); // Incrementar el conteo
    setNotificacionesNuevas(count); // Guardar el nuevo conteo
  };

  const handleOpenNotifications = async () => {
    setIsNotificacionesOpen(true);
    await fetchNotifications(); // Obtener notificaciones al abrir
  };

  return (
    <nav
      className={`bg-gray-200 shadow px-4 py-3 flex justify-between items-center fixed top-0 left-0 z-50 w-full transition-all duration-300`}
      style={{
        marginLeft: sidebarToggle ? "16rem" : "0",
        width: sidebarToggle ? "calc(100% - 16rem)" : "100%",
      }}
    >
      <div className="flex items-center text-xl">
        <FaBars
          className="text-black mr-4 cursor-pointer"
          onClick={() => setSidebarToggle(!sidebarToggle)}
        />
        <span className="text-black font-semibold hidden md:inline">
          Bienvenido al inventario{" "}
        </span>
        <span className="text-sena font-semibold mt-6 hidden md:inline">
          Mobiliario
        </span>
      </div>


      <div className="flex justify-end w-full max-w-full">
        <div className="flex items-center gap-x-5">


          <div className="relative text-white">
            <FaBell
              className="w-6 h-6 text-black cursor-pointer"
              onClick={handleOpenNotifications}
            />
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {unreadNotifications}
              </span>
            )}
          </div>


          <div>
            <button
              className="text-white group"
              onClick={() => setIsModalOpen(true)}
            >
              <FaUserCircle className="text-black w-6 h-6 mt-1" />
            </button>
          </div>

        </div>
      </div>

      <ModalCsesion isOpen={isModalOpen} onClose={handleCloseModals}>
        <ul className="font-inter text-sm text-black font-bold">
          <li>
            <div
              className="bg-gray-100 text-center rounded-lg my-2"
              onClick={handleOpenModalPerfil}
            >
              <span className="cursor-pointer block w-full text-center">
                Editar perfil
              </span>
            </div>
          </li>


          <li>
            <div className="bg-gray-100 text-center rounded-lg my-4">
              <span
                onClick={handleLogout}
                className="cursor-pointer block w-full text-center"
              >
                Cerrar Sesión
              </span>
            </div>
          </li>
        </ul>
      </ModalCsesion>
      <ModalPerfil isOpen={isModalPerfilOpen} onClose={handleCloseModals} />
      <ConfirmLogoutModal
        isOpen={showConfirmLogout}
        onClose={() => setShowConfirmLogout(false)}
        onConfirm={confirmLogout}
      />
      <ModalNotificaciones
        isOpen={isNotificacionesOpen}
        onClose={handleCloseModals}
        notifications={notifications}
        onNewNotifications={handleNewNotifications} 
      />
    </nav>
  );
};

export default Navbar ;