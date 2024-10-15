import React from "react";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import { FaBeer, FaWeight, FaRuler, FaTemperatureHigh, FaClock, FaBolt, FaTachometerAlt, FaLayerGroup } from "react-icons/fa";

const UnidadMedida = () => {
  const [sidebarToggle, setSidebarToggle] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-fondo">
      <Sidebar sidebarToggle={sidebarToggle} />
      <div className={`flex-1 px-4 md:px-8 lg:px-32 ${sidebarToggle ? "ml-custom" : ""}`}>
        <Home
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />

        <header className="mb-6 mt-24 text-center bg-fondo p-5 rounded-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-negro">
            Unidades de Medida
          </h1>
          <p className="text-negro mb-4 text-sm md:text-base">
            Explora las diversas unidades de medida que utilizamos en diferentes
            contextos.
          </p>
          <p className="text-negro mb-4 text-sm md:text-base">
            Las unidades de medida que vamos a utilizar son fundamentales para
            nuestro sistema de inventario. Nos permiten cuantificar y comparar
            diferentes magnitudes de manera precisa. En este contexto, cada
            unidad tiene un papel específico que facilita la interpretación y
            aplicación de nuestros datos.
          </p>
        </header>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
              <FaBeer className="text-3xl md:text-4xl text-sena mb-2" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Volumen</h3>
              <p className="text-sm md:text-base">
                El volumen es la medida del espacio que ocupa un objeto o sustancia. Se expresa 
                en unidades como litros (L), mililitros (ml) y metros cúbicos (m³).
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
              <FaWeight className="text-3xl md:text-4xl text-sena mb-2" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Peso</h3>
              <p className="text-sm md:text-base">
                El peso es la fuerza gravitacional sobre un objeto y se mide en kilogramos (kg), gramos (g) y toneladas (t).
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
              <FaRuler className="text-3xl md:text-4xl text-sena mb-2" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Longitud</h3>
              <p className="text-sm md:text-base">
                La longitud mide la distancia entre dos puntos y se expresa en m, cm, mm, in, ft, yd y km.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
              <FaTemperatureHigh className="text-3xl md:text-4xl text-sena mb-2" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Temperatura</h3>
              <p className="text-sm md:text-base">
                La temperatura mide el calor o frío y se expresa en grados Celsius (°C), Fahrenheit (°F) y Kelvin (K).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
              <FaClock className="text-3xl md:text-4xl text-sena mb-2" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Tiempo</h3>
              <p className="text-sm md:text-base">
                El tiempo mide la duración entre eventos y se expresa en segundos (s), minutos (min), horas (h), días (d), 
                semanas (wk), meses (mo) y años (yr).
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
              <FaBolt className="text-3xl md:text-4xl text-sena mb-2" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Energía</h3>
              <p className="text-sm md:text-base">
                La energía mide la capacidad de realizar trabajo y se expresa en julios (J), calorías (cal) y kilovatio-hora (kWh).
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
              <FaTachometerAlt className="text-3xl md:text-4xl text-sena mb-2" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Presión</h3>
              <p className="text-sm md:text-base">
                La presión mide la fuerza por unidad de área y se expresa en pascales (Pa), bares (bar) y libras por pulgada cuadrada (psi).
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
              <FaLayerGroup className="text-3xl md:text-4xl text-sena mb-2" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Área</h3>
              <p className="text-sm md:text-base">
                El área mide la extensión de una superficie en dos dimensiones y se expresa en m², cm², ha y ac.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-left text-negro">
            Unidades de Medidas Utilizadas
          </h2>
          <div className="overflow-x-auto flex justify-center items-center">
            <table className="min-w-full max-w-4xl bg-white border border-gris rounded-lg shadow-md text-center">
              <thead className="bg-grisClaro">
                <tr>
                  <th>Tipo</th>
                  <th>Sigla</th>
                  <th>Nombre</th>
                  <th>Equivalencia</th>
                </tr>
              </thead>
              <tbody>
                {/* Sección de Volumen */}
                <tr>
                  <td className="bg-sena text-white" rowSpan="6">Volumen</td>
                  <td>L</td>
                  <td>Litro</td>
                  <td>1 L = 1,000 ml = 1,000 cm³ = 0.2642 gal</td>
                </tr>
                <tr>
                  <td>ml</td>
                  <td>Mililitro</td>
                  <td>1 ml = 1 cm³ = 0.001 L</td>
                </tr>
                <tr>
                  <td>cm³</td>
                  <td>Centímetro cúbico</td>
                  <td>1 cm³ = 1 ml = 0.001 L</td>
                </tr>
                <tr>
                  <td>gal</td>
                  <td>Galón</td>
                  <td>1 gal = 3.785 L</td>
                </tr>
                <tr>
                  <td>pt</td>
                  <td>Pinta</td>
                  <td>1 pt = 0.473 L</td>
                </tr>
                <tr>
                  <td>qt</td>
                  <td>Cuarto de galón</td>
                  <td>1 qt = 0.946 L</td>
                </tr>
                <tr>
                  <td colSpan="4" className="border-t border-gray-300"></td>
                </tr>

                {/* Sección de Peso */}
                <tr>
                  <td className="bg-sena text-white" rowSpan="6">Peso</td>
                  <td>kg</td>
                  <td>Kilogramo</td>
                  <td>1 kg = 1,000 g = 0.001 t</td>
                </tr>
                <tr>
                  <td>g</td>
                  <td>Gramo</td>
                  <td>1 g = 0.001 kg</td>
                </tr>
                <tr>
                  <td>mg</td>
                  <td>Miligramo</td>
                  <td>1 mg = 0.001 g</td>
                </tr>
                <tr>
                  <td>oz</td>
                  <td>Onza</td>
                  <td>1 oz = 28.35 g</td>
                </tr>
                <tr>
                  <td>t</td>
                  <td>Tonelada</td>
                  <td>1 t = 1,000 kg</td>
                </tr>
                <tr>
                  <td>lb</td>
                  <td>Libra</td>
                  <td>1 lb = 0.4536 kg</td>
                </tr>
                <tr>
                  <td colSpan="4" className="border-t border-gray-300"></td>
                </tr>

                {/* Sección de Longitud */}
                <tr>
                  <td className="bg-sena text-white" rowSpan="7">Longitud</td>
                  <td>m</td>
                  <td>Metro</td>
                  <td>1 m = 100 cm = 1,000 mm = 39.37 in</td>
                </tr>
                <tr>
                  <td>cm</td>
                  <td>Centímetro</td>
                  <td>1 cm = 10 mm = 0.01 m</td>
                </tr>
                <tr>
                  <td>mm</td>
                  <td>Milímetro</td>
                  <td>1 mm = 0.1 cm = 0.001 m</td>
                </tr>
                <tr>
                  <td>in</td>
                  <td>Pulgada</td>
                  <td>1 in = 2.54 cm</td>
                </tr>
                <tr>
                  <td>ft</td>
                  <td>Pie</td>
                  <td>1 ft = 12 in = 30.48 cm</td>
                </tr>
                <tr>
                  <td>yd</td>
                  <td>Yarda</td>
                  <td>1 yd = 3 ft = 0.9144 m</td>
                </tr>
                <tr>
                  <td>km</td>
                  <td>Kilómetro</td>
                  <td>1 km = 1,000 m</td>
                </tr>
                <tr>
                  <td colSpan="4" className="border-t border-gray-300"></td>
                </tr>

                {/* Sección de Temperatura */}
                <tr>
                  <td className="bg-sena text-white" rowSpan="3">Temperatura</td>
                  <td>°C</td>
                  <td>Grados Celsius</td>
                  <td>°C = (°F - 32) / 1.8 = K - 273.15</td>
                </tr>
                <tr>
                  <td>°F</td>
                  <td>Grados Fahrenheit</td>
                  <td>°F = (°C * 1.8) + 32</td>
                </tr>
                <tr>
                  <td>K</td>
                  <td>Kelvin</td>
                  <td>K = °C + 273.15</td>
                </tr>
                <tr>
                  <td colSpan="4" className="border-t border-gray-300"></td>
                </tr>

                {/* Sección de Tiempo */}
                <tr>
                  <td className="bg-sena text-white" rowSpan="7">Tiempo</td>
                  <td>s</td>
                  <td>Segundo</td>
                  <td>1 s = 1 s</td>
                </tr>
                <tr>
                  <td>min</td>
                  <td>Minuto</td>
                  <td>1 min = 60 s</td>
                </tr>
                <tr>
                  <td>h</td>
                  <td>Hora</td>
                  <td>1 h = 60 min = 3,600 s</td>
                </tr>
                <tr>
                  <td>d</td>
                  <td>Día</td>
                  <td>1 d = 24 h = 1,440 min = 86,400 s</td>
                </tr>
                <tr>
                  <td>wk</td>
                  <td>Semana</td>
                  <td>1 wk = 7 d = 168 h</td>
                </tr>
                <tr>
                  <td>mo</td>
                  <td>Mes</td>
                  <td>1 yr = 365 d (366 en bisiesto)</td>
                </tr>
                <tr>
                  <td>yr</td>
                  <td>Año</td>
                  <td>1 yr = 365 d = 8,760 h</td>
                </tr>
                <tr>
                  <td colSpan="4" className="border-t border-gray-300"></td>
                </tr>

                {/* Sección de Energía */}
                <tr>
                  <td className="bg-sena text-white" rowSpan="3">Energía</td>
                  <td>J</td>
                  <td>Joule</td>
                  <td>1 J = 0.239 cal</td>
                </tr>
                <tr>
                  <td>cal</td>
                  <td>Caloría</td>
                  <td>1 cal = 4.184 J</td>
                </tr>
                <tr>
                  <td>kWh</td>
                  <td>Kilovatio-hora</td>
                  <td>1 kWh = 3.6 × 10^6 J</td>
                </tr>
                <tr>
                  <td colSpan="4" className="border-t border-gray-300"></td>
                </tr>

                {/* Sección de Presión */}
                <tr>
                  <td className="bg-sena text-white" rowSpan="3">Presión</td>
                  <td>Pa</td>
                  <td>Pascal</td>
                  <td>1 Pa = 1 N/m²</td>
                </tr>
                <tr>
                  <td>bar</td>
                  <td>Bar</td>
                  <td>1 bar = 100,000 Pa</td>
                </tr>
                <tr>
                  <td>psi</td>
                  <td>Libra por pulgada cuadrada</td>
                  <td>1 psi = 6895 Pa</td>
                </tr>
                <tr>
                  <td colSpan="4" className="border-t border-gray-300"></td>
                </tr>

                {/* Sección de Área */}
                <tr>
                  <td className="bg-sena text-white" rowSpan="3">Área</td>
                  <td>m²</td>
                  <td>Metro cuadrado</td>
                  <td>1 m² = 10,000 cm²</td>
                </tr>
                <tr>
                  <td>cm²</td>
                  <td>Centímetro cuadrado</td>
                  <td>1 cm² = 0.0001 m²</td>
                </tr>
                <tr>
                  <td>ha</td>
                  <td>Hectárea</td>
                  <td>1 ha = 10,000 m²</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UnidadMedida;