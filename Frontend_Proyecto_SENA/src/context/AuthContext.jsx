import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../api/token";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api
        .get("/perfil", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          const perfil = response.data.perfil;

          return api
            .get(`/usuarios/${perfil.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((usuarioResponse) => {
              const usuarioData = usuarioResponse.data;
              setUser({
                ...perfil,
                ...usuarioData,
                RolId: perfil.RolId,
              });
              setIsAuthenticated(true);
            })
            .catch((usuarioError) => {
              console.error("Error fetching usuario:", usuarioError);
              setUser({
                ...perfil,
                RolId: perfil.RolId,
              });
              setIsAuthenticated(true);
            });
        })
        .catch((error) => {
          console.error("Error fetching profile or invalid token:", error);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const signin = async ({ Documento, password }) => {
    try {
      const response = await api.post("/login", { Documento, password });
      const { token } = response.data;
      localStorage.setItem("token", token);

      const perfilResponse = await api.get("/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const perfil = perfilResponse.data.perfil;

      try {
        const usuarioResponse = await api.get(`/usuarios/${perfil.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usuarioData = usuarioResponse.data;

        setUser({
          ...perfil,
          ...usuarioData,
          RolId: perfil.RolId,
        });
      } catch (usuarioError) {
        console.error("Error fetching usuario:", usuarioError);
        setUser({
          ...perfil,
          RolId: perfil.RolId,
        });
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setErrors(error.response?.data || ["Error de autenticación"]);
      setIsAuthenticated(false);
    }
  };

  const signout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ signin, signout, user, isAuthenticated, loading, errors }}
    >
      {children}
    </AuthContext.Provider>
  );
};
