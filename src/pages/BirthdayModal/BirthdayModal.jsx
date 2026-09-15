import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./BirthdayModal.css";

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

export default function BirthdayModal() {
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const backendConfigURL = `${BACKEND_URL}/birthday-image`;

  const fallbackImage =
    "https://placehold.co/1500x900/ffe0f1/000000?text=Cumpleañeros+del+Mes";

  const [backgroundImage, setBackgroundImage] = useState(fallbackImage);

  const { width, height } = useWindowSize();

  // 🎉 Mensajes
  const messages = [
    "EMCA les desea un muy feliz cumpleaños. Agradecemos su contribución y compromiso. ¡Que tengan un cumple maravilloso! 🎁",

    "Que este nuevo año de vida esté lleno de éxitos, sonrisas y grandes momentos. ¡Feliz cumpleaños! 🎉",

    "Celebramos su dedicación y esfuerzo. ¡Que su día esté lleno de alegría y amor! 🎂",

    "Gracias por ser parte de esta familia. ¡Feliz cumpleaños y bendiciones! 🥳",
  ];

  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    fetch(backendConfigURL)
      .then((res) => res.json())
      .then((data) => {
        if (data?.image) {
          setBackgroundImage(`${BACKEND_URL}/uploads/birthdays/${data.image}`);
        }
      })
      .catch(() => setBackgroundImage(fallbackImage));

    // Elegir y mostrar mensaje
    const random = Math.floor(Math.random() * messages.length);
    setCurrentMessage(messages[random]);

    const timer = setTimeout(() => setCurrentMessage(""), 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="birthday-fullscreen">
      {/* 🎉 CONFETTI */}
      <Confetti
        numberOfPieces={200}
        width={width}
        height={height}
        className="confetti-layer"
      />

      {/* 📢 Texto sobre la imagen */}
      {currentMessage && (
        <div className="birthday-message">
          {currentMessage}
        </div>
      )}

      {/* 📷 Imagen */}
      <div className="image-wrapper">
        <img src={backgroundImage} alt="Cumpleañeros" />
      </div>

    </div>
  );
}
