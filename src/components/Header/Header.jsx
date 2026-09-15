import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import logoColor from "../../assets/images/logo-color.png";
import "./Header.css";

const navigate = useNavigate();
const { user, logout } = useAuth();

return (
    <header className="header">
        <section className="header-Top">
            <img src="../../assets/images/logo-blanco.png" alt="Logo Principal" />
            <h1 className="title-header">INTRANET</h1>
            <nav className="nav-links">
                <a href="#">Inicio</a>
                <a href="#">Noticias</a>
                <a href="#">Eventos</a>
                <a href="#">Utilidades</a>
                <a href="#">Nosotros</a>
            </nav>
            <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
        </section>
        <div className="inline">
        </div>
        <section className="header-Bottom">
            <h2 className="title-header-bottom">INTRANET - EMPRESAS PÚBLICAS DE CALARCÁ E.S.P</h2>
            <p>En este portal podrás acceder a información relevante sobre noticias, eventos, herramientas e información corporativa.</p>
        </section>
    </header>
)