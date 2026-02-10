import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";

const statusOptions = ["new", "contacted", "confirmed", "cancelled"];

const AdminReservations = () => {
  const [filters, setFilters] = useState({ status: "", date: "" });
  const [reservations, setReservations] = useState([]);
  const [activeReservation, setActiveReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  const filteredReservations = useMemo(() => {
    if (!filters.status && !filters.date) {
      return reservations;
    }
    return reservations.filter((reservation) => {
      const matchesStatus = filters.status
        ? reservation.status === filters.status
        : true;
      const matchesDate = filters.date ? reservation.date === filters.date : true;
      return matchesStatus && matchesDate;
    });
  }, [filters, reservations]);

  const loadReservations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reservations")
      .select("*")
      .order("date", { ascending: true })
      .order("time", { ascending: true });
    setReservations(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleStatusChange = async (id, status) => {
    await supabase.from("reservations").update({ status }).eq("id", id);
    await loadReservations();
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Reservations</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Manage table reservation requests and update their status.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={filters.status}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, status: event.target.value }))
          }
          className="rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.date}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, date: event.target.value }))
          }
          className="rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setFilters({ status: "", date: "" })}
          className="rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
        >
          Reset
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <p className="text-sm text-text-muted">Loading reservations…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-text-muted">
              <tr>
                <th className="pb-4">Guest</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Guests</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="py-4">
                    <p className="font-semibold text-text-primary">
                      {reservation.full_name}
                    </p>
                    <p className="text-text-muted">{reservation.phone}</p>
                  </td>
                  <td className="py-4">
                    {reservation.date} · {reservation.time}
                  </td>
                  <td className="py-4">{reservation.guests}</td>
                  <td className="py-4">
                    <select
                      value={reservation.status}
                      onChange={(event) =>
                        handleStatusChange(reservation.id, event.target.value)
                      }
                      className="rounded-xl border border-coffee/15 px-3 py-1 text-xs"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4">
                    <button
                      type="button"
                      onClick={() => setActiveReservation(reservation)}
                      className="text-xs font-semibold text-coffee"
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {activeReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee/60 p-6">
          <div className="glass-card max-w-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  Reservation details
                </h2>
                <p className="text-sm text-text-muted">
                  ID: {activeReservation.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveReservation(null)}
                className="text-sm text-text-muted"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm text-text-secondary">
              <p>
                <strong>Name:</strong> {activeReservation.full_name}
              </p>
              <p>
                <strong>Phone:</strong> {activeReservation.phone}
              </p>
              {activeReservation.email && (
                <p>
                  <strong>Email:</strong> {activeReservation.email}
                </p>
              )}
              <p>
                <strong>Date:</strong> {activeReservation.date}
              </p>
              <p>
                <strong>Time:</strong> {activeReservation.time}
              </p>
              <p>
                <strong>Guests:</strong> {activeReservation.guests}
              </p>
              {activeReservation.notes && (
                <p>
                  <strong>Notes:</strong> {activeReservation.notes}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReservations;
