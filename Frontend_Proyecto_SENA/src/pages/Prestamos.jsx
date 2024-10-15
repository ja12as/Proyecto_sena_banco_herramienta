import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; 
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import * as XLSX from "xlsx";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import EditPrestamoModal from "../components/EditPrestamoModal";
import AddPrestamoModal from "../components/AddPrestamoModal";
import "react-toastify/dist/ReactToastify.css";

const Prestamos = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true)

  const { user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = [
        {
          Codigo: "",
          Id: "",
          IdFicha: "",
          IDUsuario: "",
          IDInstructor: "",
          IDHerramienta: "",
          Cantidad: "",
          FechaPrestamo: "",
          FechaDevolucion: "",
          Estado: "",
          Observaciones: "",
        },
      ];

      setData(response);
    } catch (error) {
      console.error("Error fetching loan data:", error);
      toast.error("Error al cargar los datos de préstamos", {
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

  const handleEditClick = (rowIndex) => {
    const prestamo = data[rowIndex];
    setSelectedPrestamo(prestamo);
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = (updatedPrestamo) => {
    if (updatedPrestamo) {
      fetchData();
    }
    setIsOpenEditModal(false);
    setSelectedPrestamo(null);
  };

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModal = (newPrestamo) => {
    if (newPrestamo) {
      fetchData();
    }
    setIsOpenAddModal(false);
  };

  const columns = [
    {
      name: "Codigo",
      label: "CÓDIGO",
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
      name: "Id",
      label: "ID",
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
      name: "IdFicha",
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
      name: "IDUsuario",
      label: "USUARIO",
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
      name: "IDInstructor",
      label: "INSTRUCTOR",
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
      name: "IDHerramienta",
      label: "HERRAMIENTA",
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
      name: "Cantidad",
      label: "CANTIDAD",
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
      name: "FechaPrestamo",
      label: "FECHA DE PRÉSTAMO",
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
      name: "FechaDevolucion",
      label: "FECHA DE DEVOLUCIÓN",
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
      name: "Estado",
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
      name: "Observaciones",
      label: "OBSERVACIONES",
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
      label: "EDITAR",
      options: {
        filter: false,
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => (
          <div className="flex items-center justify-center">
            <IconButton
              onClick={() => handleEditClick(tableMeta.rowIndex)}
              color="primary"
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
          </div>
        ),
      },
    },
  ];

  const handleCustomExport = (rows) => {
    const exportData = rows.map((row) => ({
      Codigo: row.data[0],
      Id: row.data[1],
      IdFicha: row.data[2],
      IDUsuario: row.data[3],
      IDInstructor: row.data[4],
      IDHerramienta: row.data[5],
      Cantidad: row.data[6],
      FechaPrestamo: row.data[7],
      FechaDevolucion: row.data[8],
      Estado: row.data[9],
      Observaciones: row.data[10],
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

  // Función para verificar permisos
  const hasPermission = (permissionName) => {
    return user.DetallePermisos.some(
      (permiso) => permiso.Permiso.nombrePermiso === permissionName
    );
  }; 

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarToggle={sidebarToggle} />
      <div
        className={`flex flex-col flex-grow p-6 bg-gray-100 ${
          sidebarToggle ? "ml-64" : ""
        } mt-16`}
      >
        <Home
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />
        <div className="flex justify-end mt-2">
          {hasPermission("Crear Prestamo") && (
            <button className="btn-primary" onClick={handleOpenAddModal}>
              Agregar Préstamo
            </button>
          )}
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-9xl mx-auto">
            {loading ? (
              <div className="text-center">Cargando préstamos...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">PRÉSTAMOS</span>}
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
                      viewColumns: "Ver Columnas",
                      filterTable: "Filtrar Tabla",
                    },
                    filter: {
                      all: "Todos",
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
      {selectedPrestamo && (
        <EditPrestamoModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModal}
          prestamo={selectedPrestamo}
        />
      )}
      <AddPrestamoModal isOpen={isOpenAddModal} onClose={handleCloseAddModal}/>
    </div>
  );
};
export default Prestamos;