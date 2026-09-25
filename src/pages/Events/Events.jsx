import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import "./Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const API_URL = `${import.meta.env.VITE_API_URL}/events`;

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error cargando eventos:", err));
  }, []);

  return (
    <div className="events-page">
      <div className="events-header">
        <div className="hero-content">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Eventos</h2>
            <p>
              Conoce los próximos eventos, actividades y espacios de participación
              organizados por EMCA E.S.P.
            </p>
          </motion.div>
        </div>
      </div>

      <section id="Events" className="events-container">
        {events.length === 0 ? (
          <p className="no-events">
            No hay eventos programados en este momento.
          </p>
        ) : (
          <div className="events-grid">
            {events.map((ev) => (
              <article className="event-card" key={ev.id}>
                {ev.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/events/${ev.image}`}
                    alt={ev.name}
                    className="event-image"
                  />
                )}

                <div className="event-body">
                  <h2 className="event-title">{ev.name}</h2>

                  <p className="event-date">
                    {ev.dateTime ? (
                      <>
                        📅{" "}
                        {new Date(ev.dateTime).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        <br />
                        🕒{" "}
                        {new Date(ev.dateTime).toLocaleTimeString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </>
                    ) : (
                      "Sin fecha definida"
                    )}
                  </p>

                  {ev.place && (
                    <p className="event-place">
                      📍 {ev.place}
                    </p>
                  )}

                  <p className="event-description">
                    {ev.description}
                  </p>

                  {ev.link && (
                    <a
                      href={ev.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-btn"
                    >
                      Inscribirse
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}