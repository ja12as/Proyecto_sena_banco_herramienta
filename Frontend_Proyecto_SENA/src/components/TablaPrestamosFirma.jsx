import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TablaPrestamosFirma = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
  
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = [
          {
            FechaPedido: "",
            CantidadEntregada: "",
            IDUsuario: "",
            IDFicha: "",
            Id: "",
            CantidadSolicitada: "",
            Codigo: "",
            IDProducto: "",
            IDInstructor: "",
          },
        ];
  
        setData(response);
      } catch (error) {
        console.error("Error fetching loan data:", error);
        toast.error("Error al cargar los datos de pedidos", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      setLoading(false);
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const columns = [
      {
        name: "FechaPedido",
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
        name: "CantidadEntregada",
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
        name: "IDUsuario",
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
        name: "Id",
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
          </div>
        </div>
      </div>
    );
  };

export default TablaPrestamosFirma
