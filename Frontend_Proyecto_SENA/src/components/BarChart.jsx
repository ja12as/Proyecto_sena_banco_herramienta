import React, { useEffect, useState } from "react";
import { api } from "../api/token";
import { grey } from "@mui/material/colors";
import { ResponsiveBar } from "@nivo/bar";

const BarChart = () => {
  const [data, setData] = useState([]);
  

  useEffect(() => {
    const fetchPedidosAndProductos = async () => {
      try {
        const pedidosResponse = await api.get("/pedido");
        const pedidos = pedidosResponse.data;
        const groupedData = {};
        for (const pedido of pedidos) {
          const productosResponse = await api.get(`/pedido/${pedido.id}`);
          const productos = productosResponse.data.Productos;
          for (const producto of productos) {
            const cantidadSalida = producto.PedidoProducto.cantidadSalida;
            if (!groupedData[pedido.servidorAsignado]) {
              groupedData[pedido.servidorAsignado] = {
                servidorAsignado: pedido.servidorAsignado,
                totalProductos: 0,
              };
            }
            groupedData[pedido.servidorAsignado].totalProductos +=
              cantidadSalida;
          }
        }
        const finalData = Object.values(groupedData).map((item) => ({
          servidorAsignado: item.servidorAsignado,
          totalProductos: item.totalProductos,
        }));
        setData(finalData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPedidosAndProductos();
  }, []);

  const colorMap = {};
  
  const coloresDisponibles = [
    "#FF6347",
    "#4682B4",
    "#32CD32",
    "#FFD700",
    "#FF4500",
    "#6A5ACD",
  ];

  const getColor = (bar) => {
    if (!colorMap[bar.indexValue]) {
      colorMap[bar.indexValue] =
        coloresDisponibles[
          Object.keys(colorMap).length % coloresDisponibles.length
        ];
    }
    return colorMap[bar.indexValue];
  };

  return (
    <ResponsiveBar
      data={data}
      keys={["totalProductos"]}
      indexBy="servidorAsignado"
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
        grid: {
          line: {
            stroke: grey[400],
            strokeWidth: 1,
          },
        },
        legends: {
          text: {
            fill: grey[900],
          },
        },
      }}
      margin={{ top: 50, right: 130, bottom: 60, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={getColor}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -35,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Cantidad de Productos",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableGridX={false}
      enableGridY={true}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="transparent"
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " en servidor: " + e.indexValue
      }
    />
  );
};

export default BarChart;
