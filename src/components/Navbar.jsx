import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/gallery", label: "Gallery" },
  { to: "/booking", label: "Booking" },
  { to: "/contact", label: "Contact" }
];

const NavLinkItem = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `relative font-sans text-sm tracking-wide transition-all duration-normal ease-gentle ${
        isActive
          ? "text-brand-primary font-medium"
          : "text-neutral-slate/80 hover:text-neutral-slate"
      } after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-accent-caramel after:transition-all after:duration-normal after:ease-gentle hover:after:w-full ${
        isActive ? "after:w-full" : ""
      }`
    }
  >
    {label}
  </NavLink>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-white transition-all duration-normal ease-gentle ${
          isScrolled ? "shadow-soft" : ""
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
            <img src="/logo.png" alt="Plan B logo" className="h-10 w-10" />
            <div>
              <p className="font-serif text-lg font-semibold text-neutral-slate">Plan B</p>
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-neutral-slate/60">
                Restaurant & Cafe
              </p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLinkItem key={link.to} to={link.to} label={link.label} />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-normal ease-gentle hover:bg-brand-light/50 md:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="relative h-5 w-6">
              <span
                className={`absolute left-0 h-[2px] w-6 bg-neutral-slate transition-all duration-normal ease-gentle ${
                  isMobileMenuOpen ? "top-[9px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[9px] h-[2px] w-6 bg-neutral-slate transition-all duration-normal ease-gentle ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-[2px] w-6 bg-neutral-slate transition-all duration-normal ease-gentle ${
                  isMobileMenuOpen ? "top-[9px] -rotate-45" : "top-[18px]"
                }`}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-neutral-slate/20 backdrop-blur-sm transition-opacity duration-normal ease-gentle md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel - Slides from right */}
      <div
        className={`fixed right-0 top-0 z-40 h-full w-72 bg-white shadow-hover transition-transform duration-slow ease-gentle md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-8 pt-24">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `font-sans text-lg tracking-wide transition-all duration-normal ease-gentle ${
                    isActive
                      ? "text-brand-primary font-medium"
                      : "text-neutral-slate/80 hover:text-neutral-slate hover:translate-x-1"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="mt-auto pb-8">
            <div className="border-t border-accent-sand/30 pt-6">
              <p className="font-sans text-xs text-neutral-slate/60">
                Daily 09:00 – 02:00
              </p>
              <p className="mt-1 font-sans text-xs text-neutral-slate/60">
                Hurghada, Cornish Street
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
