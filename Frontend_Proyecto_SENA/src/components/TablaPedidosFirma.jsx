import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api/token";
import MUIDataTable from "mui-datatables";

const TablaPedidosFirma = () => {
  const [unidades, setUnidades] = useState([]);
  const location = useLocation();
  const { pedidoId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const response = await api.get("/units");
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
        setLoading(true);
        const response = await api.get(`/pedido/${pedidoId}`);

        const productosData = response.data.Productos;

        const pedidosFormatted = productosData.map((producto, index) => {
          const unidad = unidades.find(
            (unit) => unit.id === producto.UnidadMedidaId
          );
          return {
            item: index + 1,
            nombre: producto.nombre,
            UnidadMedidaId: unidad ? unidad.nombre : "",
            cantidadSolicitar: producto.PedidoProducto.cantidadSolicitar,
            observaciones: producto.PedidoProducto.observaciones,
          };
        });

        setData(pedidosFormatted);
      } catch (err) {
        console.error("Error fetching productos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (pedidoId && unidades.length > 0) {
      fetchProductos();
    }
  }, [pedidoId, unidades]);

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
      label: "CANTIDAD A SOLICITAR",
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

export default TablaPedidosFirma;
