import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotifications } from "react-icons/md";
import { useAuth } from "../../Context/AuthContext";
import "./NotificationBell.css";

/**
 * Componente encargado de gestionar y visualizar las notificaciones de la Intranet.
 *
 * Permite:
 * - Consultar notificaciones.
 * - Marcar una notificación como leída.
 * - Marcar todas como leídas.
 * - Eliminar notificaciones.
 * - Redirigir a noticias y eventos existentes.
 */
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  /*
   * Headers de autenticación.
   */
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${user?.token}`,
    "Content-Type": "application/json",
  });

  /*
   * Obtener notificaciones.
   */
  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${API_URL}/notifications`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status}`
        );
      }

      const data = await response.json();

      setNotifications(data);

    } catch (error) {
      console.error(
        "Error obteniendo notificaciones:",
        error
      );
    }
  };

  /*
   * Marcar una notificación como leída.
   */
  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${id}/is_read`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status}`
        );
      }

      await fetchNotifications();

    } catch (error) {
      console.error(
        "Error marcando como leído:",
        error
      );
    }
  };

  /*
   * Marcar todas las notificaciones como leídas.
   */
  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/read-all`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status}`
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

  /*
   * Eliminar una notificación.
   */
  const deleteNotification = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status}`
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

  /*
   * Cargar notificaciones.
   */
  useEffect(() => {
    if (!user?.token) {
      return;
    }

    fetchNotifications();

    const interval = setInterval(
      fetchNotifications,
      15000
    );

    return () => clearInterval(interval);
  }, [user?.token]);

  /*
   * Cantidad de notificaciones sin leer.
   */
  const unreadCount = notifications.filter(
    (n) => !n.is_read
  ).length;

  /**
   * Gestiona la selección de una notificación.
   *
   * CREATED:
   *   NEWS  -> /news/:id
   *   EVENT -> /events/:id
   *
   * UPDATED:
   *   NEWS  -> /news/:id
   *   EVENT -> /events/:id
   *
   * DELETED:
   *   No redirige porque el contenido ya no existe.
   */
  const handleNotificationClick = async (n) => {
    try {
      /*
       * Marcar como leída.
       */
      if (!n.is_read) {
        await markAsRead(n.id);
      }

      /*
       * Si fue eliminado, no intentamos
       * abrir el contenido.
       */
      if (n.action === "DELETED") {
        setOpen(false);
        return;
      }

      /*
       * NOTICIA
       */
      if (
        n.entity_type === "NEWS" &&
        n.reference_id
      ) {
        navigate(
          `/news/${n.reference_id}`
        );
      }

      /*
       * EVENTO
       */
      else if (
        n.entity_type === "EVENT" &&
        n.reference_id
      ) {
        navigate(
          `/events/${n.reference_id}`
        );
      }

      setOpen(false);

    } catch (error) {
      console.error(
        "Error procesando la notificación:",
        error
      );
    }
  };

  return (
    <>
      {open && (
        <div
          className="overlay-notifications"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <div className="notification-wrapper">

        <div
          className="notification-bell"
          onClick={() => setOpen(!open)}
        >
          <MdNotifications className="bell" />

          {unreadCount > 0 && (
            <span className="badge">
              {unreadCount}
            </span>
          )}
        </div>

        {open && (
          <div className="notification-dropdown">

            <div className="dropdown-header">

              <strong>
                Notificaciones
              </strong>

              {unreadCount > 0 && (
                <button
                  className="mark-all-btn"
                  onClick={markAllAsRead}
                >
                  Marcar todas como leídas
                </button>
              )}

            </div>

            {notifications.length === 0 && (
              <p className="no-notifications">
                No hay notificaciones
              </p>
            )}

            {notifications.map((n) => (
              <div
                key={n.id}
                className={`notification-item ${n.is_read ? "" : "unread"
                  }`}
                onClick={() =>
                  handleNotificationClick(n)
                }
              >

                <div className="notification-text">

                  <strong>
                    {n.title}
                  </strong>

                  <p>
                    {n.message}
                  </p>

                </div>

                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(n.id);
                  }}
                ></button>

              </div>
            ))}

          </div>
        )}

      </div>

      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}