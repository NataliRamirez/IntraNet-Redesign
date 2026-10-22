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
                <p>Cra.24 #39-54 Torre B, Calarcá, Quindío</p>
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
                            <li><a href="https://emca.siicoonline.com/site/login">Mesa de ayuda</a></li>
                            <li>Correo soporte: sistemas@emca-calarca-quindio.gov.co</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Legal</h3>
                        <ul className="links">
                            <li href="#privacypolicy"><Link to="/privacypolicy">Política de privacidad</Link></li>
                            <li href="#termsofservice"><Link to="/termsofservice">Términos de servicio</Link></li>
                            <li href="#FAQ"><Link to="/FAQ">Preguntas Frecuentes</Link></li>
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
                    <p>&copy; 2026 IntraNet. Todos los derechos reservados.</p>
                    <p>Sitio web desarrollado por Natali Ramirez</p>
                </div>
            </section>
        </footer>
    );
}
