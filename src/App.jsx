import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/Footer.jsx";
import FloatingBookingButton from "./components/FloatingBookingButton.jsx";
import PageTransition from "./components/PageTransition.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import GlobalLoadingIndicator from "./components/GlobalLoadingIndicator.jsx";
import { useGlobalLoading } from "./context/LoadingContext.jsx";
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
import AdminModifiers from "./pages/admin/AdminModifiers.jsx";
import AdminInventory from "./pages/admin/AdminInventory.jsx";
import AdminPurchases from "./pages/admin/AdminPurchases.jsx";
import AdminExpenses from "./pages/admin/AdminExpenses.jsx";
import AdminWaste from "./pages/admin/AdminWaste.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";
import POS from "./pages/POS.jsx";
import OwnerRoute from "./components/OwnerRoute.jsx";

const routeLoaderDelayMs = 450;

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isPOSRoute = location.pathname.startsWith("/pos");
  const { isLoading } = useGlobalLoading();
  const [routeLoading, setRouteLoading] = useState(true);

  useEffect(() => {
    setRouteLoading(true);
    const timer = window.setTimeout(() => {
      setRouteLoading(false);
    }, routeLoaderDelayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface-primary text-text-primary">
      <ScrollToTop />
      {!isAdminRoute && !isPOSRoute && <Header />}
      <main className={isAdminRoute || isPOSRoute ? "pt-0" : "pt-20"}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/menu" element={<PageTransition><Menu /></PageTransition>} />
            <Route path="/booking" element={<PageTransition><Booking /></PageTransition>} />
            <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
            <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/pos" element={<AdminRoute><POS /></AdminRoute>} />
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
            <Route
              path="/admin/modifiers"
              element={
                <OwnerRoute>
                  <AdminModifiers />
                </OwnerRoute>
              }
            />
            <Route
              path="/admin/inventory"
              element={
                <OwnerRoute>
                  <AdminInventory />
                </OwnerRoute>
              }
            />
            <Route
              path="/admin/purchases"
              element={
                <OwnerRoute>
                  <AdminPurchases />
                </OwnerRoute>
              }
            />
            <Route
              path="/admin/expenses"
              element={
                <OwnerRoute>
                  <AdminExpenses />
                </OwnerRoute>
              }
            />
            <Route
              path="/admin/waste"
              element={
                <OwnerRoute>
                  <AdminWaste />
                </OwnerRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <OwnerRoute>
                  <AdminReports />
                </OwnerRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <GlobalLoadingIndicator visible={isLoading || routeLoading} />
      {!isAdminRoute && !isPOSRoute && (
        <>
          <Footer />
          <FloatingBookingButton />
        </>
      )}
    </div>
  );
};

export default App;
