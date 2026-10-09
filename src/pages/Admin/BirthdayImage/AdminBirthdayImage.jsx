import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminBirthdayImage.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminBirthdayImage() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  // Obtener la imagen actual desde backend
  useEffect(() => {
    fetchCurrentImage();
  }, []);

  const fetchCurrentImage = async () => {
    try {
      const res = await axios.get(`${API_URL}/birthday-image`);
      if (res.data?.image) {
        setCurrentImage(`${API_URL}/uploads/birthdays/${res.data.image}`);
      }
    } catch (err) {
      console.warn("No hay imagen de cumpleaños aún.");
    }
  };

  const handleSelectFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire("Error", "Selecciona una imagen primero", "warning");
      return;
    }

    const fd = new FormData();
    fd.append("image", file);

    try {
      await axios.post(`${API_URL}/birthday-image`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Imagen Actualizada 🎉",
        text: "La imagen ahora aparecerá en el modal.",
        timer: 2000,
        showConfirmButton: false
      });

      fetchCurrentImage();
      setPreview(null);
      setFile(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo subir la imagen.", "error");
    }
  };

  return (
    <div className="birthday-admin-container">
      
      <h2>Imagen del Cumpleañero del Mes 🎂</h2>
      <p>Esta imagen será mostrada en el modal de cumpleaños.</p>

      {/* Imagen actual */}
      {currentImage ? (
        <div className="current-image">
          <h3>Imagen actual:</h3>
          <img src={currentImage} alt="Birthday" />
        </div>
      ) : (
        <p>No hay imagen guardada aún.</p>
      )}

      {/* Preview si seleccionó una nueva */}
      {preview && (
        <div className="preview">
          <h3>Previsualización:</h3>
          <img src={preview} alt="preview" />
        </div>
      )}

      <input type="file" accept="image/*" onChange={handleSelectFile} />

      <button className="save-btn" onClick={handleUpload}>Guardar Imagen</button>
    </div>
  );
}
