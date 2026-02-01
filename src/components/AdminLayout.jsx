import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";

const navItems = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/reservations", label: "Reservations" },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/menu", label: "Menu" }
];

const AdminLayout = ({ children, onSignOut }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (onSignOut) {
      onSignOut();
    }
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-semibold text-slate-900">Plan B Admin</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Dashboard
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
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
                    ? "bg-skywash-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
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
