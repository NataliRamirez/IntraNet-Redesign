import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TermsAcceptanceModal.css";

const API_URL = `${import.meta.env.VITE_API_URL}/terms-acceptance`;

const TERMS_VERSION = "2026-10-20";

const PRIVACY_EMAIL =
    "contactenos@emca-calarca-quindio.gov.co";

export default function TermsAcceptanceModal() {
    const [visible, setVisible] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const getToken = () => {
        const storedUser = JSON.parse(
            localStorage.getItem("user") || "{}"
        );

        return (
            storedUser.token ||
            localStorage.getItem("token") ||
            localStorage.getItem("accessToken")
        );
    };

    const getHeaders = () => {
        const token = getToken();

        return token
            ? { Authorization: `Bearer ${token}` }
            : {};
    };

    useEffect(() => {
        const checkAcceptance = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/me`,
                    { headers: getHeaders() }
                );

                const acceptance = response.data;

                if (
                    acceptance &&
                    acceptance.accepted === true &&
                    acceptance.termsVersion === TERMS_VERSION
                ) {
                    setVisible(false);
                } else {
                    setVisible(true);
                }
            } catch (err) {
                console.error(
                    "Error al consultar la aceptación:",
                    err
                );

                setError(
                    "No fue posible verificar la aceptación de los términos. " +
                    "Intenta nuevamente."
                );

                setVisible(true);
            } finally {
                setLoading(false);
            }
        };

        checkAcceptance();
    }, []);

    const handleAccept = async () => {
        if (!accepted || saving) return;

        setSaving(true);
        setError("");

        try {
            await axios.post(
                API_URL,
                {
                    termsVersion: TERMS_VERSION,
                    accepted: true,
                },
                {
                    headers: getHeaders(),
                }
            );

            setVisible(false);
        } catch (err) {
            console.error(
                "Error al registrar la aceptación:",
                err
            );

            setError(
                err.response?.data?.message ||
                "No fue posible registrar tu aceptación. Intenta nuevamente."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDecline = () => {
        const subject = encodeURIComponent(
            "Inconformidad con términos de uso y tratamiento de datos - IntraNet"
        );

        const body = encodeURIComponent(
            "Cordial saludo,\n\n" +
            "No acepto los términos de uso o tengo inquietudes " +
            "respecto al tratamiento de mis datos personales en la IntraNet.\n\n" +
            "Solicito información sobre las finalidades del tratamiento " +
            "y las opciones disponibles para ejercer mis derechos.\n\n" +
            "Nombre:\n" +
            "Área:\n\n" +
            "Gracias."
        );

        window.location.href =
            `mailto:${PRIVACY_EMAIL}?subject=${subject}&body=${body}`;
    };

    if (loading || !visible) {
        return null;
    }

    return (
        <div className="terms-modal-overlay">
            <section
                className="terms-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="terms-modal-title"
            >
                <header className="terms-modal-header">
                    <h2 id="terms-modal-title">
                        Términos de uso y tratamiento de datos personales
                    </h2>

                    <p>
                        EMCA Empresas Públicas de Calarcá E.S.P.
                    </p>
                </header>

                <div className="terms-modal-body">
                    <h3>1. Responsable del tratamiento</h3>

                    <p>
                        EMCA Empresas Públicas de Calarcá E.S.P., identificada
                        con NIT 890.000.377-0, con domicilio en Cra. 24 #39-54
                        Torre B, Calarcá, Quindío, es responsable del
                        tratamiento de los datos personales utilizados en
                        la IntraNet institucional.
                    </p>

                    <p>
                        Para consultas, solicitudes o reclamos relacionados
                        con sus datos personales puede comunicarse al correo:
                        {" "}
                        <a href={`mailto:${PRIVACY_EMAIL}`}>
                            {PRIVACY_EMAIL}
                        </a>.
                    </p>

                    <h3>2. Datos personales utilizados</h3>

                    <p>
                        La IntraNet podrá utilizar información como nombre,
                        área, cargo y, cuando corresponda, fecha de cumpleaños
                        e imagen del empleado.
                    </p>

                    <p>
                        También se podrá registrar la dirección IP, la fecha
                        y hora de aceptación, la versión de los términos
                        aceptados y la información técnica necesaria para
                        acreditar la aceptación y proteger la plataforma.
                    </p>

                    <h3>3. Finalidades</h3>

                    <ul>
                        <li>
                            Identificar a los usuarios y permitir el acceso
                            autorizado a la IntraNet.
                        </li>
                        <li>
                            Facilitar la consulta de información institucional,
                            noticias, eventos y comunicaciones.
                        </li>
                        <li>
                            Gestionar los permisos y la seguridad de las cuentas.
                        </li>
                        <li>
                            Registrar la aceptación de los términos y mantener
                            evidencia de la versión aceptada.
                        </li>
                        <li>
                            Utilizar los registros técnicos para prevenir,
                            detectar e investigar accesos no autorizados.
                        </li>
                        <li>
                            Mostrar cumpleaños e imágenes únicamente cuando
                            exista la autorización correspondiente para esa
                            finalidad, si esta es requerida.
                        </li>
                    </ul>

                    <h3>4. Seguridad y confidencialidad</h3>

                    <p>
                        EMCA adoptará medidas técnicas y administrativas
                        razonables para proteger los datos personales y los
                        registros de aceptación frente a accesos no autorizados,
                        pérdida, alteración o divulgación indebida.
                    </p>

                    <p>
                        Los datos serán consultados únicamente por personal
                        autorizado y utilizados para las finalidades informadas.
                    </p>

                    <h3>5. Conservación</h3>

                    <p>
                        Los registros de aceptación y las direcciones IP se
                        conservarán durante el tiempo necesario para acreditar
                        la aceptación, atender obligaciones legales y proteger
                        la seguridad de la plataforma, conforme al periodo
                        de conservación definido por EMCA.
                    </p>

                    <h3>6. Derechos del titular</h3>

                    <p>
                        El titular podrá conocer, actualizar y rectificar
                        sus datos personales, solicitar prueba de la
                        autorización cuando corresponda, conocer el uso
                        dado a sus datos y presentar consultas o reclamos.
                    </p>

                    <p>
                        También podrá solicitar la revocatoria de la
                        autorización o la supresión de sus datos cuando
                        sea procedente conforme a la ley.
                    </p>

                    <p>
                        Para ejercer estos derechos, puede enviar una
                        solicitud al correo:
                        {" "}
                        <a href={`mailto:${PRIVACY_EMAIL}`}>
                            {PRIVACY_EMAIL}
                        </a>.
                    </p>

                    <h3>7. Términos de uso</h3>

                    <p>
                        El usuario se compromete a utilizar la IntraNet
                        exclusivamente para fines institucionales,
                        respetar los permisos asignados a su cuenta,
                        mantener la confidencialidad de sus credenciales
                        y abstenerse de acceder, modificar, divulgar
                        o eliminar información sin autorización.
                    </p>

                    <p>
                        La aceptación de estos términos no reemplaza
                        las autorizaciones específicas que sean necesarias
                        para el tratamiento de datos personales.
                    </p>

                    <h3>8. No aceptación</h3>

                    <p>
                        Si no está de acuerdo con los términos de uso
                        o tiene inquietudes sobre el tratamiento de sus
                        datos personales, puede comunicarse con EMCA
                        mediante el correo indicado.
                    </p>

                    <p>
                        La falta de aceptación impedirá continuar
                        utilizando las funcionalidades de la IntraNet
                        que requieran dicha aceptación. Esto no limita
                        el derecho a presentar consultas o reclamos
                        relacionados con sus datos personales.
                    </p>
                </div>

                <footer className="terms-modal-footer">
                    <label className="terms-modal-checkbox">
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                        />

                        <span>
                            He leído y acepto los términos de uso de la
                            IntraNet y confirmo que he sido informado sobre
                            el tratamiento de mis datos personales, las
                            finalidades descritas y el registro de la IP,
                            fecha y hora de aceptación.
                        </span>
                    </label>

                    {error && (
                        <p className="terms-modal-error">
                            {error}
                        </p>
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
                            {saving
                                ? "Registrando..."
                                : "Aceptar y continuar"}
                        </button>
                    </div>
                </footer>
            </section>
        </div>
    );
}