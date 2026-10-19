import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import Login from "../Login/Login";
import NotificationBell from "../Notifications/NotificationBell";
import logoBlanco from "../../assets/images/logo-blanco.png";
import { FiLogOut, FiUser } from "react-icons/fi";

import "./Header.css";

export default function Header() {
    const [showLogin, setShowLogin] = useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const goToDashboard = () => {
        if (!user) return;

        if (user.role === "ADMINISTRADOR" || user.role === "COMUNICACIONES") {
            navigate("/profile");
        }
    };

    const getNavigation = () => {

        if (location.pathname === "/admin/users") {
            return (
                <>
                    <Link to="/admin">Inicio</Link>
                    <a href="#FormUsers">Formulario</a>
                    <a href="#Users">Usuarios registrados</a>
                </>
            );
        }

        if (location.pathname === "/admin/news") {
            return (
                <>
                    <Link to="/admin">Inicio</Link>
                    <a href="#FormNews">Formulario</a>
                    <a href="#News">Noticias Registradas</a>
                    <a href="#olderNews">Noticias Antiguas</a>
                </>
            );
        }

        if (location.pathname === "/admin/events") {
            return (
                <>
                    <Link to="/admin">Inicio</Link>
                    <a href="#FormEvents">Formulario</a>
                    <a href="#Events">Eventos Registrados</a>
                    <a href="#olderEvents">Eventos Antiguos</a>
                </>
            );
        }

        if (location.pathname === "/admin/employees") {
            return (
                <>
                    <Link to="/admin">Inicio</Link>
                    <a href="#FormEmployees">Formulario</a>
                    <a href="#Employees">Empleados Registrados</a>
                </>
            );
        }

        // =========================
        // ADMINISTRACIÓN
        // =========================
        if (location.pathname.startsWith("/admin")) {
            return (
                <>
                    <Link to="/admin">Inicio</Link>
                    <Link to="/admin/news">Noticias</Link>
                    <Link to="/admin/events">Eventos</Link>
                    <Link to="/admin/notifications">Notificaciones</Link>
                    <Link to="/admin/users">Usuarios</Link>
                </>
            );
        }

        // =========================
        // COMUNICACIONES
        // =========================
        if (location.pathname.startsWith("/comunications")) {
            return (
                <>
                    <Link to="/comunications">Inicio</Link>
                </>
            );
        }

        // =========================
        // UTILIDADES
        // =========================
        if (location.pathname.startsWith("/utils")) {
            return (
                <>
                    <Link to="/">Inicio</Link>
                    <a href="#Utilidades">Utilidades</a>
                    <a href="#Herramientas">Herramientas</a>
                </>
            );
        }

        // =========================
        // SOBRE NOSOTROS
        // =========================
        if (location.pathname.startsWith("/us")) {
            return (
                <>
                    <Link to="/">Inicio</Link>
                    <a href="#Nosotros">Sobre Nosotros</a>
                    <a href="#MisionVision">Misión y Visión</a>
                    <a href="#Organigrama">Organigrama</a>
                </>
            );
        }

        // =========================
        // NOTICIAS
        // =========================
        if (location.pathname.startsWith("/news")) {
            return (
                <>
                    <Link to="/">Inicio</Link>
                    <a href="#News">Noticias</a>
                    <a href="#RecentNews">Noticias Recientes</a>
                    <a href="#OlderNews">Noticias Antiguas</a>
                </>
            );
        }

        // =========================
        // EVENTOS
        // =========================
        if (location.pathname.startsWith("/events")) {
            return (
                <>
                    <Link to="/">Inicio</Link>
                    <a href="#Events">Eventos</a>
                    <a href="#RecentEvents">Eventos Recientes</a>
                    <a href="#OlderEvents">Eventos Antiguos</a>
                </>
            );
        }

        // =========================
        // CUMPLEAÑOS
        // =========================
        if (location.pathname.startsWith("/birthdaymodal")) {
            return (
                <>
                    <Link to="/">Inicio</Link>
                    <a href="#Cumpleaños">Cumpleaños</a>
                    <a href="#Agradecimientos">Agradecimientos</a>
                </>
            );
        }

        // =========================
        // PERFIL
        // =========================
        if (location.pathname.startsWith("/profile")) {
            return (
                <>
                    <Link to="/">Inicio</Link>
                </>
            );
        }

        // =========================
        // HOME
        // =========================
        return (
            <>
                <a href="#Home">Inicio</a>
                <a href="#Noticias">Noticias</a>
                <a href="#Eventos">Eventos</a>
                <a href="#Nosotros">Nosotros</a>
            </>
        );
    };

    return (
        <header className="header">
            <section className="header-top">

                {/* Logo institucional */}
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

                    <Link to="/" className="title-link">
                        <h1 className="title-header">INTRANET</h1>
                    </Link>
                </div>

                <nav className="nav-links">{getNavigation()}</nav>

                <div className="header-right">
                    <NotificationBell />

                    {user ? (
                        <div className="user-actions">

                            {/* Perfil */}
                            <button
                                className="user-button"
                                onClick={goToDashboard}
                                title="Mi panel"
                                type="button"
                            >
                                <FiUser size={24} />
                            </button>

                            {/* Cerrar sesión */}
                            <button
                                className="logout-button"
                                onClick={handleLogout}
                                title="Cerrar sesión"
                                type="button"
                            >
                                <FiLogOut size={24} />
                            </button>

                        </div>
                    ) : (
                        <button className="login-button" onClick={() => setShowLogin(true)} type="button">INGRESAR</button>
                    )}
                </div>
            </section>

            {/* =========================
                MODAL LOGIN
            ========================= */}
            {showLogin && !user && (
                <div className="login-modal">

                    {/* Fondo */}
                    <div className="login-modal-overlay" onClick={() => setShowLogin(false)} />

                    {/* Contenido */}
                    <div className="login-modal-content">

                        {/* Cerrar */}
                        <button className="login-close" onClick={() => setShowLogin(false)} type="button">✕</button>

                        <Login onClose={() => setShowLogin(false)} />
                    </div>
                </div>
            )}
        </header>
    );
}