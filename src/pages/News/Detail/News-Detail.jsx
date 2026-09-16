import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./News-Detail.css";

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // ✅ Usamos la variable de entorno
        const API_URL = `${import.meta.env.VITE_API_URL}/news/${id}`;
        const res = await axios.get(API_URL);
        setNews(res.data);
      } catch (error) {
        console.error("Error al obtener la noticia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticia();
  }, [id]);

  if (loading) return <p>Cargando noticia...</p>;
  if (!news) return <p>Noticia no encontrada.</p>;

  return (
    <div className="detail-container">
      {news.image && (
        <img
          className="detail-img"
          // ✅ También usamos la variable de entorno para las imágenes
          src={`${import.meta.env.VITE_API_URL}/uploads/news/${news.image}`}
          alt={news.title}
        />
      )}

      <h1>{news.title}</h1>
      <p className="date">
        {new Date(news.publicationDate).toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>

      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: news.content || "" }}
      />

      <Link to="/news" className="return-btn">
        ← Volver
      </Link>
    </div>
  );
}
