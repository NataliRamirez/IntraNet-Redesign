import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./BirthdayModal.css";
import logoColor from "../../assets/images/logo-color.png";

export default function BirthdayModal() {
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const backendConfigURL = `${BACKEND_URL}/birthday-image`;
  const employeesURL = `${BACKEND_URL}/public/employees/birthdays/today`;
  const fallbackImage = "https://placehold.co/1500x900/ffe0f1/000000?text=Cumpleañeros+del+Día";
  const [backgroundImage, setBackgroundImage] = useState(fallbackImage);
  const [birthdayEmployees, setBirthdayEmployees] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(0);

  // Mensajes originales de felicitación.
  const messages = [
    "En este día tan especial, EMCA desea expresar sus más sinceras felicitaciones por un año más de vida. Agradecemos profundamente su compromiso, dedicación y valiosa contribución al crecimiento de nuestra organización. Su esfuerzo diario, profesionalismo y actitud positiva son fundamentales para el cumplimiento de nuestros objetivos y para fortalecer el ambiente de trabajo que construimos juntos. Esperamos que disfrute esta fecha rodeado de sus seres queridos, recibiendo el cariño y reconocimiento que merece. Que este nuevo año esté lleno de salud, felicidad, prosperidad y grandes oportunidades tanto en el ámbito personal como profesional. ¡Le deseamos un muy feliz cumpleaños! 🎁",
    "Hoy celebramos una fecha muy especial y queremos acompañarle con nuestros mejores deseos. Que este nuevo año de vida represente el inicio de nuevas experiencias, metas cumplidas y grandes satisfacciones. Deseamos que cada día esté lleno de motivación, aprendizaje y momentos que le permitan crecer y alcanzar sus objetivos. Gracias por formar parte de nuestra organización y por aportar con su talento, compromiso y dedicación. Que la alegría, la salud y el éxito le acompañen en cada paso que dé durante esta nueva etapa. ¡Feliz cumpleaños y muchas felicidades! 🎉",
    "En nombre de toda la organización, queremos reconocer y celebrar su cumpleaños con un mensaje de gratitud y aprecio. Valoramos enormemente el esfuerzo, la responsabilidad y el entusiasmo que demuestra en cada una de sus labores. Su trabajo contribuye de manera significativa al desarrollo de nuestro equipo y al logro de nuestros propósitos institucionales. Esperamos que este día esté lleno de momentos especiales, alegría, bienestar y el afecto de quienes más aprecia. Que este nuevo ciclo traiga consigo nuevas oportunidades, grandes logros y muchas razones para sonreír. ¡Le deseamos un feliz cumpleaños y un año lleno de éxitos! 🎂",
    "Ser parte de una organización significa construir juntos historias, desafíos y logros, y nos sentimos agradecidos de contar con personas como usted en nuestro equipo. En esta fecha tan significativa queremos desearle un cumpleaños lleno de felicidad, armonía y momentos inolvidables. Que cada experiencia vivida durante este nuevo año le permita seguir creciendo, aprendiendo y alcanzando nuevas metas. Reciba nuestro reconocimiento por su compromiso, dedicación y valioso aporte a nuestra empresa. Esperamos que disfrute este día rodeado de sus familiares, amigos y seres queridos. ¡Muchas felicidades, bendiciones y los mejores deseos para este nuevo año de vida! 🥳",
    "Hoy queremos hacer una pausa para celebrar una fecha muy especial: su cumpleaños. En nombre de toda la organización, le expresamos nuestro agradecimiento por la dedicación, responsabilidad y profesionalismo que demuestra cada día. Su compromiso contribuye al fortalecimiento de nuestro equipo y al cumplimiento de nuestros objetivos institucionales. Deseamos que esta nueva etapa esté llena de bienestar, salud, satisfacción personal y nuevos logros. Que disfrute de una jornada memorable rodeado del cariño de sus seres queridos y que los próximos meses estén llenos de oportunidades y momentos significativos. ¡Feliz cumpleaños! 🎈",
    "En esta ocasión especial, queremos reconocer no solo un año más de vida, sino también el valioso aporte que realiza como parte de nuestra organización. Agradecemos su esfuerzo constante, su disposición para afrontar nuevos retos y su contribución al crecimiento colectivo. Esperamos que este cumpleaños marque el inicio de un período lleno de éxitos, aprendizajes y experiencias enriquecedoras. Que la felicidad, la tranquilidad y la prosperidad le acompañen en cada proyecto personal y profesional que emprenda. ¡Le deseamos un excelente cumpleaños y un futuro lleno de satisfacciones! 🌟",
    "Reciba nuestras más sinceras felicitaciones en este día tan importante. Nos sentimos orgullosos de contar con colaboradores que, con su talento y compromiso, contribuyen diariamente a construir una organización más sólida y exitosa. Que este nuevo año de vida le brinde la oportunidad de alcanzar nuevas metas, fortalecer sus sueños y disfrutar de innumerables momentos de felicidad junto a quienes más aprecia. Gracias por ser parte fundamental de nuestro equipo. ¡Que tenga un cumpleaños extraordinario y un año lleno de bienestar y prosperidad! 🎊",
    "Los cumpleaños representan una oportunidad para celebrar los logros alcanzados y mirar con entusiasmo hacia los nuevos desafíos que están por venir. Por ello, queremos enviarle un mensaje de reconocimiento y gratitud por su dedicación, esfuerzo y contribución a nuestra organización. Deseamos que este día esté lleno de alegría, gratitud y momentos inolvidables. Que la salud, el éxito y la felicidad sean constantes en esta nueva etapa de su vida, y que cada meta que se proponga se convierta en una realidad. ¡Muchas felicidades en su cumpleaños y los mejores deseos para el año que comienza! 🎉",
  ];

  // Consultar empleados que cumplen años hoy.
  useEffect(() => {
    const controller = new AbortController();

    const fetchBirthdayEmployees = async () => {
      try {
        const response = await fetch(employeesURL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Error al consultar los cumpleañeros: HTTP ${response.status}`
          );
        }

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const responseText = await response.text();

          console.error(
            "La API no devolvió JSON. Respuesta recibida:",
            responseText.slice(0, 300)
          );

          throw new Error(
            "La ruta de cumpleañeros no devolvió JSON. Verifica la URL y el controlador de NestJS."
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "La respuesta del backend no contiene una lista de empleados."
          );
        }

        setBirthdayEmployees(data);
        setCurrentEmployeeIndex(0);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error al obtener los cumpleañeros:", error);
          setBirthdayEmployees([]);
        }
      }
    };

    fetchBirthdayEmployees();

    return () => controller.abort();
  }, [employeesURL]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBirthdayImage = async () => {
      try {
        const response = await fetch(backendConfigURL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Error al obtener la imagen: HTTP ${response.status}`
          );
        }

        const data = await response.json();

        if (data?.image) {
          setBackgroundImage(
            `${BACKEND_URL}/uploads/birthdays/${data.image}`
          );
        } else {
          setBackgroundImage(fallbackImage);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(
            "Error al obtener la imagen de cumpleaños:",
            error
          );

          setBackgroundImage(fallbackImage);
        }
      }
    };

    fetchBirthdayImage();

    return () => controller.abort();
  }, [BACKEND_URL, backendConfigURL, fallbackImage]);

  // Cambiar el mensaje y el empleado cada ocho segundos.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);

      setCurrentEmployeeIndex((prev) =>
        birthdayEmployees.length > 0
          ? (prev + 1) % birthdayEmployees.length
          : 0
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [birthdayEmployees.length, messages.length]);

  // Empleado que se muestra actualmente.
  const currentEmployee =
    birthdayEmployees.length > 0
      ? birthdayEmployees[
          currentEmployeeIndex % birthdayEmployees.length
        ]
      : null;

  // Tarjeta del empleado.
  const renderBirthdayEmployee = () => {
    if (!currentEmployee) {
      return (
        <div className="birthday-employee-empty">
          <img src={logoColor} alt="Logo EMCA" />

          <h3>EMCA te desea un feliz día</h3>

          <p>
            Aquí celebramos a nuestros colaboradores y sus momentos
            especiales.
          </p>
        </div>
      );
    }

    return (
      <div className="birthday-employee-card">
        <img src={logoColor} alt="Logo EMCA" />

        <span className="birthday-employee-label">
          🎂 CUMPLEAÑERO DEL DÍA 🎂
        </span>

        <h3>{currentEmployee.name || "Nombre no disponible"}</h3>

        <p>
          <strong>Cargo:</strong>{" "}
          {currentEmployee.job_position || "No especificado"}
        </p>

        <p>
          <strong>Área:</strong>{" "}
          {currentEmployee.area || "No especificada"}
        </p>
      </div>
    );
  };

  return (
    <section
      className="birthday-page"
      id="Cumpleaños"
      style={{
        "--birthday-background": `url("${backgroundImage}")`,
      }}
    >
      <div className="head-bd">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="title-bd">Cumpleañeros del Día</h3>

          <p>
            Celebramos a los colaboradores que cumplen años hoy en EMCA.
          </p>
        </motion.div>
      </div>

      <div className="body-bd">
        <div className="body-img">{renderBirthdayEmployee()}</div>

        <div className="body-text">
          <h3>¡¡Feliz Cumpleaños!!</h3>

          <p>{messages[currentMessage]}</p>
        </div>
      </div>

      <div className="head-bd" id="Agradecimientos">
        <h3>Agradecimientos</h3>

        <p>Reconocemos y agradecemos el compromiso de nuestro equipo.</p>
      </div>

      <div className="body-bd">
        <div className="body-text">
          <h3>Feliz Cumpleaños</h3>

          <p>
            En este día especial queremos reconocer y celebrar a nuestros
            colaboradores que cumplen un año más de vida. Agradecemos su
            dedicación, compromiso y valioso aporte a nuestra organización.
            Les deseamos salud, bienestar, éxito y muchos momentos de
            felicidad junto a sus familiares y amigos.
          </p>

          <p>
            Recibe nuestros más sinceros deseos de parte de toda la
            organización. Esperamos que disfrutes esta fecha especial rodeado
            de bienestar y alegría, y que el nuevo año que comienzas esté
            lleno de logros, crecimiento personal y profesional, así como de
            nuevas oportunidades para alcanzar tus objetivos. Te deseamos un
            feliz cumpleaños y un año colmado de éxitos, prosperidad y
            momentos significativos.
          </p>
        </div>

        <div className="body-img">{renderBirthdayEmployee()}</div>
      </div>
    </section>
  );
}
