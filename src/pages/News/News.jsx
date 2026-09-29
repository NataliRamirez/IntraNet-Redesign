import { motion } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./News.css";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const card = carousel.querySelector(".news-card");
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = 24;

    carousel.scrollBy({
      left: direction === "right" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
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

  // Carrusel automático
  useEffect(() => {
    if (news.length <= 1) return;

    const interval = setInterval(() => {
      const carousel = carouselRef.current;

      if (!carousel) return;

      const card = carousel.querySelector(".news-card");

      if (!card) return;

      const cardWidth = card.offsetWidth;
      const gap = 24;
      const move = cardWidth + gap;

      const maxScroll =
        carousel.scrollWidth - carousel.clientWidth;

      if (carousel.scrollLeft >= maxScroll - 5) {
        carousel.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        carousel.scrollBy({
          left: move,
          behavior: "smooth",
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [news]);

  if (loading) {
    return <p className="loading-msg">Cargando noticias...</p>;
  }

  return (
    <div id="Noticias" className="news-page">

      {/* ENCABEZADO */}
      <div className="news-header">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Noticias</h2>

          <p>
            Mantente informado sobre las últimas novedades,
            comunicados, actividades y eventos de EMCA E.S.P.
          </p>
        </motion.div>
      </div>

      {/* CONTENIDO */}
      <section className="news-containers">

        {news.length === 0 ? (
          <p>No hay noticias disponibles.</p>
        ) : (

          <div className="carousel-wrapper">

            {/* FLECHA IZQUIERDA */}
            <button
              className="carousel-btn left"
              onClick={() => scroll("left")}
              aria-label="Noticias anteriores"
            >
              ❮
            </button>

            {/* CARRUSEL */}
            <div
              className="news-carousel"
              ref={carouselRef}
            >
              {news.map((n) => (
                <article
                  className="news-card"
                  key={n.id}
                >

                  {/* IMAGEN */}
                  <div className="news-image-container">
                    {n.image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/news/${n.image}`}
                        alt={n.title}
                      />
                    ) : (
                      <div className="news-image-placeholder">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  {/* INFORMACIÓN */}
                  <div className="news-content">

                    <h2>{n.title}</h2>

                    <p className="date">
                      {new Date(
                        n.publication_date
                      ).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    <p className="news-description">
                      {n.short_desc}
                    </p>

                    <Link
                      to={`/news/${n.id}`}
                      className="see-more-news-btn"
                    >
                      Leer más →
                    </Link>

                  </div>

                </article>
              ))}
            </div>

            {/* FLECHA DERECHA */}
            <button
              className="carousel-btn right"
              onClick={() => scroll("right")}
              aria-label="Siguiente noticia"
            >
              ❯
            </button>

          </div>
        )}
      </section>
    </div>
  );
}