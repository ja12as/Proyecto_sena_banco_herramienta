import React, { useState } from "react";
import { FaHome, FaUsers, FaRegFileExcel, FaUnity, FaClipboardList } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6";
import { PiChalkboardTeacher } from "react-icons/pi";
import { RiTokenSwapLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { MdOutlineCategory, MdAssignmentReturned } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { LiaDropbox } from "react-icons/lia";
import { FiTool } from "react-icons/fi";
import { MdDirectionsWalk } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { FaArrowsDownToPeople } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import fondo from "/logoSena.png";

const Sidebar = ({ sidebarToggle }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({
    usuarios: false,
    formacion: false,
    fichas: false,
    categorias: false,
    general: false,
    subdireccion: false,
  });  

  const { user } = useAuth();

  const handleClick = () => {
    navigate("/dashboard");
  };

  const handleToggle = (panel) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [panel]: !prevExpanded[panel],
    }));
  };  

  const hasPermission = (permissionName) => {
    return user.DetallePermisos.some(
      (permiso) => permiso.Permiso.nombrePermiso === permissionName
    );
  };  

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: sidebarToggle ? 0 : "-100%" }}
      transition={{ type: "spring", stiffness: 120 }}
      className="fixed w-64 bg-black h-full px-4 py-2 shadow-lg"
    >
      <div
        className="relative flex items-center font-inter my-2 mb-4"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <img className="w-10 h-10 object-cover" src={fondo} alt="logoSena" />
        <div className="absolute top-0 left-14 z-10 font-inter text-lg custom-text">
          <h6 className="textMob text-white font-bold">Inventario del</h6>
          <h6 className="text-sena font-bold">Mobiliario</h6>
        </div>
      </div>
      <hr />
      <ul className="mt-3 text-white font-bold font-inter">
        <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
          <a href="/dashboard" className="px-3">
            <FaHome className="inline-block w-6 h-6 mr-2 -mt-2"></FaHome>
            Dashboard
          </a>
        </li>

        {/* Usuarios */}
        <li className="mb-2">
          <div
            className="flex items-center justify-between px-3 py-2 rounded hover:shadow hover:bg-gray-700 cursor-pointer"
            onClick={() => handleToggle("usuarios")}
          >
            <div className="flex items-center">
              <FaUserLarge className="inline-block w-6 h-6 mr-2 -mt-2" />
              Usuarios
            </div>
            <span>{expanded.usuarios ? "-" : "+"}</span>
          </div>
          {expanded.usuarios && (
            <ul className="bg-black text-center text-white text-sm">
              {hasPermission("Vista Usuario") && (
                <li className="py-1 hover:bg-gray-700 rounded mx-4">
                  <a href="/Usuarios" className="px-3 flex items-center">
                  <FaUserLarge className="inline-block w-4 h-4 mr-2 -mt-1"></FaUserLarge>
                  Usuarios
                  </a>
                </li>
              )}
              <li className="py-1 hover:bg-gray-700 rounded mx-4">
                <a href="/roles" className="px-3 flex items-center">
                <FaUsers className="inline-block w-4 h-4 mr-2 -mt-1"></FaUsers>
                Roles
                </a>
              </li>
            </ul>
          )}
        </li>


        {/* Formación */}
        {(hasPermission("Vista Fichas") || (hasPermission("Vista Instructores"))) && (
        <li className="mb-2">
          <div
            className="flex items-center justify-between px-3 py-2 rounded hover:shadow hover:bg-gray-700 cursor-pointer"
            onClick={() => handleToggle("formacion")}
          >
            <div className="flex items-center">
              <SiGoogleclassroom className="inline-block w-6 h-6 mr-2 -mt-2" />
              Formación
            </div>
            <span>{expanded.formacion ? "-" : "+"}</span>
          </div>
          {expanded.formacion && (
            <ul className="bg-black text-center text-white text-sm">
              <li className="py-1 hover:bg-gray-700 rounded mx-4">
                  <div
                    className="flex items-center justify-between px-3 py-2 rounded hover:shadow hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleToggle("fichas")}
                  >
                    <div className="flex items-center">
                      <SiGoogleclassroom className="inline-block w-4 h-4 mr-2 -mt-1"></SiGoogleclassroom>
                      Fichas
                    </div>
                    <span>{expanded.fichas ? "-" : "+"}</span>
                  </div>
                </li>

                {expanded.fichas && ( 
                    <ul className="bg-black text-center text-white text-xs"> 
                      <li className="py-1 px-2 hover:bg-gray-700 rounded mx-4">
                        <a href="/fichas" className="px-3 flex items-center">
                          <FaArrowsDownToPeople className="inline-block w-4 h-4 mr-2 -mt-1"></FaArrowsDownToPeople>
                          Fichas
                        </a>
                      </li>
                      <li className="py-1 px-2 hover:bg-gray-700 rounded mx-4">
                        <a href="/instructor-fichas" className="px-3 flex items-center">
                          <RiTokenSwapLine className="inline-block w-4 h-4 mr-2 -mt-1"></RiTokenSwapLine>
                          Fichas por Instructor
                        </a>
                      </li>
                    </ul>
                  )}

              <li className="py-1 hover:bg-gray-700 rounded mx-4">
                <a href="/instructores" className="px-3 flex items-center">
                <PiChalkboardTeacher className="inline-block w-4 h-4 mr-2 -mt-1"></PiChalkboardTeacher>
                Instructores
                </a>
              </li>
            </ul>
          )}
        </li>
        )}

        {/* Categorías */}
        {(hasPermission("Vista Categorias") || (hasPermission("Vista Subcategorias"))) && (
          <li className="mb-2">
            <div
              className="flex items-center justify-between px-3 py-2 rounded hover:shadow hover:bg-gray-700 cursor-pointer"
              onClick={() => handleToggle("categorias")}
            >
              <div className="flex items-center">
                <TbCategory className="inline-block w-6 h-6 mr-2 -mt-2" />
                Categorías
              </div>
              <span>{expanded.categorias ? "-" : "+"}</span>
            </div>
            {expanded.categorias && (             
              <ul className="bg-black text-center text-white text-sm">
                <li className="py-1 hover:bg-gray-700 rounded mx-4">
                  <a href="/subcategorias" className="px-3 flex items-center">
                    <RiAdminLine className="inline-block w-4 h-4 mr-2 -mt-1"></RiAdminLine>
                    Administración
                  </a>
                </li>
                
                <li className="py-1 hover:bg-gray-700 rounded mx-4">
                  <div
                    className="flex items-center justify-between px-3 py-2 rounded hover:shadow hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleToggle("general")}
                  >
                    <div className="flex items-center">
                      <MdOutlineCategory className="inline-block w-4 h-4 mr-2 -mt-1"></MdOutlineCategory>
                      Inventario General
                    </div>
                    <span>{expanded.general ? "-" : "+"}</span>
                  </div>
                </li>

                  {expanded.general && ( 
                    <ul className="bg-black text-center text-white text-xs"> 
                      <li className="py-1 px-2 hover:bg-gray-700 rounded mx-4">
                        <a href="/ConsumoControladoGeneral" className="px-3 flex items-center">
                          <LiaDropbox className="inline-block w-4 h-4 mr-2 -mt-1"></LiaDropbox>
                          Consumo controlado
                        </a>
                      </li>
                        <li className="py-1 px-2 hover:bg-gray-700 rounded mx-4">
                        <a href="/ConsumoDevolutivoGeneral" className="px-3 flex items-center">
                          <FiTool className="inline-block w-4 h-4 mr-2 -mt-1"></FiTool>
                          Consumo devolutivo
                        </a>
                      </li>
                    </ul>
                  )}

                <li className="py-1 hover:bg-gray-700 rounded mx-4">
                  <div
                    className="flex items-center justify-between px-3 py-2 rounded hover:shadow hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleToggle("subdireccion")}
                  >
                    <div className="flex items-center">
                      <MdDirectionsWalk className="inline-block w-4 h-4 mr-2 -mt-1"></MdDirectionsWalk>
                      Subdirección
                    </div>
                    <span>{expanded.subdireccion ? "-" : "+"}</span>
                  </div>
                </li>
                  {expanded.subdireccion && (
                    <ul className="bg-black text-center text-white text-xs"> 
                      <li className="py-1 px-2 hover:bg-gray-700 rounded mx-4">
                        <a href="/productos" className="px-3 flex items-center">
                          <LiaDropbox className="inline-block w-4 h-4 mr-2 -mt-1"></LiaDropbox>
                          Consumo controlado
                        </a>
                      </li>
                        <li className="py-1 px-2 hover:bg-gray-700 rounded mx-4">
                        <a href="/herramientas" className="px-3 flex items-center">
                          <FiTool className="inline-block w-4 h-4 mr-2 -mt-1"></FiTool>
                          Consumo devolutivo
                        </a>
                      </li>
                    </ul>
                  )}
              </ul>
            )}
          </li>
        )}

        {/* Otros enlaces */}
        {/* {hasPermission("vista Productos") && (
          <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
            <a href="/productos" className="px-3">
              <LiaDropbox className="inline-block w-6 h-6 mr-2 -mt-2"></LiaDropbox>
              Productos
            </a>
          </li>
        )} */}
        {/* {hasPermission("vista Herramientas") && (
          <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
            <a href="/herramientas" className="px-3">
              <FiTool className="inline-block w-6 h-6 mr-2 -mt-2"></FiTool>
              Herramientas
            </a>
          </li>
        )} */}
        {hasPermission("vista Prestamos") && (
          <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
            <a href="/prestamos" className="px-3">
              <MdAssignmentReturned className="inline-block w-6 h-6 mr-2 -mt-2"></MdAssignmentReturned>
              Préstamos
            </a>
          </li>
        )}
        {hasPermission("vista Pedidos") && (
          <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
            <a href="/pedidos" className="px-3">
              <FaClipboardList className="inline-block w-6 h-6 mr-2 -mt-2"></FaClipboardList>
              Pedidos
            </a>
          </li>
        )}
        {/* {hasPermission("vista Excel") && ( */}
          <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
            <a href="/excel" className="px-3">
              <FaRegFileExcel className="inline-block w-6 h-6 mr-2 -mt-2"></FaRegFileExcel>
              Importar Excel
            </a>
          </li>
        {/* )} */}
        {hasPermission("vista Unidades medida") && (
          <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
            <a href="/unidadmedida" className="px-3">
              <FaUnity className="inline-block w-6 h-6 mr-2 -mt-2"></FaUnity>
              Unidad de Medida
            </a>
          </li>
        )}
      </ul>
    </motion.div>
  );
};

export default Sidebar;