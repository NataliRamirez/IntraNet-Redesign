import "./Home.css";
import CalendarEvents from "../../components/CalendarComponent/CalendarComponent";
import { useState, useEffect } from "react";
import Slider from "../../components/Slider/Slider";
import News from "../../pages/News/News";

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

      <section className="hero-compact">
        <div className="hero-content">

          <h2>Portal de Noticias</h2>
          <News />

          <div className="horizontal-line">
            <h2>Calendario EMCA</h2>
          </div>

          <div className="calendar-card">
            <CalendarEvents events={events} />
          </div>
        </div>
        <Slider />
      </section>
    </div>
  );
}
