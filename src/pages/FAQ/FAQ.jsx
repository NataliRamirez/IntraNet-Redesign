import React, { useState } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import "./FAQ.css";

const preguntas = [
    {
        categoria: "General",
        pregunta: "¿Qué es la IntraNet de EMCA y para qué sirve?",
        respuesta:
            "La IntraNet de EMCA es una plataforma institucional que centraliza información de interés para los colaboradores. A través de ella puedes consultar noticias, eventos, información de empleados y otras publicaciones relacionadas con la entidad."
    },
    {
        categoria: "General",
        pregunta: "¿Qué información puedo consultar sin iniciar sesión?",
        respuesta:
            "Puedes consultar las secciones públicas de la IntraNet, como noticias y eventos institucionales. Para acceder a las funciones administrativas o a información restringida, es necesario iniciar sesión con una cuenta autorizada."
    },
    {
        categoria: "Acceso",
        pregunta: "¿Cómo puedo iniciar sesión en la IntraNet?",
        respuesta:
            "Selecciona la opción de inicio de sesión ubicada en el encabezado de la página. Ingresa tu correo institucional y contraseña. Una vez autenticado, podrás acceder a las opciones disponibles según los permisos asignados a tu cuenta."
    },
    {
        categoria: "Acceso",
        pregunta: "¿Qué debo hacer si olvidé mi contraseña?",
        respuesta:
            "Si olvidaste tu contraseña, comunícate con el administrador de la IntraNet para solicitar asistencia. Por seguridad, no compartas tu contraseña con otras personas ni la envíes por medios no autorizados."
    },
    {
        categoria: "Acceso",
        pregunta: "¿Por qué no puedo ingresar a una sección de la IntraNet?",
        respuesta:
            "El acceso a determinadas secciones depende de tu rol y de los permisos asignados a tu cuenta. Si una opción no está disponible o recibes un mensaje de acceso denegado, verifica que hayas iniciado sesión. Si el problema continúa, comunícate con el administrador para revisar tus permisos."
    },
    {
        categoria: "Noticias",
        pregunta: "¿Dónde puedo consultar las noticias institucionales?",
        respuesta:
            "Dirígete a la sección Noticias desde el menú de navegación. Allí puedes consultar las publicaciones disponibles y seleccionar una noticia para leer su contenido completo, conocer los detalles y revisar la información publicada."
    },
    {
        categoria: "Noticias",
        pregunta: "¿Cómo puedo saber si hay una noticia nueva?",
        respuesta:
            "Puedes revisar la sección Noticias o consultar las notificaciones de la IntraNet. Cuando se publiquen novedades, las notificaciones disponibles te ayudarán a identificar las actualizaciones relacionadas con las noticias institucionales."
    },
    {
        categoria: "Eventos",
        pregunta: "¿Cómo puedo consultar los eventos institucionales?",
        respuesta:
            "Ingresa a la sección Eventos desde el menú de navegación. Allí puedes consultar las actividades programadas y revisar la información disponible, como el nombre del evento, su fecha, horario y descripción."
    },
    {
        categoria: "Eventos",
        pregunta: "¿Cómo puedo conocer la fecha y los detalles de un evento?",
        respuesta:
            "Selecciona el evento que te interesa dentro de la sección Eventos. En su página de detalles encontrarás la información registrada sobre la actividad, incluyendo su fecha, horario y descripción."
    },
    {
        categoria: "Empleados",
        pregunta: "¿Dónde puedo consultar la información de los empleados de EMCA?",
        respuesta:
            "Puedes ingresar a la sección Empleados, si está habilitada para tu cuenta. Allí podrás consultar la información institucional disponible y utilizar las opciones de búsqueda para localizar los registros que necesites."
    },
    {
        categoria: "Cuenta",
        pregunta: "¿Cómo puedo cambiar mi contraseña?",
        respuesta:
            "Inicia sesión en la IntraNet y accede a tu perfil de usuario. Si tienes habilitada la opción de cambiar contraseña, ingresa tu contraseña actual y registra la nueva siguiendo las indicaciones del sistema. Recuerda utilizar una contraseña segura y mantenerla privada."
    },
    {
        categoria: "Notificaciones",
        pregunta: "¿Qué son las notificaciones de la IntraNet?",
        respuesta:
            "Las notificaciones te informan sobre novedades relacionadas con las noticias y los eventos institucionales, como publicaciones nuevas, modificaciones o eliminaciones. Puedes consultar las notificaciones desde el ícono de la campana ubicado en el encabezado."
    },
    {
        categoria: "Notificaciones",
        pregunta: "¿Qué puedo hacer si no aparecen mis notificaciones?",
        respuesta:
            "Verifica que tengas conexión a internet y actualiza la página de la IntraNet. También puedes revisar los filtros de notificaciones para asegurarte de que no estés mostrando únicamente las leídas o las no leídas. Si el problema persiste, comunícate con el administrador."
    }
];


const categorias = [
    "Todas",
    "General",
    "Acceso",
    "Noticias",
    "Eventos",
    "Empleados",
    "Cuenta",
    "Notificaciones"
];

export default function FAQ() {
    const [busqueda, setBusqueda] = useState("");
    const [categoriaActiva, setCategoriaActiva] = useState("Todas");
    const [preguntaAbierta, setPreguntaAbierta] = useState(null);
    const preguntasFiltradas = preguntas.filter((item) => {
        const coincideCategoria = categoriaActiva === "Todas" || item.categoria === categoriaActiva;
        const texto = `${item.pregunta} ${item.respuesta}`.toLowerCase();
        const coincideBusqueda = texto.includes(busqueda.toLowerCase());

        return coincideCategoria && coincideBusqueda;
    });

    return (
        <section className="faq-section">

            <div className="faq-header">
                <h1 className="h1">PREGUNTAS FRECUENTES</h1>
                <span className="faq-subtitle">CENTRO DE AYUDA</span>
            </div>
            <div className="faq-container">
                <div className="faq-search">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Buscar una pregunta..."
                        value={busqueda}
                        onChange={(e) => {
                            setBusqueda(e.target.value);
                            setPreguntaAbierta(null);
                        }}
                    />
                </div>

                <div className="faq-categorias">
                    {categorias.map((categoria) => (
                        <button
                            key={categoria}
                            type="button"
                            className={
                                categoriaActiva === categoria ? "faq-categoria activa" : "faq-categoria"
                            }
                            onClick={() => {
                                setCategoriaActiva(categoria);
                                setPreguntaAbierta(null);
                            }}
                        >
                            {categoria}
                        </button>
                    ))}
                </div>

                <div className="faq-lista">
                    {preguntasFiltradas.length > 0 ? (
                        preguntasFiltradas.map((item, index) => {
                            const estaAbierta = preguntaAbierta === index;

                            return (
                                <article className={`faq-item ${estaAbierta ? "abierta" : ""}`} key={item.pregunta}>
                                    <button
                                        type="button"
                                        className="faq-pregunta"
                                        aria-expanded={estaAbierta}
                                        onClick={() =>
                                            setPreguntaAbierta(estaAbierta ? null : index)
                                        }
                                    >
                                        <span>{item.pregunta}</span>
                                        <FiChevronDown className="faq-chevron" />
                                    </button>

                                    {estaAbierta && (
                                        <div className="faq-respuesta">
                                            <p>{item.respuesta}</p>
                                        </div>
                                    )}
                                </article>
                            );
                        })
                    ) : (
                        <div className="faq-vacio">
                            <FiSearch />
                            <h3>No encontramos resultados</h3>
                            <p> Intenta buscar con otras palabras o selecciona una categoría diferente.</p>
                        </div>
                    )}
                </div>

                <div className="faq-contacto">
                    <h3>¿No encontraste lo que buscabas?</h3>
                    <p>Si tienes otra duda sobre el funcionamiento de la IntraNet, comunícate con el administrador.</p>
                </div>
            </div>
        </section>
    );
}
