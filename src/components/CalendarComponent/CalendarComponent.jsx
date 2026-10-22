import { useEffect, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarComponent.css";
import { Link } from "react-router-dom";

const locales = { es, };

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

  const handleSelectDay = (date) => {
    const dayEvents = events.filter((ev) => isSameDay(ev.start, date));
    setEventsOfTheDay(dayEvents);
  };

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
      <h3 className="title-month">{format(actualDate, "MMMM yyyy", {locale: es,}).toUpperCase()}</h3>

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
              <p>Haz clic en un día del calendario para ver sus eventos.</p>
            </div>
          ) : eventsOfTheDay.length === 0 ? (
            <div className="without-events">
              <h3>Sin eventos</h3>
              <p>No hay eventos registrados para esta fecha.</p>
            </div>
          ) : (
            <>
              <h3>EVENTOS DEL DÍA</h3>

              {eventsOfTheDay.map((ev) => (
                <div key={ev.id} className="event-card">

                  {ev.image && (<img src={ev.image} alt={ev.title} className="event-image"/>)}
                  <h3>{ev.title}</h3>
                  <p><strong>Lugar:</strong>{" "}{ev.place || "Sin definir"}</p>
                  <p>
                    <strong>Fecha y hora:</strong>{" "}
                    {ev.start.toLocaleString("es-ES", {dateStyle: "full",timeStyle: "short",})}
                  </p>
                  <p>{ev.description}</p>
                  {ev.link && (
                    <p>
                      🔗{" "}
                      <a href={ev.link} target="_blank" rel="noreferrer"> Registro de asistencia</a>
                    </p>
                  )}
                </div>
              ))}

              <div className="buttons">
                <button className="Button" onClick={() => setEventsOfTheDay(null)}>Cerrar</button>
                <Link to="/events"><button className="Button">Eventos</button></Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
