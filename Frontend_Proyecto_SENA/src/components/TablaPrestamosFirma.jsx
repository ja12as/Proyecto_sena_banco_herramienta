import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api/token";
import MUIDataTable from "mui-datatables";

const TablaPrestamosFirma = () => {
  const location = useLocation();
  const { herramientaId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHerramientas = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/prestamos/${herramientaId}`);

        const herramientasData = response.data.Herramienta;

        const prestamosFormatted = herramientasData.map(
          (herramienta, index) => {
            return {
              item: index + 1,
              nombre: herramienta.nombre,
              codigo: herramienta.codigo,
              observaciones: herramienta.PrestamoHerramienta.observaciones,
            };
          }
        );

        setData(prestamosFormatted);
      } catch (err) {
        console.error("Error fetching herramientas:", err);
      } finally {
        setLoading(false);
      }
    };

    if (herramientaId > 0) {
      fetchHerramientas();
    }
  }, [herramientaId]);

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
      label: "NOMBRE HERRAMIENTAS",
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
      name: "codigo",
      label: "CODIGO",
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
            <div>Cargando herramientas...</div>
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

export default TablaPrestamosFirma;
