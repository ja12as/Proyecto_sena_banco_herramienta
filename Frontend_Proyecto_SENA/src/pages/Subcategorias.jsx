import React, { useState, useEffect } from "react";
import { api } from "../api/token";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; 
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";
import AddSubcategoriaModal from "../components/AddSubcategoriaModal";
import EditSubcategoriaModal from "../components/EditSubcategoriaModal";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Subcategorias = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/subcategoria", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const subcategoriaConCategoriayEstado = response.data.map((subca) => ({
        ...subca,
        categoriaName: subca.Categorium
          ? subca.Categorium.categoriaName
          : "Desconocido",
        estadoName: subca.Estado ? subca.Estado.estadoName : "Desconocido",
      }));

      subcategoriaConCategoriayEstado.sort((a, b) => a.id - b.id);
      setData(subcategoriaConCategoriayEstado);
    } catch (error) {
      console.error("Error fetching subcategoria data:", error);
      toast.error("Error al cargar los datos de la  subcategoria", {
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
    const subcategoria = data[rowIndex];
    setSelectedSubcategoria(subcategoria);
    setIsOpenEditModal(true);
  };

  const handleCloseAddModal = (newSubcategoria) => {
    if (newSubcategoria) {
      fetchData();
    }
    setSelectedSubcategoria(null);
    setIsOpenAddModal(false);
  };

  const handleCloseEditModal = (updatedSubcategoria) => {
    if (updatedSubcategoria) {
      fetchData();
    }
    setSelectedSubcategoria(null);
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
      name: "subcategoriaName",
      label: "SUBCATEGORIA",
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
      id: row.data[0],
      Subcategoria: row.data[1],
      Categoria: row.data[2],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subcategoria");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Subcategoria.xlsx");
  };

  const hasPermission = (permissionName) => {
    return user.DetallePermisos.some(
      (permiso) => permiso.Permiso.nombrePermiso === permissionName
    );
  };  

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Subcategoria", "Categoria"];
    const tableRows = [];
  
    data.forEach((subcategoria) => {
      const subcategoriaData = [
        subcategoria.subcategoriaName || "",
        subcategoria.categoriaName || "",
      ];
      tableRows.push(subcategoriaData); 
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 57, 107] }, 
      margin: { top: 10 },
    });

    doc.text("Subcategorias", 14, 15);
    doc.save("Subcategorias.pdf");
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
          <button className="btn-black mr-2" onClick={handleExportPDF}>
            Exportar PDF
          </button>
          {hasPermission("Crear Subcategoria") && (
            <button
              className="btn-primary"
              onClick={() => setIsOpenAddModal(true)}
            >
              Agregar Subcategoria
            </button>
          )}
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center">Cargando Subcategoria...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">SUBCATEGORIAS</span>} 
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
      {selectedSubcategoria && (
        <EditSubcategoriaModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModal}
          subcategoria={selectedSubcategoria}
        />
      )}
      <AddSubcategoriaModal
        isOpen={isOpenAddModal}
        onClose={handleCloseAddModal}
      />
    </div>
  );
};

export default Subcategorias;
