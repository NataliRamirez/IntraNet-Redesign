import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GridNews.css";

export default function GridNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p className="loading-msg">Cargando noticias...</p>;
  }

  return (
    <div className="grid-news-page">
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

      <div className="news-grid-container">
        <h3 className="subtitle">
          Aquí encontrarás todas las noticias registradas en el sistema.
        </h3>

        <div className="news-grid">
          {news.map((n) => (
            <div className="grid-card" key={n.id}>
              {n.image && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/news/${n.image}`}
                  alt={n.title}
                />
              )}

              <div className="grid-info">
                <h2>{n.title}</h2>

                <p className="fecha">
                  {new Date(n.publication_date).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <p>{n.short_desc}</p>

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
      </div>
    </div>
  );
}