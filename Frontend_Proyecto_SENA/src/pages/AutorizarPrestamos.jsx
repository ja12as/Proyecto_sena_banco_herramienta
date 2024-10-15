import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import MUIDataTable from "mui-datatables";
import IconButton from "@mui/material/IconButton";
import Home from "../components/Home";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";
import SidebarCoord from "../components/SidebarCoord";
import VisibilityIcon from '@mui/icons-material/Visibility';

const AutorizarPrestamos = () => {
    const [sidebarToggleCoord, setsidebarToggleCoord] = useState(false);
    const [selectedPrestamo, setSelectedPrestamo] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState([
      {
        Código: "",
        Nombre: "",
        Fecha_de_Ingreso: "",
        Marca: "",
        Condición: "",
        Descripción: "",
      },
    ]);
    
    const handleViewClick = (rowIndex) => {
    //   const Prestamo = data[rowIndex];
    //   setSelectedPrestamo(Prestamo);
    //   setIsOpenEditModal(true);
    navigate("/FirmaPrestamos");
    };
  
    const columns = [
      {
        name: "Código",
        label: "FECHA",
        options: {
          customHeadRender: (columnMeta) => (
            <th 
              key={columnMeta.label}
              className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
            </th>
          ),
          customBodyRender: (value) => <div className="text-center">{value}</div>,
        },
      },
      {
        name: "Nombre",
        label: "NOMBRE SOLICITANTE",
        options: {
          customHeadRender: (columnMeta) => (
            <th 
              key={columnMeta.label}
              className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
            </th>
          ),
          customBodyRender: (value) => <div className="text-center">{value}</div>,
        },
      },
      {
        name: "Fecha_de_Ingreso",
        label: "FICHA",
        options: {
          customHeadRender: (columnMeta) => (
            <th 
              key={columnMeta.label}
              className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
            </th>
          ),
          customBodyRender: (value) => <div className="text-center">{value}</div>,
        },
      },
      {
        name: "Marca",
        label: "ÁREA",
        options: {
          customHeadRender: (columnMeta) => (
            <th 
              key={columnMeta.label}
              className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
            </th>
          ),
          customBodyRender: (value) => <div className="text-center">{value}</div>,
        },
      },
      {
        name: "Condición",
        label: "ESTADO",
        options: {
          customHeadRender: (columnMeta) => (
            <th 
              key={columnMeta.label}
              className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
            </th>
          ),
          customBodyRender: (value) => <div className="text-center">{value}</div>,
        },
      },
      {
        name: "edit",
        label: "VER DETALLE",
        options: {
          customHeadRender: (columnMeta) => (
            <th 
              key={columnMeta.label}
              className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
            </th>
          ),
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div className="flex items-center justify-center">
              <IconButton
                onClick={() => handleViewClick(tableMeta.rowIndex)}
                color="primary"
                aria-label="view" 
              >
                <VisibilityIcon /> 
              </IconButton>
            </div>
          ),
        },
      },      
    ];
  
    const handleCustomExport = (rows) => {
      const exportData = rows.map((row) => ({
        Código: row.data[0],
        Nombre: row.data[1],
        "Fecha de Ingreso": row.data[2],
        Marca: row.data[3],
        Condición: row.data[4],
        Descripción: row.data[5],
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Prestamos");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(data, "Prestamos.xlsx");
    };
  

  return (
    <div className="flex min-h-screen bg-fondo">
      <SidebarCoord sidebarToggleCoord={sidebarToggleCoord} />
      <div
        className={`flex flex-col flex-grow p-4 bg-fondo ${
          sidebarToggleCoord ? "ml-64" : ""
        } mt-16`}
      >
        <Home
          sidebarToggle={sidebarToggleCoord}
          setSidebarToggle={setsidebarToggleCoord}
        />

        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center">Cargando Prestamos...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">Préstamos de Prestamos</span>}
                data={data}
                columns={columns}
                options={{
                  responsive: "standard",
                  selectableRows: "none",
                  download: true,
                  rowsPerPage: 5,
                  rowsPerPageOptions: [5, 10, 15],
                  setTableProps: () => {
                    return {
                      className: "custom-tables",
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
                      rowsPerPage: "Filas por página",
                      displayRows: "de",
                    },
                    toolbar: {
                      search: "Buscar",
                      downloadCsv: "Descargar CSV",
                      print: "Imprimir",
                      viewColumns: "Mostrar columnas",
                      filterTable: "Filtrar tabla",
                    },
                    filter: {
                      all: "Todos",
                      title: "FILTROS",
                      reset: "REINICIAR",
                    },
                    viewColumns: {
                      title: "Mostrar columnas",
                      titleAria: "Mostrar/Ocultar Columnas",
                    },
                    selectedRows: {
                      text: "fila(s) seleccionada(s)",
                      delete: "Eliminar",
                      deleteAria: "Eliminar fila seleccionada",
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
        <div
          className="flex-grow flex items-center justify-center text-center text-sm text-black 
             border-black rounded-lg border-2 bg-orange-200 font-bold w-1/2 mx-auto mt-4 mb-4"
        >
          <p>
            NOTA: Los pedidos que no se firmen, es decir, que permanezcan en
            estado PENDIENTE. Tienen 3 días hábiles desde la fecha de creación
            para que cambien de estado a EN PROCESO, de lo contrario serán
            descartados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AutorizarPrestamos
