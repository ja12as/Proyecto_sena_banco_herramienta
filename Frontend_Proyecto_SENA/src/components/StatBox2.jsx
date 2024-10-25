import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { red, grey, green } from "@mui/material/colors";
import { api } from "../api/token";
import NewProgressCircle2 from "./NewProgressCircle2";

const StatBox2 = ({ icon }) => {
  const [productoMasAgotado, setProductoMasAgotado] = useState(null);
  const [porcentajeDisponible, setPorcentajeDisponible] = useState(0);
  const [cargando, setCargando] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get("/producto");
        const productos = response.data;

        // Verifica si hay productos
        if (productos.length === 0) {
          setCargando(false); // Cambia a no cargando si no hay productos
          return;
        }

        // Encuentra el producto con menor disponibilidad
        const productoConMenorDisponibilidad = productos.reduce((a, b) => {
          const porcentajeA = (a.cantidadActual / a.cantidadEntrada) * 100;
          const porcentajeB = (b.cantidadActual / b.cantidadEntrada) * 100;
          return porcentajeA < porcentajeB ? a : b;
        });

        const porcentaje =
          (productoConMenorDisponibilidad.cantidadActual /
            productoConMenorDisponibilidad.cantidadEntrada) *
          100;

        setProductoMasAgotado(productoConMenorDisponibilidad);
        setPorcentajeDisponible(porcentaje);
      } catch (error) {
        console.error("Error al obtener los productos", error);
      } finally {
        setCargando(false); // Cambia a no cargando después de la carga
      }
    };

    fetchProductos();
  }, []);

  if (cargando) {
    return <Typography>Cargando...</Typography>;
  }

  // Si no hay productos, muestra un mensaje adecuado
  if (!productoMasAgotado) {
    return (
      <Typography>No hay productos disponibles en este momento.</Typography>
    );
  }

  return (
    <Box width="100%" m="0 30px">
      <Typography variant="h" fontWeight="600">
        Producto más agotado
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography variant="h6" fontWeight="bold" sx={{ color: grey[900] }}>
            {productoMasAgotado.cantidadActual} /{" "}
            {productoMasAgotado.cantidadEntrada}
          </Typography>
        </Box>

        <Box pr="20px">
          <NewProgressCircle2 progress={porcentajeDisponible} />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h" sx={{ color: red[500] }}>
          {productoMasAgotado.nombre}
        </Typography>
        <Typography variant="h" sx={{ color: green[500] }}>
          {porcentajeDisponible.toFixed(0)}% disponible
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox2;
