import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import Sidebar from "../components/Sidebar";
import SidebarCoord from "../components/SidebarCoord";
import Home from "../components/Home";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../api/token";

const Historial = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [sidebarToggleCoord, setSidebarToggleCoord] = useState(false); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(""); 


  const fetchUserRole = async () => {
    try {
      const response = await api.get("/perfil"); 
      const { perfil } = response.data; 
      const { RolId } = perfil; 
  
      if (RolId === 3) {
        setUserRole("COORDINADOR");
      } else {
        setUserRole("OTRO_ROL"); 
      }
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
      toast.error("Error al obtener el rol del usuario", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/historial"); 
      setData(response.data);
    } catch (error) {
      console.error("Error fetching historial data:", error);
      toast.error("Error al cargar los datos del historial", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserRole(); 
    fetchData(); 
  }, []);


  const columns = [
    {
      name: "tipoAccion",
      label: "TIPO DE EVENTO",
      options: {
        customBodyRender: (value) => <div className="text-center">{value}</div>,
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
      },
    },
    {
      name: "Usuario",
      label: "USUARIO",
      options: {
        customBodyRender: (value) => (
          <div className="text-center">{value?.nombre ? value.nombre : "N/A"}</div>
        ),
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
      },
    },    
    {
      name: "createdAt",
      label: "FECHA",
      options: {
        customBodyRender: (value) => <div className="text-center">{new Date(value).toLocaleString()}</div>,
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
      },
    },
    {
      name: "descripcion",
      label: "DESCRIPCIÓN",
      options: {
        customBodyRender: (value) => <div className="text-center">{value}</div>,
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
        setCellProps: () => ({
          className: "custom-table-cell",
          style: { padding: "12px", fontSize: "14px" },
        }),
      },
    },
  ];
  
  return (
    <div className="flex min-h-screen">
      {userRole === "COORDINADOR" ? (
        <SidebarCoord sidebarToggleCoord={sidebarToggleCoord} />
      ) : (
        <Sidebar sidebarToggle={sidebarToggle} />
      )}

      <div
        className={`flex flex-col flex-grow p-6 bg-gray-100 ${
          userRole === "COORDINADOR"
            ? sidebarToggleCoord
              ? "ml-64"
              : ""
            : sidebarToggle
            ? "ml-64"
            : ""
        } mt-16`}
      >
        <Home
          sidebarToggle={userRole === "COORDINADOR" ? sidebarToggleCoord : sidebarToggle}
          setSidebarToggle={userRole === "COORDINADOR" ? setSidebarToggleCoord : setSidebarToggle}
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
                  responsive: "standard",
                  selectableRows: "none",
                  download: true,
                  print: true,
                  viewColumns: true,
                  filter: true,
                  search: true,
                  rowsPerPage: 5,
                  rowsPerPageOptions: [5, 10, 15],
                  setTableProps: () => ({
                    className: "custom-tables",
                  }),
                  textLabels: {
                    body: {
                      noMatch: "No se encontraron registros",
                      toolTip: "Ordenar",
                    },
                    pagination: {
                      next: "Siguiente Página",
                      previous: "Página Anterior",
                      rowsPerPage: "Filas por página:",
                      displayRows: "de",
                    },
                    toolbar: {
                      search: "Buscar",
                      downloadCsv: "Descargar CSV",
                      print: "Imprimir",
                      viewColumns: "Ver Columnas",
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
                      delete: "Borrar",
                      deleteAria: "Borrar filas seleccionadas",
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
