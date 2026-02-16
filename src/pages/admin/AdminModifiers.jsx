import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";
import { useGlobalLoading } from "../../context/LoadingContext.jsx";

const AdminModifiers = () => {
  const { startLoading, stopLoading } = useGlobalLoading();
  const [menuItems, setMenuItems] = useState([]);
  const [modifiers, setModifiers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    is_available: true,
    sort_order: 0,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    startLoading();
    try {
      const [itemsRes, modifiersRes] = await Promise.all([
        supabase
          .from("menu_items")
          .select("*")
          .eq("is_deleted", false)
          .order("name"),
        supabase
          .from("modifiers")
          .select("*, menu_items(name)")
          .eq("is_deleted", false)
          .order("sort_order"),
      ]);

      setMenuItems(itemsRes.data || []);
      setModifiers(modifiersRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      stopLoading();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) {
      alert("Please select a menu item");
      return;
    }

    startLoading();
    try {
      const modifierData = {
        ...formData,
        menu_item_id: selectedItem,
        price: parseFloat(formData.price),
      };

      if (editingId) {
        await supabase
          .from("modifiers")
          .update(modifierData)
          .eq("id", editingId);
      } else {
        await supabase.from("modifiers").insert([modifierData]);
      }

      setShowForm(false);
      setFormData({ name: "", price: "", is_available: true, sort_order: 0 });
      setEditingId(null);
      setSelectedItem(null);
      await loadData();
    } catch (error) {
      console.error("Error saving modifier:", error);
      alert("Error saving modifier");
    } finally {
      stopLoading();
    }
  };

  const handleEdit = (modifier) => {
    setFormData({
      name: modifier.name,
      price: modifier.price,
      is_available: modifier.is_available,
      sort_order: modifier.sort_order,
    });
    setSelectedItem(modifier.menu_item_id);
    setEditingId(modifier.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this modifier?")) return;

    startLoading();
    try {
      await supabase
        .from("modifiers")
        .update({ is_deleted: true })
        .eq("id", id);
      await loadData();
    } catch (error) {
      console.error("Error deleting modifier:", error);
      alert("Error deleting modifier");
    } finally {
      stopLoading();
    }
  };

  const groupedModifiers = modifiers.reduce((acc, mod) => {
    const itemName = mod.menu_items?.name || "Unknown Item";
    if (!acc[itemName]) acc[itemName] = [];
    acc[itemName].push(mod);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary">
              Modifier Management
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Manage add-ons and options for menu items
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ name: "", price: "", is_available: true, sort_order: 0 });
            }}
            className="rounded-lg bg-coffee px-4 py-2 text-white hover:bg-coffee/90"
          >
            + Add Modifier
          </button>
        </div>

        {/* Modifier Form */}
        {showForm && (
          <div className="glass-card mb-6">
            <h2 className="mb-4 text-lg font-semibold">
              {editingId ? "Edit Modifier" : "New Modifier"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Menu Item *
                </label>
                <select
                  required
                  value={selectedItem || ""}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="">Select a menu item</option>
                  {menuItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Modifier Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Extra Cheese, Large Size"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Additional Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0.00"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={formData.is_available}
                  onChange={(e) =>
                    setFormData({ ...formData, is_available: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <label htmlFor="is_available" className="text-sm">
                  Available
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-coffee px-4 py-2 text-white hover:bg-coffee/90"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modifiers List */}
        <div className="space-y-6">
          {Object.keys(groupedModifiers).length === 0 ? (
            <div className="glass-card py-12 text-center text-gray-500">
              No modifiers yet. Add your first modifier above.
            </div>
          ) : (
            Object.keys(groupedModifiers).map((itemName) => (
              <div key={itemName} className="glass-card">
                <h3 className="mb-4 text-lg font-semibold">{itemName}</h3>
                <div className="space-y-2">
                  {groupedModifiers[itemName].map((modifier) => (
                    <div
                      key={modifier.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{modifier.name}</p>
                        <p className="text-sm text-gray-600">
                          +${parseFloat(modifier.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            modifier.is_available
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {modifier.is_available ? "Available" : "Unavailable"}
                        </span>
                        <button
                          onClick={() => handleEdit(modifier)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(modifier.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminModifiers;
