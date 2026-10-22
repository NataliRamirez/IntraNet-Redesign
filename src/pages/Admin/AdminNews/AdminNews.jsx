import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminNews.css";

const API_URL = `${import.meta.env.VITE_API_URL}/news`;
const BACKEND_URL = import.meta.env.VITE_API_URL;
const getAuthHeaders = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    throw new Error("No hay una sesión iniciada.");
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch {
    throw new Error("Los datos de la sesión no son válidos.");
  }

  const token = user?.token;

  if (!token || token.split(".").length !== 3) {
    throw new Error("No se encontró un token JWT válido. Inicia sesión nuevamente.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    short_desc: "",
    content: "",
    description: "",
    publication_date: "",
    image: "",
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get(API_URL);
      setNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al obtener noticias:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las noticias.",
      });
    }
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagenFile(file);

    setForm((previousForm) => ({...previousForm,image: URL.createObjectURL(file),}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Faltan campos",
        text: "El título y el contenido de la noticia son obligatorios.",
      });

      return;
    }

    let headers;

    try {
      headers = getAuthHeaders();
    } catch (err) {
      console.error("Error de autenticación:", err.message);

      Swal.fire({
        icon: "warning",
        title: "Sesión no válida",
        text: "Inicia sesión nuevamente para publicar o editar noticias.",
      });

      return;
    }

    const shortDescription = form.short_desc.trim() || form.content.trim().slice(0, 120);
    const description = form.description.trim() || form.content.trim();
    const fd = new FormData();

    fd.append("title", form.title.trim());
    fd.append("short_desc", shortDescription);
    fd.append("content", form.content.trim());
    fd.append("description", description);

    fd.append("publication_date", form.publication_date
        ? new Date(form.publication_date).toISOString()
        : new Date().toISOString()
    );

    if (imagenFile) {
      fd.append("image", imagenFile);
    }

    try {
      let actionTitle;

      if (form.id) {
        await axios.patch(`${API_URL}/${form.id}`, fd, {headers,});
        actionTitle = "Noticia actualizada";
      } else {
        await axios.post(API_URL, fd, {headers,});
        actionTitle = "Noticia publicada";
      }

      await Swal.fire({
        icon: "success",
        title: actionTitle,
        text: "La noticia se ha guardado con éxito.",
        showConfirmButton: false,
        timer: 1800,
      });

      await fetchNews();
      resetForm();
    } catch (err) {
      console.error("Error guardando noticia:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Sesión expirada",
          text: "El servidor rechazó la autenticación. Inicia sesión nuevamente.",
        });
      } else if (err.response?.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Acceso denegado",
          text: "Tu usuario no tiene permisos para realizar esta operación.",
        });
      } else {
        const errorMessage = err.response?.data?.message;

        Swal.fire({
          icon: "error",
          title: "Error de publicación",
          text: Array.isArray(errorMessage)
            ? errorMessage.join(", ")
            : errorMessage || "No se pudo guardar la noticia. Revisa la terminal del backend.",
        });
      }
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      short_desc: "",
      content: "",
      description: "",
      publication_date: "",
      image: "",
    });

    setImagenFile(null);
  };

  const handleEdit = (n) => {
    setForm({
      id: n.id,
      title: n.title || "",
      short_desc: n.short_desc || "",
      content: n.content || "",
      description: n.description || "",
      publication_date: n.publication_date ? new Date(n.publication_date).toISOString().slice(0, 16) : "",
      image: n.image ? `${BACKEND_URL}/uploads/news/${n.image}` : "",
    });

    setImagenFile(null);

    window.scrollTo({top: 0,behavior: "smooth",});
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar noticia?",
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
      const headers = getAuthHeaders();

      await axios.delete(`${API_URL}/${id}`, {headers,});
      await fetchNews();
      await Swal.fire({
        icon: "success",
        title: "¡Borrado!",
        text: "La noticia ha sido eliminada.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Error eliminando noticia:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Sesión no válida",
          text: "Inicia sesión nuevamente para eliminar noticias.",
        });
      } else if (err.response?.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Acceso denegado",
          text: "Tu usuario no tiene permisos para eliminar noticias.",
        });
      } else {
        const errorMessage = err.response?.data?.message;

        Swal.fire({
          icon: "error",
          title: "Error",
          text: Array.isArray(errorMessage)
            ? errorMessage.join(", ")
            : errorMessage || "No se pudo eliminar la noticia.",
        });
      }
    }
  };

  const filteredNews = news.filter((n) => {
    const searchText = search.toLowerCase().trim();
    const matchesSearch =
      !searchText ||
      n.title?.toLowerCase().includes(searchText) ||
      n.short_desc?.toLowerCase().includes(searchText) ||
      n.content?.toLowerCase().includes(searchText) ||
      n.description?.toLowerCase().includes(searchText);

    const matchesDate =
      !dateFilter ||
      n.publication_date?.startsWith(dateFilter);

    return matchesSearch && matchesDate;
  });

  const clearFilters = () => {
    setSearch("");
    setDateFilter("");
  };

  return (
    <div className="adminNews" id="FormNews">
      <div className="section-form">
        <h2>{form.id ? "Editar noticia:" : "Crear noticias:"}</h2>
        <form onSubmit={handleSubmit} className="news-form">
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

          <textarea
            placeholder="Contenido de la noticia"
            rows={6}
            value={form.content}
            onChange={(e) =>
              setForm({
                ...form,
                content: e.target.value,
                description: e.target.value,
              })
            }
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          {form.image && (
            <img
              src={form.image}
              alt="Previsualización"
              style={{
                width: 150,
                borderRadius: 8,
                marginTop: 8,
              }}
            />
          )}

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

          <div style={{display: "flex",gap: "0.5rem",}}>
            <button type="submit">
              {form.id ? "Actualizar" : "Crear"} noticia
            </button>
            {form.id && (
              <button type="button" onClick={resetForm}>Cancelar edición</button>
            )}
          </div>
        </form>
      </div>

      <div className="section-news" id="News">
        <h2>Noticias registradas</h2>

        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Buscar noticia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {(search || dateFilter) && (
            <button
              type="button"
              className="clear-filters"
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* RESULTADOS */}
        <div className="news-list">
          {news.length === 0 ? (
            <p>No hay noticias aún.</p>
          ) : filteredNews.length === 0 ? (
            <p>No se encontraron noticias con los filtros seleccionados.</p>
          ) : (
            filteredNews.map((n) => (
              <div key={n.id} className="news-card">
                {n.image && (
                  <img src={`${BACKEND_URL}/uploads/news/${n.image}`}alt={n.title}/>
                )}

                <div className="news-card-content">
                  <h4>{n.title}</h4>
                  <div className="date">
                    {n.publication_date
                      ? new Date(n.publication_date).toLocaleString(
                          "es-CO",
                          {dateStyle: "medium",}
                        ) : "Sin fecha"}
                  </div>

                  <p>{n.short_desc || n.description}</p>

                  <div className="actions">
                    <button type="button" onClick={() => handleEdit(n)}>Editar</button>
                    <button type="button" onClick={() => handleDelete(n.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="endsNews" id="olderNews"></div>
    </div>
  );
}
