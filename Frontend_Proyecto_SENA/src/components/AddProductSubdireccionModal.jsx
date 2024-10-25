import React, { useEffect, useState } from "react";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProductSubModal = ({ isOpen, onClose, product }) => {
    const [subcategorias, setSubcategorias] = useState([]);
    const [estados, setEstados] = useState([]);
    const [unidades, setUnidad] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        codigo: "",
        descripcion: "",
        cantidadEntrada: "",
        marca: "",
        UnidadMedidaId: "",
        SubcategoriaId: "",
        EstadoId: "",
    });

    useEffect(() => {
        if (isOpen) {
        setLoading(true);
        }
    }, [isOpen]);

    useEffect(() => {
        if (product) {
        setFormData({
            nombre: product.nombre || "",
            codigo: product.codigo || "",
            descripcion: product.descripcion || "",
            cantidadEntrada: product.cantidad_entrada || "",
            marca: product.marca || "",
            UnidadMedidaId: product.UnidadMedidaId || "",
            SubcategoriaId: product.SubcategoriaId || "",
            EstadoId: product.EstadoId || "",
        });
        }
    }, [product]);

    useEffect(() => {
        const fetchsubcategorias = async () => {
        try {
            const response = await api.get("/subcategoria/estado");
            const filteredSubcategorias = response.data.filter(
            (Categoria) => Categoria.CategoriaId === 4
            );
            setSubcategorias(filteredSubcategorias);
        } catch (error) {
        }
        };

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

        const fetchUnidad = async () => {
        try {
            const response = await api.get("/units");
            setUnidad(response.data);
        } catch (error) {
            showToastError("Error al cargar la unidad de medida");
        }
        };

        fetchsubcategorias();
        fetchEstados();
        fetchUnidad();
    }, []);

    const validateInput = (name, value) => {
        let errorMessage = "";
        if (name === "nombre") {
        const nameRegex = /^[A-Za-z\s-_\u00C0-\u017F]+$/;
        if (!nameRegex.test(value) || /\d/.test(value)) {
            errorMessage = "El nombre no puede contener caracteres especiales.";
        }
        }
        return errorMessage;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const processedValue =
        name === "UnidadMedidaId" ||
        name === "EstadoId" ||
        name === "SubcategoriaId"
            ? Number(value)
            : value;

        const errorMessage = validateInput(name, processedValue);
        setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
        }));

        setFormData((prevData) => ({
        ...prevData,
        [name]: processedValue,
        }));
    };

    const showToastError = (message) => {
        toast.error(message, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    };

    const resetForm = () => {
        setFormData({
        nombre: "",
        codigo: "",
        descripcion: "",
        cantidadEntrada: "",
        marca: "",
        UsuarioId: "",
        UnidadMedidaId: "",
        SubcategoriaId: "",
        EstadoId: "",
        });
    };

    const handleCreate = async () => {
        const {
        nombre,
        codigo,
        descripcion,
        cantidadEntrada,
        marca,
        UnidadMedidaId,
        SubcategoriaId,
        EstadoId,
        } = formData;
    
        // Validar individualmente los campos y acumular errores
        const codigoError = validateInput("codigo", codigo);
        const nombreError = validateInput("nombre", nombre);
        const descripcionError = validateInput("descripcion", descripcion);
        const cantidadEntradaError = validateInput("cantidadEntrada", cantidadEntrada);
        const marcaError = validateInput("marca", marca);
    
        let hasErrors = false;
    
        // Mostrar errores individuales
        if (nombreError) {
        showToastError("El campo 'Nombre' es obligatorio.");
        hasErrors = true;
        }
        
        if (codigoError) {
        showToastError("El campo 'Código' es obligatorio o ya está en uso.");
        hasErrors = true;
        }
        
        if (descripcionError) {
        showToastError("El campo 'Descripción' es obligatorio.");
        hasErrors = true;
        }
        
        if (cantidadEntradaError) {
        showToastError("El campo 'Cantidad de Entrada' es obligatorio y debe ser mayor a 0.");
        hasErrors = true;
        }
        
        if (marcaError) {
        showToastError("El campo 'Marca' es obligatorio.");
        hasErrors = true;
        }
    
        // Verificar si hay errores acumulados
        if (hasErrors) {
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            codigo: codigoError,
            nombre: nombreError,
            descripcion: descripcionError,
            cantidadEntrada: cantidadEntradaError,
            marca: marcaError,
        }));
        return;
        }
    
        // Verificar si todos los campos requeridos están completos
        if (
        !nombre ||
        !codigo ||
        !descripcion ||
        !cantidadEntrada ||
        !marca ||
        !UnidadMedidaId ||
        !SubcategoriaId ||
        !EstadoId
        ) {
        showToastError("Todos los campos son obligatorios.");
        return;
        }
    
        setLoading(true);
    
        try {
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
    
        const response = await api.post("/producto", formData, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
    
        if (response.status === 201) {
            toast.success("Producto agregado exitosamente", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
            resetForm();
            setTimeout(() => {
            onClose(response.data);
            }, 2000);
        } else {
            showToastError(
            "Ocurrió un error, por favor intenta con un documento o correo diferente."
            );
        }
        } catch (error) {
        showToastError(
            "Ocurrió un error, por favor intenta con valores diferentes."
        );
        } finally {
        setLoading(false);
        }
    };
    
    return (
        <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-fondo bg-opacity-50 ${
            isOpen ? "" : "hidden"
        }`}
        >
        <div className="bg-white rounded-lg shadow-lg sm:w-full md:w-1/4 mt-4 max-h-screen overflow-y-auto">
            <div className="flex justify-end p-1">
            <button onClick={onClose}>
                <FaTimes className="text-black w-3 h-3" />
            </button>
            </div>
            <div className="flex items-center justify-center space-y-1 md:space-y-0 mb-2">
            <div className="w-full md:w-3/4">
                <div className="font-inter ml-1">
                <div className="space-y-1 md:space-y-0.5 text-left">
                    <h6 className="font-bold text-center text-lg mb-1">
                    Registro Producto
                    </h6>

                    <div className="flex flex-col">
                    <label className="mb-1 font-bold text-sm">Nombre *</label>
                    <input
                        className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={(e) => {
                        const valorEnMayusculas = e.target.value.toUpperCase();
                        handleInputChange({ target: { name: "nombre", value: valorEnMayusculas } });
                        }}
                        onKeyPress={(e) => {
                        if (/\d/.test(e.key)) {
                            e.preventDefault();
                        }
                        }}
                    />
                    {formErrors.nombre && (
                        <div className="text-red-400 text-sm mt-1 px-2">
                        {formErrors.nombre}
                        </div>
                    )}
                    </div>

                    <div className="flex flex-col">
                    <label className="mb-1 font-bold text-sm">Código *</label>
                    <input
                        className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                        type="text"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleInputChange}
                    />
                    {formErrors.codigo && (
                        <div className="text-red-400 text-sm mt-1 px-2">
                        {formErrors.codigo}
                        </div>
                    )}
                    </div>

                    <div className="flex flex-col">
                    <label className="mb-1 font-bold text-sm">Marca *</label>
                    <input
                        className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                        type="text"
                        name="marca"
                        value={formData.marca}
                        onChange={handleInputChange}
                    />
                    {formErrors.marca && (
                        <div className="text-red-400 text-sm mt-1 px-2">
                        {formErrors.marca}
                        </div>
                    )}
                    </div>

                    <div className="flex flex-col">
                    <label className="mb-1 font-bold text-sm">
                        Descripcion *
                    </label>
                    <input
                        className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                        type="text"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                    />
                    {formErrors.descripcion && (
                        <div className="text-red-400 text-sm mt-1 px-2">
                        {formErrors.descripcion}
                        </div>
                    )}
                    </div>

                    <div className="flex flex-col">
                    <label className="mb-1 font-bold text-sm">
                        Cantidad Entrada *
                    </label>
                    <input
                        className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                        type="text"
                        name="cantidadEntrada"
                        value={formData.cantidadEntrada}
                        onChange={handleInputChange}
                    />
                    {formErrors.cantidadEntrada && (
                        <div className="text-red-400 text-sm mt-1 px-2">
                        {formErrors.cantidadEntrada}
                        </div>
                    )}
                    </div>

                    <div className="flex flex-col">
                    <label className="mb-1 font-bold text-sm">
                        Subcategoría *
                    </label>
                    <select
                        className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                        name="SubcategoriaId"
                        value={formData.SubcategoriaId}
                        onChange={handleInputChange}
                    >
                        <option value="">Seleccione una Subcategoría</option>
                        {subcategorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.subcategoriaName}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div className="flex flex-col">
                    <label className="mb-1 font-bold text-sm">
                        Unidad de Medida *
                    </label>
                    <select
                        className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                        name="UnidadMedidaId"
                        value={formData.UnidadMedidaId}
                        onChange={handleInputChange}
                    >
                        <option value="">Seleccione una Unidad de medida</option>
                        {unidades.map((uni) => (
                        <option key={uni.id} value={uni.id}>
                            {uni.nombre}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div className="flex flex-col">
                    <label className="mb-1 font-bold text-sm">Estado *</label>
                    <select
                        className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                        name="EstadoId"
                        value={formData.EstadoId}
                        onChange={handleInputChange}
                    >
                        <option value="">Seleccione un estado</option>
                        {estados.map((estado) => (
                        <option
                            key={estado.id}
                            value={estado.id}
                            style={{
                            color:
                                estado.nombre === "ACTIVO"
                                ? "green"
                                : estado.nombre === "INACTIVO"
                                ? "red"
                                : "inherit",
                            }}
                        >
                            {estado.estadoName}
                        </option>
                        ))}
                    </select>
                    </div>
                    <div className="sm:w-full md:w-full flex flex-col justify-end">
                    <div className="flex justify-center mt-4 mb-4 mx-2">
                        <button className="btn-danger2 mx-2" onClick={onClose}>
                        Cancelar
                        </button>
                        <button
                        className="btn-primary2 mx-2"
                        onClick={handleCreate}
                        >
                        Agregar
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        <ToastContainer />
        </div>
    );
};

export default AddProductSubModal;
