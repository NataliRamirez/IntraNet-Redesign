import { useState } from "react";
import Header from "./components/header/header";
import Menu from "./components/Menu/Menu";
import Home from "./pages/Home/Home";
import Nosotros from "./pages/Us/Us";
import Utilidades from "./pages/Utils/Utils";
import Eventos from "./pages/Events/Events";
import Noticias from "./pages/News/News";
import NoticiaDetalle from "./pages/News/Detail/News-Detail";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ComDashboard from "./pages/Comunications/Dashboard-Comunication";
import AdminNoticias from "./pages/Admin/AdminNews";
import AdminEventos from "./pages/Admin/AdminEvents";
import PrivateRoute from "./components/Routes/PrivateRoutes";
import Footer from "./components/Footer/Footer";
import NoticiasGrid from "./pages/News/Carrousel/News-Carrousel";
import EventoDetalle from "./pages/Events/Detail/Event-Detail"; 
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
        <Route path="/us" element={<Us />} />
        <Route path="/utils" element={<Utils />} />
        <Route path="/events" element={<Events />} />
        <Route path="/news" element={<NewsCarrousel />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/events/:id" element={<EventDetail />} />
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
          path="/admin/notices"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminNotices />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminEvents />
            </PrivateRoute>
          }
        />

        <Route
          path="/comunications"
          element={
            <PrivateRoute allowedRoles={["comunications", "admin"]}>
              <ComDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer /> 
    </>
  );
}