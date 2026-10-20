import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

/**
 * Componente encargado de proteger rutas privadas de la aplicación.
 * @param {Object} props Propiedades del componente.
 * @param {React.ReactNode} props.children Componentes hijos que se renderizarán si el acceso es válido.
 * @param {string[]} props.allowedRoles Lista de roles autorizados para acceder a la ruta.
 *
 * @returns {JSX.Element} Componente protegido o redirección.
 */
export default function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  /**
    * Renderiza el contenido protegido cuando el usuario está autenticado y autorizado.
    */
  return children;
}
