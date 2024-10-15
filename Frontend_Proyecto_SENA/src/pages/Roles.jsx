import React, { useState, useEffect } from "react";
import { api } from "../api/token";
import { saveAs } from "file-saver";
import { useAuth } from "../context/AuthContext"; 
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import * as XLSX from "xlsx";
import AddRolModal from "../components/AddRolModal";
import EditRolModal from "../components/EditRolModal";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Roles = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedRol, setSelectedRol] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);

  const { user } = useAuth();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Rol");
      const sortedRoles = response.data.sort((a, b) => a.id - b.id);
      setRoles(sortedRoles);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEditClick = (rowIndex) => {
    const rol = roles[rowIndex];
    setSelectedRol(rol);
    setIsOpenEditModal(true);
  };

  const handleCloseAddModalRoles = (newRol) => {
    if (newRol) {
      fetchRoles();
    }
    setSelectedRol(null);
    setIsOpenAddModal(false);
  };

  const handleCloseEditModalRoles = (updatedRol) => {
    if (updatedRol) {
      fetchRoles();
    }
    setSelectedRol(null);
    setIsOpenEditModal(false);
  };

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        customHeadRender: (columnMeta) => (
          <th key={columnMeta.index} className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "rolName",
      label: "ROL",
      options: {
        customHeadRender: (columnMeta) => (
          <th key={columnMeta.index} className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
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
          <th key={columnMeta.index} className="text-center bg-white text-black uppercase text-xs font-bold">
          {columnMeta.label}
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Roles.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Rol"];
    const tableRows = [];
  
    roles.forEach((rol) => {
      const rolData = [
        rol.rolName || "", 
      ];
      tableRows.push(rolData);
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, 
      theme: 'striped', 
      styles: { fontSize: 10 }, 
      headStyles: { fillColor: [0, 57, 107] }, 
      margin: { top: 10 }, 
    });
  
    doc.text("Roles", 14, 15); 
    doc.save("Roles.pdf");
  };

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
          <button 
            className="btn-black mr-2" 
            onClick={handleExportPDF}
          >
            Exportar PDF
          </button>
          {hasPermission("Crear Rol") && (
            <button
              className="btn-primary"
              onClick={() => setIsOpenAddModal(true)}
            >
              Agregar Rol
            </button>
           )}
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center">Cargando roles...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">ROLES</span>} 
                data={roles}
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
      {selectedRol && (
        <EditRolModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModalRoles}
          rol={selectedRol}
        />
      )}
      <AddRolModal isOpen={isOpenAddModal} onClose={handleCloseAddModalRoles} />
    </div>
  );
};

export default Roles;
