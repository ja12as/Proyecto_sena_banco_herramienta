import React, { useState } from "react";
import { api } from "../api/token";
import { toast } from "react-toastify"; // Importar toast


const TablaHerramientas = ({ accordionStates, handleHerramientaChange, herramientas }) => {
  const [sugerenciasherramientas, setSugerenciasherramientas] = useState({});

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedHerramienta = [...herramientas];
    updatedHerramienta[index][name] = value; // Actualizar el producto específico
    handleHerramientaChange(updatedHerramienta); // Pasar los herramientas actualizados al padre

    if (name === "nombre") {
      buscarSugerenciasHerramienta(index, value);
    }
  };

  const addRow = () => {
    const newHerramienta = {
      HerramientumId: "",
      nombre: "",
      codigo: "", // Agregar campo 'codigo'
      observaciones: "",
    };

    const updatedHerramienta = [...herramientas, newHerramienta];
    handleHerramientaChange(updatedHerramienta);
  };

  const removeRow = (index) => {
    const updatedHerramienta = herramientas.filter((_, i) => i !== index);
    handleHerramientaChange(updatedHerramienta);
  };

  const buscarSugerenciasHerramienta = async (index, query) => {
    if (query.length > 2) {
      try {
        const response = await api.get(`/herramienta/busqueda?query=${query}`);
  
        if (Array.isArray(response.data)) {
          const herramientasConUnidad = response.data.map((producto) => ({
            ...producto,
          }));
  
          // Verificar si hay alguna herramienta en uso (EstadoId: 4)
          const herramientaEnUso = herramientasConUnidad.find((herramienta) => herramienta.EstadoId === 4);
          if (herramientaEnUso) {
            // Mostrar un error y no añadir la herramienta en estado 4 a las sugerencias
            showToastError(`La herramienta ${herramientaEnUso.nombre} no se encuentra disponible porque está prestada.`);
          } else {
            // Si no hay herramientas en uso, actualizar las sugerencias
            setSugerenciasherramientas((prev) => ({
              ...prev,
              [index]: herramientasConUnidad,
            }));
          }
        } else {
          setSugerenciasherramientas((prev) => ({
            ...prev,
            [index]: [],
          }));
        }
      } catch (error) {
        console.error("Error al buscar herramientas:", error);
        showToastError("Error al obtener las herramientas.");
        setSugerenciasherramientas((prev) => ({
          ...prev,
          [index]: [],
        }));
      }
    } else {
      setSugerenciasherramientas((prev) => ({
        ...prev,
        [index]: [],
      }));
    }
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


  const handleSelectSuggestion = (index, HerramientumId, nombre, codigo) => { // Añadir 'codigo'
    const newherramientas = [...herramientas];
    newherramientas[index].HerramientumId = HerramientumId;  
    newherramientas[index].nombre = nombre; 
    newherramientas[index].codigo = codigo; // Asignar el 'codigo' de la herramienta seleccionada
    handleHerramientaChange(newherramientas);
  
    setSugerenciasherramientas((prev) => ({
      ...prev,
      [index]: [],
    }));
  };

  return (
    <div>
      {accordionStates.herramientas && (
        <div className="flex flex-col rounded-lg w-auto">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-black text-xs">
              <thead>
                <tr>
                  <th className="border border-black px-2">ITEM</th>
                  <th className="border border-black px-2">NOMBRE DE LAS HERRAMIENTAS</th>
                  <th className="border border-black px-2">CÓDIGO</th>
                  <th className="border border-black px-2">OBSERVACIONES</th>
                  <th className="border border-black px-2">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {herramientas.map((herramienta, index) => (
                  <tr key={index}>
                    <td className="border border-black px-4 py-2">{index + 1}</td>
                    <td className="border border-black px-4 py-2 relative">
                      <input
                        className="w-full px-2 py-1 rounded"
                        name="nombre"
                        value={herramienta.nombre || ""}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                      {Array.isArray(sugerenciasherramientas[index]) && sugerenciasherramientas[index].length > 0 && (
                        <div className="absolute bg-white border border-gray-300 max-h-40  max-h-40 overflow-y-auto z-10">
                          {sugerenciasherramientas[index].map((sugerencia, i) => (
                            <div
                              key={i}
                              className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                              onClick={() => handleSelectSuggestion(index, sugerencia.id, sugerencia.nombre, sugerencia.codigo)} // Agregar 'codigo'
                            >
                              {sugerencia.nombre}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Campo código deshabilitado */}
                    <td className="border border-black px-4 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded"
                        name="codigo"
                        value={herramienta.codigo || ""}
                        disabled
                      />
                    </td>

                    <td className="border border-black px-4 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded"
                        name="observaciones"
                        value={herramienta.observaciones}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </td>
                    <td className="border border-black px-4 py-2">
                      <button className="btn-red" onClick={() => removeRow(index)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-4">
            <button className="btn-black2" onClick={addRow}>
              Agregar item
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaHerramientas;
