import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header/Header";
import Menu from "./components/Menu/Menu";
import Home from "./pages/Home/Home";
import Us from "./pages/Us/Us";
import Utils from "./pages/Utils/Utils";
import Events from "./pages/Events/Events";
import News from "./pages/News/News";
import NewsDetail from "./pages/News/Detail/News-Detail";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import DashboardComunication from "./pages/Comunications/Dashboard-Comunication";
import AdminNews from "./pages/Admin/AdminNews";
import AdminEvents from "./pages/Admin/AdminEvents";
import PrivateRoute from "./components/Routes/PrivateRoutes";
import Footer from "./components/Footer/Footer";
import GridNews from "./pages/News/GridNews/GridNews";
import EventDetail from "./pages/Events/Detail/Event-Detail"; 
import BirthdayModal from "./pages/BirthdayModal/BirthdayModal"; 
import AdminBirthdayImage from "./pages/Admin/AdminBirthdayImage";


import "./App.css";

export default function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header />
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/us" element={<Us />} />
        <Route path="/utils" element={<Utils />} />
        <Route path="/events" element={<Events />} />
        <Route path="/news" element={<GridNews />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/birthdaymodal" element={<BirthdayModal />} />
        <Route path="/admin/birthday" element={<AdminBirthdayImage />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminNews />
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
              <DashboardComunication />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer /> 
    </>
  );
}