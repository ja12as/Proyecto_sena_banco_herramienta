// controllers/reportes.controller.js
import Producto from "../../models/Producto.js";
import xlsx from "xlsx";
import PDFDocument from "pdfkit";
import fs from "fs";
import ExcelJS from "exceljs";
import pkg from "pg";
const { Pool } = pkg;
import { Op } from "sequelize";
import Pedido from "./../../models/Pedido.js";
import Herramienta from "./../../models/Herramientas.js";
import PedidoProducto from "./../../models/PedidoProducto.js";
import Historial from "../../models/Historial.js";

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Función para generar Excel
const generateExcel = (data, filePath) => {
  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Reportes");
  xlsx.writeFile(workbook, filePath);
};

// Función para generar PDF
const generatePDF = (data, filePath) => {
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(25).text("Reporte", { align: "center" });
  doc.moveDown();

  data.forEach((item) => {
    doc.fontSize(12).text(JSON.stringify(item));
  });

  doc.end();
};

const formatDate = (date) => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
};

export const productosSolicitadosPorFicha = async (req, res) => {
  try {
    const reportData = await Pedido.findAll({
      include: [
        {
          model: Producto,
          through: {
            model: PedidoProducto,
            attributes: ["cantidadSalida"], 
          },
          attributes: ["nombre"],
        },
      ],
      attributes: ["codigoFicha", "createdAt"], 
    });

    const formattedData = reportData
      .map((pedido) => {
        return pedido.Productos.map((producto) => ({
          fecha: formatDate(pedido.createdAt),
          codigoFicha: pedido.codigoFicha,
          productoNombre: producto.nombre,
          cantidadSalida: producto.PedidoProducto.cantidadSalida,
        }));
      })
      .flat();

    const { formato } = req.query;

    if (formato === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Productos Solicitados");

      worksheet.columns = [
        { header: "Fecha", key: "fecha" },
        { header: "Código Ficha", key: "codigoFicha" },
        { header: "Nombre del Producto", key: "productoNombre" },
        { header: "Cantidad Salida", key: "cantidadSalida" },
      ];

      formattedData.forEach((item) => {
        worksheet.addRow(item);
      });

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="productos_solicitados_por_ficha.xlsx"'
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      await workbook.xlsx.write(res);
      res.end(); 
    } else if (formato === "pdf") {

      res.json({ formattedData }); 
    } else {
      res
        .status(400)
        .send("Formato no válido. Use ?formato=excel o ?formato=pdf.");
    }
  } catch (error) {
    console.error("Error al generar el reporte", error);
    res.status(500).json({ message: "Error al generar el reporte" });
  }
};

export const productosSolicitadosPorInstructor = async (req, res) => {
  try {
    const reportData = await Pedido.findAll({
      include: [
        {
          model: Producto,
          through: {
            model: PedidoProducto,
            attributes: ["cantidadSalida"], 
          },
          attributes: ["nombre"], 
        },
      ],
      attributes: ["servidorAsignado", "createdAt"],
    });

    const formattedData = reportData
      .map((pedido) => {
        return pedido.Productos.map((producto) => ({
          fecha: formatDate(pedido.createdAt), 
          servidorAsignado: pedido.servidorAsignado,
          productoNombre: producto.nombre,
          cantidadSalida: producto.PedidoProducto.cantidadSalida,
        }));
      })
      .flat();

    const { formato } = req.query; 

    if (formato === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Productos Solicitados");

      worksheet.columns = [
        { header: "Fecha", key: "fecha" },
        { header: "Servidor Asignado", key: "servidorAsignado" },
        { header: "Nombre del Producto", key: "productoNombre" },
        { header: "Cantidad Salida", key: "cantidadSalida" },
      ];

      formattedData.forEach((item) => {
        worksheet.addRow(item);
      });

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="productos_solicitados_por_instructor.xlsx"'
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      await workbook.xlsx.write(res);
      res.end(); 
    } else if (formato === "pdf") {
      res.json({ formattedData }); 
    } else {
      res
        .status(400)
        .send("Formato no válido. Use ?formato=excel o ?formato=pdf.");
    }
  } catch (error) {
    console.error("Error al generar el reporte", error);
    res.status(500).json({ message: "Error al generar el reporte" });
  }
};

export const productosMasSolicitados = async (req, res) => {
  try {
    const query = `
        SELECT p.nombre, SUM(pp."cantidadSalida") AS "totalSolicitado"
        FROM "PedidosProductos" pp
        JOIN "Productos" p ON pp."ProductoId" = p."id"
        GROUP BY p.nombre
        ORDER BY "totalSolicitado" DESC
        LIMIT 10;
      `;

    const result = await pool.query(query);
    console.log(result.rows); 
    const formattedData = result.rows;

    const { formato } = req.query;

    if (formato === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Productos Más Solicitados");

      worksheet.columns = [
        { header: "Nombre del Producto", key: "nombre" },
        { header: "Total Solicitado", key: "totalSolicitado" },
      ];

      try {
        formattedData.forEach((item) => {
          worksheet.addRow({
            nombre: item.nombre,
            totalSolicitado: Number(item.totalSolicitado) || 0, 
          });
        });
      } catch (error) {
        console.error("Error al agregar filas al Excel:", error);
      }

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="productos_mas_solicitados.xlsx"'
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      const buffer = await workbook.xlsx.writeBuffer();
      console.log("Buffer size:", buffer.length); 

      await workbook.xlsx.write(res);
      res.end(); 
    } else if (formato === "pdf") {
      res.json({ formattedData });
    } else {
      res
        .status(400)
        .send("Formato no válido. Use ?formato=excel o ?formato=pdf.");
    }
  } catch (error) {
    console.error("Error al generar el reporte", error);
    res.status(500).json({ message: "Error al generar el reporte" });
  }
};

export const herramientasMasSolicitadas = async (req, res) => {
  try {
    const query = `
        SELECT h.nombre, COUNT(ph."HerramientumId") AS "totalSolicitado"
        FROM "PrestamosHerramientas" ph
        JOIN "Herramientas" h ON ph."HerramientumId" = h."id"
        GROUP BY h.nombre
        ORDER BY "totalSolicitado" DESC
        LIMIT 10;
      `;

    const result = await pool.query(query);
    console.log(result.rows); 
    const formattedData = result.rows;

    const { formato } = req.query;

    if (formato === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Herramientas Más Solicitadas");

      worksheet.columns = [
        { header: "Nombre de la Herramienta", key: "nombre" },
        { header: "Total Solicitada", key: "totalSolicitado" },
      ];

      try {
        formattedData.forEach((item) => {
          worksheet.addRow({
            nombre: item.nombre,
            totalSolicitado: Number(item.totalSolicitado) || 0, 
          });
        });
      } catch (error) {
        console.error("Error al agregar filas al Excel:", error);
      }

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="herramientas_mas_solicitadas.xlsx"'
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      const buffer = await workbook.xlsx.writeBuffer();
      console.log("Buffer size:", buffer.length); 

      await workbook.xlsx.write(res);
      res.end(); 
    } else if (formato === "pdf") {
      res.json({ formattedData });
    } else {
      res
        .status(400)
        .send("Formato no válido. Use ?formato=excel o ?formato=pdf.");
    }
  } catch (error) {
    console.error("Error al generar el reporte", error);
    res.status(500).json({ message: "Error al generar el reporte" });
  }
};

export const productosAgotados = async (req, res) => {
  try {
    const reportData = await Producto.findAll({
      where: {
        cantidadActual: {
          [Op.lte]: 1,
        },
      },
    });

    const formattedData = reportData.map((producto) => ({
      nombre: producto.nombre,
      cantidadActual: producto.cantidadActual,
    }));

    const { formato } = req.query;

    if (formato === "excel") {
      // Lógica para generar Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Productos Agotados");
      worksheet.columns = [
        { header: "Nombre del Producto", key: "nombre", width: 30 },
        { header: "Cantidad Actual", key: "cantidadActual", width: 15 },
      ];
      reportData.forEach((producto) => {
        worksheet.addRow({
          nombre: producto.nombre,
          cantidadActual: producto.cantidadActual,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=productos_agotados.xlsx"
      );
      const buffer = await workbook.xlsx.writeBuffer();
      res.send(buffer);
    } else if (formato === "pdf") {
      // Solo enviar los datos sin generar el PDF aquí
      res.json({ formattedData });
    } else {
      res
        .status(400)
        .send("Formato no válido. Use ?formato=excel o ?formato=pdf.");
    }
  } catch (error) {
    console.error("Error al generar el reporte de productos agotados", error);
    res.status(500).json({ message: "Error al generar el reporte" });
  }
};

export const herramientasEnMalEstado = async (req, res) => {
  try {
    const query = `
        SELECT * FROM "Herramientas" WHERE "condicion" = 'MALO';
      `;

    const result = await pool.query(query);
    const formattedData = result.rows; 

    const { formato } = req.query;

    if (formato === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Herramientas en Mal Estado");

      worksheet.columns = [
        { header: "Nombre", key: "nombre" },
        { header: "Condición", key: "condicion" },
      ];

      try {
        formattedData.forEach((item) => {
          worksheet.addRow({
            nombre: item.nombre,
            condicion: item.condicion,
          });
        });
      } catch (error) {
        console.error("Error al agregar filas al Excel:", error);
      }

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="herramientas_en_mal_estado.xlsx"'
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      const buffer = await workbook.xlsx.writeBuffer();
      console.log("Buffer size:", buffer.length); 

      await workbook.xlsx.write(res);
      res.end(); 
    } else if (formato === "pdf") {
      res.json({ formattedData });
    } else {
      res
        .status(400)
        .send("Formato no válido. Use ?formato=excel o ?formato=pdf.");
    }
  } catch (error) {
    console.error("Error al generar el reporte", error);
    res.status(500).json({ message: "Error al generar el reporte" });
  }
};

export const pedidosPorCoordinador = async (req, res) => {
  try {
    const query = `
        SELECT p."jefeOficina", COUNT(p.id) AS "totalPedidos"
        FROM "Pedidos" p
        WHERE p."EstadoId" = 7 -- Suponiendo que 7 es el ID del estado "APROBADO"
        GROUP BY p."jefeOficina";
      `;

    const result = await pool.query(query);
    const formattedData = result.rows; 

    const { formato } = req.query; 

    if (formato === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        "Pedidos Aprobados por Coordinador"
      );

      worksheet.columns = [
        { header: "Coordinador", key: "jefeOficina" },
        { header: "Total Pedidos Aprobados", key: "totalPedidos" },
      ];

      formattedData.forEach((item) => {
        worksheet.addRow({
          jefeOficina: item.jefeOficina,
          totalPedidos: item.totalPedidos,
        });
      });

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="pedidos_aprobados_por_coordinador.xlsx"'
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      await workbook.xlsx.write(res);
      res.end(); 
    } else if (formato === "pdf") {

      res.json({ formattedData }); 
    } else {
      res
        .status(400)
        .send("Formato no válido. Use ?formato=excel o ?formato=pdf.");
    }
  } catch (error) {
    console.error("Error al generar el reporte", error);
    res.status(500).json({ message: "Error al generar el reporte" });
  }
};

export const productosNuevos = async (req, res) => {
  try {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30); 

    const reportData = await Producto.findAll({
      where: {
        createdAt: {
          [Op.gte]: fechaLimite, 
        },
      },
    });

    if (reportData.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron productos nuevos." });
    }

    const formattedData = reportData.map((producto) => ({
      nombre: producto.nombre,
      codigo: producto.codigo,
      descripcion: producto.descripcion,
      cantidadActual: producto.cantidadActual,
      cantidadEntrada: producto.cantidadEntrada,
      createdAt: producto.createdAt,
    }));

    const { formato } = req.query; 

    if (formato === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Productos Nuevos");

      worksheet.columns = [
        { header: "Nombre", key: "nombre" },
        { header: "Código", key: "codigo" },
        { header: "Descripción", key: "descripcion" },
        { header: "Cantidad Actual", key: "cantidadActual" },
        { header: "Cantidad Entrada", key: "cantidadEntrada" },
        { header: "Fecha de Creación", key: "createdAt" },
      ];

      formattedData.forEach((item) => {
        worksheet.addRow(item);
      });

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="productos_nuevos.xlsx"'
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      await workbook.xlsx.write(res);
      res.end(); 
    } else if (formato === "pdf") {

      res.json({ formattedData });
    } else {
      res
        .status(400)
        .send("Formato no válido. Use ?formato=excel o ?formato=pdf.");
    }
  } catch (error) {
    console.error("Error al generar el reporte de productos nuevos", error);
    res.status(500).json({ message: "Error al generar el reporte" });
  }
};
