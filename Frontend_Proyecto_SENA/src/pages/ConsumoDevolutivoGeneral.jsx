import React, { useState } from "react";
import { saveAs } from "file-saver";
import { useAuth } from "../context/AuthContext";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import AddHerramientaModal from "../components/AddHerramientaModal";
import EditHerramientaModal from "../components/EditHerramientaModal";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import clsx from "clsx";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";

const ConsumoDevolutivoGeneral = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedHerramienta, setSelectedHerramienta] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const { user } = useAuth();

  const handleEditClick = (rowIndex) => {
    const herramienta = data[rowIndex];
    setSelectedHerramienta(herramienta);
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = (updatedHerramienta) => {
    if (updatedHerramienta) {
      // Update data logic here
    }
    setIsOpenEditModal(false);
    setSelectedHerramienta(null);
  };

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModal = (newHerramienta) => {
    if (newHerramienta) {
    }
    setIsOpenAddModal(false);
  };

  const columns = [
    {
      name: "Código",
      label: "CÓDIGO",
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
      name: "Nombre",
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
      name: "Fecha_de_Ingreso",
      label: "FECHA DE INGRESO",
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
      name: "Marca",
      label: "MARCA",
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
      name: "Condicion",
      label: "CONDICIÓN",
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
      name: "Descripcion",
      label: "DESCRIPCIÓN",
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
      name: "edit",
      label: "EDITAR",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        filter: false,
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
      Código: row.data[0],
      Nombre: row.data[1],
      "Fecha de Ingreso": row.data[2],
      Marca: row.data[3],
      Condición: row.data[4],
      Descripción: row.data[5],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Herramientas");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Herramientas.xlsx");
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
          {hasPermission("Crear Herramienta") && (
            <button className="btn-primary" onClick={handleOpenAddModal}>
              Agregar Herramienta
            </button>
          )}
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center">Cargando herramientas...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">Herramientas de consumo devolutivo - General</span>}
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
      {selectedHerramienta && (
        <EditHerramientaModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModal}
          herramienta={selectedHerramienta}
        />
      )}
      <AddHerramientaModal
        isOpen={isOpenAddModal}
        onClose={handleCloseAddModal}
      />
    </div>
  );
};

export default ConsumoDevolutivoGeneral;
