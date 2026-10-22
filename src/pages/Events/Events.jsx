import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import "./Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const API_URL = `${import.meta.env.VITE_API_URL}/events`;

    fetch(API_URL).then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {setEvents(Array.isArray(data) ? data : []);})
      .catch((err) => console.error("Error cargando eventos:", err));
  }, []);

  const filteredEvents = events
    .filter((ev) => {
      const searchText = search.toLowerCase().trim();
      const matchesSearch = !searchText ||
        ev.name?.toLowerCase().includes(searchText) ||
        ev.description?.toLowerCase().includes(searchText) ||
        ev.place?.toLowerCase().includes(searchText);

      const matchesDate = !dateFilter || (ev.date_time && new Date(ev.date_time).toLocaleDateString("en-CA") === dateFilter);
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      const now = Date.now();
      const dateA = a.date_time ? new Date(a.date_time).getTime() : 0;
      const dateB = b.date_time ? new Date(b.date_time).getTime() : 0;
      const upcomingA = dateA >= now;
      const upcomingB = dateB >= now;

      if (upcomingA && upcomingB) {return dateA - dateB;}
      if (upcomingA) return -1;
      if (upcomingB) return 1;
      return dateB - dateA;
    });

  const clearFilters = () => {
    setSearch("");
    setDateFilter("");
  };

  return (
    <div className="events-page" id="Events">
      <div className="events-header">
        <div className="hero-content">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Eventos</h2>
            <p>Conoce los próximos eventos, actividades y espacios de participación organizados por EMCA E.S.P.</p>
          </motion.div>
        </div>
      </div>

      <section id="Events" className="events-container" id="RecentEvents">
        <div className="events-filters">
          <div className="events-search">
            <input
              type="text"
              placeholder="🔍 Buscar evento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="events-date-filter">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

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

        {events.length === 0 ? (
          <p className="no-events">No hay eventos programados en este momento.</p>
        ) : filteredEvents.length === 0 ? (
          <p className="no-events">No se encontraron eventos con los filtros seleccionados.</p>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((ev) => (
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
                    {ev.date_time ? (
                      <>
                        📅{" "}
                        {new Date(ev.date_time).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        <br />
                        🕒{" "}
                        {new Date(ev.date_time).toLocaleTimeString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </>
                    ) : (
                      "Sin fecha definida"
                    )}
                  </p>

                  {ev.place && (<p className="event-place">📍 {ev.place}</p>)}
                  <p className="event-description">{ev.description}</p>
                  {ev.link && (
                    <a href={ev.link} target="_blank" rel="noopener noreferrer" className="event-btn">
                      Inscribirse
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <div className="olderEvents" id="OlderEvents"></div>
    </div>
  );
}