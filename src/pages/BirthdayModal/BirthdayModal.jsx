import { useEffect, useState } from "react";
import "./BirthdayModal.css";

export default function BirthdayModal() {
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const backendConfigURL = `${BACKEND_URL}/birthday-image`;

  const fallbackImage =
    "https://placehold.co/1500x900/ffe0f1/000000?text=Cumpleañeros+del+Mes";

  const [backgroundImage, setBackgroundImage] = useState(fallbackImage);

  const messages = [
    "EMCA les desea un muy feliz cumpleaños. Agradecemos su contribución y compromiso. ¡Que tengan un cumple maravilloso! 🎁",
    "Que este nuevo año de vida esté lleno de éxitos, sonrisas y grandes momentos. ¡Feliz cumpleaños! 🎉",
    "Celebramos su dedicación y esfuerzo. ¡Que su día esté lleno de alegría y amor! 🎂",
    "Gracias por ser parte de esta familia. ¡Feliz cumpleaños y bendiciones! 🥳"
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

    const random = Math.floor(Math.random() * messages.length);
    setCurrentMessage(messages[random]);

    const timer = setTimeout(() => setCurrentMessage(""), 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="body">
      <section className="birthday-page">

        {currentMessage && (
          <div className="birthday-message">
            {currentMessage}
          </div>
        )}

        <div className="image-wrapper">
          <img src={backgroundImage} alt="Cumpleañeros" />
        </div>
      </section>

      <section className="birthday-month">
        <div className="month-bd-text">
          <h3 className="bd-title">Happy Birthday</h3>
          <p className="lista-bd">lista de cumpleañeros del mes</p>
          <p>mensaje de cumpleaños</p>

        </div>
        <div className="month-bd-img">
          <img src="#" alt="Img ramdom" />
        </div>
      </section>
    </div>
  );
}