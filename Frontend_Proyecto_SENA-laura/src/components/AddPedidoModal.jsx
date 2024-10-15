import React, { useEffect, useState } from "react";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPedidoModal = ({ isOpen, onClose, pedido }) => {
  const [formData, setFormData] = useState({
    id: "",
    idCliente: "",
    idProducto: "",
    cantidad: "",
    fechaPedido: "",
    fechaEntrega: "",
    estado: "",
    observaciones: "",
  });
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isOpen) {
      if (pedido) {
        fetchPedidoProfile();
      } else {
        resetForm();
      }
    }
  }, [isOpen, pedido]);
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get("/clientes");
        setClientes(response.data);
      } catch (error) {
        showToastError("Error al cargar los clientes");
      }
    };
    const fetchProductos = async () => {
      try {
        const response = await api.get("/productos");
        setProductos(response.data);
      } catch (error) {
        showToastError("Error al cargar los productos");
      }
    };
    const fetchEstados = async () => {
      try {
        const response = await api.get("/estados");
        setEstados(response.data);
      } catch (error) {
        showToastError("Error al cargar los estados");
      }
    };
    fetchClientes();
    fetchProductos();
    fetchEstados();
  }, []);
  const fetchPedidoProfile = async () => {
    if (!pedido) return;
    setLoading(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const response = await api.get(`/pedidos/${pedido.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setFormData(response.data);
      } else {
        setFormErrors({ fetch: response.data.message });
      }
    } catch (error) {
      setFormErrors({ fetch: "Error al cargar la información del pedido." });
    } finally {
      setLoading(false);
    }
  };
  const validarInput = (name, value) => {
    let errorMessage = "";
    if (name === "fechaEntrega" && new Date(value) <= new Date(formData.fechaPedido)) {
      errorMessage = "La fecha de entrega debe ser posterior a la fecha de pedido.";
    }
    if (name === "cantidad" && value <= 0) {
      errorMessage = "La cantidad debe ser mayor que cero.";
    }
    return errorMessage;
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = validarInput(name, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const showToastError = (mensaje) => {
    toast.error(mensaje, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const handleCreate = async () => {
    const {
      idCliente,
      idProducto,
      cantidad,
      fechaPedido,
      fechaEntrega,
      estado,
    } = formData;
    if (
      !idCliente ||
      !idProducto ||
      !cantidad ||
      !fechaPedido ||
      !fechaEntrega ||
      !estado
    ) {
      showToastError("Todos los campos obligatorios deben ser completados.");
      return;
    }
    setLoading(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const response = await api.post("/pedidos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        toast.success("Pedido agregado exitosamente", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          resetForm();
          onClose();
        }, 2000);
      } else {
        showToastError("Ocurrió un error, por favor intenta nuevamente.");
      }
    } catch (error) {
      showToastError("Ocurrió un error, por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      id: "",
      idCliente: "",
      idProducto: "",
      cantidad: "",
      fechaPedido: "",
      fechaEntrega: "",
      estado: "",
      observaciones: "",
    });
    setFormErrors({});
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
                  Registro Pedido
                </h6>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">ID *</label>
                  <input
                    className="bg-grisClaro text-xs rounded-lg px-2 py-1"
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">ID-Cliente *</label>
                  <select
                    className="bg-grisClaro text-xs rounded-lg px-2 py-1"
                    name="idCliente"
                    value={formData.idCliente}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">ID-Producto *</label>
                  <select
                    className="bg-grisClaro text-xs rounded-lg px-2 py-1"
                    name="idProducto"
                    value={formData.idProducto}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar</option>
                    {productos.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Cantidad *</label>
                  <input
                    className="bg-grisClaro text-xs rounded-lg px-2 py-1"
                    type="number"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleInputChange}
                  />
                  {formErrors.cantidad && (
                    <div className="text-red-400 text-xs mt-1 px-2">
                      {formErrors.cantidad}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Fecha Pedido *</label>
                  <input
                    className="bg-grisClaro text-xs rounded-lg px-2 py-1"
                    type="date"
                    name="fechaPedido"
                    value={formData.fechaPedido}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Fecha Entrega *</label>
                  <input
                    className="bg-grisClaro text-xs rounded-lg px-2 py-1"
                    type="date"
                    name="fechaEntrega"
                    value={formData.fechaEntrega}
                    onChange={handleInputChange}
                  />
                  {formErrors.fechaEntrega && (
                    <div className="text-red-400 text-xs mt-1 px-2">
                      {formErrors.fechaEntrega}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Estado *</label>
                  <select
                    className="bg-grisClaro text-xs rounded-lg px-2 py-1"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar</option>
                    {estados.map((estado) => (
                      <option key={estado.id} value={estado.id}>
                        {estado.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Observaciones</label>
                  <textarea
                    className="bg-grisClaro text-xs rounded-lg px-2 py-1"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="sm:w-full md:w-full flex flex-col justify-end">
                  <div className="flex justify-center mt-2 mb-2 mx-2">
                    <button className="btn-danger2 mx-2 text-xs py-2 px-4 rounded"onClick={onClose}>
                      Cancelar
                    </button>
                    <button
                      className="btn-primary2 mx-2 text-xs py-2 px-4 rounded"
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
export default AddPedidoModal;