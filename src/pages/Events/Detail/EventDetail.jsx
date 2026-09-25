import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./EventDetail.css";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const API_URL = `${import.meta.env.VITE_API_URL}/events/${id}`;
        const res = await axios.get(API_URL);
        setEvent(res.data);
      } catch (error) {
        console.error("Error al obtener el evento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="event-detail-message">
        <p>Cargando evento...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail-message">
        <p>Evento no encontrado.</p>

        <Link to="/events" className="volver-btn">
          ← Volver a Eventos
        </Link>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      <section className="event-detail-header">
        <div className="event-detail-hero">
          <h1>{event.name}</h1>
          <p>Conoce toda la información de este evento.</p>
        </div>
      </section>

      <main className="event-detail-container">
        <article className="event-detail-card">
          {event.image && (
            <img
              className="detail-img"
              src={`${import.meta.env.VITE_API_URL}/uploads/events/${event.image}`}
              alt={event.name}
            />
          )}

          <div className="event-detail-content">
            <h2>{event.name}</h2>

            {event.dateTime && (
              <div className="event-detail-info">
                <p>
                  📅{" "}
                  {new Date(event.dateTime).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <p>
                  🕒{" "}
                  {new Date(event.dateTime).toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}

            {event.place && (
              <p className="event-detail-place">
                📍 {event.place}
              </p>
            )}

            <div
              className="event-detail-description"
              dangerouslySetInnerHTML={{
                __html: event.description || "",
              }}
            />

            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="event-detail-btn"
              >
                Inscribirse
              </a>
            )}

            <Link to="/events" className="volver-btn">
              ← Volver a Eventos
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}