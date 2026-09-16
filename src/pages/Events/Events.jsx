import React, { useEffect, useState } from "react";
import "./Events.css";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const API_URL = `${import.meta.env.VITE_API_URL}/eventos`;

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((err) => console.error("Error cargando eventos:", err));
  }, []);

  return (
    <div  id="Eventos" className="eventos-publicos">
      <h1>Eventos 🎉</h1>

      {eventos.length === 0 ? (
        <p>No hay eventos programados en este momento.</p>
      ) : (
        <div className="eventos-grid">
          {eventos.map((ev) => (
            <article className="evento-card" key={ev.id}>
              {ev.imagen && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/events/${ev.imagen}`}
                  alt={ev.nombre}
                  className="evento-imagen"
                />
              )}

              <div className="evento-body">
                <h2>{ev.nombre}</h2>

                <p className="fecha">
                  {ev.fechaHora ? (
                    <>
                      📅{" "}
                      {new Date(ev.fechaHora).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      | 🕒{" "}
                      {new Date(ev.fechaHora).toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </>
                  ) : (
                    "Sin fecha definida"
                  )}
                </p>

                {ev.lugar && <p className="lugar">📍 {ev.lugar}</p>}

                <p className="desc">{ev.descripcion}</p>

                {ev.link && (
                  <a
                    href={ev.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="evento-btn"
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
