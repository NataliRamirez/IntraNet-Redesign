import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./NewsDetail.css";

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const API_URL = `${import.meta.env.VITE_API_URL}/news/${id}`;
        const res = await fetch(API_URL);
        console.log("Estado /news/:id:", res.status);
        const data = await res.json();
        console.log("Respuesta /news/:id:", data);

        setNews(data);
      } catch (error) {
        console.error("Error al obtener la noticia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return <p className="loading-msg">Cargando noticia...</p>;
  }

  if (!news) {
    return <p className="loading-msg">Noticia no encontrada.</p>;
  }

  return (
    <>
    <div className="detail-header">
      <div className="hero-content">
        <h2>Noticias</h2>
        <p>Mantente informado sobre las últimas novedades, actividades y comunicados de EMCA E.S.P.</p>
      </div>
    </div>
    <div className="detail-page">
        <div className="detail-container">
          {news.image && (
            <img
              className="detail-img"
              src={`${import.meta.env.VITE_API_URL}/uploads/news/${news.image}`}
              alt={news.title} />
          )}

          <h1>{news.title}</h1>
          <p className="date">
            {new Date(news.publication_date).toLocaleDateString("es-CO", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>

          <div
            className="content"
            dangerouslySetInnerHTML={{__html: news.content || "",}} />
          <Link to="/news" className="return-btn">← Volver a noticias</Link>
        </div>
      </div></>
  );
}