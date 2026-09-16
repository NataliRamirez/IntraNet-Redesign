import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isSameDay } from "date-fns";
import esES from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarComponent.css";

const locals = { es: esES };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locals: locals,
});

// Se lee la variable de entorno directamente
const API_URL = import.meta.env.VITE_API_URL;

export default function CalendarComponent() {
  const [events, setEvents] = useState([]);
  const [eventsOfTheDay, setEventsOfTheDay] = useState(null);
  const [actualDate, setActualDate] = useState(new Date());

  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then((res) => res.json())
      .then((data) => {
        const transformedEvents = data.map((ev) => ({
          id: ev.id,
          title: ev.name,
          start: new Date(ev.dateTime),
          place: ev.place,
          link: ev.link,
          image: ev.image ? `${API_URL}/uploads/events/${ev.image}` : null,
          description: ev.description,
        }));
        setEvents(transformedEvents);
      })
      .catch((err) => console.error("Error al cargar eventos:", err));
  }, []);

  const handleSelectDay = (date) => {
    const eventsOfTheDay = events.filter((ev) => isSameDay(ev.start, date));
    setEventsOfTheDay(eventsOfTheDay);
  };

  const CustomDateCell = ({ date }) => {
    if (!(date instanceof Date)) return null;
    const hasEvent = events.some((ev) => isSameDay(ev.start, date));

    return (
      <div
        onClick={() => handleSelectDay(date)}
        className={`cell-day ${hasEvent ? "with-event" : ""}`}
        style={{ cursor: hasEvent ? "pointer" : "default" }}
      >
        <span className="number-day">{date.getDate()}</span>
        {hasEvent && <span className="marker-event">📍</span>}
      </div>
    );
  };


  return (

    <div className="calendar-container">
      <h2 className="title-month">
        {format(actualDate, "MMMM yyyy", { locale: esES }).toUpperCase()}
      </h2>

      <div className="calendar-layout">
        <div className="calendar-main">
          <Calendar
            localizer={localizer}
            events={[]}
            startAccessor="start"
            endAccessor="end"
            date={actualDate}
            onNavigate={(date) => setActualDate(date)}
            style={{ height: 450 }}
            toolbar={false}
            views={["month"]}
            components={{
              month: { dateHeader: CustomDateCell },
            }}
          />
        </div>

        <div className="event-detail">
          {eventsOfTheDay === null ? (
            <div className="without-events">
              <h3>Selecciona una fecha</h3>
              <p>Haz clic en un día del calendario para ver sus eventos.</p>
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
                  {ev.image && (
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="event-image"
                    />
                  )}
                  <h4>{ev.title}</h4>
                  <p>
                    <strong>📍 Lugar:</strong> {ev.place || "Sin definir"}
                  </p>
                  <p>
                    <strong>🕒 Fecha y hora:</strong>{" "}
                    {ev.start.toLocaleString("es-ES", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </p>
                  <p>{ev.description}</p>
                  {ev.link && (
                    <p>
                      🔗{" "}
                      <a href={ev.link} target="_blank" rel="noreferrer">
                        Registro de asistencia
                      </a>
                    </p>
                  )}
                </div>
              ))}
              <button onClick={() => setEventsOfTheDay(null)}>Cerrar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
