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
import EditInstructorModal from "../components/EditInstructorModal";
import AddInstructorModal from "../components/AddInstructorModal";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Instructores = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Instructor", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const [usuariosResponse, estadosResponse] = await Promise.all([
        api.get("/usuarios", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        api.get("/Estado", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const usuarios = usuariosResponse.data;
      const estados = estadosResponse.data;

      const InstructoresyCreador = response.data.map((instructor) => {
        const usuario = usuarios.find((u) => u.id === instructor.UsuarioId);
        const estado = estados.find((e) => e.id === instructor.EstadoId);

        return {
          ...instructor,
          usuarioname: usuario ? usuario.nombre : "Desconocido",
          estadoName: estado ? estado.estadoName : "Desconocido",
        };
      });

      InstructoresyCreador.sort((a, b) => a.id - b.id);
      setData(InstructoresyCreador);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error al cargar los datos de usuarios", {
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (rowIndex) => {
    const instructor = data[rowIndex];
    setSelectedInstructor(instructor);
    setIsOpenEditModal(true);
  };

  const handleCloseEditModalIntructor = (updateIntructor) => {
    if (updateIntructor) {
      fetchData();
    }
    setSelectedInstructor(null);
    setIsOpenEditModal(false);
  };

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModalIntructor = (newIntructor) => {
    if (newIntructor) {
      fetchData();
    }
    setSelectedInstructor(null);
    setIsOpenAddModal(false);
  };

  const columsInstructor = [
    {
      name: "id",
      label: "ID",
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
      label: "NOMBRE",
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
      name: "correo",
      label: "CORREO",
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
      name: "celular",
      label: "TELEFONO",
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
      name: "usuarioname",
      label: "USUARIO",
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
      name: "estadoName",
      label: "ESTADO",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => (
          <div
            className={clsx("text-center", {
              "text-sena": value === "ACTIVO",
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
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
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
      Nombre: row.data[1],
      Correo: row.data[2],
      Usuario: row.data[4],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Instructores");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Instructores.xlsx");
  };

  const hasPermission = (permissionName) => {
    return user.DetallePermisos.some(
      (permiso) => permiso.Permiso.nombrePermiso === permissionName
    );
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Nombre", "Correo", "Usuario"];
    const tableRows = [];

    data.forEach((instructor) => {
      const instructorData = [
        instructor.nombre || "N/A",
        instructor.correo || "N/A",
        instructor.usuarioname || "N/A",
      ];
      tableRows.push(instructorData);
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

    doc.text("Instructores", 14, 15);
    doc.save("Instructores.pdf");
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
          {hasPermission("Crear Instructor") && (
            <button className="btn-primary" onClick={handleOpenAddModal}>
              Agregar Instructor
            </button>
          )}
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-7xl overflow-auto">
            {loading ? (
              <div className="text-center">Cargando Instructores...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">INSTRUCTORES</span>}
                data={data}
                columns={columsInstructor}
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
      {selectedInstructor && (
        <EditInstructorModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModalIntructor}
          instructor={selectedInstructor}
        />
      )}
      <AddInstructorModal
        isOpen={isOpenAddModal}
        onClose={handleCloseAddModalIntructor}
      />
    </div>
  );
};

export default Instructores;
