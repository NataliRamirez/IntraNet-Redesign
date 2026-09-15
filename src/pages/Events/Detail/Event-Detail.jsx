import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./EventoDetalle.css"; // Crea este CSS si quieres estilos específicos, similar a NoticiaDetalle.css

export default function EventoDetalle() {
  const { id } = useParams(); // Obtiene el ID del evento de la URL
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        // Ajusta la URL si tu API es diferente (e.g., /events/${id})
        const API_URL = `${import.meta.env.VITE_API_URL}/events/${id}`;
        const res = await axios.get(API_URL);
        setEvento(res.data);
      } catch (error) {
        console.error("Error al obtener el evento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvento();
  }, [id]);

  if (loading) return <p>Cargando evento...</p>;
  if (!evento) return <p>Evento no encontrado.</p>;

  return (
    <div className="detalle-container">
      {evento.imagen && (
        <img
          className="detalle-img"
          src={`${import.meta.env.VITE_API_URL}/uploads/events/${evento.imagen}`} // Ajusta la ruta de imágenes si es diferente
          alt={evento.titulo}
        />
      )}

      <h1>{evento.titulo}</h1>
      <p className="fecha">
        {new Date(evento.fecha).toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>

      <div
        className="contenido"
        dangerouslySetInnerHTML={{ __html: evento.descripcion || "" }} // Ajusta el campo si es diferente (e.g., contenido)
      />

      <Link to="/eventos" className="volver-btn">
        ← Volver a Eventos
      </Link>
    </div>
  );
}