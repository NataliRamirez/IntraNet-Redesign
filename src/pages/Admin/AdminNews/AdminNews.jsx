import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import "./AdminNews.css";

// URL base del backend
const API_URL = import.meta.env.VITE_API_URL + "/news";

export default function AdminNews() {
  const [news, setNews] = useState([]);

  const [form, setForm] = useState({
    id: null,
    title: "",
    short_desc: "",
    content: "",
    publication_date: "",
    image: "",
  });

  const [imagenFile, setImagenFile] = useState(null);

  // =========================
  // BÚSQUEDA Y FILTROS
  // =========================
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // =========================
  // OBTENER NOTICIAS
  // =========================
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get(API_URL);
      setNews(res.data);
    } catch (err) {
      console.error("Error al obtener noticias:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las noticias.",
      });
    }
  };

  // =========================
  // SELECCIONAR IMAGEN
  // =========================
  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImagenFile(file);

    setForm((f) => ({
      ...f,
      image: URL.createObjectURL(file),
    }));
  };

  // =========================
  // CREAR / ACTUALIZAR NOTICIA
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Faltan Campos",
        text: "El título y el contenido de la noticia son obligatorios.",
      });

      return;
    }

    const fd = new FormData();

    fd.append("titulo", form.title);
    fd.append(
      "shortDesc",
      form.short_desc || form.content.slice(0, 120)
    );
    fd.append("contenido", form.content);

    fd.append(
      "fechaPublicacion",
      form.publication_date || new Date().toISOString()
    );

    if (imagenFile) {
      fd.append("imagen", imagenFile);
    }

    let actionTitle = "";

    try {
      if (form.id) {
        await axios.patch(`${API_URL}/${form.id}`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        actionTitle = "Noticia Actualizada";
      } else {
        await axios.post(API_URL, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        actionTitle = "Noticia Publicada";
      }

      Swal.fire({
        icon: "success",
        title: actionTitle,
        text: "La noticia se ha guardado con éxito.",
        showConfirmButton: false,
        timer: 1800,
      });

      await fetchNews();

      resetForm();
    } catch (err) {
      console.error("Error guardando noticia:", err);

      Swal.fire({
        icon: "error",
        title: "Error de Publicación",
        text: "Hubo un problema al guardar la noticia. Consulta la consola.",
      });
    }
  };

  // =========================
  // LIMPIAR FORMULARIO
  // =========================
  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      short_desc: "",
      content: "",
      publication_date: "",
      image: "",
    });

    setImagenFile(null);
  };

  // =========================
  // EDITAR NOTICIA
  // =========================
  const handleEdit = (n) => {
    setForm({
      id: n.id,

      title: n.title || "",

      short_desc: n.short_desc || "",

      content: n.content || "",

      publication_date: n.publication_date
        ? new Date(n.publication_date).toISOString().slice(0, 16)
        : "",

      image: n.image
        ? `${import.meta.env.VITE_API_URL}/uploads/news/${n.image}`
        : "",
    });

    // Al editar no seleccionamos una nueva imagen automáticamente
    setImagenFile(null);

    // Subimos la pantalla al formulario
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // ELIMINAR NOTICIA
  // =========================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar Noticia?",
      text: "¿Estás seguro de que quieres borrar esta noticia?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "No, cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`);

      await fetchNews();

      Swal.fire({
        icon: "success",
        title: "¡Borrado!",
        text: "La noticia ha sido eliminada.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Error eliminando noticia:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la noticia.",
      });
    }
  };

  // =========================
  // FILTRAR NOTICIAS
  // =========================
  const filteredNews = news.filter((n) => {
    const searchText = search.toLowerCase().trim();

    // Buscar por título, descripción o contenido
    const matchesSearch =
      !searchText ||
      n.title?.toLowerCase().includes(searchText) ||
      n.short_desc?.toLowerCase().includes(searchText) ||
      n.content?.toLowerCase().includes(searchText);

    // Filtrar por fecha
    const matchesDate =
      !dateFilter ||
      n.publication_date?.startsWith(dateFilter);

    return matchesSearch && matchesDate;
  });

  // =========================
  // LIMPIAR FILTROS
  // =========================
  const clearFilters = () => {
    setSearch("");
    setDateFilter("");
  };

  return (
    <div className="adminNews">

      {/* =====================================================
          FORMULARIO
      ===================================================== */}

      <div className="section-form">
        <h2>{form.id ? "Editar Noticia:" : "Crear Noticias:"} </h2>
        <form onSubmit={handleSubmit} className="news-form">

          {/* TÍTULO */}
          <input
            type="text"
            placeholder="Título"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            required
          />

          {/* DESCRIPCIÓN */}
          <input
            type="text"
            placeholder="Descripción corta"
            value={form.short_desc}
            onChange={(e) =>
              setForm({
                ...form,
                short_desc: e.target.value,
              })
            }
          />

          {/* CONTENIDO */}
          <textarea
            placeholder="Contenido de la noticia"
            rows={6}
            value={form.content}
            onChange={(e) =>
              setForm({
                ...form,
                content: e.target.value,
              })
            }
            required
          />

          {/* IMAGEN */}
          <input type="file" accept="image/*" onChange={handleImage} />

          {/* PREVISUALIZACIÓN */}
          {form.image && (
            <img src={form.image} alt="Previsualización" style={
              {
                width: 150,
                borderRadius: 8,
                marginTop: 8,
              }}
            />
          )}

          {/* FECHA */}
          <input
            type="datetime-local"
            value={form.publication_date}
            onChange={(e) =>
              setForm({
                ...form,
                publication_date: e.target.value,
              })
            }
          />

          {/* BOTONES */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
          >

            <button type="submit">
              {form.id ? "Actualizar" : "Crear"} Noticia
            </button>

            {form.id && (
              <button type="button" onClick={resetForm}>
                Cancelar edición
              </button>)}
          </div>
        </form>
      </div>

      {/* =====================================================
          LISTADO DE NOTICIAS
      ===================================================== */}

      <div className="section-news">
        <h2>Noticias registradas</h2>

        {/* =================================================
            BÚSQUEDA Y FILTROS
        ================================================= */}

        <div className="search-filters">

          {/* BÚSQUEDA */}
          <div className="search-box">

            <input
              type="text"
              placeholder="🔍 Buscar noticia..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* FILTRO POR FECHA */}
          <div className="filter-box">

            <input
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
            />

          </div>

          {/* LIMPIAR FILTROS */}
          {(search || dateFilter) && (
            <button type="button" className="clear-filters" onClick={clearFilters}>
              Limpiar filtros
            </button>
          )}

        </div>

        {/* =================================================
            RESULTADOS
        ================================================= */}

        <div className="news-list">

          {/* NO HAY NOTICIAS */}
          {news.length === 0 ? (

            <p>No hay noticias aún.</p>

          ) : filteredNews.length === 0 ? (

            /* NO HAY RESULTADOS CON FILTROS */
            <p>
              No se encontraron noticias con los filtros
              seleccionados.
            </p>

          ) : (

            /* NOTICIAS FILTRADAS */
            filteredNews.map((n) => (

              <div
                key={n.id}
                className="news-card"
              >

                {/* IMAGEN */}
                {n.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/news/${n.image}`}
                    alt={n.title}
                  />
                )}

                <div className="news-card-content">

                  {/* TÍTULO */}
                  <h4>{n.title}</h4>

                  {/* FECHA */}
                  <div className="date">

                    {n.publication_date
                      ? new Date(
                        n.publication_date
                      ).toLocaleString("es-CO", {
                        dateStyle: "medium",
                      })
                      : "Sin fecha"}

                  </div>

                  {/* DESCRIPCIÓN */}
                  <p>
                    {n.short_desc}
                  </p>

                  {/* ACCIONES */}
                  <div className="actions">
                    <button onClick={() => handleEdit(n)}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(n.id)}>
                      Eliminar
                    </button>
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