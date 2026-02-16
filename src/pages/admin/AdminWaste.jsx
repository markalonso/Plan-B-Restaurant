import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";
import { useGlobalLoading } from "../../context/LoadingContext.jsx";

const AdminWaste = () => {
  const { startLoading, stopLoading } = useGlobalLoading();
  const [wasteLogs, setWasteLogs] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ingredient_id: "",
    quantity: "",
    reason: "spoiled",
    description: "",
    waste_date: new Date().toISOString().split("T")[0],
  });
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, [dateFilter]);

  const loadData = async () => {
    startLoading();
    try {
      let query = supabase
        .from("waste_logs")
        .select("*, ingredients(name, unit)")
        .eq("is_deleted", false)
        .order("waste_date", { ascending: false });

      if (dateFilter !== "all") {
        const today = new Date();
        let startDate;
        if (dateFilter === "today") {
          startDate = today.toISOString().split("T")[0];
          query = query.eq("waste_date", startDate);
        } else if (dateFilter === "week") {
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          startDate = weekAgo.toISOString().split("T")[0];
          query = query.gte("waste_date", startDate);
        } else if (dateFilter === "month") {
          const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
          startDate = monthAgo.toISOString().split("T")[0];
          query = query.gte("waste_date", startDate);
        }
      }

      const [wasteRes, ingredientsRes] = await Promise.all([
        query,
        supabase
          .from("ingredients")
          .select("*")
          .eq("is_deleted", false)
          .order("name"),
      ]);

      setWasteLogs(wasteRes.data || []);
      setIngredients(ingredientsRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      stopLoading();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const wasteData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        logged_by: user?.id,
      };

      const { error } = await supabase.from("waste_logs").insert([wasteData]);
      if (error) throw error;

      // Log action
      await supabase.from("audit_logs").insert([{
        action: "log_waste",
        table_name: "waste_logs",
        user_id: user?.id,
        user_email: user?.email,
        details: {
          ingredient_id: formData.ingredient_id,
          quantity: formData.quantity,
          reason: formData.reason,
        },
      }]);

      setShowForm(false);
      setFormData({
        ingredient_id: "",
        quantity: "",
        reason: "spoiled",
        description: "",
        waste_date: new Date().toISOString().split("T")[0],
      });
      await loadData();
      alert("Waste logged. Ingredient stock has been updated.");
    } catch (error) {
      console.error("Error logging waste:", error);
      alert("Error logging waste");
    } finally {
      stopLoading();
    }
  };

  // Calculate waste statistics
  const wasteByReason = wasteLogs.reduce((acc, log) => {
    acc[log.reason] = (acc[log.reason] || 0) + parseFloat(log.quantity);
    return acc;
  }, {});

  const wasteByIngredient = wasteLogs.reduce((acc, log) => {
    const name = log.ingredients?.name || "Unknown";
    if (!acc[name]) {
      acc[name] = { quantity: 0, unit: log.ingredients?.unit || "" };
    }
    acc[name].quantity += parseFloat(log.quantity);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary">
              Waste Management
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Track ingredient waste and spoilage
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-coffee px-4 py-2 text-white hover:bg-coffee/90"
          >
            + Log Waste
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="glass-card">
            <h3 className="mb-3 font-semibold">Waste by Reason</h3>
            <div className="space-y-2">
              {Object.keys(wasteByReason).map((reason) => (
                <div key={reason} className="flex justify-between">
                  <span className="capitalize">{reason}</span>
                  <span className="font-semibold">
                    {wasteByReason[reason].toFixed(2)}
                  </span>
                </div>
              ))}
              {Object.keys(wasteByReason).length === 0 && (
                <p className="text-sm text-gray-500">No waste logged yet</p>
              )}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="mb-3 font-semibold">Top Wasted Ingredients</h3>
            <div className="space-y-2">
              {Object.entries(wasteByIngredient)
                .sort((a, b) => b[1].quantity - a[1].quantity)
                .slice(0, 5)
                .map(([name, data]) => (
                  <div key={name} className="flex justify-between">
                    <span>{name}</span>
                    <span className="font-semibold">
                      {data.quantity.toFixed(2)} {data.unit}
                    </span>
                  </div>
                ))}
              {Object.keys(wasteByIngredient).length === 0 && (
                <p className="text-sm text-gray-500">No waste logged yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="glass-card mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Date Range
          </label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>

        {/* Waste Form */}
        {showForm && (
          <div className="glass-card mb-6">
            <h2 className="mb-4 text-lg font-semibold">Log Waste</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Ingredient *</label>
                  <select
                    required
                    value={formData.ingredient_id}
                    onChange={(e) =>
                      setFormData({ ...formData, ingredient_id: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  >
                    <option value="">Select ingredient</option>
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} ({ing.unit})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Quantity *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Reason *</label>
                  <select
                    required
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  >
                    <option value="spoiled">Spoiled</option>
                    <option value="expired">Expired</option>
                    <option value="damaged">Damaged</option>
                    <option value="overproduction">Overproduction</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Waste Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.waste_date}
                    onChange={(e) =>
                      setFormData({ ...formData, waste_date: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="Additional details..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-coffee px-4 py-2 text-white"
                >
                  Log Waste
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Waste Logs Table */}
        <div className="glass-card overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Ingredient</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {wasteLogs.map((log) => (
                <tr key={log.id} className="border-b">
                  <td className="p-3">
                    {new Date(log.waste_date).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-semibold">
                    {log.ingredients?.name || "Unknown"}
                  </td>
                  <td className="p-3 text-right">
                    {log.quantity} {log.ingredients?.unit}
                  </td>
                  <td className="p-3">
                    <span className="capitalize">{log.reason}</span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {log.description || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {wasteLogs.length === 0 && (
            <div className="py-12 text-center text-gray-500">No waste logs found</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminWaste;
