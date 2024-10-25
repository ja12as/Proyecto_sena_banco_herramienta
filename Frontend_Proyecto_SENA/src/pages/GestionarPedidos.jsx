import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../api/token";
import "react-toastify/dist/ReactToastify.css";
import fondo from "/logoSena.png";
import siga from "/Siga.png";
import * as XLSX from "xlsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FirmasDos from "./../components/FirmasDos";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import TablaPedidosGestion from "../components/TablaPedidosGestion";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GestionarPedidos = () => {
  const [sidebarToggle, setsidebarToggle] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { pedidoId } = location.state || {};
  const [pedidoData, setPedidoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productosSalida, setProductosSalida] = useState([]);
  const [dummyState, setDummyState] = useState(false);
  const [formData, setFormData] = useState({
    createdAt: "",
    servidorAsignado: "",
    codigoFicha: "",
    area: "",
    EstadoId: "",
    nombre: "",
    Documento: "",
    jefeOficina: "",
    cedulaJefeOficina: "",
    cedulaServidor: "",
    correo: "",
    codigoSena: "",
  });

  const [accordionStates, setAccordionStates] = useState({
    datos: false,
    productos: false,
    firmas: false,
  });

  const toggleAccordion = (section) => {
    setAccordionStates((prevStates) => ({
      ...prevStates,
      [section]: !prevStates[section],
    }));
  };

  const showToastError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (pedidoId) {
        try {
          const response = await api.get(`/pedido/${pedidoId}`);
          const data = response.data;

          const pedidoFormatted = {
            id: data.id,
            createdAt: data.createdAt,
            codigoFicha: data.codigoFicha,
            jefeOficina: data.jefeOficina,
            cedulaJefeOficina: data.cedulaJefeOficina,
            servidorAsignado: data.servidorAsignado,
            cedulaServidor: data.cedulaServidor,
            correo: data.correo,
            EstadoId: data.EstadoId,
            Estado: data.Estado,
            Productos: data.Productos,
          };

          setPedidoData(pedidoFormatted);

          setFormData({
            fecha: formatDateForInput(data.createdAt),
            codigoFicha: data.codigoFicha,
            area: data.area,
            jefeOficina: data.jefeOficina,
            cedulaJefeOficina: data.cedulaJefeOficina,
            servidorAsignado: data.servidorAsignado,
            cedulaServidor: data.cedulaServidor,
            correo: data.correo,
          });
        } catch (error) {
          console.error("Error fetching pedido data:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [pedidoId]);

  useEffect(() => {
    if (pedidoData) {
      setDummyState((prev) => !prev);
    }
  }, [pedidoData]);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleCantidadSalidaChange = (index, productoId, cantidadSalida, observaciones = "") => {
    const updatedProductos = [...productosSalida];
  
    const productoIndex = updatedProductos.findIndex(
      (producto) => producto.ProductoId === productoId
    );
  
    if (productoIndex >= 0) {
      if (cantidadSalida > 0) {
        updatedProductos[productoIndex].cantidadSalida = cantidadSalida;
        updatedProductos[productoIndex].observaciones = observaciones; // Actualiza las observaciones
      } else {
        updatedProductos.splice(productoIndex, 1);
      }
    } else {
      if (cantidadSalida > 0) {
        updatedProductos.push({ ProductoId: productoId, cantidadSalida, observaciones });
      }
    }
  
    setProductosSalida(updatedProductos);
  };
  
  
  const handleObservacionesChange = (index, value, productoId) => {
    const updatedData = [...data];
    updatedData[index].observaciones = value;
    setData(updatedData);
  
    // Aquí envías la nueva observación hacia el componente superior
    actualizarCantidadSalida(index, productoId, updatedData[index].cantidadSalida, value);
  };
  
  

  const handleGestionarPedido = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
  
      const response = await api.put(
        `/pedido/${pedidoId}/salida`,
        { productos: productosSalida },  // <-- Asegúrate de que los productos estén fuera del encabezado
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        // Muestra la notificación de éxito
        toast.success("Pedido gestionado correctamente", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
  
        // Espera unos segundos antes de redirigir (opcional)
        setTimeout(() => {
          navigate("/pedidos");
        }, 2000);
      } else {
        showToastError("Error al gestionar el pedido.");
      }
    } catch (error) {
      console.error("Error al gestionar el pedido:", error);
      showToastError("Error al gestionar el pedido.");
    }
  };
  
  const Navigate = () => {
    navigate("/pedidos");
  };

  const handleExportPDF = (pedidoData) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Detalle del Pedido", 14, 20);

    doc.setFontSize(12);
    doc.text(`Código de Ficha: ${pedidoData.codigoFicha}`, 14, 30);
    doc.text(`Jefe de Oficina: ${pedidoData.jefeOficina}`, 14, 40);
    doc.text(`Cédula del Jefe: ${pedidoData.cedulaJefeOficina}`, 14, 50);
    doc.text(`Servidor Asignado: ${pedidoData.servidorAsignado}`, 14, 60);
    doc.text(`Cédula del Servidor: ${pedidoData.cedulaServidor}`, 14, 70);
    doc.text(`Correo: ${pedidoData.correo}`, 14, 80);
    doc.text(`Estado: ${pedidoData.Estado.estadoName}`, 14, 90);
    doc.text(
      `Fecha de creación: ${new Date(
        pedidoData.createdAt
      ).toLocaleDateString()}`,
      14,
      100
    );

    if (pedidoData.Productos && pedidoData.Productos.length > 0) {
      const productos = pedidoData.Productos.map((producto) => [
        producto.nombre,
        producto.codigo,
        producto.descripcion,
        producto.marca,
        producto.cantidadEntrada,
        producto.PedidoProducto.cantidadSolicitar,
        producto.PedidoProducto.cantidadSalida,
        producto.cantidadActual,
        producto.VolumenTotal,
      ]);

      doc.autoTable({
        head: [
          [
            "Producto",
            "Código",
            "Descripción",
            "Marca",
            "Cantidad Entrada",
            "Cantidad Solicitada",
            "Cantidad Salida",
            "Cantidad Actual",
            "Volumen Total",
          ],
        ],
        body: productos,
        startY: 110,
      });
    } else {
      doc.text("No hay productos asociados a este pedido.", 14, 110);
    }

    doc.save(`Pedido_${pedidoData.codigoFicha}.pdf`);
  };

  const handleExportClick = () => {
    if (pedidoData && pedidoData.codigoFicha) {
      handleExportPDF(pedidoData);
    } else {
      console.error("Los datos del pedido no están disponibles");
    }
  };

  const handleExportExcel = (pedidoData) => {
    if (!pedidoData || !pedidoData.codigoFicha) {
      console.error("Los datos del pedido no están disponibles");
      return;
    }

    const pedidoHeaders = [
      "Código de Ficha",
      "Jefe de Oficina",
      "Cédula del Jefe",
      "Servidor Asignado",
      "Cédula del Servidor",
      "Correo",
      "Estado",
      "Fecha de creación",
    ];

    const pedidoValues = [
      pedidoData.codigoFicha,
      pedidoData.jefeOficina,
      pedidoData.cedulaJefeOficina,
      pedidoData.servidorAsignado,
      pedidoData.cedulaServidor,
      pedidoData.correo,
      pedidoData.Estado?.estadoName || "Desconocido",
      new Date(pedidoData.createdAt).toLocaleDateString(),
    ];

    const productoHeaders = [
      "Producto",
      "Código",
      "Descripción",
      "Marca",
      "Cantidad Entrada",
      "Cantidad Solicitada",
      "Cantidad Salida",
      "Cantidad Actual",
      "Volumen Total",
    ];

    const productos =
      pedidoData.Productos?.map((producto) => [
        producto.nombre,
        producto.codigo,
        producto.descripcion,
        producto.marca,
        producto.cantidadEntrada,
        producto.PedidoProducto.cantidadSolicitar,
        producto.PedidoProducto.cantidadSalida,
        producto.cantidadActual,
        producto.VolumenTotal,
      ]) || [];

    const finalData = [
      [...pedidoHeaders],
      [...pedidoValues],
      [],
      [...productoHeaders],
      ...productos,
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(finalData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedido");

    XLSX.writeFile(workbook, `Pedido_${pedidoData.codigoFicha}.xlsx`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarToggle={sidebarToggle} />
      <div
        className={`flex flex-col flex-grow p-4  ${
          sidebarToggle ? "ml-64" : ""
        } mt-16`}
      >
        <Home
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setsidebarToggle}
        />
        <div className="flex flex-col justify-center md:flex-row h-screen">
          <div className="hidden md:flex items-star justify-center md:w-3/4 mx-4">
            <div className="w-full mt-10">
              <div className={"px-4 py-3 w-full"}>
                <div className="flex items-center justify-between text-sm w-auto">
                  <img
                    className="w-20 h-20 object-cover ml-2"
                    src={fondo}
                    alt="logoSena"
                  />
                  <div className="flex flex-col items-center">
                    <span className="text-black font-semibold hidden md:inline">
                      SERVICIO NACIONAL DE APRENDIZAJE SENA
                    </span>
                    <span className="text-black font-semibold hidden md:inline">
                      GESTIÓN DE INFRAESTRUCTURA Y LOGÍSTICA
                    </span>
                    <span className="text-black font-semibold hidden md:inline">
                      FORMATO DE SOLICITUD DE SALIDA DE BIENES PARA EL USO DE
                      LOS
                    </span>
                    <span className="text-black font-semibold hidden md:inline">
                      CUENTADANTES QUE TIENEN VÍNCULO CON LA ENTIDAD
                    </span>
                  </div>
                  <img
                    className="flex justify-end w-auto h-14 object-cover ml-2"
                    src={siga}
                    alt="siga"
                  />
                  <div className="flex flex-col">
                    <span className="text-black font-semibold hidden md:inline">
                      SBHNo.:
                    </span>
                    <span className="text-black font-semibold hidden md:inline">
                      Versión: 04
                    </span>
                    <span className="text-black font-semibold hidden md:inline">
                      Código: GIL-F-014
                    </span>
                  </div>
                </div>

                {/* DATOS FIJOS */}
                <div className={"px-2 py-2 w-full mt-6"}>
                  <div className="flex flex-col space-y-4 md:space-y-0 text-xs w-full">
                    <div className="w-full font-inter text-left">
                      <div className="space-y-1">
                        <div className="flex flex-col md:flex-row justify-between gap-x-4">
                          <div className="flex flex-row">
                            <label className="mb-1 font-bold text-xs mt-2">
                              Código Regional
                            </label>
                            <input
                              className="border-b border-black text-xs text-black w-6 px-2 h-8"
                              type="text"
                              name="name"
                              value="5"
                              readOnly
                            />
                          </div>

                          <div className="flex flex-row">
                            <label className="mb-1 font-bold text-xs mt-2">
                              Nombre Regional
                            </label>
                            <input
                              className="border-b border-black text-xs text-center text-black w-20 px-2 h-8"
                              type="text"
                              name="name"
                              value="Antioquia"
                              readOnly
                            />
                          </div>
                          <div className="flex flex-row">
                            <label className="mb-1 font-bold text-xs mt-2">
                              Código Centro de Costos
                            </label>
                            <input
                              className="border-b border-black text-xs text-center text-black w-20 px-2 h-8"
                              type="text"
                              name="name"
                              value="920510"
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between gap-x-4">
                          <div className="flex flex-row w-4/5">
                            <label className="mb-1 font-bold text-xs mt-2">
                              Nombre Centro de Costos
                            </label>
                            <input
                              className="border-b border-black text-xs text-center text-black w-80 px-2 h-8"
                              type="text"
                              name="name"
                              value="Centro Tecnólogico del Mobiliario"
                              readOnly
                            />
                          </div>
                          <div className="flex flex-row min-w-[200px] w-full md:w-1/3">
                            <label className="mb-1 font-bold text-xs mt-2">
                              Fecha de Solicitud*
                            </label>
                            <input
                              className="border-b border-black text-xs px-2 h-8"
                              type="date"
                              name="fecha"
                              value={formData.fecha || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DATOS */}
                <div className="flex flex-col rounded-lg w-full bg-white px-8 mx-auto border-2 border-black mt-4 mb-4">
                  <button
                    onClick={() => toggleAccordion("datos")}
                    className="font-bold text-lg py-2 flex justify-between items-center w-full"
                  >
                    <span>Datos</span>
                    <ExpandMoreIcon className="mr-2" />
                  </button>

                  {accordionStates.datos && (
                    <div className="flex flex-col rounded-lg w-full">
                      <div className="flex flex-col md:flex-row justify-between gap-x-4">
                        <div className="flex flex-row min-w-[200px] w-full md:w-2/3">
                          <label className="mb-1 font-bold text-xs mt-2">
                            Código de grupo o ficha de caracterización*
                          </label>
                          <input
                            className=" border-b border-black text-xs text-center h-8 w-20"
                            type="text"
                            name="codigoFicha"
                            value={formData.codigoFicha}
                            readOnly
                          />
                        </div>
                        <div className="flex flex-row min-w-[200px] w-full md:w-1/3">
                          <label className="mb-1 font-bold text-xs mt-2">
                            Área*
                          </label>
                          <div className="flex flex-col">
                            <input
                              className=" border-b border-black text-xs text-center h-8 w-200"
                              type="text"
                              name="area"
                              value={formData.area}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between gap-x-4">
                        <div className="flex flex-row w-full md:w-3/4">
                          <label className="mb-1 font-bold text-xs mt-2">
                            Nombre de jefe de oficina o coordinador de área:*
                          </label>
                          <div className="flex flex-col">
                            <input
                              className=" border-b border-black text-xs text-center px-2 h-8"
                              type="text"
                              name="jefeOficina"
                              value={formData.jefeOficina}
                              readOnly
                            />
                          </div>
                        </div>

                        <label className="mb-1 font-bold text-xs mt-2">
                          Cédula*
                        </label>
                        <input
                          className=" border-b border-black text-xs text-center h-8 w-20"
                          type="text"
                          name="cedulaJefeOficina"
                          value={formData.cedulaJefeOficina}
                          readOnly
                        />
                      </div>

                      <div className="flex flex-col md:flex-row justify-between gap-x-4 mb-4">
                        <div className="flex flex-row w-full md:w-3/4">
                          <label className="mb-1 font-bold text-xs mt-2">
                            Nombre del servidor público a quien se le asignará
                            el bien*
                          </label>
                          <div className="flex flex-col">
                            <input
                              className=" border-b border-black text-xs text-center px-2 h-8"
                              type="text"
                              name="servidorAsignado"
                              value={formData.servidorAsignado}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="flex flex-row w-full md:w-1/4">
                          <label className="mb-1 font-bold text-xs mt-2">
                            Cédula*
                          </label>
                          <input
                            className=" border-b border-black text-xs text-center h-8 w-20"
                            type="text"
                            name="cedulaServidor"
                            value={formData.cedulaServidor}
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-row w-full md:w-3/4 mb-2">
                          <label className="mb-1 font-bold text-xs mt-2">
                            Correo electrónico a quien se le asignará el bien*
                          </label>
                          <div className="flex flex-col">
                            <input
                              className=" border-b border-black text-xs text-center px-2 h-8"
                              type="text"
                              name="correo"
                              value={formData.correo}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      <div></div>
                    </div>
                  )}
                </div>

                {/* PEDIDOS */}
                <div className="flex flex-col rounded-lg w-full bg-white px-8 mx-auto border-2 border-black mb-4">
                  <button
                    onClick={() => toggleAccordion("productos")}
                    className="font-bold text-lg py-2 flex justify-between items-center w-full"
                  >
                    <span>Pedidos</span>
                    <ExpandMoreIcon className="mr-2" />
                  </button>

                  {accordionStates.productos && (
                    <div className="flex flex-col rounded-lg w-full">
                      <div className="flex flex-row justify-center w-full mb-4">
                      <TablaPedidosGestion
  pedidoId={pedidoId}
  actualizarCantidadSalida={handleCantidadSalidaChange} // Para actualizar la cantidad de salida
  actualizarObservaciones={handleObservacionesChange}  // Necesitas agregar una función que maneje las observaciones
  accordionStates={accordionStates}
  toggleAccordion={toggleAccordion}
/>

                      </div>
                    </div>
                  )}
                </div>

                {/* Firmas */}
                <div className="flex flex-col rounded-lg w-full bg-white px-8 mx-auto border-2 border-black mb-4">
                  <button
                    onClick={() => toggleAccordion("firmas")}
                    className="font-bold text-lg py-2 flex justify-between items-center w-full"
                  >
                    <span>Firmas</span>
                    <ExpandMoreIcon className="mr-2" />
                  </button>

                  {accordionStates.firmas && (
                    <div className="flex flex-col rounded-lg w-full">
                      <div className="flex flex-row justify-between w-auto mb-4">
                        <FirmasDos
                          pedidoId={pedidoId}
                          accordionStates={accordionStates}
                          toggleAccordion={toggleAccordion}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones */}
                <div className="flex justify-center items-center w-2/4 mt-10 mx-auto">
                  <div>
                    <button className="btn-danger2 mx-4" onClick={Navigate}>
                      Atrás
                    </button>
                    <button
                      className="btn-primary2 mr-2"
                      onClick={handleExportClick}
                    >
                      PDF
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn-primary2 mr-2"
                      onClick={() => handleExportExcel(pedidoData)}
                      disabled={!pedidoData || !pedidoData.codigoFicha}
                    >
                      Excel
                    </button>
                  </div>

                  {pedidoData &&
                    pedidoData.EstadoId !== 7 &&
                    pedidoData.EstadoId !== 5 && (
                      <button
                        className="btn-black2"
                        onClick={handleGestionarPedido}
                      >
                        Gestionar Pedido
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default GestionarPedidos;
