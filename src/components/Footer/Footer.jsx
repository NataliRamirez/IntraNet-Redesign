import React from "react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
import logoBlanco from "../../assets/images/logo-blanco.png";
import "./Footer.css";

export default function Footer() {
    const enlacesInstitucionales = [
        { name: "Misión y Visión", url: "/nosotros" },
        { name: "Nosotros", url: "/nosotros" },
        { name: "Organigrama", url: "/nosotros" },
        { name: "Terminos de servicio", path: "/useTerms" },
    ];
    return (
        <footer className="footer">
            <section className="footer-left">
                <img src={logoBlanco} alt="LogoGrisEmca" />
                <p>#SiempreLoHaremosPorTi</p>
                <p>Carrera 24 No. 39-54, Calarcá, Quindío</p>
            </section>
            <section className="footer-right">
                <div className="footer-top">
                    <div className="footer-section">
                        <h3>Acerca de</h3>
                        <ul className="links">
                            <li><a href="#MisionVision">Misión y Visión</a></li>
                            <li><a href="#Nosotros">Nosotros</a></li>
                            <li><a href="#Organigrama">Organigrama</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Contáctanos</h3>
                        <ul className="links">
                            <li><a href="#">Soporte</a></li>
                            <li>Línea de atención: +57 (606) 7421114</li>
                            <li><a href="https://emca-calarca-quindio.micolombiadigital.gov.co/">Página oficial</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Legal</h3>
                        <ul className="links">
                            <li><Link to="/useTerms">Política de privacidad</Link></li>
                            <li><Link to="/useTerms">Términos de servicio</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="inline">
                </div>
                <div className="footer-bottom">
                    <nav className="social-media">
                        <a
                            href="https://www.facebook.com/share/14ozkZ2nGMW/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="social-link"
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
                    <p>&copy; 2024 IntraNet. Todos los derechos reservados.</p>
                    <p>Sitio web desarrollado por Simón Otalvaro</p>
                </div>
            </section>
        </footer>
    );
}
