import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminNews.css";

// ✅ 1️⃣ CAMBIO PRINCIPAL: usamos la variable del .env
const API_URL = import.meta.env.VITE_API_URL + "/news";

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    shortDesc: "",
    content: "",
    publicationDate: "",
    image: "",
  });
  const [imagenFile, setImagenFile] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get(API_URL);
      setNews(res.data);
    } catch (err) {
      console.error("Error al obtener noticias:", err);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenFile(file);
    setForm((f) => ({ ...f, image: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan Campos',
        text: 'El título y el contenido de la noticia son obligatorios.',
      });
      return;
    }

    const fd = new FormData();
    fd.append("titulo", form.title);
    fd.append("shortDesc", form.shortDesc || form.content.slice(0, 120));
    fd.append("contenido", form.content);
    fd.append(
      "fechaPublicacion", form.publicationDate || new Date().toISOString()
    );
    if (imageFile) fd.append("imagen", imageFile);

    let actionTitle = '';

    try {
      if (form.id) {
        await axios.patch(`${API_URL}/${form.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        actionTitle = 'Noticia Actualizada';
      } else {
        await axios.post(API_URL, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        actionTitle = 'Noticia Publicada';
      }

      Swal.fire({
        icon: 'success',
        title: actionTitle,
        text: 'La noticia se ha guardado con éxito.',
        showConfirmButton: false,
        timer: 1800
      });

      fetchNews();
      resetForm();
    } catch (err) {
      console.error("Error guardando noticia:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error de Publicación',
        text: 'Hubo un problema al guardar la noticia. Consulta la consola.',
      });
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      shortDesc: "",
      content: "",
      publicationDate: "",
      image: "",
    });
    setImagenFile(null);
  };

  const handleEdit = (n) => {
    setForm({
      id: n.id,
      title: n.title,
      shortDesc: n.shortDesc,
      content: n.content,
      publicationDate: n.publicationDate
        ? new Date(n.PublicationDate).toISOString().slice(0, 16)
        : "",
      // ✅ 2️⃣ CAMBIO: imagen usa la URL del .env
      image: n.image
        ? `${import.meta.env.VITE_API_URL}/uploads/news/${n.image}`
        : "",
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar Noticia?',
      text: "¿Estás seguro de que quieres borrar esta noticia?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'No, cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchNews();
        Swal.fire('Borrado!', 'La noticia ha sido eliminada.', 'info');
      } catch (err) {
        console.error("Error eliminando noticia:", err);
        Swal.fire('Error', 'No se pudo eliminar la noticia.', 'error');
      }
    }
  };

  return (
    <div className="adminNews">
      <div className="section-form">
        <h2>Crear Noticias:</h2>

        <form onSubmit={handleSubmit} className="news-form">
          <input
            type="text"
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Descripción corta"
            value={form.shortDesc}
            onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
          />
          <textarea
            placeholder="Contenido de la noticia"
            rows={6}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
          <input type="file" accept="image/*" onChange={handleImage} />

          {form.image && (
            <img
              src={form.imagen}
              alt="Previsualización"
              style={{ width: 150, borderRadius: 8, marginTop: 8 }}
            />
          )}

          <input
            type="datetime-local"
            value={form.publicationDate}
            onChange={(e) =>
              setForm({ ...form, publicationDate: e.target.value })
            }
          />

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit">
              {form.id ? "Update" : "Create"} Noticia
            </button>
            {form.id && (
              <button type="button" onClick={resetForm}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="section-news">
        <h2>Noticias registradas</h2>
        <div className="news-list">
          {news.length === 0 ? (
            <p>No hay noticias aún.</p>
          ) : (
            news.map((n) => (
              <div key={n.id} className="news-card">
                {n.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/news/${n.image}`}
                    alt={n.title}
                  />
                )}
                <div className="news-card-content">
                  <h4>{n.titulo}</h4>
                  <div className="date">
                    {new Date(n.fechaPublicacion).toLocaleString("es-CO", {
                      dateStyle: "medium",
                    })}
                  </div>
                  <p>{n.shortDesc}</p>
                  <div className="actions">
                    <button onClick={() => handleEdit(n)}>Editar</button>
                    <button onClick={() => handleDelete(n.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
