import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBell,
  FaTools,
  FaUsers,
  FaNewspaper,
  FaCalendarAlt,
  FaBirthdayCake,
} from "react-icons/fa";

import "./Menu.css";
import logoColor from "../../assets/images/logo-color.png";

export default function Menu() {
  const [open, setOpen] = useState(true);

  const links = [
    {
      name: "Inicio",
      path: "/admin/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Perfil",
      path: "/admin/profile",
      icon: <FaUser />,
    },
    {
      name: "Notificaciones",
      path: "/admin/notifications",
      icon: <FaBell />,
    },
    {
      name: "Noticias",
      path: "/admin/news",
      icon: <FaNewspaper />,
    },
    {
      name: "Eventos",
      path: "/admin/events",
      icon: <FaCalendarAlt />,
    },
    {
      name: "Empleados",
      path: "/admin/employees",
      icon: <FaUsers />,
    },
    {
      name: "Cumpleañeros del mes",
      path: "/admin/birthday",
      icon: <FaBirthdayCake />,
    },
    {
      name: "Utilidades",
      path: "/utils",
      icon: <FaTools />,
    }
  ];

  return (
    <>
      {/* Botón para abrir/cerrar el menú */}
      <button
        className={`menu-btn ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label={
          open ? "Cerrar menú" : "Abrir menú"
        }
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menú lateral */}
      <nav
        className={`menu-drawer ${
          open ? "active" : ""
        }`}
      >
        {/* Encabezado */}
        <div className="menu-header">
          <img
            src={logoColor}
            alt="Logo EMCA"
          />

          <h1>IntraNet EMCA</h1>
        </div>

        {/* Opciones */}
        <ul>
          {links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                onClick={() => setOpen(true)}
              >
                <span className="icon">
                  {link.icon}
                </span>

                <span className="link-text">
                  {link.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Pie */}
        <footer className="menu-footer">
          <p>© 2026 EMCA</p>
        </footer>
      </nav>
    </>
  );
}