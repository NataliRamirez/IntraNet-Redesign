import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import "./Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);

  // 🔎 Filtros
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const API_URL = `${import.meta.env.VITE_API_URL}/events`;

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error cargando eventos:", err));
  }, []);

  // 🔎 Filtrar eventos
  const filteredEvents = events.filter((ev) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      ev.name?.toLowerCase().includes(searchText) ||
      ev.description?.toLowerCase().includes(searchText) ||
      ev.place?.toLowerCase().includes(searchText);

    const matchesDate =
      !dateFilter || ev.dateTime?.startsWith(dateFilter);

    return matchesSearch && matchesDate;
  });

  // 🧹 Limpiar filtros
  const clearFilters = () => {
    setSearch("");
    setDateFilter("");
  };

  return (
    <div className="events-page">
      {/* ================= HERO ================= */}
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
              Conoce los próximos eventos, actividades y espacios de
              participación organizados por EMCA E.S.P.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= EVENTOS ================= */}
      <section id="Events" className="events-container">

        {/* ================= FILTROS ================= */}
        <div className="events-filters">

          {/* 🔎 Buscar */}
          <div className="events-search">
            <input
              type="text"
              placeholder="🔍 Buscar evento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* 📅 Fecha */}
          <div className="events-date-filter">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {/* 🧹 Limpiar */}
          {(search || dateFilter) && (
            <button
              type="button"
              className="events-clear-filters"
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* ================= RESULTADOS ================= */}
        {events.length === 0 ? (
          <p className="no-events">
            No hay eventos programados en este momento.
          </p>
        ) : filteredEvents.length === 0 ? (
          <p className="no-events">
            No se encontraron eventos con los filtros seleccionados.
          </p>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((ev) => (
              <article className="event-card" key={ev.id}>

                {/* 🖼️ Imagen */}
                {ev.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/events/${ev.image}`}
                    alt={ev.name}
                    className="event-image"
                  />
                )}

                <div className="event-body">

                  {/* 📝 Nombre */}
                  <h2 className="event-title">
                    {ev.name}
                  </h2>

                  {/* 📅 Fecha y hora */}
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

                  {/* 📍 Lugar */}
                  {ev.place && (
                    <p className="event-place">
                      📍 {ev.place}
                    </p>
                  )}

                  {/* 📄 Descripción */}
                  <p className="event-description">
                    {ev.description}
                  </p>

                  {/* 🔗 Inscripción */}
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