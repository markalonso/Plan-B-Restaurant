import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FloatingBookingButton from "./components/FloatingBookingButton.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Booking from "./pages/Booking.jsx";
import Events from "./pages/Events.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminReservations from "./pages/admin/AdminReservations.jsx";
import AdminEvents from "./pages/admin/AdminEvents.jsx";
import AdminCustomers from "./pages/admin/AdminCustomers.jsx";
import AdminMenu from "./pages/admin/AdminMenu.jsx";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? "pt-0" : "pt-20"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
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
        </Routes>
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
