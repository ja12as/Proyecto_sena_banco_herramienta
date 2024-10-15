import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { red, grey, green } from "@mui/material/colors";
import { api } from "../api/token";
import NewProgressCircle3 from "./NewProgressCircle3";

const StatBox3 = ({ icon }) => {
  const [productoMasAgotado, setProductoMasAgotado] = useState(null);
  const [porcentajeDisponible, setPorcentajeDisponible] = useState(0);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get("/producto");
        const productos = response.data;

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
      }
    };

    fetchProductos();
  }, []);

  if (!productoMasAgotado) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Box width="100%" m="0 30px">
      <Typography variant="h" fontWeight="600">
        Herramienta más solicitada
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
          <NewProgressCircle3 progress={porcentajeDisponible} />
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

export default StatBox3
