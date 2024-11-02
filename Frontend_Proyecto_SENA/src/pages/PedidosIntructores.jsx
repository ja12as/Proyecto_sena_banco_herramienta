import React, { useState, useEffect} from "react";
import { api } from "../api/token";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fondo from "/logoSena.png";
import siga from "/Siga.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaGripLinesVertical } from "react-icons/fa6";
import TablaPedidos from "../components/TablaPedidos";

const PedidosIntructores = () => {
  const [coordinadores, setCoordinadores] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFicha, setSelectedFicha] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    codigoFicha: "",
    area: "",
    jefeOficina: "",
    cedulaJefeOficina: "",
    servidorAsignado: "",
    cedulaServidor: "",
    correo: "",
    productos: [
      {
        ProductoId: "",
        cantidadSolicitar: "",
        observaciones: "",
      },
    ],
  });

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/formatoHerramientas");
  };

  const handleNavigate = () => {
    navigate("/");
  };

  const [accordionStates, setAccordionStates] = useState({
    datos: false,
    productos: false,
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
    });
  };

  const handleSuggestionClick = (ficha) => {
    setFormData((prevData) => ({
      ...prevData,
      codigoFicha: ficha.NumeroFicha,
      area: ficha.Programa,
    }));
    setSelectedFicha(ficha);
    setSuggestions([]);
  };
  
  useEffect(() => {
    const fetchCoordinadores = async () => {
      try {
        const response = await api.get("/usuarios/busqueda");
        if (response.status === 200) {
          setCoordinadores(response.data);
        }
      } catch (error) {
        console.error("Error al obtener coordinadores:", error);
      }
    };
    fetchCoordinadores();
  }, []);

  const handleJefeSelection = (e) => {
    const selectedId = parseInt(e.target.value, 10); // Convertir a entero
    const selectedCoordinator = coordinadores.find(
      (coordinator) => coordinator.id === selectedId
    );
  
    setFormData({
      ...formData,
      jefeOficina: selectedId || "", // Guardar el ID del coordinador
      cedulaJefeOficina: selectedCoordinator?.Documento || "", // Guardar el documento de la cédula
    });
  };
  

  const validateInput = (name, value) => {
    let errorMessage = "";

    if (["area", "jefeOficina", "servidorAsignado"].includes(name)) {
      const nameRegex = /^[A-Za-z\s]+$/; 
      if (!nameRegex.test(value)) {
        errorMessage = "No puede contener números o caracteres especiales.";
      }
    }

    if (name === "correo") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
      if (!emailRegex.test(value)) {
        errorMessage = "Por favor, ingresa un correo electrónico válido.";
      }
    }

    return errorMessage;
  };

  const handleInputChange = async (e) => { // Añadido async aquí
    const { name, value } = e.target;
  
    // Convertir a mayúsculas si es necesario
    const upperCasedValue = ["area", "jefeOficina", "servidorAsignado"].includes(name)
      ? value.toUpperCase()
      : value;
  
    const errorMessage = validateInput(name, upperCasedValue);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: upperCasedValue,
    }));
  
    // Buscar fichas cuando se escriben al menos 3 caracteres
    if (name === "codigoFicha" && value.length >= 3) {
      try {
        const response = await api.get(`/Fichas/busqueda?query=${value}`);
        if (response.status === 200) {
          setSuggestions(response.data.slice(0, 5)); // Limita a 5 resultados
        }
      } catch (error) {
        console.error("Error al obtener fichas:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };
  

  const handleProductChange = (updatedProducts) => {
    setFormData({ ...formData, productos: updatedProducts });
  };

  const handleCreate = async () => {
    const {
      codigoFicha,
      area,
      jefeOficina,
      cedulaJefeOficina,
      servidorAsignado,
      cedulaServidor,
      correo,
      productos,
    } = formData;
  
    // Validaciones individuales de los campos
    if (!codigoFicha) {
      showToastError("El campo 'Código de Ficha' es obligatorio.");
      return;
    }
    
    if (!area) {
      showToastError("El campo 'Área' es obligatorio.");
      return;
    }
  
    if (!jefeOficina) {
      showToastError("El campo 'Jefe de Oficina' es obligatorio.");
      return;
    }
  
    if (!cedulaJefeOficina) {
      showToastError("El campo 'Cédula del Jefe de Oficina' es obligatorio.");
      return;
    }
  
    if (!servidorAsignado) {
      showToastError("El campo 'Servidor Asignado' es obligatorio.");
      return;
    }
  
    if (!cedulaServidor) {
      showToastError("El campo 'Cédula del Servidor' es obligatorio.");
      return;
    }
  
    if (!correo) {
      showToastError("El campo 'Correo' es obligatorio.");
      return;
    }
  
    // Validar que haya productos con ProductoId y cantidadSolicitar
    if (!productos || productos.length === 0) {
      showToastError("Debe agregar al menos un producto.");
      return;
    }
  
    // Validar cada producto individualmente
    for (let i = 0; i < productos.length; i++) {
      if (!productos[i].ProductoId) {
        showToastError(`El campo 'Producto' es obligatorio en la fila ${i + 1}.`);
        return;
      }
  
      if (!productos[i].cantidadSolicitar) {
        showToastError(
          `El campo 'Cantidad a Solicitar' es obligatorio en la fila ${i + 1}.`
        );
        return;
      }
    }
  
    // Si todas las validaciones pasaron, enviar los datos
    try {
      const response = await api.post("/pedido", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 201) {
        toast.success("Pedido creado con éxito.");
  
        // Limpiar el formulario después de crear el pedido
        setFormData({
          codigoFicha: "",
          area: "",
          jefeOficina: "",
          cedulaJefeOficina: "",
          servidorAsignado: "",
          cedulaServidor: "",
          correo: "",
          productos: [
            {
              ProductoId: "",
              cantidadSolicitar: "",
              observaciones: "",
            },
          ],
        });
      } else {
        const errorData = await response.json();
        showToastError(errorData.message || "Error al crear el pedido.");
      }
    } catch (error) {
      console.error("Error en la comunicación con el servidor:", error);
      showToastError("Error en la comunicación con el servidor.");
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row h-screen bg-grisClaro">
      <div className="hidden md:flex items-star justify-center md:w-2/3 bg-grisClaro mx-4">
        <div className="w-full mt-10">
          <div className="px-4 py-3 w-full">
            <div className="flex justify-between text-xs w-full">
              <img
                className="w-10 h-10 object-cover ml-4 mr-2 mt-2"
                src={fondo}
                alt="logoSena"
              />
              <div className="flex flex-col items-center text-base">
                <span className="text-black text-center text-xs font-semibold hidden md:inline">
                  SERVICIO NACIONAL DE APRENDIZAJE SENA
                </span>
                <span className="text-black text-center text-xs font-semibold hidden md:inline">
                  GESTIÓN DE INFRAESTRUCTURA Y LOGÍSTICA
                </span>
                <span className="text-black text-center text-xs font-semibold hidden md:inline">
                  FORMATO DE SOLICITUD DE SALIDA DE BIENES PARA EL USO DE LOS
                </span>
                <span className="text-black text-center text-xs font-semibold hidden md:inline">
                  CUENTADANTES QUE TIENEN VÍNCULO CON LA ENTIDAD
                </span>
              </div>
              <img
                className="flex justify-end w-auto h-10 object-cover mt-2 ml-2 mr-2"
                src={siga}
                alt="siga"
              />
              <div className="flex flex-col mt-2">
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
                          className="bg-grisClaro border-b border-black text-xs text-black w-6 px-2 h-8"
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
                          className="bg-grisClaro border-b border-black text-xs text-center text-black w-20 px-2 h-8"
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
                          className="bg-grisClaro border-b border-black text-xs text-center text-black w-20 px-2 h-8"
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
                          className="bg-grisClaro border-b border-black text-xs text-center text-black w-80 px-2 h-8"
                          type="text"
                          name="name"
                          value="Centro Tecnólogico del Mobiliario"
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
                    <div className="flex flex-row min-w-[200px] w-full md:w-2/3 relative"> {/* Añadido 'relative' aquí */}
                      <label className="mb-1 font-bold text-xs mt-2">
                        Código de grupo o ficha de caracterización*
                      </label>
                      <div className="flex items-center"> {/* Agrupamos el input y la lista de sugerencias */}
                        <input
                          className="border-b border-black text-xs text-center h-8 w-20"
                          type="text"
                          name="codigoFicha"
                          value={formData.codigoFicha}
                          onChange={handleInputChange}
                          maxLength={7}
                        />
                        {/* Lista de sugerencias */}
                        {suggestions.length > 0 && (
                          <div className="absolute top-full mt-1 left-0 bg-white border border-gray-300 max-h-40 overflow-y-auto z-10">
                            {suggestions.map((ficha) => (
                              <div
                                key={ficha.id}
                                onClick={() => handleSuggestionClick(ficha)}
                                className="flex items-center justify-between p-2 m-1 bg-green-200 border border-green-400 rounded-md cursor-pointer hover:bg-green-300"
                              >
                                <span className="text-sm font-semibold">{ficha.NumeroFicha}</span>
                                {/* Otros campos de ficha pueden ir aquí */}
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>
                    <div className="flex flex-row min-w-[200px] w-full md:w-1/3">
                      <label className="mb-1 font-bold text-xs mt-2">
                        Área*
                      </label>
                      <div className="flex flex-col">
                        <input
                          className="border-b border-black text-xs text-center h-8 w-full" // Ajustado a w-full para que use el ancho completo disponible
                          type="text"
                          name="area"
                          value={formData.area}
                          readOnly // Deshabilitado, se rellena automáticamente
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
                      <select
                        className="border-b border-black text-xs text-center px-2 h-8"
                        name="jefeOficina"
                        value={formData.jefeOficina}
                        onChange={handleJefeSelection}
                      >
                        <option value="">Seleccione una opción</option>
                        {coordinadores.map((coordinator) => (
                          <option key={coordinator.id} value={coordinator.id}>
                            {coordinator.nombre}
                          </option>
                        ))}
                      </select>

                    {formErrors.jefeOficina && (
                      <div className="text-red-400 text-xs mt-1 px-2">
                        {formErrors.jefeOficina}
                      </div>
                    )}
                      </div>
                    </div>

                    <label className="mb-1 font-bold text-xs mt-2">
                      Cédula*
                    </label>
                    <input
                      className="border-b border-black text-xs text-center h-8 w-20"
                      type="text"
                      name="cedulaJefeOficina"
                      value={formData.cedulaJefeOficina}
                      readOnly // Hace el campo de cédula solo lectura
                    />
                    {formErrors.cedulaJefeOficina && (
                      <div className="text-red-400 text-xs mt-1 px-2">
                        {formErrors.cedulaJefeOficina}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row justify-between gap-x-4">
                    <div className="flex flex-row w-full md:w-3/4">
                      <label className="mb-1 font-bold text-xs mt-2">
                        Nombre del servidor público a quien se le asignará el
                        bien*
                      </label>
                      <div className="flex flex-col">
                        <input
                          className=" border-b border-black text-xs text-center px-2 h-8"
                          type="text"
                          name="servidorAsignado"
                          value={formData.servidorAsignado}
                          onChange={handleInputChange}
                        />
                        {formErrors.servidorAsignado && (
                          <div className="text-red-400 text-xs mt-1 px-2">
                            {formErrors.instservidorAsignadoructor}
                          </div>
                        )}
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
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        maxLength={10}
                      />
                      {formErrors.cedulaServidor && (
                        <div className="text-red-400 text-xs mt-1 px-2">
                          {formErrors.cedulaServidor}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-row w-full md:w-3/4">
                      <label className="mb-1 font-bold text-xs mt-2">
                        Correo electrónico a quien se le asignará el bien*
                      </label>
                      <div className="flex flex-col">
                        <input
                          className=" border-b border-black text-xs text-center px-2 h-8"
                          type="text"
                          name="correo"
                          value={formData.correo}
                          onChange={handleInputChange}
                        />
                        {formErrors.correo && (
                          <div className="text-red-400 text-xs mt-1 px-2">
                            {formErrors.correo}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-2"></div>
                </div>
              )}
            </div>

            {/* PRODUCTOS */}
            <div className="flex flex-col rounded-lg w-full bg-white px-8 mx-auto border-2 border-black mb-4">
              <button
                onClick={() => toggleAccordion("productos")}
                className="font-bold text-lg py-2 flex justify-between items-center w-full"
              >
                <span>Productos</span>
                <ExpandMoreIcon className="mr-2" />
              </button>

              {accordionStates.productos && (
                <div className="flex flex-col rounded-lg w-full">
                  <div className="flex flex-row justify-between w-full mb-4">
                    <TablaPedidos
                      accordionStates={accordionStates}
                      handleProductChange={handleProductChange}
                      productos={formData.productos}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center items-center w-2/4 mt-10 mx-auto">
              <button
                className="btn-black2 mb-4"
                onClick={() => handleCreate("productos")}
              >
                Enviar Solicitud
              </button>
              <FaGripLinesVertical className="h-24 mx-4" />
              <div onClick={handleClick} style={{ cursor: "pointer" }}>
                <h6 className="font-semibold">FORMATO DE HERRAMIENTAS</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-negro flex justify-center items-center md:clip-path2 h-full md:h-auto">
        <div className="main w-3/4 md:w-1/2 text-center text-lg">
          <div className="letras font-inter mb-4 md:mb-8">
            <h1 className="text-white font-normal text-2xl md:text-4xl lg:text-5xl mt-2 md:mt-4">
              Bienvenido a
            </h1>
            <h1 className="text-white font-semibold text-2xl md:text-4xl lg:text-5xl mt-2 md:mt-4">
              inventario del
            </h1>
            <h1 className="text-sena font-semibold text-2xl md:text-4xl lg:text-5xl mt-2 md:mt-4">
              Mobiliario
            </h1>
          </div>

          <div className="mt-2 text-center">
            <h1 className="text-white text-xs md:text-lg -mt-2 mb-4">
              Aquí puedes acceder al formulario para solicitar el préstamo de
              herramientas y realizar pedidos de productos o si perteneces al
              almacén puedes iniciar sesión.
            </h1>
          </div>

          <div className="flex justify-center mt-4 md:mt-8">
            <button className="btn-primary" onClick={handleNavigate}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PedidosIntructores;
