import React, { useState, useEffect } from "react";
import { api } from "../api/token";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HistorialIF = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/HistorialIF", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching historial data:", error);
      toast.error("Error al cargar los datos del historial", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const sampleData = [
    {
      id: 1,
      InstructorId: "1040572063",
      FichaId: "2694524",
      Trimestre: 1,
      fecha: "2024-07-31",
      hora: "10:00 AM"
    },
    {
      id: 2,
      InstructorId: "1040572063",
      FichaId: "2694524",
      Trimestre: 2,
      fecha: "2024-08-01",
      hora: "11:00 AM"
    },
    {
      id: 3,
      InstructorId: "1040572063",
      FichaId: "2694524",
      Trimestre: 3,
      fecha: "2024-08-02",
      hora: "12:00 PM"
    },
    {
      id: 4,
      InstructorId: "1040572063",
      FichaId: "2694524",
      Trimestre: 4,
      fecha: "2024-08-03",
      hora: "01:00 PM"
    },
    {
      id: 5,
      InstructorId: "1040572063",
      FichaId: "2694524",
      Trimestre: 5,
      fecha: "2024-08-04",
      hora: "02:00 PM"
    },
    {
      id: 6,
      InstructorId: "1040572063",
      FichaId: "2694524",
      Trimestre: 6,
      fecha: "2024-08-05",
      hora: "03:00 PM"
    },
    {
      id: 7,
      InstructorId: "1040572063",
      FichaId: "2694524",
      Trimestre: 7,
      fecha: "2024-08-06",
      hora: "04:00 PM"
    }
  ];

  return (
    <div className="flex min-h-screen bg-fondo">
      <Sidebar sidebarToggle={sidebarToggle} />
      <div className={`flex-1 px-8 ${sidebarToggle ? "ml-custom" : ""}`}>
        <Home
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />
        <header className="flex items-center justify-between mb-6 mt-24 bg-fondo p-5 rounded-lg">
          <Button
            className="bg-sena-500 text-white"
            variant="contained"
            onClick={() => window.history.back()}
          >
            Volver Atrás
          </Button>
          <div className="flex-1 flex justify-center">
            <Typography variant="h3" className="text-4xl font-bold text-negro">
              Historial de Fichas e Instructores
            </Typography>
          </div>
        </header>
        <div className="flex-grow flex flex-col items-center">
          {loading ? (
            <div className="text-center">Cargando historial...</div>
          ) : (
            <div className="w-full max-w-7xl">
              {sampleData.length === 0 ? (
                <div className="text-center">No hay registros</div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <Typography variant="subtitle1" className="text-gray-600 mb-10 text-2xl">
                    Hoy - miércoles, 31 de julio de 2024
                  </Typography>
                  {sampleData.map((item, index) => (
                    <div key={index} className="mb-10 flex justify-between items-center border-b border-gray-300 pb-6">
                      <Typography variant="h6" className="text-gray-800 text-xl">
                        {item.hora}
                      </Typography>
                      <Typography variant="h6" className="text-gray-800 text-xl">
                        Instructor ID: {item.InstructorId}
                      </Typography>
                      <Typography variant="h6" className="text-gray-800 text-xl">
                        Ficha ID: {item.FichaId}
                      </Typography>
                      <Typography variant="h6" className="text-gray-800 text-xl">
                        Trimestre {item.Trimestre}
                      </Typography>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialIF;