import { motion } from "framer-motion";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "./DashboardComunication.css";

export default function DashboardComunication() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || user.role !== "COMUNICACIONES") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="comunication-dashboard">
      <header className="comunication-header">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Panel de Comunicaciones</h1>
          <p>Bienvenido, aquí puedes gestionar las noticias, los eventos y consultar los cumpleaños de la Intranet.</p>
        </motion.div>
      </header>

      <section className="comunication-actions">
        {/* Noticias */}
        <motion.div
          className="action-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Noticias</h2>
          <p>Crea, consulta, edita y elimina las noticias de la empresa.</p>
          <button type="button"className="action-btn"onClick={() => navigate("/comunications/news")}>Gestionar noticias</button>
        </motion.div>

        {/* Eventos */}
        <motion.div
          className="action-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2>Eventos</h2>
          <p>Crea, consulta, edita y elimina los eventos de la organización.</p>
          <button type="button" className="action-btn"onClick={() => navigate("/comunications/events")}>Gestionar eventos</button>
        </motion.div>

        
      </section>
    </div>
  );
}
