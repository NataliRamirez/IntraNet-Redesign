import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./Event-Detail.css"; // Crea este CSS si quieres estilos específicos, similar a NoticiaDetalle.css

export default function EventDetail() {
  const { id } = useParams(); // Obtiene el ID del evento de la URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Ajusta la URL si tu API es diferente (e.g., /events/${id})
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

  if (loading) return <p>Cargando evento...</p>;
  if (!event) return <p>Evento no encontrado.</p>;

  return (
    <div className="detail-container">
      {event.imagen && (
        <img
          className="detail-img"
          src={`${import.meta.env.VITE_API_URL}/uploads/events/${event.imagen}`} // Ajusta la ruta de imágenes si es diferente
          alt={event.title}
        />
      )}

      <h1>{event.title}</h1>
      <p className="date">
        {new Date(event.date).toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>

      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: event.description || "" }} // Ajusta el campo si es diferente (e.g., contenido)
      />

      <Link to="/events" className="volver-btn">
        ← Volver a Eventos
      </Link>
    </div>
  );
}