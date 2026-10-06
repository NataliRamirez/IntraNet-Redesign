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
        console.log("Usuario actual:", user);
        console.log("Rol:", user?.role);

        if (!user) return;

        if (
            user.role === "ADMINISTRADOR"
        ) {
            navigate("/admin");
        } else if (
            user.role === "COMUNICACIONES"
        ) {
            navigate("/comunications");
        } else {
            console.log("Rol no reconocido:", user.role);
        }
    };


    const getNavigation = () => {

        // =========================
        // ADMINISTRACIÓN
        // =========================
        if (location.pathname.startsWith("/admin")) {
            return (
                <>
                    <Link to="/admin">Inicio</Link>

                    <Link to="/admin/news">
                        Noticias
                    </Link>

                    <Link to="/admin/events">
                        Eventos
                    </Link>

                    <Link to="/admin/employees">
                        Empleados
                    </Link>

                    <Link to="/admin/notifications">
                        Notificaciones
                    </Link>
                </>
            );
        }

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
                    <nav className="nav-links">
                        <Link to="/">
                            Inicio
                        </Link>
                        <a href="#Utilidades">Utilidades</a>
                        <a href="#Herramientas">Herramientas</a>
                    </nav>
                </>
            );
        }

        // =========================
        // SOBRE NOSOTROS
        // =========================
        if (location.pathname.startsWith("/us")) {
            return (
                <>
                    <nav className="nav-links">
                        <Link to="/">
                            Inicio
                        </Link>
                        <a href="#Nosotros">Sobre Nosotros</a>
                        <a href="#MisionVision">Misión y Visión</a>
                        <a href="#Organigrama">Organigrama</a>
                    </nav>
                </>
            );
        }

        // =========================
        // NOTICIAS
        // =========================
        if (location.pathname.startsWith("/news")) {
            return (
                <>
                    <nav className="nav-links">
                        <Link to="/">
                            Inicio
                        </Link>
                        <a href="#Noticias">Noticias</a>
                        <a href="#Recientes">Noticias Recientes</a>
                        <a href="#Antiguos">Noticias Antiguas</a>
                    </nav>
                </>
            );
        }

        // =========================
        // EVENTOS
        // =========================
        if (location.pathname.startsWith("/events")) {
            return (
                <>
                    <nav className="nav-links">
                        <Link to="/">
                            Inicio
                        </Link>
                        <a href="#Eventos">Eventos</a>
                        <a href="#Recientes">Eventos Recientes</a>
                        <a href="#Antiguos">Eventos Antiguos</a>
                    </nav>
                </>
            );
        }

        // =========================
        // CUMPLEAÑOS
        // =========================
        if (location.pathname.startsWith("/birthdaymodal")) {
            return (
                <>
                    <nav className="nav-links">
                        <Link to="/">
                            Inicio
                        </Link>
                        <a href="#Cumpleaños">Cumpleaños</a>
                        <a href="#Agradecimientos">Agradecimientos</a>
                    </nav>
                </>
            );
        }

        // =========================
        // HOME
        // =========================
        return (
            <>
                <nav className="nav-links">
                    <a href="#Home">Inicio</a>
                    <a href="#Noticias">Noticias</a>
                    <a href="#Eventos">Eventos</a>
                    <a href="#Nosotros">Nosotros</a>
                </nav>
            </>
        );
    };

    return (
        <header className="header">

            {/* =========================
                BARRA SUPERIOR
            ========================= */}
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

                    <Link
                        to="/"
                        className="title-link"
                    >
                        <h1 className="title-header">
                            INTRANET
                        </h1>
                    </Link>

                </div>

                {/* =========================
                    MENÚ
                ========================= */}
                <nav className="nav-links">
                    {getNavigation()}
                </nav>

                {/* =========================
                    ACCIONES DE USUARIO
                ========================= */}
                <div className="header-right">

                    <NotificationBell />

                    {user ? (

                        <div className="user-actions">

                            {/* Perfil / Dashboard */}
                            <button
                                className="user-button"
                                onClick={goToDashboard}
                                title="Mi panel"
                            >
                                <FiUser size={24} />
                            </button>

                            {/* Cerrar sesión */}
                            <button
                                className="logout-button"
                                onClick={handleLogout}
                                title="Cerrar sesión"
                            >
                                <FiLogOut size={24} />
                            </button>

                        </div>

                    ) : (

                        /* Iniciar sesión */
                        <button
                            className="login-button"
                            onClick={() => setShowLogin(true)}
                        >
                            INGRESAR
                        </button>

                    )}

                </div>

            </section>

            {/* =========================
                MODAL LOGIN
            ========================= */}
            {showLogin && !user && (

                <div className="login-modal">

                    {/* Fondo */}
                    <div
                        className="login-modal-overlay"
                        onClick={() => setShowLogin(false)}
                    />

                    {/* Contenido */}
                    <div className="login-modal-content">

                        {/* Cerrar */}
                        <button
                            className="login-close"
                            onClick={() => setShowLogin(false)}
                        >
                            ✕
                        </button>

                        <Login
                            onClose={() => setShowLogin(false)}
                        />

                    </div>

                </div>
            )}

        </header>
    );
}