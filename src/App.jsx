import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Menu from "./components/Menu/Menu";
import Home from "./pages/Home/Home";
import Nosotros from "./pages/Nosotros/Nosotros";
import Utilidades from "./pages/Utilidades/Utilidades";
import Eventos from "./pages/Eventos/Eventos";
import Noticias from "./pages/Noticias/Noticias";
import NoticiaDetalle from "./pages/Noticias/NoticiaDetalle";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ComDashboard from "./pages/Comunicaciones/ComDashboard";
import AdminNoticias from "./pages/Admin/AdminNoticias";
import AdminEventos from "./pages/Admin/AdminEventos";
import PrivateRoute from "./components/Routes/PrivateRoutes";
import EmpleadosList from "./pages/Admin/empleados/EmpleadosList";
import Footer from "./components/Footer/Footer";
import NoticiasGrid from "./pages/Noticias/NoticiasGrid";
import EventoDetalle from "./pages/Eventos/EventoDetalle"; 
import BirthdayModal from "./pages/BirthdayModal/BirthdayModal"; 
import AdminBirthdayImage from "./pages/Admin/AdminBirthdayImage";


import "./App.css";

export default function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header />
      <div>
        <hr className="hr-line" />
      </div>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/utilidades" element={<Utilidades />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/noticias" element={<NoticiasGrid />} />
        <Route path="/noticias/:id" element={<NoticiaDetalle />} />
        <Route path="/admin/empleados" element={<EmpleadosList />} />
        <Route path="/eventos/:id" element={<EventoDetalle />} />
        <Route path="/birthdaymodal" element={<BirthdayModal />} />
        <Route path="/admin/cumpleanos" element={<AdminBirthdayImage />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/noticias"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminNoticias />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/eventos"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminEventos />
            </PrivateRoute>
          }
        />

        <Route
          path="/comunicaciones"
          element={
            <PrivateRoute allowedRoles={["comunicaciones", "admin"]}>
              <ComDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer /> 
    </>
  );
}