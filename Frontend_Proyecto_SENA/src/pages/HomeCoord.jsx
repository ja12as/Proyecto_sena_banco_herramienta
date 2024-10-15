import React, { useState } from "react";
import Resumen from "../components/Resumen";
import SidebarCoord from "../components/SidebarCoord";
import Home from "../components/Home";

const HomeCoord = () => {
  const [sidebarToggleCoord, setsidebarToggleCoord] = useState(false);

  return (
    <div className="flex min-h-screen bg-fondo">
      <SidebarCoord sidebarToggleCoord={sidebarToggleCoord} />
      <div
        className={`flex flex-col flex-grow p-4 bg-fondo ${
          sidebarToggleCoord ? "ml-64" : ""
        } mt-16`}
      >
        <Home
          sidebarToggle={sidebarToggleCoord}
          setSidebarToggle={setsidebarToggleCoord}
        />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto">
            <Resumen />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCoord;
