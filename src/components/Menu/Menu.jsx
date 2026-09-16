import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaTools,
  FaUsers,
  FaNewspaper,
  FaCalendarAlt,
} from "react-icons/fa";

import "./Menu.css";
import logoColor from "../../assets/images/logo-color.png";

export default function Menu() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Inicio", path: "/", icon: <FaHome /> },
    { name: "Utilidades", path: "/utils", icon: <FaTools /> },
    { name: "Nosotros", path: "/us", icon: <FaUsers /> },
    { name: "Noticias", path: "/news", icon: <FaNewspaper /> },
    { name: "Eventos", path: "/events", icon: <FaCalendarAlt /> },
    {
      name: "Cumpleañeros del mes",
      path: "/birthdaymodal",
      icon: <FaCalendarAlt />,
    },
  ];

  return (
    <>
      <button
        className={`menu-btn ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <nav className={`menu-drawer ${open ? "active" : ""}`}>
        <div className="menu-header">
          <img src={logoColor} alt="Logo Empresa" />
          <h1>IntraNet EMCA</h1>
        </div>

        <ul>
          {links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                onClick={() => setOpen(false)}
              >
                <span className="icon">{link.icon}</span>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <footer className="menu-footer">
          <p>© 2025 EMCA</p>
        </footer>
      </nav>
    </>
  );
}