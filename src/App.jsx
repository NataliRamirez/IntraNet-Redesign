import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import ScrollToTop from "./components/ScrollTop/ScrollToTop";
import Header from "./components/Header/Header";
import Menu from "./components/Menu/Menu";
import Home from "./pages/Home/Home";
import Us from "./pages/Us/Us";
import Utils from "./pages/Utils/Utils";
import Events from "./pages/Events/Events";
import News from "./pages/News/News";
import NewsDetail from "./pages/News/Detail/NewsDetail";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import DashboardComunication from "./pages/Comunications/DashboardComunication";
import AdminNews from "./pages/Admin/AdminNews/AdminNews";
import AdminEvents from "./pages/Admin/AdminEvents/AdminEvents";
import AdminUsers from "./pages/Admin/AdminUsers/AdminUsers";
import AdminEmployees from "./pages/Admin/AdminEmployees/AdminEmployees";
import PrivateRoute from "./components/Routes/PrivateRoutes";
import Footer from "./components/Footer/Footer";
import GridNews from "./pages/News/GridNews/GridNews";
import EventDetail from "./pages/Events/Detail/EventDetail";
import BirthdayModal from "./pages/BirthdayModal/BirthdayModal";
import AdminBirthdayImage from "./pages/Admin/BirthdayImage/AdminBirthdayImage";
import PrivacyPolicy from "./pages/UseTerms/PrivacyPolicy";
import TermsOfService from "./pages/UseTerms/TermsOfService";
import UserProfile from "./pages/UserProfile/UserProfile";
import "./App.css";

export default function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header />
      <Menu />
      <ScrollToTop />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/us" element={<Us />} />
        <Route path="/utils" element={<Utils />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/news" element={<GridNews />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/birthdaymodal" element={<BirthdayModal />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/termsofservice" element={<TermsOfService />} />


        <Route path="/admin" element={<PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
          <AdminDashboard />
        </PrivateRoute>} />

        <Route path="/admin/news" element={<PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
          <AdminNews />
        </PrivateRoute>} />

        <Route path="/profile" element={<PrivateRoute allowedRoles={["ADMINISTRADOR", "COMUNICACIONES"]}>
          <UserProfile />
        </PrivateRoute>} />

        <Route path="/admin/events" element={<PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
          <AdminEvents />
        </PrivateRoute>} />

        <Route path="/admin/users" element={<PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
          <AdminUsers />
        </PrivateRoute>} />

        <Route path="/admin/employees" element={<PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
          <AdminEmployees />
        </PrivateRoute>} />

        <Route path="/admin/birthday" element={<PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
          <AdminBirthdayImage />
        </PrivateRoute>} />

        <Route path="/comunications" element={<PrivateRoute allowedRoles={["COMUNICACIONES"]}>
          <DashboardComunication />
        </PrivateRoute>} />

        <Route path="/comunications/news" element={<PrivateRoute allowedRoles={["COMUNICACIONES"]}>
          <AdminNews />
        </PrivateRoute>} />

        <Route path="/comunications/events" element={<PrivateRoute allowedRoles={["COMUNICACIONES"]}>
          <AdminEvents />
        </PrivateRoute>} />

        <Route path="/comunications/birthday" element={<PrivateRoute allowedRoles={["COMUNICACIONES"]}>
          <BirthdayModal />
        </PrivateRoute>} />

        <Route path="/comunications/tools" element={<PrivateRoute allowedRoles={["COMUNICACIONES"]}>
          <Utils />
        </PrivateRoute>} />

      </Routes>
      <Footer />
    </>
  );
}