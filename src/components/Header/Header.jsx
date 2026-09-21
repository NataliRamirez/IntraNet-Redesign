import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import Login from "../Login/Login";
import NotificationBell from "../Notifications/NotificationBell";
import logoBlanco from "../../assets/images/logo-blanco.png";
import userImg from "../../assets/images/user-img.png";
import { FiLogOut } from "react-icons/fi";
import { FiUser } from "react-icons/fi";


import "./Header.css";

/**
 * Componente encargado de mostrar la cabecera principal
 * de la Intranet EMCA. Permite la navegación entre secciones,
 * el acceso al inicio de sesión, la visualización de
 * notificaciones y la gestión de la sesión del usuario.
 *
 * @returns {JSX.Element}
 */
export default function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const goToDashboard = () => {
        console.log("Usuario actual:", user);
        console.log("Rol:", user?.role);

        if (!user) return;

        if (user.role === "admin") {
            navigate("/admin");
        } else if (user.role === "comunications") {
            navigate("/comunications");
        } else {
            console.log("Rol no reconocido:", user.role);
        }
    };

    return (
        <header className="header">

            {/* Barra superior del encabezado */}
            <section className="header-top">

                {/* Logo institucional y nombre del sistema */}
                <div className="logo-container">
                    <a
                        href="https://emca-calarca-quindio.micolombiadigital.gov.co/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            className="logoBlancoEmca"
                            src={logoBlanco}
                            alt="Logo Principal"
                        />
                    </a>

                    <h1 className="title-header">
                        INTRANET
                    </h1>
                </div>

                {/* Menú de navegación interna */}
                <nav className="nav-links">
                    <a href="#Home">Inicio</a>
                    <a href="#News">Noticias</a>
                    <a href="#Events">Eventos</a>
                    <a href="#Us">Nosotros</a>
                </nav>

                {/* Acciones de usuario */}
                <div className="header-right">

                    {/* Componente de notificaciones */}
                    <NotificationBell />

                    {user ? (
                        <div className="user-actions">

                            {/* Imagen de perfil del usuario */}
                            <button
                                className="user-button"
                                onClick={() => {
                                    console.log("click usuario");
                                    goToDashboard();
                                }}
                            >
                                <FiUser size={24} />
                            </button>


                            {/* Botón para cerrar sesión */}
                            <button
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                <FiLogOut size={24} />
                            </button>

                        </div>
                    ) : (

                        /* Botón para abrir el modal de inicio de sesión */
                        <button
                            className="login-button"
                            onClick={() => setShowLogin(true)}
                        >
                            INGRESAR
                        </button>

                    )}
                </div>
            </section>



            {/* Modal de autenticación */}
            {showLogin && !user && (
                <div className="login-modal">

                    {/* Fondo oscuro para cerrar el modal */}
                    <div
                        className="login-modal-overlay"
                        onClick={() => setShowLogin(false)}
                    ></div>

                    {/* Contenido del modal */}
                    <div className="login-modal-content">

                        {/* Botón para cerrar el modal */}
                        <button
                            className="login-close"
                            onClick={() => setShowLogin(false)}
                        >
                            ✕
                        </button>

                        {/* Formulario de inicio de sesión */}
                        <Login
                            onClose={() => setShowLogin(false)}
                        />
                    </div>
                </div>
            )}
        </header>
    );
}