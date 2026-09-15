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
                    <a href="https://www.facebook.com/share/14ozkZ2nGMW/" target="_blank" rel="noopener noreferrer">
                        <img src="src/assets/images/facebook-icon.png" alt="Facebook" className="social-icon-img" />
                    </a>
                    <a href="https://www.instagram.com/emcaesp?stkn=MTlvdW9semp5bjZ5MQ==" target="_blank" rel="noopener noreferrer">
                        <img src="src/assets/images/instagram-icon.png" alt="Instagram" className="social-icon-img" />
                    </a>
                    <a href="https://www.tiktok.com/@emca.esp?_r=1&_t=ZS-99lRI5zjk2P" target="_blank" rel="noopener noreferrer">
                        <img src="src/assets/images/tiktok-icon.png" alt="TikTok" className="social-icon-img" />
                    </a>
                </nav>
                <p>&copy; 2024 IntraNet. Todos los derechos reservados.</p>
            </div>
        </section>
    </footer>
)