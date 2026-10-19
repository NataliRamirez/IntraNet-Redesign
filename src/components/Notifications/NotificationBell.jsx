import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotifications, MdDelete, MdCheck, MdDoneAll, MdSearch, MdClose, MdEvent, MdArticle,} from "react-icons/md";
import { useAuth } from "../../Context/AuthContext";
import "./NotificationBell.css";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [readFilter, setReadFilter] = useState("ALL");

  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const getAuthHeaders = () => {
    const headers = {"Content-Type": "application/json",};

    if (user?.token) {
      headers.Authorization = `Bearer ${user.token}`;
    }

    return headers;
  };

  /**
   * ============================================
   * OBTENER NOTIFICACIONES
   * ============================================
   */
  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${API_URL}/notifications`,
        {method: "GET", headers: getAuthHeaders(),}
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      setNotifications(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Error obteniendo notificaciones:", error);
    }
  };

  /**
   * ============================================
   * MARCAR UNA COMO LEÍDA
   * ============================================
   *
   * Solamente usuarios autenticados.
   */
  const markAsRead = async (id) => {
    if (!user?.token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/notifications/${id}/is_read`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      setNotifications((current) =>
        current.map((notification) => notification.id === id ? {
          ...notification,
          is_read: true,
        }
          : notification
        )
      );

    } catch (error) {
      console.error("Error marcando como leída:",error);
    }
  };

  /**
   * ============================================
   * MARCAR TODAS COMO LEÍDAS
   * ============================================
   */
  const markAllAsRead = async () => {
    if (!user?.token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/notifications/read-all`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

    } catch (error) {
      console.error("Error marcando todas como leídas:",error);
    }
  };

  /**
   * ============================================
   * ELIMINAR NOTIFICACIÓN
   * ============================================
   */
  const deleteNotification = async (id) => {
    if (!user?.token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/notifications/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      setNotifications((current) => current.filter((notification) => notification.id !== id));

    } catch (error) {
      console.error("Error eliminando notificación:",error);
    }
  };

  /**
   * ============================================
   * CARGA INICIAL
   * ============================================
   */
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications,15000);

    return () => clearInterval(interval);
  }, [user?.token]);

  /**
   * ============================================
   * FILTRAR NOTIFICACIONES
   * ============================================
   */
  const filteredNotifications =
    notifications.filter((notification) => {
      const searchText =
        search.toLowerCase().trim();

      // -------------------------------
      // BÚSQUEDA
      // -------------------------------
      const matchesSearch = !searchText ||
        notification.title?.toLowerCase()
          .includes(searchText) || notification.message?.toLowerCase().includes(searchText);

      // -------------------------------
      // TIPO
      // -------------------------------
      const matchesType = typeFilter === "ALL" || notification.entity_type === typeFilter;

      // -------------------------------
      // ESTADO
      // -------------------------------
      const matchesRead = readFilter === "ALL" ||
        (readFilter === "UNREAD" && !notification.is_read) ||
        (readFilter === "READ" && notification.is_read);

      return (
        matchesSearch && matchesType && matchesRead
      );
    });

  /**
   * ============================================
   * LIMPIAR FILTROS
   * ============================================
   */
  const clearFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setReadFilter("ALL");
  };

  /**
   * ============================================
   * CANTIDAD SIN LEER
   * ============================================
   */
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  /**
   * ============================================
   * CLIC EN NOTIFICACIÓN
   * ============================================
   */
  const handleNotificationClick = async (
    notification
  ) => {
    try {
      /*
       * Si está autenticado, marcar como leída.
       */
      if (
        user?.token && !notification.is_read
      ) {
        await markAsRead(notification.id);
      }

      /*
       * Si el contenido fue eliminado,
       * no intentamos abrirlo.
       */
      if (
        notification.action === "DELETED"
      ) {
        setOpen(false);
        return;
      }

      /*
       * NOTICIA
       */
      if (
        notification.entity_type === "NEWS" && notification.reference_id
      ) {
        setOpen(false);

        navigate(`/news/${notification.reference_id}`);

        return;
      }

      /*
       * EVENTO
       */
      if (
        notification.entity_type === "EVENT" && notification.reference_id
      ) {
        setOpen(false);

        navigate(`/events/${notification.reference_id}`);
        return;
      }

      console.warn(
        "Notificación sin referencia válida:",
        notification
      );

      setOpen(false);

    } catch (error) {
      console.error(
        "Error procesando la notificación:",
        error
      );
    }
  };

  /**
   * ============================================
   * ICONO DE NOTIFICACIÓN
   * ============================================
   */
  const getNotificationIcon = (entityType) => {
    if (entityType === "NEWS") {
      return <MdArticle />;
    }

    if (entityType === "EVENT") {
      return <MdEvent />;
    }

    return <MdNotifications />;
  };

  /**
   * ============================================
   * TEXTO DEL TIPO
   * ============================================
   */
  const getNotificationType = (
    entityType
  ) => {
    if (entityType === "NEWS") {
      return "Noticia";
    }

    if (entityType === "EVENT") {
      return "Evento";
    }

    return "Notificación";
  };

  return (
    <>
      {open && (
        <div
          className="overlay-notifications"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="notification-wrapper">

        <button
          type="button"
          className="notification-bell"
          onClick={() =>
            setOpen((current) => !current)
          }
          aria-label="Abrir notificaciones"
        >
          <MdNotifications className="bell" />

          {unreadCount > 0 && (
            <span className="badge">
              {unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div
            className="notification-dropdown"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="dropdown-header">

              <div>
                <strong>
                  Notificaciones
                </strong>

                <span className="notification-total">
                  {notifications.length}
                </span>
              </div>

              {user?.token &&
                unreadCount > 0 && (
                  <button type="button" className="mark-all-btn" onClick={markAllAsRead}>
                    <MdDoneAll />
                    Marcar todas
                  </button>
                )}

            </div>

            <div className="notification-filters">
              <div className="notification-search">
                <MdSearch />
                <input type="text" placeholder="Buscar notificación..." value={search} onChange={(e) => setSearch(e.target.value)}
                />

                {search && (<button type="button" onClick={() => setSearch("")} className="clear-search" >
                  <MdClose />
                </button>
                )}

              </div>
              <div className="filtersContainer">
                <select className="notification-filter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="ALL">
                    Todas
                  </option>

                  <option value="NEWS">
                    Noticias
                  </option>

                  <option value="EVENT">
                    Eventos
                  </option>
                </select>

                <select className="notification-filter" value={readFilter} onChange={(e) => setReadFilter(e.target.value)}>
                  <option value="ALL">
                    Todas
                  </option>

                  <option value="UNREAD">
                    Sin leer
                  </option>

                  <option value="READ">
                    Leídas
                  </option>
                </select>
              </div>
              {(search || typeFilter !== "ALL" || readFilter !== "ALL") && (
                <button type="button" className="clear-filters-btn" onClick={clearFilters}>
                  Limpiar filtros
                </button>
              )}

            </div>

            {notifications.length === 0 ? (
              <div className="no-notifications">
                <MdNotifications />
                <p>No hay notificaciones</p>
              </div>
            ) : filteredNotifications.length === 0 ? (

              <div className="no-notifications">
                <MdSearch />
                <p> No se encontraron notificaciones.</p>

                <button type="button" onClick={clearFilters}>Limpiar filtros</button>

              </div>

            ) : (

              <div className="notifications-list">

                {filteredNotifications.map(
                  (notification) => {

                    const unread = !notification.is_read;
                    return (
                      <div key={notification.id} className={`notification-item ${unread ? "unread" : ""}`}
                        onClick={() => handleNotificationClick(notification)}>

                        {/* ICONO */}
                        <div className="notification-item-icon">
                          {getNotificationIcon(notification.entity_type)}
                        </div>

                        {/* TEXTO */}
                        <div className="notification-text">
                          <div className="notification-item-header">
                            <span className="notification-type">
                              {getNotificationType(notification.entity_type)}
                            </span>

                            {unread && (
                              <span className="notification-new">Nueva</span>
                            )}

                          </div>

                          <strong>{notification.title}</strong>
                          <p>{notification.message}</p>

                          {notification.created_at && (
                            <small>
                              {new Date(notification.created_at).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short", })}
                            </small>
                          )}

                        </div>

                        {/* ACCIONES */}
                        {user?.token && (
                          <div className="notification-actions">

                            {unread && (
                              <button type="button" className="read-btn" title="Marcar como leída" onClick={(
                                e
                              ) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              >
                                <MdCheck />
                              </button>
                            )}

                            <button type="button" className="delete-btn" title="Eliminar notificación" onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            >
                              <MdDelete />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}