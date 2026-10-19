import { useEffect, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarComponent.css";

/**
 * Componente encargado de visualizar el calendario de eventos institucionales.
 */

const locales = {es,};

/**
 * Configuración del localizador utilizado por react-big-calendar.
 * Define el formato de fechas, el inicio de semana y el idioma.
 */
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

const API_URL = import.meta.env.VITE_API_URL;

export default function CalendarComponent() {

  const [events, setEvents] = useState([]);
  const [eventsOfTheDay, setEventsOfTheDay] = useState(null);
  const [actualDate, setActualDate] = useState(new Date());

  /**
   * Obtiene los eventos registrados.
   */
  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then((res) => {
        console.log("Estado /events:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Respuesta /events:", data);

        if (!Array.isArray(data)) {
          console.error("La API no devolvió un arreglo:", data);
          return;
        }

        const transformedEvents = data.map((ev) => {
          console.log("Evento recibido:", ev);

          const startDate = new Date(ev.date_time);

          return {
            id: ev.id,
            title: ev.name,
            start: startDate,
            end: startDate,
            place: ev.place,
            link: ev.link,
            image: ev.image
              ? `${API_URL}/uploads/events/${ev.image}`
              : null,
            description: ev.description,
          };
        });

        setEvents(transformedEvents);
      })
      .catch((err) => {
        console.error("Error al cargar eventos:", err);
      });
  }, []);

  /**
   * Filtra los eventos que coinciden con la fecha
   * seleccionada por el usuario.
   *
   * @param {Date} date Fecha seleccionada en el calendario.
   */
  const handleSelectDay = (date) => {
    const dayEvents = events.filter((ev) => isSameDay(ev.start, date));
    setEventsOfTheDay(dayEvents);
  };

  /**
   * Componente personalizado para renderizar cada celda
   * de fecha dentro del calendario mensual.
   * Muestra un marcador cuando existen eventos asociados.
   *
   * @param {Object} props Propiedades de la celda.
   * @param {Date} props.date Fecha representada en la celda.
   * @returns {JSX.Element}
   */
  const CustomDateCell = ({ date }) => {
    const hasEvent = events.some((ev) => isSameDay(ev.start, date));

    return (
      <div
        onClick={() => handleSelectDay(date)}
        className={`cell-day ${hasEvent ? "with-event" : ""}`}
        style={{
          cursor: hasEvent ? "pointer" : "default",
        }}
      >
        <span className="number-day">{date.getDate()}</span>

        {hasEvent && (<span className="marker-event">📍</span>)}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      {/* Título correspondiente al mes visualizado */}
      <h3 className="title-month">
        {format(actualDate, "MMMM yyyy", {
          locale: es,
        }).toUpperCase()}
      </h3>

      <div className="calendar-layout">

        {/* Calendario principal */}
        <div className="calendar-main">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={actualDate}
            onNavigate={(date) => setActualDate(date)}
            style={{ height: 450 }}
            toolbar={false}
            views={["month"]}
            components={{
              month: {
                dateHeader: CustomDateCell,
              },
            }}
          />
        </div>

        {/* Panel de detalle de eventos */}
        <div className="event-detail">
          {eventsOfTheDay === null ? (
            <div className="without-events">
              <h3>Selecciona una fecha</h3>
              <p>
                Haz clic en un día del calendario para ver sus
                eventos.
              </p>
            </div>
          ) : eventsOfTheDay.length === 0 ? (
            <div className="without-events">
              <h3>Sin eventos</h3>
              <p>No hay eventos registrados para esta fecha.</p>
            </div>
          ) : (
            <>
              <h3>Eventos del día:</h3>

              {eventsOfTheDay.map((ev) => (
                <div key={ev.id} className="event-card">

                  {/* Imagen del evento */}
                  {ev.image && (
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="event-image"
                    />
                  )}

                  {/* Nombre del evento */}
                  <h4>{ev.title}</h4>

                  {/* Lugar del evento */}
                  <p><strong>📍 Lugar:</strong>{" "}{ev.place || "Sin definir"}</p>

                  {/* Fecha y hora del evento */}
                  <p>
                    <strong>🕒 Fecha y hora:</strong>{" "}
                    {ev.start.toLocaleString("es-ES", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </p>

                  {/* Descripción del evento */}
                  <p>{ev.description}</p>

                  {/* Enlace de registro o asistencia */}
                  {ev.link && (
                    <p>
                      🔗{" "}
                      <a href={ev.link} target="_blank" rel="noreferrer"> Registro de asistencia</a>
                    </p>
                  )}
                </div>
              ))}

              {/* Botón para cerrar el panel de detalles */}
              <button onClick={() => setEventsOfTheDay(null)}>Cerrar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
