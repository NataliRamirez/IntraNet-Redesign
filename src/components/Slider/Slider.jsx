import { useState, useEffect } from "react";
import "./Slider.css";
import img1 from "../../assets/images/banner1.png";
import img2 from "../../assets/images/banner2.png";
import img3 from "../../assets/images/banner3.png";
import img4 from "../../assets/images/imagen-noticias-1.jpeg"

const images = [img4, img1, img2, img3];

/**
 * Componente encargado de mostrar un carrusel automático de imágenes. Permite la navegación mediante 
 * indicadores y cambia de imagen automáticamente cada 3 segundos.
 *
 * @returns {JSX.Element} Carrusel de imágenes con indicadores de navegación.
 */
export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  
  // Configura el cambio automático de imágenes cada 3 segundos.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider">
      {images.map((imgSrc, index) => (
        <div
          key={index}
          className={`slide-image-wrapper ${index === currentIndex ? "active" : ""
            }`}
          style={{ "--bg": `url(${imgSrc})` }}
        >
          <img
            src={imgSrc}
            alt={`slide-${index}`}
            className={`slide-image ${index === currentIndex ? "active" : ""}`}
          />
        </div>
      ))}

      <div className="slider-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
