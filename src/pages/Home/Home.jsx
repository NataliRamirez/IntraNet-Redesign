import { motion } from "framer-motion";
import "./Home.css";
import CalendarioEventos from "../../components/CalendarComponent/CalendarComponent";
import { useState, useEffect } from "react";
import News from "../../Pages/News/News";
import Us from "../../Pages/Us/Us";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // ✅ Usamos la URL base desde el archivo .env
    const API_URL = `${import.meta.env.VITE_API_URL}/events`;

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error al cargar eventos:", err));
  }, []);

  return (
    <div className="home">

      {/* Línea divisoria del encabezado */}
      <div className="inline"></div>

      {/* Sección principal de bienvenida */}
      <section
        id="Home"
        className="header-bottom"
      >
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="title-header-bottom">
            INTRANET - EMPRESAS PÚBLICAS DE CALARCÁ E.S.P
          </h2>
        </motion.div>
        <p>
          En este portal podrás acceder a información
          relevante sobre noticias, eventos, herramientas
          e información corporativa.
        </p>
      </section>

      <section id="Noticias">
        <News />
      </section>

      <div className="horizontal-line">
        <span>Calendario EMCA</span>
      </div>

      <div id="Eventos" className="calendar-card">
        <CalendarioEventos events={events} />
      </div>

      <section id="Nosotros" className="us-section">
        <Us />
      </section>
    </div>
  );
}