import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotifications, MdEvent, MdArticle, MdDelete, MdCheck, MdDoneAll,} from "react-icons/md";
import "./NotificationPanel.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/notifications`);

      if (!response.ok) {
        throw new Error("No fue posible obtener las notificaciones");
      }

      const data = await response.json();

      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error obteniendo notificaciones:",error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${id}/is_read`,{method: "PATCH",});

      if (!response.ok) {
        throw new Error("No fue posible marcar la notificación");
      }

      await fetchNotifications();
    } catch (error) {
      console.error("Error marcando como leída:",error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/read-all`,{method: "PATCH",});

      if (!response.ok) {
        throw new Error("No fue posible marcar todas las notificaciones");
      }

      await fetchNotifications();
    } catch (error) {
      console.error("Error marcando todas como leídas:",error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${id}`,{method: "DELETE",});

      if (!response.ok) {
        throw new Error("No fue posible eliminar la notificación");
      }

      await fetchNotifications();
    } catch (error) {
      console.error("Error eliminando notificación:",error);
    }
  };

  const handleNotificationClick = async (notification) => {
    const unread = !notification.is_read && !notification.read;

    if (unread) {
      await markAsRead(notification.id);
    }

    if (notification.entity_type === "EVENT" && notification.reference_id) {
      navigate(`/events/${notification.reference_id}`);
      return;
    }

    if ( notification.entity_type === "NEWS" && notification.reference_id) {
      navigate( `/news/${notification.reference_id}` );
      return;
    }

    console.warn("La notificación no tiene una referencia válida:",notification);
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications,15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount =
    notifications.filter(
      (notification) => !notification.is_read && !notification.read
    ).length;

  const getNotificationIcon = (entityType) => {
    if (entityType === "EVENT") {
      return <MdEvent />;
    }

    if (entityType === "NEWS") {
      return <MdArticle />;
    }

    return <MdNotifications />;
  };

  const getNotificationType = (entityType) => {
    if (entityType === "EVENT") {
      return "Evento";
    }

    if (entityType === "NEWS") {
      return "Noticia";
    }

    return "Notificación";
  };

  return (
    <main className="notifications-page">
      <section className="notifications-header">
        <div className="notifications-title">
          <MdNotifications />
          <div>
            <h1>Notificaciones</h1>
            <p> Mantente al día con las novedades de IntraNet EMCA. </p>
          </div>
        </div>
        <div className="notifications-actions">
          {unreadCount > 0 && (<span className="unread-counter">{unreadCount} sin leer</span>)}
          {unreadCount > 0 && (
            <button className="mark-all-btn" onClick={markAllAsRead}>
              <MdDoneAll />
              Marcar todas como leídas
            </button>
          )}
        </div>
      </section>

      <section className="notifications-content">
        {loading ? (
          <div className="notifications-state">
            <MdNotifications />
            <p>Cargando notificaciones...</p>
          </div>

        ) : notifications.length === 0 ? (

          <div className="notifications-state">
            <MdNotifications />
            <h2>No tienes notificaciones</h2>
            <p>Cuando haya novedades aparecerán aquí.</p>
          </div>

        ) : (

          <div className="notifications-grid">
            {notifications.map((notification) => {
              const unread = !notification.is_read && !notification.read;

              return (
                <article
                  key={notification.id}
                  className={`notification-card ${
                    unread ? "unread" : "read"
                  }`}
                >

                  <div className="notification-icon">
                    {getNotificationIcon(notification.entity_type)}
                  </div>

                  <div
                    className="notification-card-content"
                    onClick={() => handleNotificationClick(notification)}
                  >

                    <div className="notification-card-top">
                      <span className="notification-type">{getNotificationType(notification.entity_type)}</span>
                      {unread && (<span className="new-label">Nueva</span>)}
                    </div>

                    <h2>{notification.title}</h2>
                    <p>{notification.message}</p>

                    {notification.created_at && (
                      <span className="notification-date">
                        {new Date(notification.created_at).toLocaleString("es-CO",{
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </span>
                    )}
                  </div>

                  {/* ACCIONES */}
                  <div className="notification-card-actions">
                    {unread && (
                      <button
                        className="read-btn"
                        title="Marcar como leída"
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                      >
                        <MdCheck />
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      title="Eliminar notificación"
                      onClick={() =>
                        deleteNotification(notification.id)
                      }
                    >
                      <MdDelete />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}