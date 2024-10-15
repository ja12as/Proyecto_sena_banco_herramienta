import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

const Reportes = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [coordinador, setCoordinador] = useState("");

  const obtenerReportes = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/reportes?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&coordinador=${coordinador}`
      );
      const data = await response.json();
      setReportes(data);
    } catch (error) {
      console.error("Error al obtener reportes:", error);
    }
  };

  const reportes = [
    {
      id: 1,
      nombre: "Productos solicitados por fichas",
      excelUrl: "/descargar/excel/ventas",
      pdfUrl: "/descargar/pdf/ventas",
    },
    {
      id: 2,
      nombre: "Productos solicitados por instructor",
      excelUrl: "/descargar/excel/inventario",
      pdfUrl: "/descargar/pdf/inventario",
    },
    {
      id: 3,
      nombre: "Productos más solicitados",
      excelUrl: "/descargar/excel/clientes",
      pdfUrl: "/descargar/pdf/clientes",
    },
    {
      id: 4,
      nombre: "Herramientas más solicitadas",
      excelUrl: "/descargar/excel/clientes",
      pdfUrl: "/descargar/pdf/clientes",
    },
    {
      id: 5,
      nombre: "Productos agotados",
      excelUrl: "/descargar/excel/clientes",
      pdfUrl: "/descargar/pdf/clientes",
    },
    {
      id: 6,
      nombre: "Herramientas en mal estado",
      excelUrl: "/descargar/excel/clientes",
      pdfUrl: "/descargar/pdf/clientes",
    },
    {
      id: 7,
      nombre: "Pedidos por coordinador",
      excelUrl: "/descargar/excel/clientes",
      pdfUrl: "/descargar/pdf/clientes",
    },
    {
      id: 8,
      nombre: "Productos que ingresan por primera vez",
      excelUrl: "/descargar/excel/clientes",
      pdfUrl: "/descargar/pdf/clientes",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarToggle={sidebarToggle} />
      <div
        className={`flex flex-col flex-grow p-6 bg-gray-100 ${
          sidebarToggle ? "ml-64" : ""
        } mt-16`}
      >
        <Home
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-6xl mx-auto">
            <form onSubmit={obtenerReportes} className="mb-6">
              <div className="flex justify-between space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Coordinador
                  </label>
                  <input
                    type="text"
                    value={coordinador}
                    onChange={(e) => setCoordinador(e.target.value)}
                    placeholder="Nombre del coordinador"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 btn-black2 text-white px-4 py-2 rounded-md"
                >
                  Filtrar Reportes
                </button>
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-center text-base font-bold text-black uppercase tracking-wider">
                      Nombre del Reporte
                    </th>
                    <th className="px-6 py-3 text-center text-base font-bold text-black uppercase tracking-wider">
                      Descargar Excel
                    </th>
                    <th className="px-6 py-3 text-center text-base font-bold text-black uppercase tracking-wider">
                      Descargar PDF
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center bg-white divide-y divide-gray-200">
                  {reportes.map((reporte) => (
                    <tr key={reporte.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {reporte.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <a
                          href={reporte.excelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sena hover:text-primaryDark inline-flex justify-center"
                        >
                          <FaFileExcel className="text-center w-6 h-6" />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <a
                          href={reporte.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-700 inline-flex justify-center"
                        >
                          <FaFilePdf className="text-center w-6 h-6" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
