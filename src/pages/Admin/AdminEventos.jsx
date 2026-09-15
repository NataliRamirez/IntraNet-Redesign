import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminEventos.css";

// ✅ URL base del backend desde .env
const API_URL = `${import.meta.env.VITE_API_URL}/eventos`;

export default function AdminEventos() {
  const [eventos, setEventos] = useState([]);
  const [form, setForm] = useState({
    id: null,
    titulo: "",
    descripcion: "",
    fechaHora: "",
    lugar: "",
    link: "",
    imagen: "",
  });
  const [imagenFile, setImagenFile] = useState(null);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const res = await axios.get(API_URL);
      setEventos(res.data);
    } catch (err) {
      console.error("Error al obtener eventos:", err);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenFile(file);
    const url = URL.createObjectURL(file);
    setForm((f) => ({ ...f, imagen: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo.trim() || !form.descripcion.trim() || !form.fechaHora) {
      Swal.fire({
        icon: "warning",
        title: "Campos Incompletos",
        text: "Debes completar el título, la descripción y la fecha/hora del evento.",
      });
      return;
    }

    try {
      const fd = new FormData();
      fd.append("nombre", form.titulo);
      fd.append("descripcion", form.descripcion);
      fd.append("fechaHora", new Date(form.fechaHora).toISOString());
      if (form.lugar) fd.append("lugar", form.lugar);
      if (form.link) fd.append("link", form.link);
      if (imagenFile) fd.append("imagen", imagenFile);

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

      fetchEventos();
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
      titulo: "",
      descripcion: "",
      fechaHora: "",
      lugar: "",
      link: "",
      imagen: "",
    });
    setImagenFile(null);
  };

  const handleEdit = (ev) => {
    setForm({
      id: ev.id,
      titulo: ev.nombre,
      descripcion: ev.descripcion,
      fechaHora: new Date(ev.fechaHora).toISOString().slice(0, 16),
      lugar: ev.lugar || "",
      link: ev.link || "",
      imagen: ev.imagen
        ? `${import.meta.env.VITE_API_URL}/uploads/events/${ev.imagen}`
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
        fetchEventos();
        Swal.fire("¡Eliminado!", "El evento ha sido eliminado correctamente.", "success");
      } catch (err) {
        console.error("Error eliminando evento:", err);
        Swal.fire("Error", "No se pudo eliminar el evento.", "error");
      }
    }
  };

  return (
    <div className="admin-eventos">
      {/* === Formulario === */}
      <div className="seccion-formulario">
        <h2>Formulario para crear un nuevo evento:</h2>

        <form onSubmit={handleSubmit} className="evento-form">
          <input
            type="text"
            placeholder="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            required
          />
          <textarea
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            value={form.fechaHora}
            onChange={(e) => setForm({ ...form, fechaHora: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Lugar"
            value={form.lugar}
            onChange={(e) => setForm({ ...form, lugar: e.target.value })}
          />
          <input
            type="url"
            placeholder="Link (opcional)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
          <input type="file" accept="image/*" onChange={handleImage} />

          {form.imagen && (
            <img
              src={form.imagen}
              alt="Previsualización"
              style={{ width: 150, borderRadius: 8, marginTop: 8 }}
            />
          )}

          <div style={{ display: "flex", gap: "0.5rem" }}>
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
      <div className="seccion-eventos">
        <h2>Eventos registrados:</h2>
        <div className="eventos-lista">
          {eventos.length === 0 ? (
            <p>No hay eventos registrados aún.</p>
          ) : (
            eventos.map((ev) => (
              <div key={ev.id} className="evento-card">
                {ev.imagen && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/events/${ev.imagen}`}
                    alt={ev.nombre}
                  />
                )}
                <div className="evento-card-content">
                  <h4>{ev.nombre}</h4>
                  <div className="fecha">
                    {new Date(ev.fechaHora).toLocaleString("es-CO", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                  <p>{ev.descripcion}</p>
                  {ev.lugar && (
                    <p>
                      <b>Lugar:</b> {ev.lugar}
                    </p>
                  )}
                  {ev.link && (
                    <p>
                      <a href={ev.link} target="_blank" rel="noreferrer">
                        Enlace al evento
                      </a>
                    </p>
                  )}
                  <div className="acciones">
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
