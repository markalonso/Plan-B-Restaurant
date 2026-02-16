import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";

const navItems = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/reservations", label: "Reservations" },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/menu", label: "Menu" },
  { to: "/admin/gallery", label: "Gallery" }
];

const AdminLayout = ({ children, onSignOut }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("[AdminLayout] Sign out error:", err);
    }
    if (onSignOut) {
      onSignOut();
    }
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-surface-primary">
      <header className="border-b border-coffee/15 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-semibold text-text-primary">Plan B Admin</p>
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
              Dashboard
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-coffee/15 px-4 py-2 text-sm font-semibold text-text-secondary"
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-coffee text-white"
                    : "text-text-secondary hover:bg-surface-muted"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
