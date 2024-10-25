import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { grey, green } from "@mui/material/colors";
import { api } from "../api/token";
import NewProgressCircle3 from "./NewProgressCircle3";

const StatBox3 = ({ icon }) => {
  const [herramientaMasUsada, setHerramientaMasUsada] = useState(null);
  const [usoHerramienta, setUsoHerramienta] = useState(0);
  const [totalPrestamos, setTotalPrestamos] = useState(0);
  const [condicion, setCondicion] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const response = await api.get("/prestamos");
        const prestamos = response.data;

        setTotalPrestamos(prestamos.length);

        if (prestamos.length === 0) return;

        const herramientasContador = {};

        prestamos.forEach((prestamo) => {
          prestamo.Herramienta.forEach((herramienta) => {
            const nombreHerramienta = herramienta.nombre;
            herramientasContador[nombreHerramienta] =
              (herramientasContador[nombreHerramienta] || 0) + 1;
          });
        });

        const herramientaMasUsada = Object.keys(herramientasContador).reduce(
          (a, b) => (herramientasContador[a] > herramientasContador[b] ? a : b)
        );

        setUsoHerramienta(herramientasContador[herramientaMasUsada] || 0);

        const responseHerramienta = await api.get("/herramienta");
        const herramientas = responseHerramienta.data;

        const herramientaDetalles = herramientas.find(
          (herramienta) => herramienta.nombre === herramientaMasUsada
        );

        setHerramientaMasUsada(herramientaMasUsada);
        setCondicion(herramientaDetalles?.condicion?.toUpperCase() || "DESCONOCIDA");
      } catch (error) {
        console.error("Error al obtener los préstamos", error);
        setError("No se pudo cargar la información de préstamos.");
      }
    };

    fetchPrestamos();
  }, []);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Si no hay préstamos, mostrar un mensaje específico
  if (totalPrestamos === 0) {
    return <Typography>No hay herramientas prestadas en este momento.</Typography>;
  }

  // Si aún no se ha determinado la herramienta más usada y hay préstamos, muestra un mensaje de carga
  if (!herramientaMasUsada) {
    return <Typography>Cargando datos de herramientas...</Typography>;
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
            {usoHerramienta} veces usada
          </Typography>
        </Box>

        <Box pr="20px">
          <NewProgressCircle3 progress={100} condicion={condicion} />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h" sx={{ color: green[500] }}>
          {herramientaMasUsada}
        </Typography>
        <Typography variant="h" sx={{ color: grey[900] }}>
          Condición: {condicion}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox3;
