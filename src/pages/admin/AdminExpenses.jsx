import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";
import { useGlobalLoading } from "../../context/LoadingContext.jsx";

const AdminExpenses = () => {
  const { startLoading, stopLoading } = useGlobalLoading();
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "operational",
    amount: "",
    description: "",
    expense_date: new Date().toISOString().split("T")[0],
    payment_method: "cash",
  });
  const [dateFilter, setDateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadExpenses();
  }, [dateFilter, categoryFilter]);

  const loadExpenses = async () => {
    startLoading();
    try {
      let query = supabase
        .from("expenses")
        .select("*")
        .eq("is_deleted", false)
        .order("expense_date", { ascending: false });

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }

      if (dateFilter !== "all") {
        const today = new Date();
        let startDate;
        if (dateFilter === "today") {
          startDate = today.toISOString().split("T")[0];
          query = query.eq("expense_date", startDate);
        } else if (dateFilter === "week") {
          const weekAgo = new Date(today.getTime());
          weekAgo.setDate(weekAgo.getDate() - 7);
          startDate = weekAgo.toISOString().split("T")[0];
          query = query.gte("expense_date", startDate);
        } else if (dateFilter === "month") {
          const monthAgo = new Date(today.getTime());
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          startDate = monthAgo.toISOString().split("T")[0];
          query = query.gte("expense_date", startDate);
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      setExpenses(data || []);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      stopLoading();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: expenseNumber } = await supabase.rpc("generate_expense_number");

      const expenseData = {
        ...formData,
        expense_number: expenseNumber,
        amount: parseFloat(formData.amount),
        created_by: user?.id,
      };

      const { error } = await supabase.from("expenses").insert([expenseData]);
      if (error) throw error;

      // Log action
      await supabase.from("audit_logs").insert([{
        action: "create_expense",
        table_name: "expenses",
        user_id: user?.id,
        user_email: user?.email,
        details: {
          expense_number: expenseNumber,
          category: formData.category,
          amount: formData.amount,
        },
      }]);

      setShowForm(false);
      setFormData({
        category: "operational",
        amount: "",
        description: "",
        expense_date: new Date().toISOString().split("T")[0],
        payment_method: "cash",
      });
      await loadExpenses();
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("Error creating expense");
    } finally {
      stopLoading();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    startLoading();
    try {
      await supabase
        .from("expenses")
        .update({ is_deleted: true })
        .eq("id", id);
      await loadExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Error deleting expense");
    } finally {
      stopLoading();
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount),
    0
  );

  const expensesByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary">
              Expense Management
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Track operational and administrative expenses
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-coffee px-4 py-2 text-white hover:bg-coffee/90"
          >
            + Add Expense
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>
          {Object.keys(expensesByCategory).map((category) => (
            <div key={category} className="glass-card">
              <p className="text-sm capitalize text-gray-600">{category}</p>
              <p className="mt-1 text-2xl font-bold">
                ${expensesByCategory[category].toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-card mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="all">All Categories</option>
                <option value="operational">Operational</option>
                <option value="administrative">Administrative</option>
                <option value="utilities">Utilities</option>
                <option value="maintenance">Maintenance</option>
                <option value="marketing">Marketing</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expense Form */}
        {showForm && (
          <div className="glass-card mb-6">
            <h2 className="mb-4 text-lg font-semibold">New Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  >
                    <option value="operational">Operational</option>
                    <option value="administrative">Administrative</option>
                    <option value="utilities">Utilities</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="marketing">Marketing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Expense Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.expense_date}
                    onChange={(e) =>
                      setFormData({ ...formData, expense_date: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Payment Method *</label>
                  <select
                    required
                    value={formData.payment_method}
                    onChange={(e) =>
                      setFormData({ ...formData, payment_method: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="transfer">Transfer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="Describe the expense..."
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
                  Create Expense
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Expenses List */}
        <div className="glass-card overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Number</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b">
                  <td className="p-3">
                    {new Date(expense.expense_date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {expense.expense_number}
                  </td>
                  <td className="p-3">
                    <span className="capitalize">{expense.category}</span>
                  </td>
                  <td className="p-3">{expense.description}</td>
                  <td className="p-3 capitalize">{expense.payment_method}</td>
                  <td className="p-3 text-right font-semibold">
                    ${parseFloat(expense.amount).toFixed(2)}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {expenses.length === 0 && (
            <div className="py-12 text-center text-gray-500">No expenses found</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminExpenses;
