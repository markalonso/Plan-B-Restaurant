import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";

const statusOptions = ["new", "contacted", "confirmed", "cancelled"];

const AdminEvents = () => {
  const [filters, setFilters] = useState({ status: "", date: "" });
  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const filteredRequests = useMemo(() => {
    if (!filters.status && !filters.date) {
      return requests;
    }
    return requests.filter((request) => {
      const matchesStatus = filters.status
        ? request.status === filters.status
        : true;
      const matchesDate = filters.date ? request.date === filters.date : true;
      return matchesStatus && matchesDate;
    });
  }, [filters, requests]);

  const loadRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("event_requests")
      .select("*")
      .order("date", { ascending: true });
    setRequests(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    await supabase.from("event_requests").update({ status }).eq("id", id);
    await loadRequests();
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-semibold text-neutral-slate">Event Requests</h1>
        <p className="mt-2 text-sm text-neutral-slate/70">
          Track group and party requests with customized details.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={filters.status}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, status: event.target.value }))
          }
          className="rounded-lg border border-accent-sand/40 px-4 py-2 text-sm"
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
          className="rounded-lg border border-accent-sand/40 px-4 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setFilters({ status: "", date: "" })}
          className="rounded-lg border border-accent-sand/40 px-4 py-2 text-sm"
        >
          Reset
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <p className="text-sm text-neutral-slate/60">Loading event requests…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-neutral-slate/50">
              <tr>
                <th className="pb-4">Host</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Guests</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td className="py-4">
                    <p className="font-semibold text-neutral-slate">
                      {request.full_name}
                    </p>
                    <p className="text-neutral-slate/60">{request.phone}</p>
                  </td>
                  <td className="py-4">{request.date}</td>
                  <td className="py-4">{request.guests}</td>
                  <td className="py-4">
                    <select
                      value={request.status}
                      onChange={(event) =>
                        handleStatusChange(request.id, event.target.value)
                      }
                      className="rounded-xl border border-accent-sand/40 px-3 py-1 text-xs"
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
                      onClick={() => setActiveRequest(request)}
                      className="text-xs font-semibold text-brand-primary"
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

      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-primary/60 p-6">
          <div className="glass-card max-w-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-neutral-slate">
                  Event request details
                </h2>
                <p className="text-sm text-neutral-slate/60">ID: {activeRequest.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveRequest(null)}
                className="text-sm text-neutral-slate/60"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm text-neutral-slate/70">
              <p>
                <strong>Name:</strong> {activeRequest.full_name}
              </p>
              <p>
                <strong>Phone:</strong> {activeRequest.phone}
              </p>
              {activeRequest.email && (
                <p>
                  <strong>Email:</strong> {activeRequest.email}
                </p>
              )}
              <p>
                <strong>Date:</strong> {activeRequest.date}
              </p>
              <p>
                <strong>Guests:</strong> {activeRequest.guests}
              </p>
              {activeRequest.time_window && (
                <p>
                  <strong>Time window:</strong> {activeRequest.time_window}
                </p>
              )}
              {activeRequest.event_type && (
                <p>
                  <strong>Event type:</strong> {activeRequest.event_type}
                </p>
              )}
              {activeRequest.budget_range && (
                <p>
                  <strong>Budget:</strong> {activeRequest.budget_range}
                </p>
              )}
              {activeRequest.notes && (
                <p>
                  <strong>Notes:</strong> {activeRequest.notes}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminEvents;
