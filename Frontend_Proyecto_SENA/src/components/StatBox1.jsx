import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { api } from "../api/token";
import NewProgressCircle1 from "./NewProgressCircle1";

const StatBox1 = ({ icon }) => {
  const [productoMasPedido, setProductoMasPedido] = useState(null);
  const [porcentajeDisponible, setPorcentajeDisponible] = useState(0);
  const [cargando, setCargando] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await api.get("/pedido");
        const pedidos = response.data;

        // Verifica si hay pedidos
        if (pedidos.length === 0) {
          setCargando(false); // Cambia a no cargando si no hay pedidos
          return;
        }

        const productoCantidadMap = {};

        pedidos.forEach((pedido) => {
          pedido.Productos.forEach((producto) => {
            if (!productoCantidadMap[producto.nombre]) {
              productoCantidadMap[producto.nombre] = 0;
            }
            productoCantidadMap[producto.nombre] +=
              producto.PedidoProducto.cantidadSolicitar;
          });
        });

        const nombreProductoMasPedido = Object.keys(productoCantidadMap).reduce(
          (a, b) => (productoCantidadMap[a] > productoCantidadMap[b] ? a : b)
        );

        const cantidad = productoCantidadMap[nombreProductoMasPedido];
        setProductoMasPedido({ nombre: nombreProductoMasPedido, cantidad });
      } catch (error) {
        console.error("Error al obtener los pedidos", error);
      } finally {
        setCargando(false); // Cambia a no cargando después de la carga
      }
    };

    fetchPedidos();
  }, []);

  useEffect(() => {
    const fetchProductoMasPedido = async () => {
      if (!productoMasPedido) return;

      try {
        const response = await api.get("/producto");
        const productos = response.data;

        const producto = productos.find(
          (p) => p.nombre === productoMasPedido.nombre
        );

        if (producto) {
          const porcentaje =
            (producto.cantidadActual / producto.cantidadEntrada) * 100;
          setPorcentajeDisponible(porcentaje);
        } else {
          // Si no se encuentra el producto
          setPorcentajeDisponible(0);
        }
      } catch (error) {
        console.error("Error al obtener los productos", error);
      }
    };

    fetchProductoMasPedido();
  }, [productoMasPedido]);

  if (cargando) {
    return <Typography>Cargando...</Typography>;
  }

  // Si no hay producto más pedido, muestra un mensaje adecuado
  if (!productoMasPedido) {
    return (
      <Typography>No hay productos más solicitados en este momento.</Typography>
    );
  }

  return (
    <Box width="100%" m="0 30px">
      <Typography variant="h" fontWeight="600">
        Producto más solicitado
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography variant="h6" fontWeight="bold" sx={{ color: grey[900] }}>
            {productoMasPedido.cantidad}
          </Typography>
        </Box>

        <Box pr="20px">
          <NewProgressCircle1 progress={porcentajeDisponible} />{" "}
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h" sx={{ color: green[500] }}>
          {productoMasPedido.nombre}
        </Typography>
        <Typography variant="h" sx={{ color: green[500] }}>
          {porcentajeDisponible.toFixed(0)}% disponible{" "}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox1;
