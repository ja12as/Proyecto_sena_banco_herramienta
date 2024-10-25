import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Reportes = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [coordinador, setCoordinador] = useState("");
  const [showTable, setShowTable] = useState(false);

  const descargarExcel = async (ruta) => {
    try {
      const response = await axios.get(`http://localhost:9100${ruta}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Reporte_Excel.xlsx"); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el archivo Excel:", error);
    }
  };

  const descargarProductosPorFicha = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9100/reportes/productos-solicitados-por-ficha?formato=pdf`,
        {
          responseType: "json",
        }
      );

      const formattedData = response.data.formattedData;
      const doc = new jsPDF();

      doc.text("Productos Solicitados por Ficha", 10, 10);
      doc.text("Fecha", 10, 20);
      doc.text("Código Ficha", 60, 20);
      doc.text("Producto Nombre", 110, 20);
      doc.text("Cantidad Salida", 160, 20);

      formattedData.forEach((item, index) => {
        doc.text(item.fecha || "N/A", 10, 30 + index * 10);
        doc.text(item.codigoFicha || "N/A", 60, 30 + index * 10);
        doc.text(item.productoNombre || "N/A", 110, 30 + index * 10);
        doc.text(
          item.cantidadSalida != null ? item.cantidadSalida.toString() : "0",
          160,
          30 + index * 10
        );
      });

      doc.save("productos_solicitados_por_ficha.pdf");
    } catch (error) {
      console.error("Error al descargar el archivo PDF:", error);
    }
  };

  const descargarProductosPorInstructor = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9100/reportes/productos-solicitados-por-instructor?formato=pdf`,
        {
          responseType: "json",
        }
      );
      const formattedData = response.data.formattedData;
      const doc = new jsPDF();

      doc.text("Productos Solicitados por Instructor", 10, 10);
      doc.text("Fecha", 10, 20);
      doc.text("Instructor", 60, 20);
      doc.text("Producto Nombre", 110, 20);
      doc.text("Cantidad Solicitada", 160, 20);

      formattedData.forEach((item, index) => {
        const fechaFormateada = item.fecha
          ? new Date(item.fecha).toLocaleDateString("es-ES")
          : "N/A";

        doc.text(fechaFormateada, 10, 30 + index * 10); 
        doc.text(item.servidorAsignado || "N/A", 60, 30 + index * 10);
        doc.text(item.productoNombre || "N/A", 110, 30 + index * 10);
        doc.text(
          item.cantidadSalida != null ? item.cantidadSalida.toString() : "0",
          160,
          30 + index * 10
        ); 
      });

      doc.save("productos_solicitados_por_instructor.pdf");
    } catch (error) {
      console.error("Error al descargar el archivo PDF:", error);
    }
  };

  const descargarProductosMasSolicitados = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9100/reportes/productos-mas-solicitados?formato=pdf`,
        {
          responseType: "json",
        }
      );

      const formattedData = response.data.formattedData;
      const doc = new jsPDF();

      doc.text("Productos Más Solicitados", 10, 10);
      doc.text("Nombre Producto", 10, 20);
      doc.text("Total Solicitado", 60, 20);

      formattedData.forEach((item, index) => {
        doc.text(item.nombre || "N/A", 10, 30 + index * 10);
        doc.text(item.totalSolicitado || "N/A", 60, 30 + index * 10);
      });

      doc.save("productos_mas_solicitados.pdf");
    } catch (error) {
      console.error("Error al descargar el archivo PDF:", error);
    }
  };

  const descargarHerramientasMasSolicitadas = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9100/reportes/herramientas-mas-solicitadas?formato=pdf`,
        {
          responseType: "json",
        }
      );

      const formattedData = response.data.formattedData;
      const doc = new jsPDF();

      doc.text("Herramientas Más Solicitadas", 10, 10);
      doc.text("Nom Herramienta", 10, 20);
      doc.text("Total Solicitada", 60, 20);

      formattedData.forEach((item, index) => {
        doc.text(item.nombre || "N/A", 10, 30 + index * 10);
        doc.text(item.totalSolicitado || "N/A", 60, 30 + index * 10);
      });

      doc.save("herramientas_mas_solicitados.pdf");
    } catch (error) {
      console.error("Error al descargar el archivo PDF:", error);
    }
  };

  const descargarProductoAgotados = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9100/reportes/productos-agotados?formato=pdf`,
        { responseType: "json" }
      );

      const formattedData = response.data.formattedData;
      const doc = new jsPDF();

      doc.text("Productos Agotados", 10, 10);
      doc.text("Nombre Producto", 10, 20);
      doc.text("Cantidad Actual", 60, 20);

      formattedData.forEach((item, index) => {
        doc.text(item.nombre || "N/A", 10, 30 + index * 10);
        doc.text(String(item.cantidadActual) || "N/A", 60, 30 + index * 10);
      });

      doc.save("productos_agotados.pdf");
    } catch (error) {
      console.error("Error al descargar el archivo PDF:", error);
    }
  };

  const descargarHerramientasMalEstado = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9100/reportes/herramientas-en-mal-estado?formato=pdf`,
        {
          responseType: "json",
        }
      );

      const formattedData = response.data.formattedData;
      const doc = new jsPDF();

      doc.text("Herramientas en Mal Estado", 10, 10);
      doc.text("Nom Herramienta", 10, 20);
      doc.text("Condición", 60, 20);

      formattedData.forEach((item, index) => {
        doc.text(item.nombre || "N/A", 10, 30 + index * 10);
        doc.text(item.condicion || "N/A", 60, 30 + index * 10);
      });

      doc.save("herramientas_mas_solicitados.pdf");
    } catch (error) {
      console.error("Error al descargar el archivo PDF:", error);
    }
  };

  const descargarPedidosCoordinador = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9100/reportes/pedidos-por-coordinador?formato=pdf`,
        {
          responseType: "json",
        }
      );

      const formattedData = response.data.formattedData;
      const doc = new jsPDF();

      doc.text("Pedidos por Coordinador", 10, 10);
      doc.text("Coordinador", 10, 20);
      doc.text("Total Pedidos Aprobados", 60, 20);

      formattedData.forEach((item, index) => {
        doc.text(item.jefeOficina || "N/A", 10, 30 + index * 10);
        doc.text(item.totalPedidos || "N/A", 60, 30 + index * 10);
      });

      doc.save("pedidos_por_coordinador.pdf");
    } catch (error) {
      console.error("Error al descargar el archivo PDF:", error);
    }
  };

  const descargarProductosNuevos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9100/reportes/productos-nuevos?formato=pdf`,
        {
          responseType: "json",
        }
      );

      const formattedData = response.data.formattedData;

      if (!Array.isArray(formattedData)) {
        throw new Error("formattedData no es un array");
      }

      const doc = new jsPDF("landscape");

      doc.setFontSize(12); 

      doc.text("Productos Nuevos", 10, 10);
      doc.text("Fecha", 10, 20);
      doc.text("Nombre", 60, 20);
      doc.text("Código", 110, 20);
      doc.text("Descripción", 160, 20);
      doc.text("Cantidad Actual", 210, 20);
      doc.text("Cantidad Entrada", 260, 20);

      formattedData.forEach((item, index) => {
        const fechaFormateada = item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("es-ES") 
          : "N/A";

        doc.text(fechaFormateada, 10, 30 + index * 10); 
        doc.text(String(item.nombre || "N/A"), 60, 30 + index * 10); 
        doc.text(String(item.codigo || "N/A"), 110, 30 + index * 10); 
        doc.text(String(item.descripcion || "N/A"), 160, 30 + index * 10); 
        doc.text(String(item.cantidadActual || "N/A"), 210, 30 + index * 10); 
        doc.text(String(item.cantidadEntrada || "N/A"), 260, 30 + index * 10); 
      });

      doc.save("productos_nuevos.pdf");
    } catch (error) {
      console.error("Error al descargar el archivo PDF:", error);
    }
  };

  const reportes = [
    {
      id: 1,
      nombre: "Productos solicitados por ficha",
      rutaExcel: "/reportes/productos-solicitados-por-ficha?formato=excel",
      rutaPDF: "/reportes/productos-solicitados-por-ficha?formato=pdf",
    },
    {
      id: 2,
      nombre: "Productos solicitados por instructor",
      rutaExcel: "/reportes/productos-solicitados-por-instructor?formato=excel",
      rutaPDF: "/reportes/productos-solicitados-por-instructor?formato=pdf",
    },
    {
      id: 3,
      nombre: "Productos más solicitados",
      rutaExcel: "/reportes/productos-mas-solicitados?formato=excel",
      rutaPDF: "/reportes/productos-mas-solicitados?formato=pdf",
    },
    {
      id: 4,
      nombre: "Herramientas más solicitadas",
      rutaExcel: "/reportes/herramientas-mas-solicitadas?formato=excel",
      rutaPDF: "/reportes/herramientas-mas-solicitadas?formato=pdf",
    },
    {
      id: 5,
      nombre: "Productos agotados",
      rutaExcel: "/reportes/productos-agotados?formato=excel",
      rutaPDF: "/reportes/productos-agotados?formato=pdf",
    },
    {
      id: 6,
      nombre: "Herramientas en mal estado",
      rutaExcel: "/reportes/herramientas-en-mal-estado?formato=excel",
      rutaPDF: "/reportes/herramientas-en-mal-estado?formato=pdf",
    },
    {
      id: 7,
      nombre: "Pedidos por coordinador",
      rutaExcel: "/reportes/pedidos-por-coordinador?formato=excel",
      rutaPDF: "/reportes/pedidos-por-coordinador?formato=pdf",
    },
    {
      id: 8,
      nombre: "Productos que ingresan por primera vez",
      rutaExcel: "/reportes/productos-nuevos?formato=excel",
      rutaPDF: "/reportes/productos-nuevos?formato=pdf",
    },
  ];

  const filtrarReportes = () => {
    setShowTable(true);
  };

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
            {/* Formulario de filtros */}
            <form className="mb-6">
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
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Coordinador (opcional)
                  </label>
                  <input
                    type="text"
                    value={coordinador}
                    onChange={(e) => setCoordinador(e.target.value)}
                    placeholder="Nombre del coordinador"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                </div> */}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={filtrarReportes}
                  className="mt-4 btn-black2 text-white px-4 py-2 rounded-md"
                >
                  Filtrar Reportes
                </button>
              </div>
            </form>

            {/* Mostrar la tabla solo si se han aplicado filtros */}
            {showTable && (
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
                    {/* Fila para el primer reporte: Productos solicitados por Ficha */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Productos solicitados por Ficha
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() =>
                            descargarExcel(
                              "/reportes/productos-solicitados-por-ficha?formato=excel"
                            )
                          }
                          className="text-sena hover:text-primaryDark inline-flex justify-center"
                        >
                          <FaFileExcel className="text-center w-6 h-6" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={descargarProductosPorFicha}
                          className="text-red-500 hover:text-red-700 inline-flex justify-center"
                        >
                          <FaFilePdf className="text-center w-6 h-6" />
                        </button>
                      </td>
                    </tr>

                    {/* Fila para el segundo reporte: Productos solicitados por Instructor */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Productos solicitados por Instructor
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() =>
                            descargarExcel(
                              "/reportes/productos-solicitados-por-instructor?formato=excel"
                            )
                          }
                          className="text-sena hover:text-primaryDark inline-flex justify-center"
                        >
                          <FaFileExcel className="text-center w-6 h-6" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={descargarProductosPorInstructor}
                          className="text-red-500 hover:text-red-700 inline-flex justify-center"
                        >
                          <FaFilePdf className="text-center w-6 h-6" />
                        </button>
                      </td>
                    </tr>

                    {/* Fila para el tercer reporte: Productos más solicitados */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Productos más solicitados
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() =>
                            descargarExcel(
                              "/reportes/productos-mas-solicitados?formato=excel"
                            )
                          }
                          className="text-sena hover:text-primaryDark inline-flex justify-center"
                        >
                          <FaFileExcel className="text-center w-6 h-6" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={descargarProductosMasSolicitados}
                          className="text-red-500 hover:text-red-700 inline-flex justify-center"
                        >
                          <FaFilePdf className="text-center w-6 h-6" />
                        </button>
                      </td>
                    </tr>

                    {/* Fila para el cuarto reporte: Herramientas más solicitadas */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Herramientas más solicitadas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() =>
                            descargarExcel(
                              "/reportes/herramientas-mas-solicitadas?formato=excel"
                            )
                          }
                          className="text-sena hover:text-primaryDark inline-flex justify-center"
                        >
                          <FaFileExcel className="text-center w-6 h-6" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={descargarHerramientasMasSolicitadas}
                          className="text-red-500 hover:text-red-700 inline-flex justify-center"
                        >
                          <FaFilePdf className="text-center w-6 h-6" />
                        </button>
                      </td>
                    </tr>

                    {/* Fila para el quinto reporte: Productos agotados */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Productos agotados
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() =>
                            descargarExcel(
                              "/reportes/productos-agotados?formato=excel"
                            )
                          }
                          className="text-sena hover:text-primaryDark inline-flex justify-center"
                        >
                          <FaFileExcel className="text-center w-6 h-6" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={descargarProductoAgotados}
                          className="text-red-500 hover:text-red-700 inline-flex justify-center"
                        >
                          <FaFilePdf className="text-center w-6 h-6" />
                        </button>
                      </td>
                    </tr>

                    {/* Fila para el sexto reporte: Herramientas en mal estado */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Herramientas en mal estado
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() =>
                            descargarExcel(
                              "/reportes/herramientas-en-mal-estado?formato=excel"
                            )
                          }
                          className="text-sena hover:text-primaryDark inline-flex justify-center"
                        >
                          <FaFileExcel className="text-center w-6 h-6" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={descargarHerramientasMalEstado}
                          className="text-red-500 hover:text-red-700 inline-flex justify-center"
                        >
                          <FaFilePdf className="text-center w-6 h-6" />
                        </button>
                      </td>
                    </tr>

                    {/* Fila para el séptimo reporte: Pedidos por coordinador */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Pedidos por coordinador
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() =>
                            descargarExcel(
                              "/reportes/pedidos-por-coordinador?formato=excel"
                            )
                          }
                          className="text-sena hover:text-primaryDark inline-flex justify-center"
                        >
                          <FaFileExcel className="text-center w-6 h-6" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={descargarPedidosCoordinador}
                          className="text-red-500 hover:text-red-700 inline-flex justify-center"
                        >
                          <FaFilePdf className="text-center w-6 h-6" />
                        </button>
                      </td>
                    </tr>

                    {/* Fila para el octavo reporte: Productos que ingresan por primera vez */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Productos que ingresan por primera vez
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() =>
                            descargarExcel(
                              "/reportes/productos-nuevos?formato=excel"
                            )
                          }
                          className="text-sena hover:text-primaryDark inline-flex justify-center"
                        >
                          <FaFileExcel className="text-center w-6 h-6" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={descargarProductosNuevos}
                          className="text-red-500 hover:text-red-700 inline-flex justify-center"
                        >
                          <FaFilePdf className="text-center w-6 h-6" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
