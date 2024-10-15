import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Historial = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = [
        {
          id: 1,
          tipo: "Agregó usuario",
          usuario: "Valentina Admin",
          fecha: "2021-09-01",
          descripcion: "Se añadió un nuevo usuario al sistema."
        },
        {
          id: 2,
          tipo: "Editó producto",
          usuario: "Valentina Admin",
          fecha: "2022-04-01",
          descripcion: "Se actualizó la información del producto ID 123."
        },
        {
          id: 3,
          tipo: "Eliminó registro",
          usuario: "Carlos Usuario",
          fecha: "2023-05-12",
          descripcion: "Se eliminó el registro de usuario ID 456."
        },
        {
          id: 4,
          tipo: "Actualizó información",
          usuario: "Ana Superuser",
          fecha: "2023-11-23",
          descripcion: "Se actualizó la información de producto ID 789."
        },
      ];
      setData(response);
    } catch (error) {
      console.error("Error fetching historial data:", error);
      toast.error("Error al cargar los datos del historial", {
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
      name: "tipo",
      label: "TIPO DE EVENTO",
      options: {
        customBodyRender: (value) => <div className="text-center">{value}</div>,
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
      },
    },
    {
      name: "usuario",
      label: "USUARIO",
      options: {
        customBodyRender: (value) => <div className="text-center">{value}</div>,
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
      },
    },
    {
      name: "fecha",
      label: "FECHA",
      options: {
        customBodyRender: (value) => <div className="text-center">{value}</div>,
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
      },
    },
    {
      name: "descripcion",
      label: "DESCRIPCIÓN",
      options: {
        customBodyRender: (value) => (
          <div className="text-center">{value}</div>
        ),
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        setCellProps: () => ({
          className: "custom-table-cell",
          style: { padding: '12px', fontSize: '14px' },
        }),
      },
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarToggle={sidebarToggle} />
      <div
        className={`flex flex-col flex-grow p-6 bg-gray-100 ${sidebarToggle ? 'ml-64' : ''} mt-16`}
      >
        <Home
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />
        <div className="flex justify-start mt-2">
          <button className="btn-primary" onClick={() => window.history.back()}>
            Volver Atrás
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="w-auto">
            {loading ? (
              <div className="text-center">Cargando historial...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">HISTORIAL</span>}
                data={data}
                columns={columns}
                options={{
                  responsive: 'standard',
                  selectableRows: 'none',
                  download: true,
                  print: true,
                  viewColumns: true,
                  filter: true,
                  search: true,
                  rowsPerPage: 5,
                  rowsPerPageOptions: [5, 10, 15],
                  setTableProps: () => ({
                    className: 'custom-tables',
                  }),
                  textLabels: {
                    body: {
                      noMatch: 'No se encontraron registros',
                      toolTip: 'Ordenar',
                    },
                    pagination: {
                      next: 'Siguiente Página',
                      previous: 'Página Anterior',
                      rowsPerPage: 'Filas por página:',
                      displayRows: 'de',
                    },
                    toolbar: {
                      search: 'Buscar',
                      downloadCsv: 'Descargar CSV',
                      print: 'Imprimir',
                      viewColumns: 'Ver Columnas',
                      filterTable: 'Filtrar Tabla',
                    },
                    filter: {
                      all: 'Todo',
                      title: 'FILTROS',
                      reset: 'REINICIAR',
                    },
                    viewColumns: {
                      title: 'Mostrar Columnas',
                      titleAria: 'Mostrar/Ocultar Columnas',
                    },
                    selectedRows: {
                      text: 'fila(s) seleccionada(s)',
                      delete: 'Borrar',
                      deleteAria: 'Borrar filas seleccionadas',
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historial;
