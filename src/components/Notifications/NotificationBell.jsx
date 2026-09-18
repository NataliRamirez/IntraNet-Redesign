import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotifications } from "react-icons/md";
import "./NotificationBell.css";

/**
 * Componente encargado de gestionar y visualizar las notificaciones de la Intranet. 
 * Permite consultar, marcar como leídas, eliminar y redirigir al usuario
 * hacia el contenido relacionado con cada notificación.
 *
 * @returns {JSX.Element}
 */
export default function NotificationBell() {

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  //hook de navegación
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  //Obtener notificaciones del backend
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error obteniendo notificaciones:", error);
    }
  };

  /**
   * Marca una notificación específica como leída.
   *
   * @param {number} id Identificador de la notificación.
   */
  const markAsRead = async (id) => {
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, { method: "PATCH" });
      fetchNotifications();
    } catch (error) {
      console.error("Error marcando como leído:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${API_URL}/notifications/read-all`, { method: "PATCH" });
      fetchNotifications();
    } catch (error) {
      console.error("Error marcando todas como leídas:", error);
    }
  };

  /**
   * Elimina una notificación específica.
   * @param {number} id Identificador de la notificación.
   */
  const deleteNotification = async (id) => {
    try {
      await fetch(`${API_URL}/notifications/${id}`, { method: "DELETE" });
      fetchNotifications();
    } catch (error) {
      console.error("Error eliminando notificación:", error);
    }
  };

  /**
   * Carga las notificaciones al iniciar el componente y 
   * actualiza la información automáticamente cada 15 segundos.
   */
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /**
   * Gestiona la selección de una notificación. La marca como leída y 
   * redirige al contenido relacionado según su tipo.
   *
   * @param {Object} n Notificación seleccionada.
   */
  const handleNotificationClick = async (n) => {
    if (!n.read) await markAsRead(n.id);

    if (n.type === "event" && n.eventId) {
      navigate(`/event/${n.eventId}`);
    } else if (n.type === "news" && n.newsId) {
      navigate(`/news/${n.newsId}`);
    }

    setOpen(false);
  };

  return (
    <div className="notification-wrapper">

      {/* Botón de apertura del panel */}
      <div
        className="notification-bell"
        onClick={() => setOpen(!open)}
      >

        {/* Ícono de notificaciones */}
        <MdNotifications className="bell" />

        {/* Indicador de notificaciones sin leer */}
        {unreadCount > 0 && (
          <span className="badge">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Panel desplegable de notificaciones */}
      {open && (
        <div className="notification-dropdown">

          {/* Encabezado del panel */}
          <div className="dropdown-header">
            <strong>Notificaciones</strong>

            {unreadCount > 0 && (
              <button
                className="mark-all-btn"
                onClick={markAllAsRead}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Mensaje cuando no existen notificaciones */}
          {notifications.length === 0 && (
            <p className="no-notifications">
              No hay notificaciones
            </p>
          )}

          {/* Listado de notificaciones */}
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${n.read ? "" : "unread"
                }`}
              onClick={() =>
                handleNotificationClick(n)
              }
            >
              <div className="notification-text">

                {/* Título de la notificación */}
                <strong>{n.title}</strong>

                {/* Mensaje de la notificación */}
                <p>{n.message}</p>
              </div>

              {/* Botón para eliminar la notificación */}
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n.id);
                }}
              >
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}