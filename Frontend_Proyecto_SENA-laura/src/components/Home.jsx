import React from "react";
import Navbar from "./Navbar";

const Home = ({ sidebarToggle, setSidebarToggle }) => {
  return (
    <div className={`flex flex-col flex-grow ${sidebarToggle ? "" : "ml-64"}`}>
      <Navbar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
      />
    </div>
  );
};

export default Home;
