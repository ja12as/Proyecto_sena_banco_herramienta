import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { api } from "../api/token";
import { Box, Button, CardHeader, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
//import ForestIcon from "@mui/icons-material/Forest";
import PushPinIcon from '@mui/icons-material/PushPin';
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import HardwareIcon from "@mui/icons-material/Hardware";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import LineChart from "../components/LineChart";
import ProgressCircle from "./../components/ProgressCircle";
import { green, grey } from "@mui/material/colors";
import StatBox1 from "./../components/StatBox1";
import { mockTransactions } from "../data/mockData";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import Reportes from "../pages/Reportes";
import StatBox2 from "./StatBox2";
import StatBox3 from "./StatBox3";

const Resumen = () => {
  const [loading, setLoading] = useState(false);
  const [totalPedidos2024, setTotalPedidos2024] = useState(0);
  const [cantidadHerramientas, setCantidadHerramientas] = useState(0);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/pedido", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const pedidos2024 = response.data.filter((pedido) => {
        const fechaPedido = new Date(pedido.createdAt); 
        return fechaPedido.getFullYear() === 2024;
      });

      setTotalPedidos2024(pedidos2024.length);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  useEffect(() => {
    const fetchHerramientas = async () => {
      try {
        const response = await api.get("/herramienta");
        
        const herramientasBuenas = response.data.filter(
          (herramienta) => herramienta.condicion === "Bueno"
        );
        setCantidadHerramientas(herramientasBuenas.length);
      } catch (error) {
        console.error("Error al obtener las herramientas", error);
      }
    };

    fetchHerramientas();
  }, []);

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/reportes");
  };

  return (
    <div>
      <Box m="20px">
        {/* HEADER */}
        <Box className="flex justify-between items-center font-inter">
          <CardHeader
            title="DASHBOARD"
            subheader="Bienvenido a tu panel de control"
            sx={{
              ".MuiCardHeader-title": {
                fontWeight: "bold",
                fontSize: "1.50rem",
              },
            }}
          />
          <Box>
            <Button
              color="primary"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                padding: "10px 20px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  color: "white",
                },
                "&:active": {
                  backgroundColor: "primary.light",
                  color: "white",
                },
                "&:focus": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
              onClick={handleRedirect}
            >
              <DownloadIcon sx={{ mr: "10px" }} />
              Descargar Reportes
            </Button>
          </Box>
        </Box>

        {/* CUADRÍCULAS Y GRÁFICOS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          {/* FILA 1 */}
          <Box
            gridColumn="span 4"
            backgroundColor="grisClaro.main"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox1
              cantidad="190"
              producto="Madera"
              progress="0.75"
              disponible="Disp: 75%"
              icon={<PushPinIcon sx={{ color: green[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box
            gridColumn="span 4"
            backgroundColor="grisClaro.main"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox2
              cantidad="1,225"
              producto="Pintura"
              progress="0.50"
              disponible="Disp: 50%"
              icon={
                <PushPinIcon
                  sx={{ color: green[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 4"
            backgroundColor="grisClaro.main"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox3
              cantidad="12,441"
              producto="Puntillas"
              progress="0.30"
              disponible="Disp: 30%"
              icon={
                <HardwareIcon sx={{ color: green[600], fontSize: "26px" }} />
              }
            />
          </Box>

          {/* FILA 2 */}
          <Box
            gridColumn="span 8"
            gridRow="span 2"
            backgroundColor="grisClaro.main"
          >
            <Box
              mt="25px"
              p="0 30px"
              display="flex "
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h6" fontWeight="600" color={grey[900]}>
                  Pedidos realizados por instructores en el 2024
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={green[500]}>
                  {loading ? "Cargando..." : totalPedidos2024}
                </Typography>
              </Box>
            </Box>
            <Box height="250px" m="-20px 0 0 0">
              <LineChart isDashboard={true} />
            </Box>
          </Box>

          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor="grisClaro.main"
            overflow="auto"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${grey[900]}`}
              color={grey[900]}
              p="15px"
            >
              <Typography color={grey[900]} variant="h" fontWeight="600">
                Historial de Transacciones
              </Typography>
            </Box>
            {mockTransactions.map((transaction, i) => (
              <Box
                key={`${transaction.accion}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${grey[900]}`}
                p="15px"
              >
                <Box display="flex" flexDirection="column">
                  <Typography color={green[500]} variant="h" fontWeight="400">
                    {transaction.accion}
                  </Typography>
                  <Typography color={grey[900]} variant="h" fontWeight="200">
                    {transaction.usuario}
                  </Typography>
                </Box>
                <Box color={grey[900]} variant="h6" fontWeight="200">
                  {transaction.fecha}
                </Box>

                <Link to="/historial">
                  <Box
                    backgroundColor={green[500]}
                    p="5px 10px"
                    borderRadius="4px"
                    variant="h6"
                    fontWeight="200"
                  >
                    {transaction.estado}
                  </Box>
                </Link>
              </Box>
            ))}
          </Box>

          {/* FILA 3 */}
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor="grisClaro.main"
            p="30px"
          >
            <Typography variant="h" fontWeight="600">
              Estado de las Herramientas 
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              <ProgressCircle size="125" />
              <Typography variant="h" color={green[500]} sx={{ mt: "15px" }}>
                {cantidadHerramientas} Herramientas en buen estado
              </Typography>
              <Typography variant="h">
                Con gestión constante para el incremento{" "}
              </Typography>
            </Box>
          </Box>

          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor="grisClaro.main"
            pt="30px"
          >
            <Typography
              variant="h"
              fontWeight="600"
              sx={{ padding: "30px 30px 0 30px" }}
            >
              Pedidos por instructor y fichas
            </Typography>
            <Box height="250px" mt="-20px">
              <BarChart isDashboard={true} />
            </Box>
          </Box>
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor="grisClaro.main"
            paddingTop="30px"
            paddingLeft="30px"
            paddingRight="30px"
          >
            <Typography
              variant="h"
              fontWeight="600"
              sx={{ marginBottom: "15px" }}
            >
              Consumo de productos por fichas
            </Typography>
            <Box height="200px">
              <PieChart isDashboard={true} />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Resumen;
