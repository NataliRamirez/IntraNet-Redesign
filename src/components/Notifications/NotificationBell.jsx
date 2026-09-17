import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotifications } from "react-icons/md";
import "./NotificationBell.css";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error obteniendo notificaciones:", error);
    }
  };

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

  const deleteNotification = async (id) => {
    try {
      await fetch(`${API_URL}/notifications/${id}`, { method: "DELETE" });
      fetchNotifications();
    } catch (error) {
      console.error("Error eliminando notificación:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
      <div className="notification-bell" onClick={() => setOpen(!open)}>

        <MdNotifications   className="bell" />

        {unreadCount > 0 && ( <span className="badge">{unreadCount}</span>)}
      </div>

      {open && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <strong>Notificaciones</strong>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={markAllAsRead}>
                Marcar todas como leídas
              </button>
            )}
          </div>

          {notifications.length === 0 && (
            <p className="no-notifications">No hay notificaciones</p>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${n.read ? "" : "unread"}`}
              onClick={() => handleNotificationClick(n)}
            >
              <div className="notification-text">
                <strong>{n.title}</strong>
                <p>{n.message}</p>
              </div>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation(); // evita que redirija
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
