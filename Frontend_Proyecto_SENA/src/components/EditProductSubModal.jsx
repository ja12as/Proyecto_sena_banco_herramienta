import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProductSubModa = ({ isOpen, onClose, product }) => {
    const [loading, setLoading] = useState(false);
    const [estados, setEstados] = useState([]);
    const [medidas, setMedidas] = useState([]);
    const [subcategoria, sesubcategoria] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        marca: "",
        descripcion: "",
        UnidadMedidaId: "",
        SubcategoriaId: "",
        EstadoId: "",
    });

    useEffect(() => {
        if (isOpen && product) {
        fetchProductDetails(product.id);
        }
    }, [isOpen, product]);

    useEffect(() => {
        const fetchEstados = async () => {
        try {
            const response = await api.get("/Estado");
            const filteredEstados = response.data.filter(
            (estado) => estado.id === 1 || estado.id === 2
            );
            setEstados(filteredEstados);
        } catch (error) {
            showToastError("Error al cargar los estados");
        }
        };

        const fetchMedidas = async () => {
        try {
            const response = await api.get("/units");
            setMedidas(response.data);
        } catch (error) {
            toast.error("Error al cargar las unidades de medida", {
            position: "top-right",
            });
        }
        };

        const fetchSubcategoria = async () => {
        try {
            const response = await api.get("/subcategoria/estado");
            const filteredSubcategorias = response.data.filter(
            (Categoria) => Categoria. Categoria.CategoriaId === 4
            );
            sesubcategoria(filteredSubcategorias);
        } catch (error) {
        }
        };

        fetchEstados();
        fetchMedidas();
        fetchSubcategoria();
    }, []);

    const fetchProductDetails = async (productId) => {
        setLoading(true);
        try {
        const response = await api.get(`/producto/${productId}`);
        if (response.status === 200) {
            const {
            nombre,
            marca,
            descripcion,
            UnidadMedidaId,
            SubcategoriaId,
            EstadoId,
            } = response.data;
            setFormData({
            nombre: nombre || "",
            marca: marca || "",
            descripcion: descripcion || "",
            UnidadMedidaId: UnidadMedidaId || "",
            SubcategoriaId: SubcategoriaId || "",
            EstadoId: EstadoId || "",
            });
            setLoading(false);
        } else {
            console.error("Error fetching product details:", response.data.message);
            toast.error("Error al cargar la información del producto.", {
            position: "top-right",
            });
            setLoading(false);
        }
        } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Error al cargar la información del producto.", {
            position: "top-right",
        });
        setLoading(false);
        }
    };

    const validateInput = (name, value) => {
        let errorMessage = "";
        if (name === "nombre" || name === "descripcion") {
        if (/[^a-zA-Z0-9\s]/.test(value)) {
            errorMessage = "El campo no puede contener caracteres especiales.";
        }
        } else if (name === "volumen") {
        if (!/^[A-Za-z0-9]+$/.test(value)) {
            errorMessage = "El código debe ser alfanumérico.";
        }
        }
        return errorMessage;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const errorMessage = validateInput(name, value);
        setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
        }));
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    const handleUpdate = async () => {
        const {
        nombre,
        marca,
        descripcion,
        UnidadMedidaId,
        SubcategoriaId,
        EstadoId,
        } = formData;

        if (
        !nombre ||
        !marca ||
        !descripcion ||
        !UnidadMedidaId ||
        !SubcategoriaId ||
        !EstadoId
        ) {
        toast.error("Todos los campos son obligatorios.", {
            position: "top-right",
        });
        return;
        }
        setLoading(true);
        try {
        const response = await api.put(
            `/producto/${product.id}`,
            {
            nombre,
            marca,
            descripcion,
            UnidadMedidaId: UnidadMedidaId,
            SubcategoriaId: SubcategoriaId,
            EstadoId: EstadoId,
            },
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            }
        );
        if (response.status === 200) {
            toast.success("Producto actualizado exitosamente", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
            setTimeout(() => {
            onClose(response.data);
            }, 2000);
        } else {
            console.error("Error updating product:", response.data.message);
            toast.error("Error al actualizar la información del producto.", {
            position: "top-right",
            });
        }
        } catch (error) {
        console.error("Error updating product:", error);
        if (error.response && error.response.status === 401) {
            setTimeout(() => {
            navigate("/");
            });
        } else {
            toast.error("Error al actualizar la información del producto.", {
            position: "top-right",
            });
        }
        } finally {
        setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-fondo bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg sm:w-full md:w-1/4 mt-4 max-h-screen overflow-y-auto">
            <div className="flex justify-end p-2">
            <button onClick={onClose}>
                <FaTimes className="text-black w-3 h-3" />
            </button>
            </div>
            <div className="flex items-center justify-center space-y-2 md:space-y-0 mb-2">
            <div className="w-full md:w-3/4">
                <div className="font-inter ml-1">
                <div className="space-y-1 md:space-y-1 text-left">
                    <h6 className="font-bold text-center text-lg mb-1">
                    Editar Producto
                    </h6>
                    {loading ? (
                    <p className="text-center text-xs">Cargando información...</p>
                    ) : (
                    <div className="space-y-1">
                        <div className="flex flex-col">
                        <label className="mb-0.5 font-bold text-xs">
                            Nombre *
                        </label>
                        <input
                            className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                        />
                        {formErrors.nombre && (
                            <div className="text-red-400 text-xs mt-0.5">
                            {formErrors.nombre}
                            </div>
                        )}
                        </div>

                        <div className="flex flex-col">
                        <label className="mb-0.5 font-bold text-xs">
                            Marca *
                        </label>
                        <input
                            className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                            type="text"
                            name="marca"
                            value={formData.marca}
                            onChange={handleInputChange}
                        />
                        {formErrors.marca && (
                            <div className="text-red-400 text-xs mt-0.5">
                            {formErrors.marca}
                            </div>
                        )}
                        </div>
                        <div className="flex flex-col">
                        <label className="mb-0.5 font-bold text-xs">
                            Descripcion *
                        </label>
                        <input
                            className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                            type="text"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                        />
                        {formErrors.descripcion && (
                            <div className="text-red-400 text-xs mt-0.5">
                            {formErrors.descripcion}
                            </div>
                        )}
                        </div>

                        <div className="flex flex-col">
                        <label className="mb-0.5 font-bold text-xs">
                            Unidad de Medida *
                        </label>
                        <select
                            className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                            name="UnidadMedidaId"
                            value={formData.UnidadMedidaId}
                            onChange={handleInputChange}
                        >
                            <option value="">Seleccionar</option>
                            {medidas.map((medida) => (
                            <option key={medida.id} value={medida.id}>
                                {medida.nombre}
                            </option>
                            ))}
                        </select>
                        {formErrors.UnidadMedidaId && (
                            <div className="text-red-400 text-xs mt-0.5">
                            {formErrors.UnidadMedidaId}
                            </div>
                        )}
                        </div>

                        <div className="flex flex-col">
                        <label className="mb-0.5 font-bold text-xs">
                            Subcategoria *
                        </label>
                        <select
                            className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                            name="SubcategoriaId"
                            value={formData.SubcategoriaId}
                            onChange={handleInputChange}
                        >
                            <option value="">Seleccionar</option>
                            {subcategoria.map((uni) => (
                            <option key={uni.id} value={uni.id}>
                                {uni.subcategoriaName}
                            </option>
                            ))}
                        </select>
                        {formErrors.SubcategoriaId && (
                            <div className="text-red-400 text-xs mt-0.5">
                            {formErrors.SubcategoriaId}
                            </div>
                        )}
                        </div>

                        <div className="flex flex-col">
                        <label className="mb-1 font-bold text-sm">Estado *</label>
                        <select
                            className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                            name="EstadoId"
                            value={formData.EstadoId}
                            onChange={handleInputChange}
                        >
                            <option value="">Seleccionar Estado</option>
                            {estados.map((estado) => (
                            <option
                                key={estado.id}
                                value={estado.id}
                                style={{
                                color:
                                    estado.estadoName === "ACTIVO"
                                    ? "green"
                                    : estado.estadoName === "INACTIVO"
                                    ? "red"
                                    : "inherit",
                                }}
                            >
                                {estado.estadoName}
                            </option>
                            ))}
                        </select>
                        </div>
                    </div>
                    )}
                </div>
                </div>
            </div>
            </div>
            <div className="sm:w-full md:w-full flex flex-col justify-end">
            <div className="flex justify-center mb-2 mx-1">
                <button className="btn-danger2 mx-1 text-xs" onClick={onClose}>
                Cancelar
                </button>
                <button
                className="btn-primary2 mx-1 text-xs"
                onClick={handleUpdate}
                >
                Actualizar
                </button>
            </div>
            </div>
        </div>
        <ToastContainer />
        </div>
    );
};

export default EditProductSubModa;
