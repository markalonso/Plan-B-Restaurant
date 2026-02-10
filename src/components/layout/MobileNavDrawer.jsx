import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { modalBackdropVariants, drawerVariants } from "../../lib/motion.js";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];

const MobileNavDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const prevPathname = useRef(location.pathname);

  // Close drawer on route change
  useEffect(() => {
    if (prevPathname.current !== location.pathname && isOpen) {
      onClose();
    }
    prevPathname.current = location.pathname;
  }, [location.pathname, isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinkClasses = ({ isActive }) =>
    `block py-3 text-lg font-medium transition-colors ${
      isActive ? "text-coffee" : "text-text-primary hover:text-coffee"
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-coffee-dark/50 backdrop-blur-sm"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            className="fixed right-0 top-0 z-50 h-full w-72 bg-white shadow-xl"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Close button */}
            <div className="flex items-center justify-between border-b border-coffee/10 px-6 py-4">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-text-muted">
                Menu
              </span>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-muted hover:text-coffee"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation links */}
            <nav className="px-6 py-4">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClasses}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-coffee/10 bg-surface-muted p-6">
              <NavLink
                to="/booking"
                className="flex w-full items-center justify-center gap-2 rounded-ui-default bg-coffee px-5 py-3 text-sm font-semibold text-white shadow-soft transition duration-200 hover:bg-coffee-dark"
              >
                Reserve a Table
              </NavLink>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNavDrawer;
