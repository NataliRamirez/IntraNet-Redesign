import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import Login from "../Login/Login";
import NotificationBell from "../Notifications/NotificationBell";
import logoBlanco from "../../assets/images/logo-blanco.png";
import userImg from "../../assets/images/user-img.png";
import logoutImg from "../../assets/images/logout-img.jpg";

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
        if (!user) return;
        if (user.role === "admin") navigate("/admin");
        if (user.role === "comunicaciones") navigate("/comunicaciones");
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
                    <a href="#Inicio">Inicio</a>
                    <a href="#Noticias">Noticias</a>
                    <a href="#Eventos">Eventos</a>
                    <a href="#Nosotros">Nosotros</a>
                </nav>

                {/* Acciones de usuario */}
                <div className="header-right">

                    {/* Componente de notificaciones */}
                    <NotificationBell />

                    {user ? (
                        <div className="user-actions">

                            {/* Imagen de perfil del usuario */}
                            <img
                                src={userImg}
                                alt="Usuario"
                                className="user-img"
                                onClick={goToDashboard}
                            />

                            {/* Botón para cerrar sesión */}
                            <button
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                <img
                                    src={logoutImg}
                                    alt="Cerrar sesión"
                                    className="logout-img"
                                />
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