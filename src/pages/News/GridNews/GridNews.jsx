import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GridNews.css";

export default function GridNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔎 Filtros
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const API_URL = `${import.meta.env.VITE_API_URL}/news`;

        const res = await fetch(API_URL);

        console.log("Estado /news:", res.status);

        const data = await res.json();

        console.log("Respuesta /news:", data);

        if (!Array.isArray(data)) {
          console.error("La API no devolvió un arreglo:", data);
          return;
        }

        setNews(data);
      } catch (error) {
        console.error("Error al obtener noticias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // 🔎 Filtrar noticias
  const filteredNews = news.filter((n) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      n.title?.toLowerCase().includes(searchText) ||
      n.short_desc?.toLowerCase().includes(searchText) ||
      n.content?.toLowerCase().includes(searchText);

    const matchesDate =
      !dateFilter ||
      n.publication_date?.startsWith(dateFilter);

    return matchesSearch && matchesDate;
  });

  // 🧹 Limpiar filtros
  const clearFilters = () => {
    setSearch("");
    setDateFilter("");
  };

  if (loading) {
    return <p className="loading-msg">Cargando noticias...</p>;
  }

  return (
    <div className="grid-news-page">

      {/* ================= HERO ================= */}
      <div className="grid-news-header">
        <div className="hero-content">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Todas las Noticias</h2>

            <p>
              Consulta las noticias, comunicados y novedades publicadas
              por EMCA E.S.P.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= CONTENIDO ================= */}
      <div className="news-grid-container">

        <h3 className="subtitle">
          Aquí encontrarás todas las noticias registradas en el sistema.
        </h3>

        {/* ================= FILTROS ================= */}
        <div className="news-filters">

          {/* 🔎 Buscar */}
          <div className="news-search">
            <input
              type="text"
              placeholder="🔍 Buscar noticia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* 📅 Fecha */}
          <div className="news-date-filter">
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
              className="news-clear-filters"
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* ================= RESULTADOS ================= */}
        {news.length === 0 ? (
          <p className="no-news">
            No hay noticias registradas en este momento.
          </p>
        ) : filteredNews.length === 0 ? (
          <p className="no-news">
            No se encontraron noticias con los filtros seleccionados.
          </p>
        ) : (
          <div className="news-grid">

            {filteredNews.map((n) => (
              <div className="grid-card" key={n.id}>

                {/* 🖼️ Imagen */}
                {n.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/news/${n.image}`}
                    alt={n.title}
                  />
                )}

                <div className="grid-info">

                  {/* 📰 Título */}
                  <h2>{n.title}</h2>

                  {/* 📅 Fecha */}
                  <p className="fecha">
                    {new Date(n.publication_date).toLocaleDateString(
                      "es-CO",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>

                  {/* 📝 Descripción */}
                  <p>{n.short_desc}</p>

                  {/* 🔗 Detalle */}
                  <Link
                    to={`/news/${n.id}`}
                    className="btn"
                  >
                    Leer más →
                  </Link>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}