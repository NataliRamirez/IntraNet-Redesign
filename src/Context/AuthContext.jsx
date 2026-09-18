import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

/**
 * Proveedor del contexto de autenticación.
 * Gestiona el estado del usuario autenticado y sincroniza
 * la información con el almacenamiento local del navegador.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto.
 * @returns {JSX.Element} Proveedor de autenticación.
 */
export function AuthProvider({ children }) {

  /**
  * Estado que almacena la información del usuario autenticado.
  * Se inicializa recuperando los datos almacenados en localStorage.
  */
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  //Inicio de sesión
  const login = (username) => {
    const role = username === "admin" ? "admin" : "comunicaciones";
    const userData = { username, role };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  /**
   * Escucha los cambios realizados en localStorage desde otras
   * pestañas o ventanas del navegador para mantener sincronizado
   * el estado de autenticación.
   */
  useEffect(() => {
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem("user")) || null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado para acceder al contexto de autenticación.
 *
 * @returns {Object} Información del usuario autenticado y funciones de autenticación.
 */
export function useAuth() {
  return useContext(AuthContext);
}
