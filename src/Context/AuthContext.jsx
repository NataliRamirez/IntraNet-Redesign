import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

/**
 * Decodifica el payload de un JWT.
 */
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};

/**
 * Normaliza los roles para que todo el frontend trabaje únicamente con los nombres del backend.
 */
const normalizeRole = (role) => {
  if (!role) return null;

  const normalizedRole = role.toString().toUpperCase();

  if (normalizedRole === "ADMINISTRADOR") {
    return "ADMINISTRADOR";
  }

  if (normalizedRole === "COMUNICACIONES") {
    return "COMUNICACIONES";
  }

  return null;
};

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error leyendo usuario almacenado:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  /**
   * Inicio de sesión.
   */
  const login = (token) => {
    const decodedToken = decodeToken(token);

    if (!decodedToken) {
      console.error("Token JWT inválido.");
      return false;
    }

    const role = normalizeRole(decodedToken.role);

    if (!role) {
      console.error("Rol no reconocido:", decodedToken.role);
      return false;
    }

    const userData = {
      token,
      username: decodedToken.email || decodedToken.sub,
      userId: decodedToken.sub,
      email: decodedToken.email,
      role,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("Usuario autenticado");

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  /**
   * Sincronizar cambios de localStorage entre diferentes pestañas.
   */
  useEffect(() => {
    const handleStorage = () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error leyendo usuario:", error);
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <AuthContext.Provider value={{user,login,logout,}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}