import { motion } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./News.css";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const cardWidth = 450;

    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === "right" ? cardWidth : -cardWidth,
        behavior: "smooth",
      });
    }
  };

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
    <div className="news-page">
      <div className="news-header">
        <div className="hero-content">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Noticias</h2>
            <p>
              Mantente informado sobre las últimas novedades, comunicados,
              actividades y eventos de EMCA E.S.P.
            </p>
          </motion.div>
        </div>
      </div>

      <section id="Noticias" className="news-containers">
        {news.length === 0 ? (
          <p>No hay noticias disponibles.</p>
        ) : (
          <div className="carousel-wrapper">
            <button
              className="carousel-btn left"
              onClick={() => scroll("left")}
            >
              ❮
            </button>

            <div className="news-carousel" ref={carouselRef}>
              {news.map((n) => (
                <div className="news-card" key={n.id}>
                  {n.image && (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/news/${n.image}`}
                      alt={n.title}
                    />
                  )}

                  <div className="news-content">
                    <h2>{n.title}</h2>

                    <p className="date">
                      {new Date(n.publication_date).toLocaleDateString(
                        "es-CO",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>

                    <p>{n.short_desc}</p>

                    <Link
                      to={`/news/${n.id}`}
                      className="see-more-btn"
                    >
                      Leer más →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="carousel-btn right"
              onClick={() => scroll("right")}
            >
              ❯
            </button>
          </div>
        )}
      </section>
    </div>
  );
}