import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TermsAcceptanceModal.css";

const API_URL = `${import.meta.env.VITE_API_URL}/terms-acceptance`;
const TERMS_VERSION = "2026-10-21";
const PRIVACY_EMAIL = "sistemas@emca-calarca-quindio.gov.co";
const STORAGE_KEY = `terms_accepted_${TERMS_VERSION}`;

export default function TermsAcceptanceModal() {
    const [visible, setVisible] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const previouslyAccepted = localStorage.getItem(STORAGE_KEY) === "true";

        if (!previouslyAccepted) {
            setVisible(true);
        }
    }, []);

    const handleAccept = async () => {
        if (!accepted || saving) return;
        setSaving(true);
        setError("");
        try {
            await axios.post(API_URL, {
                termsVersion: TERMS_VERSION,
                accepted: true,
            });

            localStorage.setItem(STORAGE_KEY, "true");
            setVisible(false);
        } catch (err) {
            console.error("Error registrando aceptación:", err);
            setError("No fue posible registrar tu aceptación. " + "Verifica tu conexión e intenta nuevamente.");
        } finally {
            setSaving(false);
        }
    };

    const handleDecline = () => {
        const subject = encodeURIComponent("Inconformidad con términos de uso - IntraNet EMCA");
        const body = encodeURIComponent(
            "Cordial saludo,\n\n" +
            "No acepto los términos de uso de la IntraNet " +
            "o tengo inquietudes sobre el tratamiento de mis " +
            "datos personales.\n\n" +
            "Solicito información sobre las finalidades del " +
            "tratamiento y las opciones disponibles para ejercer " +
            "mis derechos.\n\n" +
            "Gracias."
        );

        window.location.href = `mailto:${PRIVACY_EMAIL}?subject=${subject}&body=${body}`;
    };

    if (!visible) return null;

    return (
        <div className="terms-modal-overlay">
            <section
                className="terms-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="terms-modal-title"
            >
                <header className="terms-modal-header">
                    <h2 id="terms-modal-title">Términos de uso y tratamiento de datos personales</h2>
                    <p>EMCA Empresas Públicas de Calarcá E.S.P.</p>
                </header>

                <div className="terms-modal-body">
                    <h3>1. Responsable del tratamiento</h3>
                    <p> EMCA Empresas Públicas de Calarcá E.S.P., NIT 890.000.377-0, con domicilio en Cra. 24 #39-54 Torre B, Calarcá, Quindío.</p>
                    <p>Contacto:
                        {" "}
                        <a href={`mailto:${PRIVACY_EMAIL}`}>
                            {PRIVACY_EMAIL}
                        </a>
                    </p>

                    <h3>2. Datos utilizados</h3>

                    <p>La IntraNet utiliza nombre, área y cargo de los empleados para facilitar la consulta de información institucional.</p>

                    <p> Cuando corresponda, también podrá utilizar fecha de cumpleaños e imagen para felicitaciones institucionales, de acuerdo con las autorizaciones aplicables.</p>

                    <p>Para acreditar la aceptación y proteger la plataforma, se registra la dirección IP, la fecha y hora de aceptación y la versión de los términos.</p>

                    <h3>3. Finalidades</h3>

                    <ul>
                        <li>Facilitar el acceso y la consulta de información pública institucional.</li>
                        <li>Administrar la seguridad de la IntraNet.</li>
                        <li>Acreditar la aceptación de los términos de uso.</li>
                        <li>Prevenir e investigar accesos no autorizados.</li>
                        <li>Mostrar cumpleaños e imágenes cuando corresponda y exista autorización.</li>
                    </ul>

                    <h3>4. Seguridad y conservación</h3>

                    <p> EMCA adoptará medidas técnicas y administrativas para proteger la información y limitar el acceso a los registros de aceptación.</p>

                    <p> Los registros serán conservados durante el tiempo necesario para acreditar la aceptación, atender obligaciones legales y proteger la seguridad de la plataforma, de acuerdo con los periodos de conservación establecidos por la empresa.</p>

                    <h3>5. Derechos de los titulares</h3>

                    <p> Los titulares podrán conocer, actualizar y rectificar sus datos, solicitar información sobre su tratamiento y ejercer los demás derechos previstos en la Ley 1581 de 2012.</p>

                    <p>
                        Para consultas o reclamos, pueden escribir a:
                        {" "}
                        <a href={`mailto:${PRIVACY_EMAIL}`}>
                            {PRIVACY_EMAIL}
                        </a>
                    </p>

                    <h3>6. Condiciones de uso</h3>

                    <p>Los usuarios se comprometen a utilizar la IntraNet para fines institucionales, respetar los permisos asignados y no acceder, modificar o divulgar información sin autorización.</p>

                    <p>La aceptación de estos términos no sustituye las autorizaciones específicas que sean necesarias para el tratamiento de datos personales.</p>

                    <h3>7. No aceptación</h3>

                    <p>Si no está de acuerdo con los términos o tiene inquietudes sobre el tratamiento de sus datos, puede comunicarse con EMCA mediante el correo institucional.</p>
                </div>

                <footer className="terms-modal-footer">
                    <label className="terms-modal-checkbox">
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                        />

                        <span> He leído y acepto los términos de uso de la IntraNet y confirmo que he sido informado sobre el tratamiento de mis datos personales y el registro de la IP, fecha y hora de aceptación.</span>
                    </label>

                    {error && (
                        <p className="terms-modal-error">{error}</p>
                    )}

                    <div className="terms-modal-actions">
                        <button
                            type="button"
                            className="terms-modal-decline"
                            onClick={handleDecline}
                        >
                            No acepto
                        </button>

                        <button
                            type="button"
                            className="terms-modal-accept"
                            disabled={!accepted || saving}
                            onClick={handleAccept}
                        >
                            {saving ? "Registrando..." : "Aceptar y continuar"}
                        </button>
                    </div>
                </footer>
            </section>
        </div>
    );
}