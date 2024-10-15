import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Contras_1 from "./pages/Contras_1.jsx";
import Contras_2 from "./pages/Contras_2.jsx";
import Contra_3 from "./pages/Contras_3.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Usuarios from "./pages/Usuarios.jsx";
import Roles from "./pages/Roles.jsx";
import Categorias from "./pages/Categorias.jsx";
import Instructores from "./pages/Instructores.jsx";
import Fichas from "./pages/Fichas.jsx";
import ImportExcel from "./pages/ImportExcel.jsx";
import Subcategorias from "./pages/Subcategorias.jsx";
import UnidadMedida from "./pages/UnidadMedida.jsx";
import Productos from "./pages/Productos.jsx";
import Herramientas from "./pages/Herramientas.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Prestamos from "./pages/Prestamos.jsx";
import Pedidos from "./pages/Pedidos.jsx";
import Historial from "./pages/Historial.jsx";
import Formularios from "./pages/Formularios.jsx";
import PedidosIntructores from "./pages/PedidosIntructores.jsx";
import FirmaPedidos from "./pages/FirmaPedidos.jsx";
import FormatoHerram from "./pages/FormatoHerram.jsx";
import HomeCoord from "./pages/HomeCoord.jsx";
import NoPermiso from "./components/NoPermiso.jsx";
import Intructor_Ficha from "./pages/Instructor_Ficha.jsx";
import FichasCoordi from "./pages/FichasCoordi.jsx";
import Reportes from "./pages/Reportes.jsx";
import ConsumoDevolutivoGeneral from "./pages/ConsumoDevolutivoGeneral.jsx";
import ConsumoControladoGeneral from "./pages/ConsumoControladoGeneral.jsx";
import AutorizarPedidos from "./pages/AutorizarPedidos.jsx";
import AutorizarPrestamos from "./pages/AutorizarPrestamos.jsx";
import FirmaPrestamos from "./pages/FirmaPrestamos.jsx";
import GestionarPedidos from "./pages/GestionarPedidos.jsx";
import GestionarPrestamos from "./pages/GestionarPrestamos.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/contras_1" element={<Contras_1 />} />
          <Route path="/contras_2" element={<Contras_2 />} />
          <Route path="/contras_3" element={<Contra_3 />} />
          <Route path="/formularios" element={<Formularios />} />
          <Route path="/pedInstructores" element={<PedidosIntructores />} />
          <Route path="/formatoHerramientas" element={<FormatoHerram />} />
          <Route path="/no-permission" element={<NoPermiso />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/roles" element={<Roles />} /> 
            <Route path="/excel" element={<ImportExcel />} />

            {/* Ruta protegida por permiso */}
            <Route
              path="/usuarios"
              element={<ProtectedRoute requiredPermission="Vista Usuario" />}
            >
              <Route path="" element={<Usuarios />} />
            </Route>
            <Route
              path="/fichas"
              element={<ProtectedRoute requiredPermission="Vista Fichas" />}
            >
              <Route path="" element={<Fichas />} />
            </Route>
            <Route
              path="/instructor-fichas"
              element={<ProtectedRoute requiredPermission="Vista Fichas" />}
            >
              <Route path="" element={<Intructor_Ficha />} />
            </Route>
            <Route
              path="/instructores"
              element={<ProtectedRoute requiredPermission="Vista Instructores" />}
            >
              <Route path="" element={<Instructores />} />
            </Route>
            <Route
              path="/categorias"
              element={<ProtectedRoute requiredPermission="Vista Categorias" />}
            >
              <Route path="" element={<Categorias />} />
            </Route>
            <Route
              path="/subcategorias"
              element={<ProtectedRoute requiredPermission="Vista Subcategorias" />}
            >
              <Route path="" element={<Subcategorias />} />
            </Route>
            <Route
              path="/ConsumoDevolutivoGeneral"
              element={<ProtectedRoute requiredPermission="Vista Subcategorias" />}
            >
              <Route path="" element={<ConsumoDevolutivoGeneral />} />
            </Route>

            <Route
              path="/ConsumoControladoGeneral"
              element={<ProtectedRoute requiredPermission="Vista Subcategorias" />}
            >
              <Route path="" element={<ConsumoControladoGeneral />} />
            </Route>
            <Route
              path="/productos"
              element={<ProtectedRoute requiredPermission="vista Productos" />}
            >
              <Route path="" element={<Productos />} />
            </Route> 
            <Route
              path="/herramientas"
              element={<ProtectedRoute requiredPermission="vista Herramientas" />}
            >
              <Route path="" element={<Herramientas />} />
            </Route>
            <Route
              path="/prestamos"
              element={<ProtectedRoute requiredPermission="vista Prestamos" />}
            >
              <Route path="" element={<Prestamos />} />
            </Route>
            <Route
              path="/pedidos"
              element={<ProtectedRoute requiredPermission="vista Pedidos" />}
            >
              <Route path="" element={<Pedidos />} />
            </Route> 
            <Route
              path="/unidadmedida"
              element={<ProtectedRoute requiredPermission="vista Unidades medida" />}
            >
              <Route path="" element={<UnidadMedida />} />
            </Route> 
          </Route>

          {/* Rutas protegidas por RolId */}
          <Route element={<ProtectedRoute requiredRoleId={1} />}>
            <Route path="/gestionarPedidos" element={<GestionarPedidos />} />
            <Route path="/gestionarPrestamos" element={<GestionarPrestamos />} />
          </Route>

          <Route element={<ProtectedRoute requiredRoleId={3} />}>
            <Route path="/homecoord" element={<HomeCoord />} />
            <Route path="/autPedidos" element={<AutorizarPedidos />} />
            <Route path="/autPrestamos" element={<AutorizarPrestamos />} />
            <Route path="/firmaPedidos" element={<FirmaPedidos />} />
            <Route path="/firmaPrestamos" element={<FirmaPrestamos />} />
            <Route path="/fichasCoordi" element={<FichasCoordi />} />
          </Route>

          {/* Rutas protegidas por RolId 1 y 3 */}
          <Route element={<ProtectedRoute requiredRoleIds={[1, 3]} />}>
            <Route path="/reportes" element={<Reportes />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
