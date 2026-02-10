import { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { headerVariants } from "../../lib/motion.js";
import MobileNavDrawer from "./MobileNavDrawer.jsx";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll to toggle header style
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const openMobileMenu = useCallback(() => setIsMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-coffee" : "text-text-secondary hover:text-coffee"
    }`;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 border-b border-transparent"
        variants={headerVariants}
        initial="transparent"
        animate={isScrolled ? "scrolled" : "transparent"}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4" aria-label="Main navigation">
          {/* Logo - Left */}
          <NavLink to="/" className="flex items-center gap-3">
            <img
              src="/assets/planb/home/logo-planb.png"
              alt="Plan B logo"
              className="h-10 w-10"
              onError={(e) => console.error("Navbar logo failed:", e.currentTarget.src)}
            />
            <div>
              <p className="text-lg font-semibold text-text-primary">Plan B</p>
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
                Restaurant & Cafe
              </p>
            </div>
          </NavLink>

          {/* Desktop Navigation - Center/Right */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClasses}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA Button - Right */}
          <div className="hidden md:block">
            <NavLink
              to="/booking"
              className="inline-flex items-center justify-center gap-2 rounded-ui-default bg-coffee px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-coffee-dark hover:shadow-md"
            >
              Reserve
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={openMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-muted hover:text-coffee md:hidden"
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
};

export default Header;
