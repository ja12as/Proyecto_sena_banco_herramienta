import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext"; 
import "react-toastify/dist/ReactToastify.css";

const EditPedidoModal = ({ isOpen, onClose, pedido }) => {
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FechaPedido: "",
    CantidadEntregada: "",
    IDUsuario: "",
    IDFicha: "",
    Id: "",
    CantidadSolicitada: "",
    Codigo: "",
    IDProducto: "",
    IDInstructor: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && pedido) {
      fetchPedidoDetails(pedido.Id);
    }
  }, [isOpen, pedido]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/usuarios");
        setUsuarios(response.data);
      } catch (error) {
        toast.error("Error al cargar los usuarios", { position: "top-right" });
      }
    };

    const fetchFichas = async () => {
      try {
        const response = await api.get("/fichas");
        setFichas(response.data);
      } catch (error) {
        toast.error("Error al cargar las fichas", { position: "top-right" });
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await api.get("/productos");
        setProductos(response.data);
      } catch (error) {
        toast.error("Error al cargar los productos", { position: "top-right" });
      }
    };

    const fetchInstructores = async () => {
      try {
        const response = await api.get("/instructores");
        setInstructores(response.data);
      } catch (error) {
        toast.error("Error al cargar los instructores", { position: "top-right" });
      }
    };

    fetchUsuarios();
    fetchFichas();
    fetchProductos();
    fetchInstructores();
  }, []);

  const fetchPedidoDetails = async (pedidoId) => {
    setLoading(true);
    try {
      const response = await api.get(`/pedidos/${pedidoId}`);
      if (response.status === 200) {
        const {
          FechaPedido,
          CantidadEntregada,
          IDUsuario,
          IDFicha,
          Id,
          CantidadSolicitada,
          Codigo,
          IDProducto,
          IDInstructor,
        } = response.data;
        setFormData({
          FechaPedido,
          CantidadEntregada,
          IDUsuario,
          IDFicha,
          Id,
          CantidadSolicitada,
          Codigo,
          IDProducto,
          IDInstructor,
        });
        setLoading(false);
      } else {
        console.error("Error fetching pedido details:", response.data.message);
        toast.error("Error al cargar la información del pedido.", {
          position: "top-right",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching pedido details:", error);
      toast.error("Error al cargar la información del pedido.", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "CantidadEntregada" && value <= 0) {
      errorMessage = "La cantidad entregada debe ser mayor que cero.";
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
      FechaPedido,
      CantidadEntregada,
      IDUsuario,
      IDFicha,
      Id,
      CantidadSolicitada,
      Codigo,
      IDProducto,
      IDInstructor,
    } = formData;

    if (!FechaPedido || !IDUsuario || !IDFicha || !CantidadSolicitada || !IDProducto || !IDInstructor) {
      toast.error("Todos los campos obligatorios deben ser completados.", {
        position: "top-right",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await api.put(
        `/pedidos/${Id}`,
        {
          FechaPedido,
          CantidadEntregada,
          IDUsuario,
          IDFicha,
          CantidadSolicitada,
          Codigo,
          IDProducto,
          IDInstructor,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Pedido actualizado exitosamente", {
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
        console.error("Error updating pedido:", response.data.message);
        toast.error("Error al actualizar la información del pedido.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating pedido:", error);
      if (error.response && error.response.status === 401) {
        setTimeout(() => {
          navigate("/");
        });
      } else {
        toast.error("Error al actualizar la información del pedido.", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Función para verificar permisos
  const hasPermission = (permissionName) => {
    return user.DetallePermisos.some(
      (permiso) => permiso.Permiso.nombrePermiso === permissionName
    );
  };  

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 ${isOpen ? "" : "hidden"}`}>
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
                <h6 className="font-bold text-center text-lg mb-1">Editar Pedido</h6>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Fecha Pedido *</label>
                  <input
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    type="date"
                    name="FechaPedido"
                    value={formData.FechaPedido}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Cantidad Entregada *</label>
                  <input
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    type="number"
                    name="CantidadEntregada"
                    value={formData.CantidadEntregada}
                    onChange={handleInputChange}
                  />
                  {formErrors.CantidadEntregada && (
                    <p className="text-red-500 text-xs">{formErrors.CantidadEntregada}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">ID Usuario *</label>
                  <select
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    name="IDUsuario"
                    value={formData.IDUsuario}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">ID Ficha *</label>
                  <select
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    name="IDFicha"
                    value={formData.IDFicha}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar</option>
                    {fichas.map((ficha) => (
                      <option key={ficha.id} value={ficha.id}>
                        {ficha.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Código *</label>
                  <input
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    type="text"
                    name="Codigo"
                    value={formData.Codigo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">ID Producto *</label>
                  <select
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    name="IDProducto"
                    value={formData.IDProducto}
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
                  <label className="mb-0.5 font-bold text-xs">ID Instructor *</label>
                  <select
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    name="IDInstructor"
                    value={formData.IDInstructor}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar</option>
                    {instructores.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Cantidad Solicitada *</label>
                  <input
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    type="number"
                    name="CantidadSolicitada"
                    value={formData.CantidadSolicitada}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-0.5 font-bold text-xs">Observaciones</label>
                  <textarea
                    className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                    name="observaciones"
                    value={formData.observaciones || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex justify-center mt-2 mb-2">
                  <button
                    className="btn-danger2 mx-2 text-xs py-2 px-4 rounded"
                    onClick={onClose}>
                    Cancelar
                  </button>
                  <button
                    className="btn-primary2 mx-2 text-xs py-2 px-4 rounded"
                    onClick={handleUpdate}
                    disabled={loading}
                  >
                    {loading ? "Cargando..." : "Actualizar"}
                  </button>
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
export default EditPedidoModal;