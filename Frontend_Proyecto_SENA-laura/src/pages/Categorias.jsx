import React, { useState, useEffect } from "react";
import { api } from "../api/token";
import { saveAs } from "file-saver";
import { useAuth } from "../context/AuthContext"; 
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import * as XLSX from "xlsx";
import AddCategModal from "../components/AddCategModal";
import EditCategModal from "../components/EditCategModal";

const Categorias = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const { user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/categorias", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const categoriasConEstados = response.data.map((categoria) => ({
        ...categoria,
        estadoName: categoria.Estado
          ? categoria.Estado.estadoName
          : "Desconocido",
      }));

      categoriasConEstados.sort((a, b) => a.id - b.id);
      setData(categoriasConEstados);
    } catch (error) {
      console.error("Error fetching categoria data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (rowIndex) => {
    const categoria = data[rowIndex];
    setSelectedCategoria(categoria);
    setIsOpenEditModal(true);
  };

  const handleCloseAddModalCategorias = (newCategoria) => {
    if (newCategoria) {
      fetchData();
    }
    setSelectedCategoria(null);
    setIsOpenAddModal(false);
  };

  const handleCloseEditModalCategorias = (updateCategoria) => {
    if (updateCategoria) {
      fetchData();
    }
    setSelectedCategoria(null);
    setIsOpenEditModal(false);
  };

  const columns = [
    {
      name: "id",
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
      name: "categoriaName",
      label: "CATEGORIA",
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
      name: "estadoName",
      label: "ESTADO",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => (
          <div
            className={clsx("text-center", {
              "text-green-500": value === "ACTIVO",
              "text-red-500": value === "INACTIVO",
            })}
          >
            {value}
          </div>
        ),
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
      rolName: row.data[1],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categorias");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Categorias.xlsx");
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
          {hasPermission("Crear Categoria") && (
            <button
              className="btn-primary"
              onClick={() => setIsOpenAddModal(true)}
            >
              Agregar Categoria
            </button>
          )}
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center">Cargando categorias...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">CATEGORIAS</span>} 
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
      </div>
      {selectedCategoria && (
        <EditCategModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModalCategorias}
          categoria={selectedCategoria}
        />
      )}
      <AddCategModal
        isOpen={isOpenAddModal}
        onClose={handleCloseAddModalCategorias}
      />
    </div>
  );
};

export default Categorias;
