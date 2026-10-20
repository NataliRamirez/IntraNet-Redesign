import "./AdminDashboard.css";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || user.role !== "ADMINISTRADOR") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-dashboard">
      <section className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, aquí puedes gestionar toda la intranet.</p>
      </section>

      <section className="admin-actions">
        <div className="action-card">
          <h2>Noticias</h2>
          <p>Crea, edita y elimina las noticias de la empresa.</p>
          <button className="action-btn" onClick={() => navigate("/admin/news")}>Gestionar Noticias</button>
        </div>

        <div className="action-card">
          <h2>Empleados</h2>
          <p>Crea, edita y elimina los empleados de la empresa.</p>
          <button className="action-btn" onClick={() => navigate("/admin/employees")}>Gestionar Empleados</button>
        </div>

        <div className="action-card">
          <h2>Usuarios</h2>
          <p>Crea, edita y elimina los usuarios del sistema.</p>
          <button className="action-btn" onClick={() => navigate("/admin/users")}>Gestionar Usuarios</button>
        </div>

        <div className="action-card">
          <h2>Cumpleaños</h2>
          <p>Sube la imagen de los cumpleañeros del mes.</p>
          <button className="action-btn" onClick={() => navigate("/admin/birthday")}>Gestionar Imagen</button>
        </div>

        <div className="action-card">
          <h2>Eventos</h2>
          <p>Administra los eventos de la organización.</p>
          <button className="action-btn" onClick={() => navigate("/admin/events")}>Gestionar Eventos</button>
        </div>
      </section>
    </div >
  );
}
