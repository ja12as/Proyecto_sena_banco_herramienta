import React, { useState, useEffect } from "react";
import { api } from "../api/token";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "react-toastify/dist/ReactToastify.css";
import AddHerramientaSubModal from './../components/AddHerramientaSubdireccionModal';
import EditHerramientaSubModal from './../components/EditHerramientaSubModal';

const ConsumoDevolutivoGeneral = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedHerramienta, setSelectedHerramienta] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const subcategoriaResponse = await api.get("/subcategoria", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const subcategoriasCategoria3 = subcategoriaResponse.data
        .filter((subcategoria) => subcategoria.CategoriaId === 2)
        .map((subcategoria) => subcategoria.id);
      const herramientaResponse = await api.get("/herramienta", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const herramientaFiltrados = herramientaResponse.data.filter(
        (herramienta) => subcategoriasCategoria3.includes(herramienta.SubcategoriaId)
      );
      const herramientaconUnidadSub = herramientaFiltrados.map((herram) => ({
        ...herram,
        herramientaNombre: herram.nombre,
        nombreUser: herram.Usuario ? herram.Usuario.nombre : "Desconocido",
        estadoName: herram.Estado ? herram.Estado.estadoName : "Desconocido",
        subcategoriaName: herram.Subcategorium
          ? herram.Subcategorium.subcategoriaName
          : "Desconocido",
        unidadNombre: herram.UnidadDeMedida
          ? herram.UnidadDeMedida.nombre
          : "Desconocido",
      }));
      herramientaconUnidadSub.sort((a, b) => a.id - b.id);
      setData(herramientaconUnidadSub);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos", {
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
    const herramienta = data[rowIndex];
    setSelectedHerramienta(herramienta);
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = (updatedHerramienta) => {
    if (updatedHerramienta) {
      fetchData();
    }
    setIsOpenEditModal(false);
    setSelectedHerramienta(null);
  };

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModal = (newUser) => {
    if (newUser) {
      fetchData();
    }
    setIsOpenAddModal(false);
  };

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "nombre",
      label: "Nombre",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "codigo",
      label: "Codigo",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "marca",
      label: "Marca",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "condicion",
      label: "Condicion",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "observaciones",
      label: "Observacion",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "fechaDeIngreso",
      label: "Fecha de Ingreso",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "subcategoriaName",
      label: "Subcategoria",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "nombreUser",
      label: "Usuario",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
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
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => (
          <div
            className={clsx("text-center", {
              "text-green-500": value === "ACTIVO",
              "text-red-500": value === "INACTIVO",
              "text-gray-500": value === "AGOTADO",
              "text-yellow-500": value === "PENDIENTE",
              "text-blue-500": value === "EN PROCESO",
              "text-orange-500": value === "EN USO",
              "text-green-300": value === "ENTREGADO",
              "text-purple-500": value === "DEVUELTO",
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
            className="text-center bg-white text-black uppercase text-xs font-bold">
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
      Código: row.data[0],
      Nombre: row.data[1],
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

  const handleExportPDF = () => {
    const doc = new jsPDF("landscape");
    const tableColumn = [
      "ID",
      "Nombre",
      "Codigo",
      "Marca",
      "Condición",
      "Observación",
      "Fecha de Ingreso",
      "Subcategoria",
      "Usuario",
      "Estado",
    ];
    const tableRows = [];

    data.forEach((herramienta) => {
      const herramientaData = [
        herramienta.id || "",
        herramienta.nombre || "",
        herramienta.codigo || "",
        herramienta.marca || "",
        herramienta.condicion || "",
        herramienta.observaciones || "",
        herramienta.fechaDeIngreso || "",
        herramienta.subcategoriaName || "",
        herramienta.nombreuser || "",
        herramienta.estadoName || "",
      ];
      tableRows.push(herramientaData);
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

    doc.text("Listado de Herramientas", 14, 15);
    doc.save("Herramientas.pdf");
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

        {/* Contenedor para los botones */}
        <div className="flex justify-end mt-6 fixed top-16 right-6 z-10">
          <button className="btn-black mr-2" onClick={handleExportPDF}>
            Exportar PDF
          </button>
          <button className="btn-primary" onClick={handleOpenAddModal}>
            Agregar Herramienta
          </button>
        </div>

        {/* Contenedor de la tabla */}
        <div className="flex-grow flex items-center justify-center mt-16">
          {" "}
          {/* Añadir mt-16 para espacio */}
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center">Cargando herramientas...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">Herramientas consumo devolutivo - General</span>}
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
        <EditHerramientaSubModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModal}
          herramienta={selectedHerramienta}
        />
      )}
      <AddHerramientaSubModal
        isOpen={isOpenAddModal}
        onClose={handleCloseAddModal}
      />
    </div>
  );
};

export default ConsumoDevolutivoGeneral;
