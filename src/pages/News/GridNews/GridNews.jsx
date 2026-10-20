import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GridNews.css";

export default function GridNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const API_URL = `${import.meta.env.VITE_API_URL}/news`;
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setNews(data);
        } else {
          console.error("La API no devolvió un array:", data);
        }
      } catch (error) {
        console.error("Error al obtener noticias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = news.filter((n) => {
    const searchText = search.toLowerCase().trim();
    const matchesSearch =
      !searchText ||
      n.title?.toLowerCase().includes(searchText) ||
      n.short_desc?.toLowerCase().includes(searchText) ||
      n.content?.toLowerCase().includes(searchText);

    const matchesDate =
      !dateFilter || n.publication_date?.startsWith(dateFilter);
    return matchesSearch && matchesDate;
  });

  const clearFilters = () => {
    setSearch("");
    setDateFilter("");
  };

  if (loading) {
    return <p className="loading-msg">Cargando noticias...</p>;
  }

  return (
    <div className="grid-news-page" id="News">
      {/* HERO */}
      <header className="grid-news-header">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Todas las Noticias</h2>
          <p>Consulta las noticias, comunicados y novedades publicadas por EMCA E.S.P.</p>
        </motion.div>
      </header>

      {/* CONTENIDO */}
      <main className="news-grid-container" id="RecentNews">
        <h3 className="subtitle">Aquí encontrarás todas las noticias registradas en el sistema.</h3>
        <div className="news-filters">
          <div className="news-search">
            <input
              type="text"
              placeholder="🔍 Buscar noticia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar noticias"
            />
          </div>

          <div className="news-date-filter">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              aria-label="Filtrar noticias por fecha"
            />
          </div>

          {(search || dateFilter) && (
            <button
              type="button"
              className="news-clear-filters"
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* RESULTADOS */}
        {news.length === 0 ? (
          <p className="no-news">No hay noticias registradas en este momento.</p>
        ) : filteredNews.length === 0 ? (
          <p className="no-news">No se encontraron noticias con los filtros seleccionados.</p>
        ) : (
          <div className="news-grid">
            {filteredNews.map((n) => (
              <article className="grid-card" key={n.id}>
                {/* IMAGEN */}
                {n.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/news/${n.image}`}
                    alt={n.title || "Imagen de la noticia"}
                    loading="lazy"
                  />
                )}

                {/* INFORMACIÓN */}
                <div className="grid-info">
                  <h2>{n.title}</h2>

                  <p className="fecha">
                    {n.publication_date
                      ? new Date(n.publication_date).toLocaleDateString(
                        "es-CO",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )
                      : "Sin fecha de publicación"}
                  </p>

                  {n.short_desc && <p>{n.short_desc}</p>}

                  <Link to={`/news/${n.id}`} className="btn">Leer más →</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <div className="olderNews" id="OlderNews"></div>
    </div>
  );
}