import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Usamos useNavigate para redirigir después de completar el préstamo
import { toast } from "react-toastify";
import { api } from "../api/token";
import MUIDataTable from "mui-datatables";
import "react-toastify/dist/ReactToastify.css";

const TablaPrestamosDevolucion = ({ actualizarObservacion }) => {
    const location = useLocation();
    const [herramientas, setHerramientas] = useState([]);
    const { prestamoId } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchherramientas = async () => {
            try {
                const response = await api.get(`/herramienta`);
                setHerramientas(response.data);
            } catch (err) {
                console.error("Error fetching herramientas:", err);
                toast.error("Error al cargar herramientas.");
            }
        };

        fetchherramientas();
    }, []);

    useEffect(() => {
        const fetchHerramientasDelPedido = async () => {
            if (!prestamoId) return;

            try {
                setLoading(true);
                const response = await api.get(`/prestamos/${prestamoId}`);
                const herramientasData = response.data.Herramienta || [];
                const prestamo = response.data;
                const fechaEntregaGlobal = response.data.fechaEntrega;

                const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    return isNaN(date.getTime())
                        ? "Fecha no válida"
                        : date.toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        });
                };

                const herramientasFormatted = herramientasData.map((herramienta, index) => {
                    const fechaEntrega = fechaEntregaGlobal
                        ? formatDate(fechaEntregaGlobal)
                        : "Sin fecha de entrega";

                    const fechaDevolucion = prestamo.PrestamoHerramienta?.fechaDevolucion
                        ? formatDate(prestamo.PrestamoHerramienta.fechaDevolucion)
                        : "Pendiente de devolución";

                    return {
                        item: index + 1,
                        nombre: herramienta.nombre,
                        codigo: herramienta.codigo,
                        HerramientumId: herramienta.id,
                        observaciones: herramienta.PrestamoHerramienta?.observacion || "",
                        fechaEntrega,
                        fechaDevolucion,
                    };
                });

                console.log("Herramientas formateadas:", herramientasFormatted); // Debug

                setData(herramientasFormatted);
            } catch (err) {
                console.error("Error fetching herramientas:", err);
                toast.error("Error al cargar herramientas.");
            } finally {
                setLoading(false);
            }
        };

        fetchHerramientasDelPedido();
    }, [prestamoId]);

    const handleObservacionChange = (value, rowIndex) => {
        const updatedData = [...data];
        updatedData[rowIndex].observaciones = value;
        setData(updatedData);

        console.log("Observación actualizada:", value, "en la fila:", rowIndex); // Debug

        // Llama a actualizarObservacion con los datos actualizados de la devolución
        actualizarObservacion(
            rowIndex,  // Índice de la fila
            updatedData[rowIndex].HerramientumId,  // ID de la herramienta
            value  // Observación nueva
        );
    };
    
    const columns = [
        {
            name: "item",
            label: "ITEM",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.label} className="text-center bg-white text-black uppercase text-xs font-bold">
                        {columnMeta.label}
                    </th>
                ),
                customBodyRender: (value) => <div className="text-center">{value}</div>,
            },
        },
        {
            name: "nombre",
            label: "NOMBRE herramienta",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.label} className="text-center bg-white text-black uppercase text-xs font-bold">
                        {columnMeta.label}
                    </th>
                ),
                customBodyRender: (value) => <div className="text-center">{value}</div>,
            },
        },
        {
            name: "codigo",
            label: "CÓDIGO herramienta",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.label} className="text-center bg-white text-black uppercase text-xs font-bold">
                        {columnMeta.label}
                    </th>
                ),
                customBodyRender: (value) => <div className="text-center">{value}</div>,
            },
        },
        {
            name: "fechaEntrega",
            label: "FECHA ENTREGA",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.label} className="text-center bg-white text-black uppercase text-xs font-bold">
                        {columnMeta.label}
                    </th>
                ),
                customBodyRender: (value) => <div className="text-center">{value || "Fecha pendiente"}</div>,
            },
        },
        {
            name: "fechaDevolucion",
            label: "FECHA DEVOLUCIÓN",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.label} className="text-center bg-white text-black uppercase text-xs font-bold">
                        {columnMeta.label}
                    </th>
                ),
                customBodyRender: (value) => <div className="text-center">{value || "Pendiente de devolución"}</div>,
            },
        },
        {
            name: "observaciones",
            label: "OBSERVACIONES",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.label} className="text-center bg-white text-black uppercase text-xs font-bold">
                        {columnMeta.label}
                    </th>
                ),
                customBodyRender: (value, tableMeta) => {
                    const rowIndex = tableMeta.rowIndex;
                    return (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleObservacionChange(e.target.value, rowIndex)}
                            className="border border-gray-400 rounded p-1 w-full"
                        />
                    );
                },
            },
        },
    ];

    return (
        <div>
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-9xl mx-auto">
                    {loading ? (
                        <div>Cargando herramientas...</div>
                    ) : (
                        <div>
                            <MUIDataTable
                                data={data}
                                columns={columns}
                                options={{
                                    responsive: "standard",
                                    selectableRows: "none",
                                    download: false,
                                    print: false,
                                    viewColumns: false,
                                    filter: false,
                                    search: false,
                                    rowsPerPage: 5,
                                    rowsPerPageOptions: [5, 10, 15],
                                    setTableProps: () => {
                                        return {
                                            className: "custom-table",
                                        };
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
                                            viewColumns: "Mostrar Columnas",
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
                                            delete: "Eliminar",
                                            deleteAria: "Eliminar filas seleccionadas",
                                        },
                                    },
                                }}
                            />

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TablaPrestamosDevolucion
