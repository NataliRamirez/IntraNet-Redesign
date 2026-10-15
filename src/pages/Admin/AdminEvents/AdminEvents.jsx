import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import "./AdminEvents.css";

const API_URL = `${import.meta.env.VITE_API_URL}/events`;

const getAuthHeaders = () => {
  let token = null;

  token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token");

  if (!token) {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        token =
          user.token ||
          user.accessToken ||
          user.access_token ||
          null;

        if (
          !token &&
          typeof user.username === "string" &&
          user.username.split(".").length === 3
        ) {
          token = user.username;
        }
      } catch (error) {
        console.error(
          "No se pudo leer el usuario guardado:",
          error
        );
      }
    }
  }

  if (!token) {
    throw new Error(
      "No se encontró el token de autenticación. Inicia sesión nuevamente."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};


export default function AdminEvents() {
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    date_time: "",
    place: "",
    link: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_URL);

      console.log("Respuesta del backend:", res.data);

      setEvents(
        Array.isArray(res.data) ? res.data : []
      );
    } catch (err) {
      console.error("Error al obtener eventos:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los eventos.",
      });
    }
  };

  // =========================
  // SELECCIONAR IMAGEN
  // =========================
  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const url = URL.createObjectURL(file);

    setForm((f) => ({
      ...f,
      image: url,
    }));
  };

  // =========================
  // CREAR / ACTUALIZAR EVENTO
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.date_time
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Debes completar el título, la descripción y la fecha/hora del evento.",
      });

      return;
    }

    try {
      const fd = new FormData();

      fd.append("name", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append(
        "date_time",
        new Date(form.date_time).toISOString()
      );

      if (form.place.trim()) {
        fd.append("place", form.place.trim());
      }

      if (form.link.trim()) {
        fd.append("link", form.link.trim());
      }

      if (imageFile) {
        fd.append("image", imageFile);
      }

      const authHeaders = getAuthHeaders();

      let actionTitle = "";

      if (form.id) {
        await axios.patch(`${API_URL}/${form.id}`, fd, {
          headers: getAuthHeaders(),
        });

        actionTitle = "¡Evento actualizado!";
      } else {
        await axios.post(API_URL, fd, {
          headers: getAuthHeaders(),
        });

        actionTitle = "¡Evento creado!";
      }

      await fetchEvents();
      resetForm();

      Swal.fire({
        icon: "success",
        title: actionTitle,
        text: "Los cambios se han guardado correctamente.",
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (err) {
      console.error("Error guardando evento:", err);

      const status = err.response?.status;

      let message =
        "Ocurrió un error al guardar el evento. Revisa la consola.";

      if (status === 401) {
        message =
          "Tu sesión no es válida o ha expirado. Cierra sesión e inicia sesión nuevamente.";
      } else if (status === 403) {
        message =
          "Tu usuario no tiene permisos para realizar esta operación.";
      } else if (
        err.message?.includes("token de autenticación")
      ) {
        message = err.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: message,
      });
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      description: "",
      date_time: "",
      place: "",
      link: "",
      image: "",
    });

    setImageFile(null);
  };

  const handleEdit = (ev) => {
    setForm({
      id: ev.id,
      title: ev.name || "",
      description: ev.description || "",
      date_time: ev.date_time
        ? new Date(ev.date_time).toISOString().slice(0, 16)
        : "",
      place: ev.place || "",
      link: ev.link || "",
      image: ev.image
        ? `${import.meta.env.VITE_API_URL}/uploads/events/${ev.image}`
        : "",
    });

    setImageFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta eliminación!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeaders(),
      });

      await fetchEvents();

      Swal.fire({
        icon: "success",
        title: "¡Eliminado!",
        text: "El evento ha sido eliminado correctamente.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Error eliminando evento:", err);

      const status = err.response?.status;

      let message = "No se pudo eliminar el evento.";

      if (status === 401) {
        message =
          "Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.";
      } else if (status === 403) {
        message =
          "Tu usuario no tiene permisos para eliminar eventos.";
      } else if (err.message?.includes("token de autenticación")) {
        message = err.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    }
  };

  
  
const filteredEvents = events
  .filter((ev) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      ev.name?.toLowerCase().includes(searchText) ||
      ev.description?.toLowerCase().includes(searchText) ||
      ev.place?.toLowerCase().includes(searchText);

    const matchesDate =
      !dateFilter || ev.date_time?.startsWith(dateFilter);

    return matchesSearch && matchesDate;
  })
  .sort((a, b) => {
    const now = new Date().getTime();
    const dateA = a.date_time ? new Date(a.date_time).getTime() : 0;
    const dateB = b.date_time ? new Date(b.date_time).getTime() : 0;

    const isUpcomingA = dateA >= now;
    const isUpcomingB = dateB >= now;

    // Primero los próximos; entre ellos, el más cercano.
    if (isUpcomingA && isUpcomingB) return dateA - dateB;

    // Los próximos siempre van antes que los que ya pasaron.
    if (isUpcomingA) return -1;
    if (isUpcomingB) return 1;

    // Después, los pasados más recientes y al final los antiguos.
    return dateB - dateA;
  });


  // =========================
  // LIMPIAR FILTROS
  // =========================
  const clearFilters = () => {
    setSearch("");
    setDateFilter("");
  };

  return (
    <div className="admin-events">
      {/* FORMULARIO */}
      <div className="section-form">
        <h2>
          {form.id
            ? "Editar evento:"
            : "Formulario para crear un nuevo evento:"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="event-form"
        >
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
          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            required
          />

          {/* FECHA Y HORA */}
          <input
            type="datetime-local"
            value={form.date_time}
            onChange={(e) =>
              setForm({
                ...form,
                date_time: e.target.value,
              })
            }
            required
          />

          {/* LUGAR */}
          <input
            type="text"
            placeholder="Lugar"
            value={form.place}
            onChange={(e) =>
              setForm({
                ...form,
                place: e.target.value,
              })
            }
          />

          {/* ENLACE */}
          <input
            type="url"
            placeholder="Link (opcional)"
            value={form.link}
            onChange={(e) =>
              setForm({
                ...form,
                link: e.target.value,
              })
            }
          />

          {/* IMAGEN */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          {/* PREVISUALIZACIÓN */}
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

          {/* BOTONES */}
          <div
            className="divButton"
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <button type="submit">
              {form.id ? "Actualizar" : "Crear"} Evento
            </button>

            {form.id && (
              <button
                type="button"
                onClick={resetForm}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LISTADO DE EVENTOS */}
      <div className="section-events">
        <h2>Eventos registrados:</h2>

        {/* BÚSQUEDA Y FILTROS */}
        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Buscar evento..."
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
        <div className="events-list">
          {events.length === 0 ? (
            <p>No hay eventos registrados aún.</p>
          ) : filteredEvents.length === 0 ? (
            <p>
              No se encontraron eventos con los filtros seleccionados.
            </p>
          ) : (
            filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="event-card"
              >
                {/* IMAGEN */}
                {ev.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/events/${ev.image}`}
                    alt={ev.name}
                  />
                )}

                <div className="event-card-content">
                  {/* NOMBRE */}
                  <h4>{ev.name}</h4>

                  {/* FECHA */}
                  <div className="date">
                    {ev.date_time
                      ? new Date(ev.date_time).toLocaleString(
                        "es-CO",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )
                      : "Sin fecha"}
                  </div>

                  {/* DESCRIPCIÓN */}
                  <p>{ev.description}</p>

                  {/* LUGAR */}
                  {ev.place && (
                    <p>
                      <b>Lugar:</b> {ev.place}
                    </p>
                  )}

                  {/* ENLACE */}
                  {ev.link && (
                    <p>
                      <a
                        href={ev.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Enlace al evento
                      </a>
                    </p>
                  )}

                  {/* ACCIONES */}
                  <div className="actions">
                    <button
                      type="button"
                      onClick={() => handleEdit(ev)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(ev.id)}
                    >
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