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
import EditProductModal from "../components/EditProductModal";
import AddProductModal from "../components/AddProductModal";
import clsx from "clsx";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "react-toastify/dist/ReactToastify.css";

const ConsumoControladoGeneral = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/productos/categoria/:2", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const productoconUnidadSub = response.data.map((produc) => ({
        ...produc,
        productoNombre: produc.nombre,
        nombreUser: produc.Usuario ? produc.Usuario.nombre : "Desconocido",
        estadoName: produc.Estado ? produc.Estado.estadoName : "Desconocido",
        subcategoriaName: produc.Subcategorium
          ? produc.Subcategorium.subcategoriaName
          : "Desconocido",
        unidadNombre: produc.UnidadMedida
          ? produc.UnidadMedida.sigla
          : "Desconocido",
      }));

      productoconUnidadSub.sort((a, b) => a.id - b.id);
      setData(productoconUnidadSub);
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
    const product = data[rowIndex];
    setSelectedProduct(product);
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = (updatedProduct) => {
    if (updatedProduct) {
      fetchData();
    }
    setIsOpenEditModal(false);
    setSelectedProduct(null);
  };

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModal = (newProduct) => {
    if (newProduct) {
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
      name: "productoNombre",
      label: "Nombre del Producto",
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
      name: "descripcion",
      label: "Descripcion",
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
      name: "cantidadEntrada",
      label: "Cantidad Entrada",
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
      name: "cantidadSalida",
      label: "Cantidad Salida",
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
      name: "cantidadActual",
      label: "Cantidad Actual",
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
      name: "volumenTotal",
      label: "volumen Total",
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
      name: "unidadNombre",
      label: "Unidad de Medida",
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
      id: row.data[0],
      UsuarioId: row.data[1],
      Marca: row.data[2],
      CantidadActual: row.data[3],
      CantidadEntrada: row.data[4],
      Descripcion: row.data[5],
      UnidadMedida: row.data[6],
      SubcategoriaId: row.data[7],
      CantidadSalida: row.data[9],
      Nombre: row.data[10],
      Codigo: row.data[11],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Productos.xlsx");
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
        {hasPermission("Crear Producto") && (
          <button className="btn-primary" onClick={handleOpenAddModal}>
            Agregar Producto
          </button>
        )}
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-9xl mx-auto">
            {loading ? (
              <div className="text-center">Cargando productos...</div>
            ) : (
              <MUIDataTable
                title={
                  <span className="custom-title">
                    Productos de consumo controlado - General
                  </span>
                }
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
      {selectedProduct && (
        <EditProductModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModal}
          product={selectedProduct}
        />
      )}
      <AddProductModal isOpen={isOpenAddModal} onClose={handleCloseAddModal} />
    </div>
  );
};
export default ConsumoControladoGeneral;
