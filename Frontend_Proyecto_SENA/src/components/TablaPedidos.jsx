import React, { useState } from "react";
import { api } from "../api/token";

const TablaPedidos = ({ accordionStates, handleProductChange, productos }) => {
  const [sugerenciasProductos, setSugerenciasProductos] = useState({});

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const upperCaseValue = value.toUpperCase(); // Convertir a mayúsculas

    const updatedProducts = [...productos];
    updatedProducts[index][name] = upperCaseValue; // Asignar el valor en mayúsculas
    handleProductChange(updatedProducts);

    if (name === "nombre") {
      buscarSugerenciasProducto(index, upperCaseValue); // Usar el valor en mayúsculas
    }
  };

  const addRow = () => {
    const newProduct = {
      ProductoId: "",
      nombre: "",
      cantidadSolicitar: "",
      observaciones: "",
    };

    const updatedProducts = [...productos, newProduct];

    handleProductChange(updatedProducts);
  };

  const removeRow = (index) => {
    const updatedProducts = productos.filter((_, i) => i !== index);

    handleProductChange(updatedProducts);
  };

  const buscarSugerenciasProducto = async (index, query) => {
    if (query.length > 2) {
      try {
        const response = await api.get(`/producto/busqueda?query=${query}`);

        if (Array.isArray(response.data)) {
          const productosConUnidad = response.data.map((producto) => ({
            ...producto,
          }));

          setSugerenciasProductos((prev) => ({
            ...prev,
            [index]: productosConUnidad,
          }));
        } else {
          setSugerenciasProductos((prev) => ({
            ...prev,
            [index]: [],
          }));
        }
      } catch (error) {
        console.error("Error al buscar :", error);
        setSugerenciasProductos((prev) => ({
          ...prev,
          [index]: [],
        }));
      }
    } else {
      setSugerenciasProductos((prev) => ({
        ...prev,
        [index]: [],
      }));
    }
  };

  const handleSelectSuggestion = (index, ProductoId, nombre) => {
    const newProductos = [...productos];
    newProductos[index].ProductoId = ProductoId;
    newProductos[index].nombre = nombre;
    handleProductChange(newProductos);

    setSugerenciasProductos((prev) => ({
      ...prev,
      [index]: [],
    }));
  };

  return (
    <div>
      {accordionStates.productos && (
        <div className="flex flex-col rounded-lg w-auto">
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-black text-xs">
              <thead>
                <tr>
                  <th className="border border-black px-2">ITEM</th>
                  <th className="border border-black px-2">
                    NOMBRE DEL PRODUCTO
                  </th>
                  <th className="border border-black px-2">
                    CANTIDAD A SOLICITAR
                  </th>
                  <th className="border border-black px-2">OBSERVACIONES</th>
                  <th className="border border-black px-2">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr key={index}>
                    <td className="border border-black px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-black px-4 py-2 relative">
                      <input
                        className="w-full px-2 py-1 rounded uppercase" // Agrega 'uppercase' aquí
                        name="nombre"
                        value={producto.nombre || ""}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                      {Array.isArray(sugerenciasProductos[index]) &&
                        sugerenciasProductos[index].length > 0 && (
                          <div
                            className="absolute bg-white border border-gray-300 max-h-40 overflow-y-auto z-10"
                            style={{ width: "100%" }}
                          >
                            {sugerenciasProductos[index].map(
                              (sugerencia, i) => (
                                <div
                                  key={i}
                                  className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                                  onClick={() =>
                                    handleSelectSuggestion(
                                      index,
                                      sugerencia.id,
                                      sugerencia.nombre
                                    )
                                  }
                                >
                                  {sugerencia.nombre} (
                                  {sugerencia.UnidadDeMedida})
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </td>
                    <td className="border border-black px-4 py-2">
                      <input
                        type="number"
                        className="w-full px-2 py-1 rounded"
                        name="cantidadSolicitar"
                        value={producto.cantidadSolicitar}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </td>
                    <td className="border border-black px-4 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded"
                        name="observaciones"
                        value={producto.observaciones}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </td>
                    <td className="border border-black px-4 py-2">
                      <button
                        className="btn-red"
                        onClick={() => removeRow(index)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-2">
            <button className="btn-black2" onClick={addRow}>
              Agregar item
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaPedidos;
