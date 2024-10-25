import React from "react";
import fondo from "/logoSena.png";

const Navbardark = ({ sidebarToggle, setSidebarToggle }) => {
  return (
    <nav
      className={`bg-black shadow px-4 py-3 flex justify-between items-center fixed top-0 left-0 z-50 w-full transition-all duration-300`}
      style={{
        marginLeft: sidebarToggle ? "16rem" : "0",
        width: sidebarToggle ? "calc(100% - 16rem)" : "100%",
      }}
    >
      <div className="flex items-center text-xl w-auto">
        <img
          className="w-10 h-10 object-cover ml-2"
          src={fondo}
          alt="logoSena"
        />

        <span className="text-white font-semibold hidden md:inline mr-2 ml-2">
          Bievenidos al inventario del
        </span>
        <span className="text-sena font-semibold hidden md:inline">
          Mobiliario
        </span>
      </div>
    </nav>
  );
};

export default Navbardark;
