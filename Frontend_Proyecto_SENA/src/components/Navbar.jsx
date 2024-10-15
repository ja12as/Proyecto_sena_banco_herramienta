import React, { useState } from "react";
import { FaBars, FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import ModalCsesion from "./ModalCsesion";
import ModalPerfil from "./ModalPerfil";
import ConfirmLogoutModal from "./ConfirmLogoutModal";
import ModalNotificaciones from "./ModalNotificaciones";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { api } from "../api/token";

const Navbar = ({ sidebarToggle, setSidebarToggle }) => {
  const { signout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPerfilOpen, setIsModalPerfilOpen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [isNotificacionesOpen, setIsNotificacionesOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const notifications = ["Notificación 1", "Notificación 2", "Notificación 3"];

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
  const handleNewNotifications = (nuevas) => {
    setUnreadNotifications(nuevas); // Actualizamos el número de notificaciones no leídas
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
          {/* <div className="relative items-center md:w-65">
            <span className="relative md:absolute inside-y-0 left-0 flex items-center pl-40">
              <button className="p-2 focus:outline-none text-white md:text-black">
                <FaSearch />
              </button>
            </span>
            <input
              type="text"
              placeholder="Buscar aquí"
              className="w-full px-4 py-1 pl-22 rounded-lg shadow outline-none hidden md:block bg-gray-100"
            />
          </div> */}
          <div className="relative text-white">
            <FaBell
              className="w-6 h-6 text-black cursor-pointer"
              onClick={() => setIsNotificacionesOpen(true)}
            />
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
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
          {/* <li>
            <div className="bg-gray-100 text-center rounded-lg my-4">
              <a href="">Ayuda</a>
            </div>
          </li>
          <li>
            <div className="bg-gray-100 text-center rounded-lg my-4">
              <a href="">Configuración</a>
            </div>
          </li> */}
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

export default Navbar;
