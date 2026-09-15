import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; 
import "./AdminNoticias.css";

// ✅ 1️⃣ CAMBIO PRINCIPAL: usamos la variable del .env
const API_URL = import.meta.env.VITE_API_URL + "/news";

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [form, setForm] = useState({
    id: null,
    titulo: "",
    shortDesc: "",
    contenido: "",
    fechaPublicacion: "",
    imagen: "",
  });
  const [imagenFile, setImagenFile] = useState(null);

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      const res = await axios.get(API_URL);
      setNoticias(res.data);
    } catch (err) {
      console.error("Error al obtener noticias:", err);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenFile(file);
    setForm((f) => ({ ...f, imagen: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo.trim() || !form.contenido.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan Campos',
        text: 'El título y el contenido de la noticia son obligatorios.',
      });
      return;
    }

    const fd = new FormData();
    fd.append("titulo", form.titulo);
    fd.append("shortDesc", form.shortDesc || form.contenido.slice(0, 120));
    fd.append("contenido", form.contenido);
    fd.append(
      "fechaPublicacion",
      form.fechaPublicacion || new Date().toISOString()
    );
    if (imagenFile) fd.append("imagen", imagenFile);
    
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
      
      fetchNoticias();
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
      titulo: "",
      shortDesc: "",
      contenido: "",
      fechaPublicacion: "",
      imagen: "",
    });
    setImagenFile(null);
  };

  const handleEdit = (n) => {
    setForm({
      id: n.id,
      titulo: n.titulo,
      shortDesc: n.shortDesc,
      contenido: n.contenido,
      fechaPublicacion: n.fechaPublicacion
        ? new Date(n.fechaPublicacion).toISOString().slice(0, 16)
        : "",
      // ✅ 2️⃣ CAMBIO: imagen usa la URL del .env
      imagen: n.imagen
        ? `${import.meta.env.VITE_API_URL}/uploads/news/${n.imagen}`
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
        fetchNoticias();
        Swal.fire('Borrado!', 'La noticia ha sido eliminada.', 'info');
      } catch (err) {
        console.error("Error eliminando noticia:", err);
        Swal.fire('Error', 'No se pudo eliminar la noticia.', 'error');
      }
    }
  };

  return (
    <div className="admin-noticias">
      <div className="seccion-formulario">
        <h2>Crear Noticias:</h2>

        <form onSubmit={handleSubmit} className="noticia-form">
          <input
            type="text"
            placeholder="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
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
            value={form.contenido}
            onChange={(e) => setForm({ ...form, contenido: e.target.value })}
            required
          />
          <input type="file" accept="image/*" onChange={handleImage} />

          {form.imagen && (
            <img
              src={form.imagen}
              alt="Previsualización"
              style={{ width: 150, borderRadius: 8, marginTop: 8 }}
            />
          )}

          <input
            type="datetime-local"
            value={form.fechaPublicacion}
            onChange={(e) =>
              setForm({ ...form, fechaPublicacion: e.target.value })
            }
          />

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit">
              {form.id ? "Actualizar" : "Crear"} Noticia
            </button>
            {form.id && (
              <button type="button" onClick={resetForm}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="seccion-noticias">
        <h2>Noticias registradas</h2>
        <div className="noticias-lista">
          {noticias.length === 0 ? (
            <p>No hay noticias aún.</p>
          ) : (
            noticias.map((n) => (
              <div key={n.id} className="noticia-card">
                {n.imagen && (
                  // ✅ 3️⃣ CAMBIO: la imagen en lista usa también la base del .env
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/news/${n.imagen}`}
                    alt={n.titulo}
                  />
                )}
                <div className="noticia-card-content">
                  <h4>{n.titulo}</h4>
                  <div className="fecha">
                    {new Date(n.fechaPublicacion).toLocaleString("es-CO", {
                      dateStyle: "medium",
                    })}
                  </div>
                  <p>{n.shortDesc}</p>
                  <div className="acciones">
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
