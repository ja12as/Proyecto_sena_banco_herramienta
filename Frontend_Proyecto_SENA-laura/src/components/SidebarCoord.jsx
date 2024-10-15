import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import { FaFileSignature } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import fondo from "/logoSena.png";
import { LiaDropbox } from "react-icons/lia";
import { FiTool } from "react-icons/fi";

const SidebarCoord = ({ sidebarToggleCoord }) => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState({
      autorizar: false,
    });  

    const handleClick = () => {
        navigate("/homecoord");
      };

    const handleToggle = (panel) => {
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        [panel]: !prevExpanded[panel],
      }));
    };  
    
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: sidebarToggleCoord ? 0 : "-100%" }}
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
          <a href="/homecoord" className="px-3">
            <FaHome className="inline-block w-6 h-6 mr-2 -mt-2"></FaHome>
            Dashboard
          </a>
        </li>

        <li className="mb-2">
          <div 
            className="flex items-center justify-between px-3 py-2 rounded hover:shadow hover:bg-gray-700 cursor-pointer"
            onClick={() => handleToggle("autorizar")}
          >
            <div className="flex items-center">
              <FaFileSignature className="inline-block w-6 h-6 mr-2 -mt-2"></FaFileSignature>
              Autorizar Pedidos 
            </div>
            <span>{expanded.autorizar ? "-" : "+"}</span>
          </div>
          {expanded.autorizar && (
            <ul className="bg-black text-center text-white text-sm">
              <li className="py-1 hover:bg-gray-700 rounded mx-4">
                <a href="/autPedidos" className="px-3 flex items-center">
                <LiaDropbox className="inline-block w-4 h-4 mr-2 -mt-1"></LiaDropbox>
                Productos
                </a>
              </li>
              <li className="py-1 hover:bg-gray-700 rounded mx-4">
                <a href="/autPrestamos" className="px-3 flex items-center">
                <FiTool className="inline-block w-4 h-4 mr-2 -mt-1"></FiTool>
                Herramientas
                </a>
              </li>
            </ul>
          )}
          </li>

        <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
          <a href="/fichasCoordi" className="px-3">
            <SiGoogleclassroom className="inline-block w-6 h-6 mr-2 -mt-2"></SiGoogleclassroom>
            Gestión Fichas
          </a>
        </li>
      </ul>
    </motion.div>
  );
};

export default SidebarCoord
