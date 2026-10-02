import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdNotifications,
  MdEvent,
  MdArticle,
  MdDelete,
  MdCheck,
  MdDoneAll,
} from "react-icons/md";

import "./NotificationPanel.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * Obtiene las notificaciones del backend.
   */
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/notifications`
      );

      if (!response.ok) {
        throw new Error(
          "No fue posible obtener las notificaciones"
        );
      }

      const data = await response.json();

      setNotifications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Error obteniendo notificaciones:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Marca una notificación como leída.
   */
  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${id}/is_read`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error(
          "No fue posible marcar la notificación"
        );
      }

      await fetchNotifications();
    } catch (error) {
      console.error(
        "Error marcando como leída:",
        error
      );
    }
  };

  /**
   * Marca todas las notificaciones como leídas.
   */
  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/read-all`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error(
          "No fue posible marcar todas las notificaciones"
        );
      }

      await fetchNotifications();
    } catch (error) {
      console.error(
        "Error marcando todas como leídas:",
        error
      );
    }
  };

  /**
   * Elimina una notificación.
   */
  const deleteNotification = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "No fue posible eliminar la notificación"
        );
      }

      await fetchNotifications();
    } catch (error) {
      console.error(
        "Error eliminando notificación:",
        error
      );
    }
  };

  /**
   * Redirige al contenido relacionado.
   */
  const handleNotificationClick = async (notification) => {
    const isUnread =
      !notification.is_read &&
      !notification.read;

    if (isUnread) {
      await markAsRead(notification.id);
    }

    if (
      notification.type === "event" &&
      notification.eventId
    ) {
      navigate(
        `/events/${notification.eventId}`
      );

      return;
    }

    if (
      notification.type === "news" &&
      notification.newsId
    ) {
      navigate(
        `/news/${notification.newsId}`
      );
    }
  };

  /**
   * Carga inicial y actualización automática.
   */
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(
      fetchNotifications,
      15000
    );

    return () => clearInterval(interval);
  }, []);

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.is_read &&
        !notification.read
    ).length;

  /**
   * Icono dependiendo del tipo.
   */
  const getNotificationIcon = (type) => {
    if (type === "event") {
      return <MdEvent />;
    }

    if (type === "news") {
      return <MdArticle />;
    }

    return <MdNotifications />;
  };

  /**
   * Texto del tipo de notificación.
   */
  const getNotificationType = (type) => {
    if (type === "event") {
      return "Evento";
    }

    if (type === "news") {
      return "Noticia";
    }

    return "Notificación";
  };

  return (
    <main className="notifications-page">

      {/* Encabezado */}
      <section className="notifications-header">
        <div className="notifications-title">
          <MdNotifications />

          <div>
            <h1>Notificaciones</h1>

            <p>
              Mantente al día con las novedades de
              IntraNet EMCA.
            </p>
          </div>
        </div>

        <div className="notifications-actions">
          {unreadCount > 0 && (
            <span className="unread-counter">
              {unreadCount}{" "}
              {unreadCount === 1
                ? "sin leer"
                : "sin leer"}
            </span>
          )}

          {unreadCount > 0 && (
            <button
              className="mark-all-btn"
              onClick={markAllAsRead}
            >
              <MdDoneAll />
              Marcar todas como leídas
            </button>
          )}
        </div>
      </section>

      {/* Contenido */}
      <section className="notifications-content">

        {loading ? (
          <div className="notifications-state">
            <MdNotifications />

            <p>
              Cargando notificaciones...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notifications-state">
            <MdNotifications />

            <h2>
              No tienes notificaciones
            </h2>

            <p>
              Cuando haya novedades aparecerán
              aquí.
            </p>
          </div>
        ) : (
          <div className="notifications-grid">

            {notifications.map((notification) => {
              const unread =
                !notification.is_read &&
                !notification.read;

              return (
                <article
                  key={notification.id}
                  className={`notification-card ${
                    unread ? "unread" : "read"
                  }`}
                >
                  {/* Icono */}
                  <div className="notification-icon">
                    {getNotificationIcon(
                      notification.type
                    )}
                  </div>

                  {/* Información */}
                  <div
                    className="notification-card-content"
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                  >
                    <div className="notification-card-top">

                      <span className="notification-type">
                        {getNotificationType(
                          notification.type
                        )}
                      </span>

                      {unread && (
                        <span className="new-label">
                          Nueva
                        </span>
                      )}
                    </div>

                    <h2>
                      {notification.title}
                    </h2>

                    <p>
                      {notification.message}
                    </p>

                    {notification.created_at && (
                      <span className="notification-date">
                        {new Date(
                          notification.created_at
                        ).toLocaleString(
                          "es-CO",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="notification-card-actions">

                    {unread && (
                      <button
                        className="read-btn"
                        title="Marcar como leída"
                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }
                      >
                        <MdCheck />
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      title="Eliminar notificación"
                      onClick={() =>
                        deleteNotification(
                          notification.id
                        )
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
