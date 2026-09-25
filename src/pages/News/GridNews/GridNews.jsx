import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./GridNews.css";

export default function GridNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const API_URL = `${import.meta.env.VITE_API_URL}/news`;
        const res = await axios.get(API_URL);
        setNews(res.data);
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
                  {new Date(n.publicationDate).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <p>{n.shortDesc}</p>

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