import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";

const AdminCustomers = () => {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredCustomers = useMemo(() => {
    if (!search) {
      return customers;
    }
    const query = search.toLowerCase();
    return customers.filter((customer) => {
      return (
        customer.full_name?.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query)
      );
    });
  }, [customers, search]);

  const loadCustomers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    setCustomers(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const updateCustomer = async (id, updates) => {
    await supabase.from("customers").update(updates).eq("id", id);
    await loadCustomers();
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Customers</h1>
        <p className="mt-2 text-sm text-slate-600">
          Keep notes and tags for guest preferences.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search by name or phone"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm md:w-80"
        />
        <button
          type="button"
          onClick={() => setSearch("")}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm"
        >
          Reset
        </button>
      </div>

      <div className="glass-card space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500">Loading customers…</p>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="rounded-2xl border border-slate-100 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {customer.full_name || "Guest"}
                  </p>
                  <p className="text-xs text-slate-500">{customer.phone}</p>
                  {customer.email && (
                    <p className="text-xs text-slate-500">{customer.email}</p>
                  )}
                </div>
                <div className="text-xs text-slate-400">
                  Joined {new Date(customer.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <textarea
                  rows="3"
                  defaultValue={customer.notes || ""}
                  onBlur={(event) =>
                    updateCustomer(customer.id, { notes: event.target.value })
                  }
                  placeholder="Notes"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  defaultValue={(customer.tags || []).join(", ")}
                  onBlur={(event) =>
                    updateCustomer(customer.id, {
                      tags: event.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                    })
                  }
                  placeholder="Tags (comma separated)"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
