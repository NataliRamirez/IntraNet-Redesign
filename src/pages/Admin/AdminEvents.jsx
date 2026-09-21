import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminEvents.css";

// ✅ URL base del backend desde .env
const API_URL = `${import.meta.env.VITE_API_URL}/events`;

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    dateTime: "",
    place: "",
    link: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_URL);
      setEvents(res.data);
    } catch (err) {
      console.error("Error al obtener eventos:", err);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setForm((f) => ({ ...f, image: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.dateTime) {
      Swal.fire({
        icon: "warning",
        title: "Campos Incompletos",
        text: "Debes completar el título, la descripción y la fecha/hora del evento.",
      });
      return;
    }

    try {
      const fd = new FormData();
      fd.append("nombre", form.title);
      fd.append("descripcion", form.description);
      fd.append("fechaHora", new Date(form.dateTime).toISOString());
      if (form.place) fd.append("lugar", form.place);
      if (form.link) fd.append("link", form.link);
      if (imageFile) fd.append("imagen", imageFile);

      let actionTitle = "";

      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        actionTitle = "¡Evento Actualizado!";
      } else {
        await axios.post(API_URL, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        actionTitle = "¡Evento Creado!";
      }

      Swal.fire({
        icon: "success",
        title: actionTitle,
        text: "Los cambios se han guardado correctamente.",
        showConfirmButton: false,
        timer: 1800,
      });

      fetchEvents();
      resetForm();
    } catch (err) {
      console.error("Error guardando evento:", err);
      Swal.fire({
        icon: "error",
        title: "Error al Guardar",
        text: "Ocurrió un error al guardar el evento. Revisa la consola.",
      });
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      description: "",
      dateTime: "",
      place: "",
      link: "",
      image: "",
    });
    setImageFile(null);
  };

  const handleEdit = (ev) => {
    setForm({
      id: ev.id,
      title: ev.name,
      description: ev.description,
      dateTime: new Date(ev.dateTime).toISOString().slice(0, 16),
      place: ev.place || "",
      link: ev.link || "",
      image: ev.image
        ? `${import.meta.env.VITE_API_URL}/uploads/events/${ev.image}`
        : "",
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

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchEvents();
        Swal.fire("¡Eliminado!", "El evento ha sido eliminado correctamente.", "success");
      } catch (err) {
        console.error("Error eliminando evento:", err);
        Swal.fire("Error", "No se pudo eliminar el evento.", "error");
      }
    }
  };

  return (
    <div className="admin-events">
      {/* === Formulario === */}
      <div className="section-form">
        <h2>Formulario para crear un nuevo evento:</h2>

        <form onSubmit={handleSubmit} className="event-form">
          <input
            type="text"
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            value={form.dateTime}
            onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Lugar"
            value={form.place}
            onChange={(e) => setForm({ ...form, place: e.target.value })}
          />
          <input
            type="url"
            placeholder="Link (opcional)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
          <input type="file" accept="image/*" onChange={handleImage} />

          {form.image && (
            <img
              src={form.image}
              alt="Previsualización"
              style={{ width: 150, borderRadius: 8, marginTop: 8 }}
            />
          )}

          <div className="divButton" style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit">{form.id ? "Actualizar" : "Crear"} Evento</button>
            {form.id && (
              <button type="button" onClick={resetForm}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </div>

      {/* === Lista de Eventos === */}
      <div className="section-events">
        <h2>Eventos registrados:</h2>
        <div className="events-list">
          {events.length === 0 ? (
            <p>No hay eventos registrados aún.</p>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="event-card">
                {ev.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/events/${ev.image}`}
                    alt={ev.name}
                  />
                )}
                <div className="event-card-content">
                  <h4>{ev.name}</h4>
                  <div className="date">
                    {new Date(ev.dateTime).toLocaleString("es-CO", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                  <p>{ev.description}</p>
                  {ev.place && (
                    <p>
                      <b>Lugar:</b> {ev.place}
                    </p>
                  )}
                  {ev.link && (
                    <p>
                      <a href={ev.link} target="_blank" rel="noreferrer">
                        Enlace al evento
                      </a>
                    </p>
                  )}
                  <div className="actions">
                    <button onClick={() => handleEdit(ev)}>Editar</button>
                    <button onClick={() => handleDelete(ev.id)}>Eliminar</button>
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
