import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTools, FaUsers, FaNewspaper, FaCalendarAlt, FaBirthdayCake, FaUserTie,} from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import "./Menu.css";
import logoColor from "../../assets/images/logo-color.png";

/**
 * Componente encargado de mostrar el menú lateral
 * desplegable de la Intranet.
 *
 * El menú cambia dependiendo del estado de autenticación
 * y del rol del usuario.
 *
 * USUARIO NO AUTENTICADO:
 * - Inicio
 * - Utilidades
 * - Nosotros
 * - Noticias
 * - Eventos
 * - Cumpleañeros del mes
 *
 * ADMINISTRADOR:
 * - Inicio
 * - Herramientas
 * - Usuarios
 * - Empleados
 * - Noticias
 * - Eventos
 * - Cumpleañeros (agregar imagen)
 *
 * COMUNICACIONES:
 * - Inicio
 * - Herramientas
 * - Noticias
 * - Eventos
 * - Cumpleañeros del mes
 *
 * @returns {JSX.Element}
 */
export default function Menu() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const role = user?.role?.toUpperCase();

  const isAdmin =
    role === "ADMINISTRADOR" ||
    role === "ADMIN";

  const isCommunications =
    role === "COMUNICACIONES" ||
    role === "COMMUNICATIONS";

  /*
   * ==================================================
   * MENÚ PARA USUARIOS NO AUTENTICADOS
   * ==================================================
   */
  const publicLinks = [
    {name: "Inicio",path: "/",icon: <FaHome />,},
    {name: "Utilidades",path: "/utils",icon: <FaTools />,},
    {name: "Nosotros",path: "/us",icon: <FaUsers />,},
    {name: "Noticias",path: "/news",icon: <FaNewspaper />,},
    {name: "Eventos",path: "/events",icon: <FaCalendarAlt />,},
    {name: "Cumpleañeros del mes",path: "/birthdaymodal",icon: <FaBirthdayCake />,},
  ];

  /*
   * ==================================================
   * MENÚ PARA ADMINISTRADOR
   * ==================================================
   */
  const adminLinks = [
    {name: "Inicio",path: "/admin",icon: <FaHome />,},
    {name: "Utilidades",path: "/utils",icon: <FaTools />,},
    {name: "Usuarios",path: "/admin/users",icon: <FaUsers />,},
    {name: "Empleados",path: "/admin/employees",icon: <FaUserTie />,},
    {name: "Noticias",path: "/admin/news",icon: <FaNewspaper />,},
    {name: "Eventos",path: "/admin/events",icon: <FaCalendarAlt />,},
    {name: "Cumpleañeros del mes",path: "/admin/birthday",icon: <FaBirthdayCake />,},
  ];

  /*
   * ==================================================
   * MENÚ PARA COMUNICACIONES
   * ==================================================
   */
  const communicationsLinks = [
    {name: "Inicio",path: "/comunications",icon: <FaHome />,},
    {name: "Herramientas",path: "/comunications/tools",icon: <FaTools />,},
    {name: "Noticias",path: "/comunications/news",icon: <FaNewspaper />,},
    {name: "Eventos",path: "/comunications/events",icon: <FaCalendarAlt />,},
    {name: "Cumpleañeros del mes",path: "/comunications/birthday",icon: <FaBirthdayCake />,},
  ];

  /*
   * ==================================================
   * SELECCIONAR EL MENÚ
   * ==================================================
   */
  let links;

  if (!user) {
    links = publicLinks;
  } else if (isAdmin) {
    links = adminLinks;
  } else if (isCommunications) {
    links = communicationsLinks;
  } else {
    // Por seguridad, si existe un rol desconocido, no mostramos opciones administrativas.
    links = publicLinks;
  }

  return (
    <>
      {/* ============================================
          BOTÓN HAMBURGUESA
      ============================================= */}
      <button
        className={`menu-btn ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label={
          open ? "Cerrar menú" : "Abrir menú"}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* ============================================
          CAPA OSCURA
      ============================================= */}
      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
        </div>
      )}

      {/* ============================================
          MENÚ LATERAL
      ============================================= */}
      <nav className={`menu-drawer ${open ? "active" : ""}`}>

        {/* ==========================================
            ENCABEZADO DEL MENÚ
        =========================================== */}
        <div className="menu-header">

          <img src={logoColor} alt="Logo Empresa"/>
          <h1>IntraNet EMCA</h1>

        </div>

        {/* ==========================================
            OPCIONES DE NAVEGACIÓN
        =========================================== */}
        <ul>

          {links.map((link) => (<li key={link.name}>

              <Link to={link.path} onClick={() => setOpen(false)}>

                <span className="icon">{link.icon}</span>
                {link.name}

              </Link>

            </li>
          ))}

        </ul>

        {/* ==========================================
            PIE DE PÁGINA
        =========================================== */}
        <footer className="menu-footer">
          <p>© 2026 EMCA</p>
        </footer>

      </nav>
    </>
  );
}