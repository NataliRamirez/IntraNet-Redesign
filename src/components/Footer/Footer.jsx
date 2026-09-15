import React, { useState, useEffect } from "react";
import "./Footer.css";

return (
    <footer className="footer">
        <section className="footer-left">
            <img src="assets/images/logo-gris.png" alt="Logo-Gris" />
            <p>#SiempreLoHaremosPorTi</p>
        </section>
        <section className="footer-right">
            <div className="footer-top">
                <div className="footer-section">
                    <h3>Acerca de</h3>
                    <ul>
                        <li><a href="#">Nosotros</a></li>
                        <li><a href="#">Misión y Visión</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Contáctanos</h3>
                    <ul>
                        <li><a href="#">Soporte</a></li>
                        <li><a href="#">Reportar un problema</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Legal</h3>
                    <ul>
                        <li><a href="#">Política de privacidad</a></li>
                        <li><a href="#">Términos de servicio</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <nav className="social-media">
                    <img src="assets/images/facebook.png" alt="Facebook"/>
                    <img src="assets/images/twitter.png" alt="Twitter" />
                    <img src="assets/images/instagram.png" alt="Instagram" />
                </nav>
                <p>&copy; 2024 IntraNet. Todos los derechos reservados.</p>
            </div>
        </section>
    </footer>
)