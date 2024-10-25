import { blue, grey } from "@mui/material/colors";
import { ResponsiveLine } from "@nivo/line";
import { useState, useEffect } from "react";
import { api } from "../api/token";

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const transformData = (pedidos) => {
    const groupedByServidor = pedidos.reduce((acc, pedido) => {
      const servidor = pedido.servidorAsignado;
      const fechaPedido = new Date(pedido.createdAt);
      const mes = fechaPedido
        .toLocaleString("default", { month: "short" })
        .toLowerCase();

      if (!acc[servidor]) {
        acc[servidor] = {};
      }

      acc[servidor][mes] = (acc[servidor][mes] || 0) + 1;
      return acc;
    }, {});

    const formattedData = Object.keys(groupedByServidor).map((servidor) => ({
      id: servidor,
      data: [
        { x: "ene", y: groupedByServidor[servidor]["ene"] || 0 },
        { x: "feb", y: groupedByServidor[servidor]["feb"] || 0 },
        { x: "mar", y: groupedByServidor[servidor]["mar"] || 0 },
        { x: "abr", y: groupedByServidor[servidor]["abr"] || 0 },
        { x: "may", y: groupedByServidor[servidor]["may"] || 0 },
        { x: "jun", y: groupedByServidor[servidor]["jun"] || 0 },
        { x: "jul", y: groupedByServidor[servidor]["jul"] || 0 },
        { x: "ago", y: groupedByServidor[servidor]["ago"] || 0 },
        { x: "sep", y: groupedByServidor[servidor]["sep"] || 0 },
        { x: "oct", y: groupedByServidor[servidor]["oct"] || 0 },
        { x: "nov", y: groupedByServidor[servidor]["nov"] || 0 },
        { x: "dic", y: groupedByServidor[servidor]["dic"] || 0 },
      ],
    }));

    return formattedData;
  };

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/pedido", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const transformedData = transformData(response.data);
      setChartData(transformedData);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return chartData.length > 0 ? (
    <ResponsiveLine
      data={chartData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: grey[900],
            },
          },
          legend: {
            text: {
              fill: grey[900],
            },
          },
          ticks: {
            line: {
              stroke: grey[900],
              strokeWidth: 1,
            },
            text: {
              fill: grey[900],
            },
          },
        },
        legends: {
          text: {
            fill: grey[900],
          },
        },
        tooltip: {
          container: {
            color: blue[500],
          },
        },
      }}
      colors={["#00C49F", "#FFBB28", "#FF8042", "#0088FE"]}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{
        type: "band",
        domain: [
          "ene",
          "feb",
          "mar",
          "abr",
          "may",
          "jun",
          "jul",
          "ago",
          "sep",
          "oct",
          "nov",
          "dic",
        ],
      }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Mes",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Número de Pedidos",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
    ) : (
      <p>Cargando datos...</p>
  );
};

export default LineChart;
