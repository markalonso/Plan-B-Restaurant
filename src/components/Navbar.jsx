import { NavLink } from "react-router-dom";

const navLinkClasses = ({ isActive }) =>
  `font-sans text-sm transition-all duration-normal ease-gentle ${
    isActive ? "text-brand-primary font-medium" : "text-neutral-slate/80 hover:text-brand-primary"
  }`;

const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-accent-sand/30 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Plan B logo" className="h-10 w-10" />
          <div>
            <p className="font-serif text-lg font-semibold text-neutral-slate">Plan B</p>
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-neutral-slate/60">
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
            className="rounded-lg border border-accent-sand/50 px-4 py-2 font-sans text-sm text-neutral-slate transition-all duration-normal hover:bg-brand-light/50"
          >
            View Menu
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
