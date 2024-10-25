import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LinearProgress from "@mui/material/LinearProgress";

const ProtectedRoute = ({
  requiredRoleId,
  requiredRoleIds,
  requiredPermission,
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div>
        <LinearProgress className="h-2 w-full mt-2" color="primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRoleId && user?.RolId !== requiredRoleId) {
    return <Navigate to="/no-permission" replace />;
  }

  if (requiredRoleIds && !requiredRoleIds.includes(user?.RolId)) {
    return <Navigate to="/no-permission" replace />;
  }

  if (
    requiredPermission &&
    !user?.DetallePermisos.some(
      (p) => p.Permiso.nombrePermiso === requiredPermission
    )
  ) {
    return <Navigate to="/no-permission" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
