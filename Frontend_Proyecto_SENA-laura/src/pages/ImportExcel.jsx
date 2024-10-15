import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import MUIDataTable from "mui-datatables";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IoCloudUploadOutline } from "react-icons/io5";
import LinearProgress from "@mui/material/LinearProgress";
import * as XLSX from "xlsx";
import { api } from "../api/token";

const ImportExcel = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [thumbnailHtml, setThumbnailHtml] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Archivo subido exitosamente:", response.data);

      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const html = XLSX.utils.sheet_to_html(worksheet);

        const styledHtml = styleHtml(html);

        setThumbnailHtml(styledHtml);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const styleHtml = (html) => {
    const styledHtml = html
      .replace(
        /<table/g,
        '<table class="table-auto border-collapse border border-gray-400"'
      )
      .replace(
        /<th/g,
        '<th class="border border-gray-300 bg-gray-200 px-2 py-1 text-center text-sm"'
      )
      .replace(/<td/g, '<td class="border border-gray-300 px-2 py-1 text-sm"')
      .replace(/<\/td>/g, "</td>")
      .replace(/<\/th>/g, "</th>");
    return styledHtml;
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
      name: "name",
      label: "NOMBRE",
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
      name: "preview",
      label: "VISTA PREVIA",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta) => (
          <div className="flex items-center justify-center">
            <IconButton onClick={() => handlePreviewClick(tableMeta.rowData)}>
              <VisibilityIcon />
            </IconButton>
          </div>
        ),
      },
    },
  ];

  const data = [
    {
      ID: 1,
      name: "Documento ejemplo",
      preview: "vista",
    },
  ];

  const options = {
    filterType: "checkbox",
  };

  const handlePreviewClick = (rowData) => {
    console.log("Vista previa para:", rowData);
  };

  const handleCustomExport = (rows) => {
    const exportData = rows.map((row) => ({
      id: row.data[0],
      Nombre: row.data[2],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Usuarios.xlsx");
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
        <div className="flex justify-center mt-11">
          <div
            className={`flex flex-col justify-center items-center text-center w-1/2 mb-4 bg-white rounded-lg border-2 border-dashed ${
              dragActive ? "border-blue-500" : "border-gray-300"
            } p-4`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <IoCloudUploadOutline className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">Arrastra el archivo excel aquí</p>
            <button
              onClick={handleUpload}
              className="btn-primary2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Subir archivo
            </button>
          </div>
        </div>
        {uploading && (
          <LinearProgress className="h-2 w-full mb-4" color="primary" />
        )}
        <div className="flex flex-grow">
          <div className="flex justify-center w-1/2 mt-2 pr-2">
            <div className="w-3/4">
              <MUIDataTable
                title={<span className="custom-title">DOCUMENTOS</span>}
                data={data}
                columns={columns}
                options={{
                  responsive: "standard",
                  download: true,
                  selectableRows: "none",
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
            </div>
          </div>
          <div className="w-1/2 pl-2 h-full flex justify-center items-center">
            <div className="flex justify-center p-2">
              <div
                className="text-center border border-sena shadow-lg p-2 overflow-auto"
                style={{
                  maxHeight: "600px",
                  maxWidth: "600px",
                  transform: "scale(0.6)",
                  transformOrigin: "top center",
                }}
                dangerouslySetInnerHTML={{ __html: thumbnailHtml }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExcel;


//CODIGO DE MAQUETACIÓN SIN CONEXIÓN A BACK
// import React, { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Home from "../components/Home";
// import MUIDataTable from "mui-datatables";
// import IconButton from "@mui/material/IconButton";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { IoCloudUploadOutline } from "react-icons/io5";
// import LinearProgress from "@mui/material/LinearProgress";
// import * as XLSX from "xlsx";

// const ImportExcel = () => {
//   const [sidebarToggle, setSidebarToggle] = useState(false);
//   const [thumbnailHtml, setThumbnailHtml] = useState("");
//   const [file, setFile] = useState(null);
//   const [dragActive, setDragActive] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   const handleUpload = () => {
//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const html = XLSX.utils.sheet_to_html(worksheet);

//       const styledHtml = styleHtml(html);

//       setThumbnailHtml(styledHtml);
//     };
//     reader.readAsArrayBuffer(file);
//     setUploading(true);
//     setTimeout(() => {
//       setUploading(false);
//     }, 1000);
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     setDragActive(true);
//   };

//   const handleDragLeave = (event) => {
//     event.preventDefault();
//     setDragActive(false);
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     setDragActive(false);
//     if (event.dataTransfer.files && event.dataTransfer.files[0]) {
//       setFile(event.dataTransfer.files[0]);
//     }
//   };

//   const styleHtml = (html) => {
//     const styledHtml = html
//       .replace(
//         /<table/g,
//         '<table class="table-auto border-collapse border border-gray-400"'
//       )
//       .replace(
//         /<th/g,
//         '<th class="border border-gray-300 bg-gray-200 px-2 py-1 text-center text-sm"'
//       )
//       .replace(/<td/g, '<td class="border border-gray-300 px-2 py-1 text-sm"')
//       .replace(/<\/td>/g, "</td>")
//       .replace(/<\/th>/g, "</th>");
//     return styledHtml;
//   };

//   const columns = [
//     {
//       name: "ID",
//       label: "ID",
//       options: {
//         customHeadRender: (columnMeta) => (
//           <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
//         ),
//         customBodyRender: (value) => <div className="text-center">{value}</div>,
//       },
//     },
//     {
//       name: "name",
//       label: "NOMBRE",
//       options: {
//         customHeadRender: (columnMeta) => (
//           <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
//         ),
//         customBodyRender: (value) => <div className="text-center">{value}</div>,
//       },
//     },
//     {
//       name: "preview",
//       label: "VISTA PREVIA",
//       options: {
//         customHeadRender: (columnMeta) => (
//           <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
//         ),
//         customBodyRender: (value, tableMeta, updateValue) => (
//           <div className="flex items-center justify-center">
//             <IconButton onClick={() => handlePreviewClick(tableMeta.rowData)}>
//               <VisibilityIcon />
//             </IconButton>
//             </div>
//         ),
//       },
//     },
//   ];

//   const data = [
//     {
//       ID: 1,
//       name: "Documento ejemplo",
//       preview: "vista",
//     },
//   ];

//   const options = {
//     filterType: "checkbox",
//   };

//   const handlePreviewClick = (rowData) => {
//     console.log("Vista previa para:", rowData);
//   };

//   const handleCustomExport = (rows) => {
//     const exportData = rows.map((row) => ({
//       id: row.data[0],
//       Nombre: row.data[2],
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(data, "Usuarios.xlsx");
//   };
//   return (
//     <div className="flex min-h-screen">
//       <Sidebar sidebarToggle={sidebarToggle} />
//       <div
//         className={`flex flex-col flex-grow p-6 bg-gray-100 ${
//           sidebarToggle ? "ml-64" : ""
//         } mt-16`}
//       >
//         <Home
//           sidebarToggle={sidebarToggle}
//           setSidebarToggle={setSidebarToggle}
//         />
//         <div className="flex justify-center mt-11">
//           <div
//             className={`flex flex-col justify-center items-center text-center w-1/2 mb-4 bg-white rounded-lg border-2 border-dashed ${
//               dragActive ? "border-blue-500" : "border-gray-300"
//             } p-4`}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//           >
//             <IoCloudUploadOutline className="h-16 w-16 text-gray-400 mb-4" />
//             <p className="text-gray-500 mb-4">Arrastra el archivo excel aquí</p>
//             <button
//               onClick={handleUpload}
//               className="btn-primary2 px-4 py-2 bg-blue-500 text-white rounded"
//             >
//               Subir archivo
//             </button>
//           </div>
//         </div>
//         {uploading && (
//           <LinearProgress className="h-2 w-full mb-4" color="primary" />
//         )}
//         <div className="flex flex-grow">
//           <div className="flex justify-center w-1/2 mt-2 pr-2">
//             <div className="w-3/4">
//               <MUIDataTable
//                 title={<span className="custom-title">DOCUMENTOS</span>} 
//                 data={data}
//                 columns={columns}
//                 options={{
//                   selectableRows: "none",
//                   rowsPerPage: 5,
//                   rowsPerPageOptions: [5, 10, 15],
//                   setTableProps: () => {
//                     return {
//                       className: "custom-tables",
//                     };
//                   },
//                   onDownload: (buildHead, buildBody, columns, data) => {
//                     handleCustomExport(data);
//                     return false;
//                   },
//                 }}
//               />
//             </div>
//           </div>
//           <div className="w-1/2 pl-2 h-full flex justify-center items-center">
//             <div className="flex justify-center p-2">
//               <div
//                 className=" text-center border border-sena shadow-lg p-2 overflow-auto"
//                 style={{
//                   maxHeight: "600px",
//                   maxWidth: "600px",
//                   transform: "scale(0.6)",
//                   transformOrigin: "top center",
//                 }}
//                 dangerouslySetInnerHTML={{ __html: thumbnailHtml }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImportExcel;
