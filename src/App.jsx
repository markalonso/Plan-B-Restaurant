import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/Footer.jsx";
import FloatingBookingButton from "./components/FloatingBookingButton.jsx";
import PageTransition from "./components/PageTransition.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Booking from "./pages/Booking.jsx";
import Events from "./pages/Events.jsx";
import Gallery from "./pages/Gallery.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminReservations from "./pages/admin/AdminReservations.jsx";
import AdminEvents from "./pages/admin/AdminEvents.jsx";
import AdminCustomers from "./pages/admin/AdminCustomers.jsx";
import AdminMenu from "./pages/admin/AdminMenu.jsx";
import AdminGallery from "./pages/admin/AdminGallery.jsx";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-surface-primary text-text-primary">
      <ScrollToTop />
      {!isAdminRoute && <Header />}
      <main className={isAdminRoute ? "pt-0" : "pt-20"}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/menu" element={<PageTransition><Menu /></PageTransition>} />
            <Route path="/booking" element={<PageTransition><Booking /></PageTransition>} />
            <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
            <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminOverview />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/reservations"
              element={
                <AdminRoute>
                  <AdminReservations />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <AdminRoute>
                  <AdminEvents />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <AdminRoute>
                  <AdminCustomers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/menu"
              element={
                <AdminRoute>
                  <AdminMenu />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <AdminRoute>
                  <AdminGallery />
                </AdminRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminRoute && (
        <>
          <Footer />
          <FloatingBookingButton />
        </>
      )}
    </div>
  );
};

export default App;
