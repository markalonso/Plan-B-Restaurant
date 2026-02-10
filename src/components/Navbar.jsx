import { NavLink } from "react-router-dom";

const navLinkClasses = ({ isActive }) =>
  `transition-colors ${
    isActive ? "text-coffee" : "text-text-secondary hover:text-coffee"
  }`;

const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-coffee/10 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/assets/planb/home/logo-planb.png.jpg" alt="Plan B logo" className="h-10 w-auto" />
          <div>
            <p className="text-lg font-semibold text-text-primary">Plan B</p>
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
              Restaurant & Cafe
            </p>
          </div>
        </NavLink>
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/menu" className={navLinkClasses}>
            Menu
          </NavLink>
          <NavLink to="/booking" className={navLinkClasses}>
            Booking
          </NavLink>
          <NavLink to="/events" className={navLinkClasses}>
            Events
          </NavLink>
          <NavLink to="/gallery" className={navLinkClasses}>
            Gallery
          </NavLink>
          <NavLink to="/contact" className={navLinkClasses}>
            Contact
          </NavLink>
        </div>
        <div className="md:hidden">
          <NavLink
            to="/menu"
            className="rounded-full border border-coffee/15 px-4 py-2 text-sm text-text-secondary"
          >
            View Menu
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
