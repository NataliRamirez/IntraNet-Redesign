import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./News.css";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const cardWidth = 360; // width + gap
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

  if (loading) return <p className="loading-msg">Cargando noticias...</p>;

  return (
    <section id="Noticias" className="news-container">
      <h2>SECCIÓN DE NOTICIAS NUEVAS</h2>

      {news.length === 0 ? (
        <p>No hay noticias disponibles.</p>
      ) : (
        <div className="carousel-wrapper">
          {/* Botón Izquierda */}
          <button className="carousel-btn left" onClick={() => scroll("left")}>
            ❮
          </button>

          {/* Carrusel */}
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
                    {new Date(n.publicationDate).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p>{n.shortDesc}</p>
                  <Link to={`/news/${n.id}`} className="see-more-btn">
                    Leer más →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Botón Derecha */}
          <button className="carousel-btn right" onClick={() => scroll("right")}>
            ❯
          </button>
        </div>
      )}
    </section>
  );
}
