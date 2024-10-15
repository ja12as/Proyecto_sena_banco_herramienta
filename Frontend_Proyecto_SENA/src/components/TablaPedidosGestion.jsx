import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/token";
import MUIDataTable from "mui-datatables";
import "react-toastify/dist/ReactToastify.css";

const TablaPedidosGestion = ({ actualizarCantidadSalida }) => {
  const [unidades, setUnidades] = useState([]);
  const [productos, setProductos] = useState([]);
  const location = useLocation();
  const { pedidoId } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const response = await api.get(`/units`);
        setUnidades(response.data);
      } catch (err) {
        console.error("Error fetching unidades:", err);
      }
    };

    fetchUnidades();
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get(`/producto`);
        setProductos(response.data);
      } catch (err) {
        console.error("Error fetching productos:", err);
        toast.error("Error al cargar productos.");
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchProductosDelPedido = async () => {
      if (!pedidoId || unidades.length === 0) return;

      try {
        setLoading(true);
        const response = await api.get(`/pedido/${pedidoId}`);
        const productosData = response.data.Productos;

        const pedidosFormatted = productosData.map((producto, index) => {
          const unidad = unidades.find(
            (unit) => unit.id === producto.UnidadMedidaId
          );

          const productoActual = productos.find((p) => p.id === producto.id);
          const cantidadActual = productoActual
            ? productoActual.cantidadActual
            : 0;

          return {
            item: index + 1,
            nombre: producto.nombre,
            ProductoId: producto.id,
            UnidadMedidaId: unidad ? unidad.nombre : "",
            cantidadSolicitar: producto.PedidoProducto.cantidadSolicitar,
            cantidadActual,
            cantidadSalida: producto.PedidoProducto.cantidadSalida || "",
            observaciones: producto.PedidoProducto.observaciones,
          };
        });

        setData(pedidosFormatted);
      } catch (err) {
        console.error("Error fetching productos:", err);
        toast.error("Error al cargar productos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductosDelPedido();
  }, [pedidoId, unidades, productos]);

  const handleCantidadSalidaChange = (index, value, productoId) => {
    const numericValue = value === "" ? "" : parseInt(value);

    if (numericValue === "") {
      const updatedData = [...data];
      updatedData[index].cantidadSalida = "";
      setData(updatedData);
      actualizarCantidadSalida(index, productoId, "");
      return;
    }

    if (numericValue < 0) {
      toast.error("La cantidad entregada no puede ser negativa.");
      return;
    }

    const cantidadSolicitar = data[index].cantidadSolicitar;
    if (numericValue > cantidadSolicitar) {
      toast.error(
        `No puedes pedir más de ${cantidadSolicitar} para este producto.`
      );
      return;
    }

    const cantidadActual = data[index].cantidadActual;

    if (numericValue > cantidadActual) {
      toast.error(
        "No hay suficientes productos en inventario para cumplir la entrega."
      );
      return;
    }

    const updatedData = [...data];
    updatedData[index].cantidadSalida = numericValue;
    setData(updatedData);

    actualizarCantidadSalida(index, productoId, numericValue);
  };

  const columns = [
    {
      name: "item",
      label: "ITEM",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "nombre",
      label: "NOMBRE PRODUCTO",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "UnidadMedidaId",
      label: "UNIDAD DE MEDIDA",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "cantidadSolicitar",
      label: "CANTIDAD SOLICITADA",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "cantidadSalida",
      label: "CANTIDAD ENTREGADA",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const productoId = data[rowIndex].ProductoId;
          return (
            <div className="flex justify-center">
              <input
                type="number"
                value={data[rowIndex].cantidadSalida || ""}
                onChange={(e) => {
                  const cantidadSalida = parseInt(e.target.value);
                  handleCantidadSalidaChange(
                    rowIndex,
                    cantidadSalida,
                    productoId
                  );
                }}
                className="border px-2 py-1 rounded text-center"
                style={{ width: "60px" }}
              />
            </div>
          );
        },
      },
    },
    {
      name: "observaciones",
      label: "OBSERVACIONES",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
  ];

  return (
    <div>
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-9xl mx-auto">
          {loading ? (
            <div>Cargando productos...</div>
          ) : (
            <MUIDataTable
              data={data}
              columns={columns}
              options={{
                responsive: "standard",
                selectableRows: "none",
                download: false,
                print: false,
                viewColumns: false,
                filter: false,
                search: false,
                rowsPerPage: 5,
                rowsPerPageOptions: [5, 10, 15],
                setTableProps: () => {
                  return {
                    className: "custom-table",
                  };
                },
                onDownload: (buildHead, buildBody, columns, data) => {
                  handleCustomExport(data);
                  return false;
                },
                textLabels: {
                  body: {
                    noMatch: "Lo siento, no se encontraron registros",
                    toolTip: "Ordenar",
                  },
                  pagination: {
                    next: "Siguiente",
                    previous: "Anterior",
                    rowsPerPage: "Filas por página:",
                    displayRows: "de",
                  },
                  toolbar: {
                    search: "Buscar",
                    downloadCsv: "Descargar CSV",
                    print: "Imprimir",
                    viewColumns: "Mostrar Columnas",
                    filterTable: "Filtrar Tabla",
                  },
                  filter: {
                    all: "Todo",
                    title: "FILTROS",
                    reset: "REINICIAR",
                  },
                  viewColumns: {
                    title: "Mostrar Columnas",
                    titleAria: "Mostrar/Ocultar Columnas",
                  },
                  selectedRows: {
                    text: "fila(s) seleccionada(s)",
                    delete: "Eliminar",
                    deleteAria: "Eliminar filas seleccionadas",
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default TablaPedidosGestion;
