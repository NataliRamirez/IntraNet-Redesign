import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import Login from "../Login/Login";
import NotificationBell from "../Notifications/NotificationBell";
/*import logoBlanco from "../../assets/images/LogoEmcaBlanco.png";*/
import logoBlanco from "../../assets/images/logo-blanco.png";
import userImg from "../../assets/images/user-img.png";
import logoutImg from "../../assets/images/logout-img.jpg";

import "./Header.css";

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
            <section className="header-top">
                <div className="logo-container">
                    <img className="logoBlancoEmca" src={logoBlanco} alt="Logo Principal" />
                    <h1 className="title-header">INTRANET</h1>
                </div>
                <nav className="nav-links">
                    <a href="">Inicio</a>
                    <a href="#">Noticias</a>
                    <a href="#">Eventos</a>
                    <a href="#">Nosotros</a>
                </nav>

                <div className="header-right">
                    <NotificationBell />

                    {user ? (
                        <div className="user-actions">
                            <img
                                src={userImg}
                                alt="Usuario"
                                className="user-img"
                                onClick={goToDashboard}
                            />

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
                        <button
                            className="login-button"
                            onClick={() => setShowLogin(true)}
                        >
                            INGRESAR
                        </button>
                    )}
                </div>
            </section>
            <div className="inline">
            </div>
            <section className="header-bottom">
                <h2 className="title-header-bottom">INTRANET - EMPRESAS PÚBLICAS DE CALARCÁ E.S.P</h2>
                <p>En este portal podrás acceder a información relevante sobre noticias, eventos, herramientas e información corporativa.</p>
            </section>
            {showLogin && !user && (
                <div className="login-modal">
                    <div
                        className="login-modal-overlay"
                        onClick={() => setShowLogin(false)}
                    ></div>

                    <div className="login-modal-content">
                        <button
                            className="login-close"
                            onClick={() => setShowLogin(false)}
                        >
                            ✕
                        </button>

                        <Login onClose={() => setShowLogin(false)} />
                    </div>
                </div>
            )}
        </header>
    );
}