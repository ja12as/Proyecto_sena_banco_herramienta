import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import Resumen from "../components/Resumen";

const Dashboard = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  return (
    <div className="flex min-h-screen bg-fondo">
      <Sidebar sidebarToggle={sidebarToggle} />
      <div
        className={`flex flex-col flex-grow p-4 bg-fondo ${
          sidebarToggle ? "ml-64" : ""
        } mt-16`}
      >
        <Home
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
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

export default Dashboard;
