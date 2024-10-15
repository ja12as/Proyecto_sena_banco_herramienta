import React, { useEffect, useState } from "react";
import { api } from "../api/token";
import { grey } from "@mui/material/colors";
import { ResponsivePie } from '@nivo/pie';

const PieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPedidosAndProductos = async () => {
      try {
        const pedidosResponse = await api.get("/pedido");
        const pedidos = pedidosResponse.data;

        const productosPromises = pedidos.map(async (pedido) => {
          const productosResponse = await api.get(`/pedido/${pedido.id}`);
          return { codigoFicha: pedido.codigoFicha, productos: productosResponse.data.Productos };
        });

        const pedidosConProductos = await Promise.all(productosPromises);

        const groupedData = pedidosConProductos.reduce((acc, pedido) => {
          const existingFicha = acc.find(item => item.codigoFicha === pedido.codigoFicha);

          if (existingFicha) {
            existingFicha.totalProductos += pedido.productos.reduce(
              (total, producto) => total + producto.PedidoProducto.cantidadSalida,
              0
            );
          } else {
            acc.push({
              codigoFicha: pedido.codigoFicha,
              totalProductos: pedido.productos.reduce(
                (total, producto) => total + producto.PedidoProducto.cantidadSalida,
                0
              ),
            });
          }

          return acc;
        }, []);

        const chartData = groupedData.map(item => ({
          id: item.codigoFicha,
          label: item.codigoFicha,
          value: item.totalProductos,
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPedidosAndProductos();
  }, []);

  return (
    <ResponsivePie
      data={data}
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
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={grey[900]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={grey[900]}
      legends={[
        {
          anchor: "bottom",
          direction: "column",
          justify: false,
          translateX: 90,
          translateY: 85,
          itemsSpacing: 0,
          itemWidth: 40,
          itemHeight: 18,
          itemTextColor: grey[900],
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 12,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: grey[700],
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
