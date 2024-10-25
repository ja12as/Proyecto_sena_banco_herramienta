import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { green, grey, orange, red } from "@mui/material/colors";
import { api } from "../api/token";

const ProgressCircle = ({ size = "100" }) => {
  const [data, setData] = useState({
    bueno: { count: 0, percentage: 0 },
    regular: { count: 0, percentage: 0 },
    malo: { count: 0, percentage: 0 },
  });

  useEffect(() => {
    const fetchHerramientas = async () => {
      try {
        const response = await api.get("/herramienta");
        const totalHerramientas = response.data.length;

        const herramientasBuenas = response.data.filter(
          (herramienta) => herramienta.condicion === "BUENO"
        ).length;
        const herramientasRegulares = response.data.filter(
          (herramienta) => herramienta.condicion === "REGULAR"
        ).length;
        const herramientasMalas = response.data.filter(
          (herramienta) => herramienta.condicion === "MALO"
        ).length;

        setData({
          bueno: {
            count: herramientasBuenas,
            percentage: (herramientasBuenas / totalHerramientas) * 100,
          },
          regular: {
            count: herramientasRegulares,
            percentage: (herramientasRegulares / totalHerramientas) * 100,
          },
          malo: {
            count: herramientasMalas,
            percentage: (herramientasMalas / totalHerramientas) * 100,
          },
        });
      } catch (error) {
        console.error("Error al obtener las herramientas", error);
      }
    };

    fetchHerramientas();
  }, []);

  const angleBueno = (data.bueno.percentage / 100) * 360;
  const angleRegular = (data.regular.percentage / 100) * 360;
  const angleMalo = (data.malo.percentage / 100) * 360;

  return (
    <Box display="flex" alignItems="center">
      <Box
        sx={{
          background: `radial-gradient(${grey[300]} 55%, transparent 56%),
            conic-gradient(${green[500]} 0deg ${angleBueno}deg,
            ${orange[500]} ${angleBueno}deg ${angleBueno + angleRegular}deg,
            ${red[500]} ${angleBueno + angleRegular}deg 360deg)`,
          borderRadius: "50%",
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
      <Box display="flex" flexDirection="column" ml={2}>
        <Box display="flex" alignItems="center" mb={1}>
          <Box
            sx={{
              width: 15,
              height: 15,
              backgroundColor: green[500],
              borderRadius: "50%",
              marginRight: 1,
            }}
          />
          <Typography variant="body2" sx={{ fontSize: "12px" }}>
            Bueno: {data.bueno.count} herramientas ({data.bueno.percentage.toFixed(2)}%)
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <Box
            sx={{
              width: 15,
              height: 15,
              backgroundColor: orange[500],
              borderRadius: "50%",
              marginRight: 1,
            }}
          />
          <Typography variant="body2" sx={{ fontSize: "12px" }}>
            Regular: {data.regular.count} herramientas ({data.regular.percentage.toFixed(2)}%)
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              width: 15,
              height: 15,
              backgroundColor: red[500],
              borderRadius: "50%",
              marginRight: 1,
            }}
          />
          <Typography variant="body2" sx={{ fontSize: "12px" }}>
            Malo: {data.malo.count} herramientas ({data.malo.percentage.toFixed(2)}%)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressCircle;
