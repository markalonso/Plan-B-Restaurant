import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";

const AdminOverview = () => {
  const [metrics, setMetrics] = useState({
    reservations: 0,
    events: 0,
    customers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      setLoading(true);
      const [reservations, events, customers] = await Promise.all([
        supabase
          .from("reservations")
          .select("id", { count: "exact", head: true })
          .eq("status", "new"),
        supabase
          .from("event_requests")
          .select("id", { count: "exact", head: true })
          .eq("status", "new"),
        supabase
          .from("customers")
          .select("id", { count: "exact", head: true })
      ]);

      if (isMounted) {
        setMetrics({
          reservations: reservations.count ?? 0,
          events: events.count ?? 0,
          customers: customers.count ?? 0
        });
        setLoading(false);
      }
    };

    loadMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Overview</h1>
        <p className="mt-2 text-sm text-slate-600">
          Live status of new requests and total customers.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {["New reservations", "New event requests", "Total customers"].map(
          (label, index) => {
            const values = [
              metrics.reservations,
              metrics.events,
              metrics.customers
            ];
            return (
              <div key={label} className="glass-card">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {loading ? "…" : values[index]}
                </p>
              </div>
            );
          }
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
