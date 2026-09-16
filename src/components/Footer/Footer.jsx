import React from "react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

import logo from "../../assets/images/LogoEmcaGris.png";

import "./Footer.css";

export default function Footer() {
    const enlacesInstitucionales = [
        { name: "Misión y Visión", url: "/nosotros" },
        { name: "Nosotros", url: "/nosotros" },
        { name: "Organigrama", url: "/nosotros" }
    ];

    return (
        <footer className="footer">
            <section className="footer-left">
                <img src={logo} alt="LogoGrisEmca" />
                <p>#SiempreLoHaremosPorTi</p>
                <p>Carrera 24 No. 39-54, Calarcá, Quindío</p>
            </section>
            <section className="footer-right">
                <div className="footer-top">
                    <div className="footer-section">
                        <h3>Acerca de</h3>
                        <ul>
                            {enlacesInstitucionales.map((enlace, index) => (
                                <li key={index}>
                                    <a href={enlace.url}>{enlace.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Contáctanos</h3>
                        <ul>
                            <li><a href="#">Soporte</a></li>
                            <li><a href="#">Reportar un problema</a></li>
                            <li><a href="#">Preguntas frecuentes</a></li>
                            <li>Línea de atención: +57 (606) 7421114</li>
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
                        <a
                            href="https://www.facebook.com/share/14ozkZ2nGMW/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <FaFacebook />
                        </a>

                        <a
                            href="https://www.instagram.com/emcaesp?stkn=MTlvdW9semp5bjZ5MQ=="
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <FaInstagram />
                        </a>

                        <a
                            href="https://www.tiktok.com/@emca.esp?_r=1&_t=ZS-99lRI5zjk2P"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                        >
                            <FaTiktok />
                        </a>
                    </nav>
                    <p>&copy; {new Date().getFullYear()} IntraNet. Todos los derechos reservados.</p>
                    <p>Sitio web desarrollado por Simón Otalvaro</p>
                </div>
            </section>
        </footer>
    );
}