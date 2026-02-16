import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";

const navItems = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/pos", label: "POS", end: true, highlight: true },
  { to: "/admin/reservations", label: "Reservations" },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/menu", label: "Menu" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/modifiers", label: "Modifiers", ownerOnly: true },
  { to: "/admin/inventory", label: "Inventory", ownerOnly: true },
  { to: "/admin/purchases", label: "Purchases", ownerOnly: true },
  { to: "/admin/expenses", label: "Expenses", ownerOnly: true },
  { to: "/admin/waste", label: "Waste", ownerOnly: true },
  { to: "/admin/reports", label: "Reports", ownerOnly: true },
];

const AdminLayout = ({ children, onSignOut }) => {
  const navigate = useNavigate();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (adminUser && adminUser.role === "owner") {
        setIsOwner(true);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("[AdminLayout] Sign out error:", err.message);
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
          {navItems
            .filter((item) => !item.ownerOnly || isOwner)
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-coffee text-white"
                      : item.highlight
                      ? "bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-200"
                      : item.ownerOnly
                      ? "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                      : "text-text-secondary hover:bg-surface-muted"
                  }`
                }
              >
                {item.label}
                {item.ownerOnly && <span className="ml-2 text-xs">👑</span>}
              </NavLink>
            ))}
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
