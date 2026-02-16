import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";
import { useGlobalLoading } from "../../context/LoadingContext.jsx";

const AdminPurchases = () => {
  const { startLoading, stopLoading } = useGlobalLoading();
  const [purchases, setPurchases] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_contact: "",
    purchase_date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [purchaseItems, setPurchaseItems] = useState([
    { ingredient_id: "", quantity: "", unit_cost: "" },
  ]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    startLoading();
    try {
      const [purchasesRes, ingredientsRes] = await Promise.all([
        supabase
          .from("purchases")
          .select("*, purchase_items(*, ingredients(name, unit))")
          .eq("is_deleted", false)
          .order("created_at", { ascending: false }),
        supabase
          .from("ingredients")
          .select("*")
          .eq("is_deleted", false)
          .order("name"),
      ]);

      setPurchases(purchasesRes.data || []);
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
      const { data: purchaseNumber } = await supabase.rpc("generate_purchase_number");

      // Create purchase
      const { data: purchase, error: purchaseError } = await supabase
        .from("purchases")
        .insert([{
          ...formData,
          purchase_number: purchaseNumber,
          created_by: user?.id,
          status: "pending",
        }])
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Create purchase items
      const items = purchaseItems
        .filter((item) => item.ingredient_id && item.quantity && item.unit_cost)
        .map((item) => ({
          purchase_id: purchase.id,
          ingredient_id: item.ingredient_id,
          quantity: parseFloat(item.quantity),
          unit_cost: parseFloat(item.unit_cost),
          total_cost: parseFloat(item.quantity) * parseFloat(item.unit_cost),
        }));

      if (items.length > 0) {
        await supabase.from("purchase_items").insert(items);
      }

      // Log action
      await supabase.from("audit_logs").insert([{
        action: "create_purchase",
        table_name: "purchases",
        record_id: purchase.id,
        user_id: user?.id,
        user_email: user?.email,
        details: { purchase_number: purchaseNumber },
      }]);

      setShowForm(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Error creating purchase:", error);
      alert("Error creating purchase");
    } finally {
      stopLoading();
    }
  };

  const handleMarkReceived = async (purchaseId) => {
    if (!confirm("Mark this purchase as received? This will update ingredient stock.")) return;

    startLoading();
    try {
      const { error } = await supabase
        .from("purchases")
        .update({
          status: "received",
          received_date: new Date().toISOString().split("T")[0],
        })
        .eq("id", purchaseId);

      if (error) throw error;

      // Log action
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("audit_logs").insert([{
        action: "mark_purchase_received",
        table_name: "purchases",
        record_id: purchaseId,
        user_id: user?.id,
        user_email: user?.email,
      }]);

      await loadData();
      alert("Purchase marked as received. Ingredient stock updated.");
    } catch (error) {
      console.error("Error marking purchase:", error);
      alert("Error marking purchase as received");
    } finally {
      stopLoading();
    }
  };

  const addPurchaseItem = () => {
    setPurchaseItems([
      ...purchaseItems,
      { ingredient_id: "", quantity: "", unit_cost: "" },
    ]);
  };

  const removePurchaseItem = (index) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  const updatePurchaseItem = (index, field, value) => {
    const updated = [...purchaseItems];
    updated[index][field] = value;
    setPurchaseItems(updated);
  };

  const resetForm = () => {
    setFormData({
      supplier_name: "",
      supplier_contact: "",
      purchase_date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setPurchaseItems([{ ingredient_id: "", quantity: "", unit_cost: "" }]);
  };

  const calculateTotal = () => {
    return purchaseItems.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const cost = parseFloat(item.unit_cost) || 0;
      return sum + quantity * cost;
    }, 0);
  };

  return (
    <AdminLayout>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary">
              Purchase Management
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Track supplier orders and inventory purchases
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-coffee px-4 py-2 text-white hover:bg-coffee/90"
          >
            + New Purchase
          </button>
        </div>

        {/* Purchase Form */}
        {showForm && (
          <div className="glass-card mb-6">
            <h2 className="mb-4 text-lg font-semibold">New Purchase Order</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.supplier_name}
                    onChange={(e) =>
                      setFormData({ ...formData, supplier_name: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Supplier Contact</label>
                  <input
                    type="text"
                    value={formData.supplier_contact}
                    onChange={(e) =>
                      setFormData({ ...formData, supplier_contact: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Purchase Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.purchase_date}
                    onChange={(e) =>
                      setFormData({ ...formData, purchase_date: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={2}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Purchase Items */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium">Purchase Items *</label>
                  <button
                    type="button"
                    onClick={addPurchaseItem}
                    className="text-sm text-coffee hover:underline"
                  >
                    + Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {purchaseItems.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <select
                        required
                        value={item.ingredient_id}
                        onChange={(e) =>
                          updatePurchaseItem(index, "ingredient_id", e.target.value)
                        }
                        className="flex-1 rounded-lg border px-3 py-2"
                      >
                        <option value="">Select ingredient</option>
                        {ingredients.map((ing) => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name} ({ing.unit})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          updatePurchaseItem(index, "quantity", e.target.value)
                        }
                        className="w-24 rounded-lg border px-3 py-2"
                      />
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="Unit Cost"
                        value={item.unit_cost}
                        onChange={(e) =>
                          updatePurchaseItem(index, "unit_cost", e.target.value)
                        }
                        className="w-28 rounded-lg border px-3 py-2"
                      />
                      <span className="flex items-center px-2 font-semibold">
                        $
                        {((parseFloat(item.quantity) || 0) *
                          (parseFloat(item.unit_cost) || 0)).toFixed(2)}
                      </span>
                      {purchaseItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePurchaseItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-right font-semibold">
                  Total: ${calculateTotal().toFixed(2)}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-coffee px-4 py-2 text-white"
                >
                  Create Purchase
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Purchases List */}
        <div className="space-y-4">
          {purchases.length === 0 ? (
            <div className="glass-card py-12 text-center text-gray-500">
              No purchases yet
            </div>
          ) : (
            purchases.map((purchase) => (
              <div key={purchase.id} className="glass-card">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold">{purchase.purchase_number}</p>
                    <p className="text-sm text-gray-600">{purchase.supplier_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(purchase.purchase_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-coffee">
                      ${parseFloat(purchase.total_cost).toFixed(2)}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        purchase.status === "received"
                          ? "bg-green-100 text-green-800"
                          : purchase.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {purchase.status}
                    </span>
                  </div>
                </div>

                {/* Purchase Items */}
                <div className="mb-3 space-y-1 border-t pt-2">
                  {purchase.purchase_items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.ingredients?.name} - {item.quantity}{" "}
                        {item.ingredients?.unit}
                      </span>
                      <span>${parseFloat(item.total_cost).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {purchase.status === "pending" && (
                  <button
                    onClick={() => handleMarkReceived(purchase.id)}
                    className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Mark as Received
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPurchases;
