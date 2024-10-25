import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { api } from "../api/token";
import { Box, Button, CardHeader, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PushPinIcon from '@mui/icons-material/PushPin';
import HardwareIcon from "@mui/icons-material/Hardware";
import LineChart from "../components/LineChart";
import ProgressCircle from "./../components/ProgressCircle";
import { green, grey } from "@mui/material/colors";
import StatBox1 from "./../components/StatBox1";
import { mockTransactions } from "../data/mockData";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import StatBox2 from "./StatBox2";
import StatBox3 from "./StatBox3";

const Resumen = () => {
  const [loading, setLoading] = useState(false);
  const [totalPedidos2024, setTotalPedidos2024] = useState(0);
  const [cantidadHerramientas, setCantidadHerramientas] = useState(0);
  const [historial, setHistorial] = useState([]);

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


  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await api.get("/historial");
        setHistorial(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el historial:", error);
        setLoading(false);
      }
    };

    fetchHistorial();
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
        <Typography color={grey[900]} variant="h6" fontWeight="600">
          Historial de Transacciones
        </Typography>
      </Box>

      {loading ? (
        <Typography variant="h6" fontWeight="400" color={grey[900]} p="15px">
          Cargando...
        </Typography>
      ) : (
        historial.map((transaction, i) => (
          <Box
            key={`${transaction.tipoAccion}-${i}`}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${grey[900]}`}
            p="15px"
          >
            <Box display="flex" flexDirection="column">
              <Typography color={green[500]} variant="h6" fontWeight="400">
                {transaction.tipoAccion}
              </Typography>
              <Typography color={grey[900]} variant="body1" fontWeight="200">
                {transaction.Usuario?.nombre}
              </Typography>
            </Box>
            <Typography color={grey[900]} variant="body1" fontWeight="200">
              {new Date(transaction.createdAt).toLocaleDateString()}
            </Typography>

            <Link to="/historial">
              <Box
                backgroundColor={green[500]}
                p="5px 10px"
                borderRadius="4px"
                variant="h6"
                fontWeight="200"
              >
                Ver
              </Box>
            </Link>
          </Box>
        ))
      )}
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
