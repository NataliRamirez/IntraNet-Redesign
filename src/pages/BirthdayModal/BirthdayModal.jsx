import { useEffect, useState } from "react";
import "./BirthdayModal.css";
import logoColor from "../../assets/images/logo-color.png";

export default function BirthdayModal() {
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const backendConfigURL = `${BACKEND_URL}/birthday-image`;

  const fallbackImage =
    "https://placehold.co/1500x900/ffe0f1/000000?text=Cumpleañeros+del+Mes";

  const [backgroundImage, setBackgroundImage] = useState(fallbackImage);

  const messages = [
    "En este día tan especial, EMCA desea expresar sus más sinceras felicitaciones por un año más de vida. Agradecemos profundamente su compromiso, dedicación y valiosa contribución al crecimiento de nuestra organización. Su esfuerzo diario, profesionalismo y actitud positiva son fundamentales para el cumplimiento de nuestros objetivos y para fortalecer el ambiente de trabajo que construimos juntos. Esperamos que disfrute esta fecha rodeado de sus seres queridos, recibiendo el cariño y reconocimiento que merece. Que este nuevo año esté lleno de salud, felicidad, prosperidad y grandes oportunidades tanto en el ámbito personal como profesional. ¡Le deseamos un muy feliz cumpleaños! 🎁",

    "Hoy celebramos una fecha muy especial y queremos acompañarle con nuestros mejores deseos. Que este nuevo año de vida represente el inicio de nuevas experiencias, metas cumplidas y grandes satisfacciones. Deseamos que cada día esté lleno de motivación, aprendizaje y momentos que le permitan crecer y alcanzar sus objetivos. Gracias por formar parte de nuestra organización y por aportar con su talento, compromiso y dedicación. Que la alegría, la salud y el éxito le acompañen en cada paso que dé durante esta nueva etapa. ¡Feliz cumpleaños y muchas felicidades! 🎉",

    "En nombre de toda la organización, queremos reconocer y celebrar su cumpleaños con un mensaje de gratitud y aprecio. Valoramos enormemente el esfuerzo, la responsabilidad y el entusiasmo que demuestra en cada una de sus labores. Su trabajo contribuye de manera significativa al desarrollo de nuestro equipo y al logro de nuestros propósitos institucionales. Esperamos que este día esté lleno de momentos especiales, alegría, bienestar y el afecto de quienes más aprecia. Que este nuevo ciclo traiga consigo nuevas oportunidades, grandes logros y muchas razones para sonreír. ¡Le deseamos un feliz cumpleaños y un año lleno de éxitos! 🎂",

    "Ser parte de una organización significa construir juntos historias, desafíos y logros, y nos sentimos agradecidos de contar con personas como usted en nuestro equipo. En esta fecha tan significativa queremos desearle un cumpleaños lleno de felicidad, armonía y momentos inolvidables. Que cada experiencia vivida durante este nuevo año le permita seguir creciendo, aprendiendo y alcanzando nuevas metas. Reciba nuestro reconocimiento por su compromiso, dedicación y valioso aporte a nuestra empresa. Esperamos que disfrute este día rodeado de sus familiares, amigos y seres queridos. ¡Muchas felicidades, bendiciones y los mejores deseos para este nuevo año de vida! 🥳",

    "Hoy queremos hacer una pausa para celebrar una fecha muy especial: su cumpleaños. En nombre de toda la organización, le expresamos nuestro agradecimiento por la dedicación, responsabilidad y profesionalismo que demuestra cada día. Su compromiso contribuye al fortalecimiento de nuestro equipo y al cumplimiento de nuestros objetivos institucionales. Deseamos que esta nueva etapa esté llena de bienestar, salud, satisfacción personal y nuevos logros. Que disfrute de una jornada memorable rodeado del cariño de sus seres queridos y que los próximos meses estén llenos de oportunidades y momentos significativos. ¡Feliz cumpleaños! 🎈",

    "En esta ocasión especial, queremos reconocer no solo un año más de vida, sino también el valioso aporte que realiza como parte de nuestra organización. Agradecemos su esfuerzo constante, su disposición para afrontar nuevos retos y su contribución al crecimiento colectivo. Esperamos que este cumpleaños marque el inicio de un período lleno de éxitos, aprendizajes y experiencias enriquecedoras. Que la felicidad, la tranquilidad y la prosperidad le acompañen en cada proyecto personal y profesional que emprenda. ¡Le deseamos un excelente cumpleaños y un futuro lleno de satisfacciones! 🌟",

    "Reciba nuestras más sinceras felicitaciones en este día tan importante. Nos sentimos orgullosos de contar con colaboradores que, con su talento y compromiso, contribuyen diariamente a construir una organización más sólida y exitosa. Que este nuevo año de vida le brinde la oportunidad de alcanzar nuevas metas, fortalecer sus sueños y disfrutar de innumerables momentos de felicidad junto a quienes más aprecia. Gracias por ser parte fundamental de nuestro equipo. ¡Que tenga un cumpleaños extraordinario y un año lleno de bienestar y prosperidad! 🎊",

    "Los cumpleaños representan una oportunidad para celebrar los logros alcanzados y mirar con entusiasmo hacia los nuevos desafíos que están por venir. Por ello, queremos enviarle un mensaje de reconocimiento y gratitud por su dedicación, esfuerzo y contribución a nuestra organización. Deseamos que este día esté lleno de alegría, gratitud y momentos inolvidables. Que la salud, el éxito y la felicidad sean constantes en esta nueva etapa de su vida, y que cada meta que se proponga se convierta en una realidad. ¡Muchas felicidades en su cumpleaños y los mejores deseos para el año que comienza! 🎉"
  ];


  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    fetch(backendConfigURL)
      .then((res) => res.json())
      .then((data) => {
        if (data?.image) {
          setBackgroundImage(`${BACKEND_URL}/uploads/birthdays/${data.image}`);
        }
      })
      .catch(() => setBackgroundImage(fallbackImage));

    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="birthday-page">

      <div className="head-bd">
        <h3 className="title-bd">Cumpleañeros del Mes</h3>
        <p>En esta sección podrás encontrar a nuestros cumpleañeros del mes</p>
      </div>

      <div className="body-bd">

        <div className="body-img">
          <img src={logoColor} alt="logo emca" />
        </div>


        <div className="body-text">
          <h3>¡¡Feliz Cumpleaños!!</h3>
          <p>{messages[currentMessage]}</p>
        </div>

      </div>

      <div className="head-bd">
        <h3>Agradecimientos</h3>
        <p>...</p>
      </div>


      <div className="body-bd">

        <div className="body-text">
          <h3>Feliz Cumpleaños</h3>
          <p>
            En este día especial queremos reconocer y celebrar a nuestros colaboradores que cumplen un año más de vida. Agradecemos su dedicación, compromiso y valioso aporte a nuestra organización. Les deseamos salud, bienestar, éxito y muchos momentos de felicidad junto a sus familiares y amigos.
          </p>
          <p>Recibe nuestros más sinceros deseos de parte de toda la organización. Esperamos que disfrutes esta fecha especial rodeado de bienestar y alegría, y que el nuevo año que comienzas esté lleno de logros, crecimiento personal y profesional, así como de nuevas oportunidades para alcanzar tus objetivos. Te deseamos un feliz cumpleaños y un año colmado de éxitos, prosperidad y momentos significativos.
          </p>
        </div>

        <div className="body-img">
          <img src={logoColor} alt="logo emca" />
        </div>

      </div>




    </section>
  );
}