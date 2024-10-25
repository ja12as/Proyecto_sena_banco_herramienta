import React, { useState } from "react";
import Navbardark from "../components/Navbardark";
import fondo from "/logoSena.png";
import siga from "/Siga.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Formularios = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: "",
    Documento: "",
    item: "",
    codigoSena: "",
  });

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "nombre") {
      const nameRegex = /^[A-Za-z\s-_\u00C0-\u017F]+$/;
      if (!nameRegex.test(value) || /\d/.test(value)) {
        errorMessage = "No puede contener caracteres especiales.";
      }
    }
    return errorMessage;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateInput(name, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-screen bg-fondo">
      <Navbardark />
      <div
        className={`flex flex-col flex-grow w-full p-6 bg-fondo ${
          sidebarToggle ? "ml-64" : ""
        } mt-16`}
      >
        <div className="flex-grow">
          <div className=" mx-auto">
            <div className={"bg-white px-4 py-3 w-full border-2 border-black"}>
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
                    FORMATO DE SOLICITUD DE SALIDA DE BIENES PARA EL USO DE LOS
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
            </div>

            <div
              className={"bg-white px-4 py-3 w-full border-2 border-black mt-2"}
            >
              <div className="flex flex-col space-y-4 md:space-y-0 text-sm w-full">
                <div className="w-full font-inter text-left">
                  <div className="space-y-2">
                    <div className="flex flex-col md:flex-row justify-between gap-x-4">
                      <div className="flex flex-row min-w-[200px] w-full md:w-1/3">
                        <label className="mb-1 font-bold text-sm mt-2">
                          Fecha de Solicitud*
                        </label>
                        <input
                          className=" border-b border-black text-sm px-2 h-8"
                          type="date"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="flex flex-row min-w-[200px] w-full md:w-1/3">
                        <label className="mb-1 font-bold text-sm mt-2">
                          Área*
                        </label>
                        <input
                          className=" border-b border-black text-sm px-2 h-8"
                          type="text"
                          name="Documento"
                          value={formData.Documento}
                          onChange={handleInputChange}
                          onKeyPress={(e) => {
                            if (/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {formErrors.name && (
                          <div className="text-red-400 text-sm mt-1 px-2">
                            {formErrors.name}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-row min-w-[200px]  w-full md:w-2/3">
                        <label className="mb-1 font-bold text-sm mt-2">
                          Código de grupo o ficha de caracterización*
                        </label>
                        <input
                          className=" border-b border-black text-sm px-2 h-8"
                          type="text"
                          name="Documento"
                          value=""
                          onChange={handleInputChange}
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          maxLength={6}
                        />
                        {formErrors.Documento && (
                          <div className="text-red-400 text-sm mt-1 px-2">
                            {formErrors.Documento}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-x-4">
                      <div className="flex flex-row">
                        <label className="mb-1 font-bold text-sm mt-2">
                          Código Regional
                        </label>
                        <input
                          className="border-b border-black text-sm text-center text-noEdit w-10 px-2 h-8"
                          type="text"
                          name="name"
                          value="5"
                          readOnly
                        />
                      </div>

                      <div className="flex flex-row">
                        <label className="mb-1 font-bold text-sm mt-2">
                          Nombre Regional
                        </label>
                        <input
                          className=" border-b border-black text-sm text-center text-noEdit w-20 px-2 h-8"
                          type="text"
                          name="name"
                          value="Antioquia"
                          readOnly
                        />
                      </div>
                      <div className="flex flex-row">
                        <label className="mb-1 font-bold text-sm mt-2">
                          Código Centro de Costos
                        </label>
                        <input
                          className=" border-b border-black text-sm text-center text-noEdit w-20 px-2 h-8"
                          type="text"
                          name="name"
                          value="920510"
                          readOnly
                        />
                      </div>

                      <div className="flex flex-row w-2/4">
                        <label className="mb-1 font-bold text-sm mt-2">
                          Nombre Centro de Costos
                        </label>
                        <input
                          className="border-b border-black text-sm text-center text-noEdit w-64 px-2 h-8"
                          type="text"
                          name="name"
                          value="Centro Tecnólogico del Mobiliario"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-x-4">
                      <div className="flex flex-row w-full md:w-3/4">
                        <label className="mb-1 font-bold text-sm mt-2">
                          Nombre de jefe de oficina o coordinador de área:*
                        </label>
                        <input
                          className=" border-b border-black text-sm px-2 h-8"
                          type="text"
                          name="name"
                          value=""
                          onChange={handleInputChange}
                        />
                        {formErrors.name && (
                          <div className="text-red-400 text-sm mt-1 px-2">
                            {formErrors.name}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row min-w-[200px] w-full md:w-1/2">
                        <label className="mb-1 font-bold text-sm mt-2">
                          Cédula*
                        </label>
                        <input
                          className=" border-b border-black text-sm px-2 h-8"
                          type="text"
                          name="Documento"
                          value=""
                          onChange={handleInputChange}
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          maxLength={10}
                        />
                        {formErrors.Documento && (
                          <div className="text-red-400 text-sm mt-1 px-2">
                            {formErrors.Documento}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-x-4">
                      <div className="flex flex-row w-full md:w-3/4">
                        <label className="mb-1 font-bold text-sm mt-2">
                          Nombre del servidor público a quien se le asignará el
                          bien*
                        </label>
                        <input
                          className=" border-b border-black text-sm px-2 h-8"
                          type="text"
                          name="name"
                          value=""
                          onChange={handleInputChange}
                        />
                        {formErrors.name && (
                          <div className="text-red-400 text-sm mt-1 px-2">
                            {formErrors.name}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row w-full md:w-1/4">
                        <label className="mb-1 font-bold text-sm mt-2">
                          Cédula*
                        </label>
                        <input
                          className=" border-b border-black text-sm px-2 h-8"
                          type="text"
                          name="Documento"
                          value=""
                          onChange={handleInputChange}
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          maxLength={10}
                        />
                        {formErrors.Documento && (
                          <div className="text-red-400 text-sm mt-1 px-2">
                            {formErrors.Documento}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button className="btn-primary2 mb-2">Agregar Item</button>
            </div>

            <div className="flex flex-col rounded-lg w-3/4 bg-white shadow-lg px-8 py-3 mx-auto">
              <button
                onClick={toggleAccordion}
                className="font-bold text-lg py-2 flex justify-between items-center w-full"
              >
                <span>Item 1</span>
                <ExpandMoreIcon className="mr-2" />
              </button>

              {isAccordionOpen && (
                <div className="flex flex-col rounded-lg w-full px-4 py-3">
                  <div className="flex flex-row justify-between w-full mb-4">
                    <div className="flex flex-col justify-end text-center w-10 mr-4">
                      <label className="mb-1 font-bold text-sm mt-2">
                        Item
                      </label>
                      <input
                        className="bg-grisClaro text-sm text-noEdit rounded-lg px-2 h-8"
                        type="text"
                        name="item"
                        value={formData.item}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        maxLength={10}
                      />
                    </div>

                    <div className="flex flex-col justify-center text-center w-20 mr-4">
                      <label className="mb-1 font-bold text-sm mt-2">
                        Código Sena
                      </label>
                      <input
                        className="bg-grisClaro text-sm text-noEdit rounded-lg px-2 h-8"
                        type="text"
                        name="codigoSena"
                        value={formData.codigoSena}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        maxLength={10}
                      />
                    </div>

                    <div className="flex flex-col justify-end text-center w-48 mr-4">
                      <label className="mb-1 font-bold text-sm mt-2">
                        Descripción de bien
                      </label>
                      <input
                        className="bg-grisClaro text-sm text-noEdit rounded-lg px-2 h-8"
                        type="text"
                        name="descripcionBien"
                        value={formData.descripcionBien}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        maxLength={10}
                      />
                    </div>

                    <div className="flex flex-col justify-center text-center w-20 mr-4">
                      <label className="mb-1 font-bold text-sm mt-2">
                        Unidad de medida
                      </label>
                      <input
                        className="bg-grisClaro text-sm text-noEdit rounded-lg px-2 h-8"
                        type="text"
                        name="unidadMedida"
                        value={formData.unidadMedida}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        maxLength={10}
                      />
                    </div>

                    <div className="flex flex-col justify-center text-center w-10 mr-4">
                      <label className="mb-1 font-bold text-sm mt-2">
                        Cantidad solicitada
                      </label>
                      <input
                        className="bg-grisClaro text-sm text-noEdit rounded-lg px-2 h-8"
                        type="text"
                        name="cantidadSolicitada"
                        value={formData.cantidadSolicitada}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        maxLength={10}
                      />
                    </div>

                    <div className="flex flex-col justify-center text-center w-10">
                      <label className="mb-1 font-bold text-sm mt-2">
                        Cantidad entregada
                      </label>
                      <input
                        className="bg-grisClaro text-sm text-noEdit rounded-lg px-2 h-8"
                        type="text"
                        name="cantidadEntregada"
                        value={formData.cantidadEntregada}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="mb-1 font-bold text-sm mt-2">
                      Observaciones
                    </label>
                    <input
                      className="bg-grisClaro text-sm text-noEdit rounded-lg px-2 h-8"
                      type="text"
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={10}
                    />
                  </div>
                  <div className="sm:w-full md:w-full flex flex-col justify-end">
                    <div className="flex justify-end mt-4 mb-4 mx-2">
                      <button className="btn-danger2 mx-2">Limpiar</button>
                      <button className="btn-primary2 mx-2">Agregar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sm:w-full md:w-full flex flex-col justify-end">
              <div className="flex justify-center mt-4 mb-4 mx-2">
                <button className="btn-danger2 mx-2">Cancelar</button>
                <button className="btn-primary2 mx-2">Agregar Pedido</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formularios;
