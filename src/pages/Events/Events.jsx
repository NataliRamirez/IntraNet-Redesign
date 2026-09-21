import React, { useEffect, useState } from "react";
import "./Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const API_URL = `${import.meta.env.VITE_API_URL}/events`;

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((err) => console.error("Error cargando eventos:", err));
  }, []);

  return (
    <div  id="Events" className="public-events">
      <h1>Eventos 🎉</h1>

      {events.length === 0 ? (
        <p>No hay eventos programados en este momento.</p>
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
                <h2>{ev.name}</h2>

                <p className="date">
                  {ev.dateTime ? (
                    <>
                      📅{" "}
                      {new Date(ev.dateTime).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      | 🕒{" "}
                      {new Date(ev.dateTime).toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </>
                  ) : (
                    "Sin fecha definida"
                  )}
                </p>

                {ev.place && <p className="place">📍 {ev.place}</p>}

                <p className="desc">{ev.description}</p>

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
    </div>
  );
}
