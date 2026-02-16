import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";
import { useGlobalLoading } from "../../context/LoadingContext.jsx";

const AdminInventory = () => {
  const { startLoading, stopLoading } = useGlobalLoading();
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [ingredientForm, setIngredientForm] = useState({
    name: "",
    unit: "kg",
    cost_per_unit: "",
    current_stock: "",
    reorder_level: "",
    supplier_name: "",
    supplier_contact: "",
    notes: "",
  });
  const [recipeForm, setRecipeForm] = useState({
    menu_item_id: "",
    ingredient_id: "",
    quantity_needed: "",
    notes: "",
  });
  const [editingIngredientId, setEditingIngredientId] = useState(null);
  const [viewMode, setViewMode] = useState("ingredients"); // ingredients | recipes

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    startLoading();
    try {
      const [ingredientsRes, recipesRes, itemsRes] = await Promise.all([
        supabase
          .from("ingredients")
          .select("*")
          .eq("is_deleted", false)
          .order("name"),
        supabase
          .from("recipes")
          .select("*, menu_items(name), ingredients(name, unit)")
          .eq("is_deleted", false),
        supabase
          .from("menu_items")
          .select("*")
          .eq("is_deleted", false)
          .order("name"),
      ]);

      setIngredients(ingredientsRes.data || []);
      setRecipes(recipesRes.data || []);
      setMenuItems(itemsRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      stopLoading();
    }
  };

  const handleIngredientSubmit = async (e) => {
    e.preventDefault();
    startLoading();
    try {
      const data = {
        ...ingredientForm,
        cost_per_unit: parseFloat(ingredientForm.cost_per_unit),
        current_stock: parseFloat(ingredientForm.current_stock),
        reorder_level: parseFloat(ingredientForm.reorder_level),
      };

      if (editingIngredientId) {
        await supabase
          .from("ingredients")
          .update(data)
          .eq("id", editingIngredientId);
      } else {
        await supabase.from("ingredients").insert([data]);
      }

      setShowIngredientForm(false);
      setIngredientForm({
        name: "",
        unit: "kg",
        cost_per_unit: "",
        current_stock: "",
        reorder_level: "",
        supplier_name: "",
        supplier_contact: "",
        notes: "",
      });
      setEditingIngredientId(null);
      await loadData();
    } catch (error) {
      console.error("Error saving ingredient:", error);
      alert("Error saving ingredient");
    } finally {
      stopLoading();
    }
  };

  const handleRecipeSubmit = async (e) => {
    e.preventDefault();
    startLoading();
    try {
      const data = {
        ...recipeForm,
        quantity_needed: parseFloat(recipeForm.quantity_needed),
      };

      await supabase.from("recipes").insert([data]);

      setShowRecipeForm(false);
      setRecipeForm({
        menu_item_id: "",
        ingredient_id: "",
        quantity_needed: "",
        notes: "",
      });
      await loadData();
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Error saving recipe. This ingredient may already be linked to this item.");
    } finally {
      stopLoading();
    }
  };

  const handleDeleteIngredient = async (id) => {
    if (!confirm("Are you sure? This will affect all related recipes.")) return;

    startLoading();
    try {
      await supabase
        .from("ingredients")
        .update({ is_deleted: true })
        .eq("id", id);
      await loadData();
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      alert("Error deleting ingredient");
    } finally {
      stopLoading();
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (!confirm("Are you sure you want to delete this recipe link?")) return;

    startLoading();
    try {
      await supabase
        .from("recipes")
        .update({ is_deleted: true })
        .eq("id", id);
      await loadData();
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Error deleting recipe");
    } finally {
      stopLoading();
    }
  };

  const lowStockIngredients = ingredients.filter(
    (ing) => ing.current_stock <= ing.reorder_level
  );

  const groupedRecipes = recipes.reduce((acc, recipe) => {
    const itemName = recipe.menu_items?.name || "Unknown Item";
    if (!acc[itemName]) acc[itemName] = [];
    acc[itemName].push(recipe);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary">
              Inventory Management
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Manage ingredients, recipes, and stock levels
            </p>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockIngredients.length > 0 && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
            <p className="font-semibold">⚠️ Low Stock Alert</p>
            <p className="mt-1 text-sm">
              {lowStockIngredients.length} ingredient(s) need reordering:
            </p>
            <ul className="mt-2 list-inside list-disc text-sm">
              {lowStockIngredients.slice(0, 5).map((ing) => (
                <li key={ing.id}>
                  {ing.name} - {ing.current_stock} {ing.unit} (reorder at{" "}
                  {ing.reorder_level})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* View Mode Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setViewMode("ingredients")}
            className={`rounded-lg px-4 py-2 font-semibold ${
              viewMode === "ingredients"
                ? "bg-coffee text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Ingredients
          </button>
          <button
            onClick={() => setViewMode("recipes")}
            className={`rounded-lg px-4 py-2 font-semibold ${
              viewMode === "recipes"
                ? "bg-coffee text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Recipes
          </button>
        </div>

        {/* Ingredients View */}
        {viewMode === "ingredients" && (
          <>
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => {
                  setShowIngredientForm(true);
                  setEditingIngredientId(null);
                }}
                className="rounded-lg bg-coffee px-4 py-2 text-white hover:bg-coffee/90"
              >
                + Add Ingredient
              </button>
            </div>

            {showIngredientForm && (
              <div className="glass-card mb-6">
                <h2 className="mb-4 text-lg font-semibold">
                  {editingIngredientId ? "Edit Ingredient" : "New Ingredient"}
                </h2>
                <form onSubmit={handleIngredientSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Name *</label>
                      <input
                        type="text"
                        required
                        value={ingredientForm.name}
                        onChange={(e) =>
                          setIngredientForm({ ...ingredientForm, name: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Unit *</label>
                      <select
                        required
                        value={ingredientForm.unit}
                        onChange={(e) =>
                          setIngredientForm({ ...ingredientForm, unit: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="l">Liter (l)</option>
                        <option value="ml">Milliliter (ml)</option>
                        <option value="unit">Unit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Cost per Unit *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={ingredientForm.cost_per_unit}
                        onChange={(e) =>
                          setIngredientForm({
                            ...ingredientForm,
                            cost_per_unit: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Current Stock *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={ingredientForm.current_stock}
                        onChange={(e) =>
                          setIngredientForm({
                            ...ingredientForm,
                            current_stock: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Reorder Level *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={ingredientForm.reorder_level}
                        onChange={(e) =>
                          setIngredientForm({
                            ...ingredientForm,
                            reorder_level: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Supplier Name
                      </label>
                      <input
                        type="text"
                        value={ingredientForm.supplier_name}
                        onChange={(e) =>
                          setIngredientForm({
                            ...ingredientForm,
                            supplier_name: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Supplier Contact
                      </label>
                      <input
                        type="text"
                        value={ingredientForm.supplier_contact}
                        onChange={(e) =>
                          setIngredientForm({
                            ...ingredientForm,
                            supplier_contact: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Notes</label>
                    <textarea
                      value={ingredientForm.notes}
                      onChange={(e) =>
                        setIngredientForm({ ...ingredientForm, notes: e.target.value })
                      }
                      rows={2}
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowIngredientForm(false);
                        setEditingIngredientId(null);
                      }}
                      className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-coffee px-4 py-2 text-white"
                    >
                      {editingIngredientId ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Ingredients Table */}
            <div className="glass-card overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Unit</th>
                    <th className="p-3 text-right">Stock</th>
                    <th className="p-3 text-right">Reorder Level</th>
                    <th className="p-3 text-right">Cost/Unit</th>
                    <th className="p-3 text-left">Supplier</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ing) => (
                    <tr key={ing.id} className="border-b">
                      <td className="p-3 font-semibold">{ing.name}</td>
                      <td className="p-3">{ing.unit}</td>
                      <td
                        className={`p-3 text-right ${
                          ing.current_stock <= ing.reorder_level
                            ? "font-semibold text-red-600"
                            : ""
                        }`}
                      >
                        {ing.current_stock}
                      </td>
                      <td className="p-3 text-right">{ing.reorder_level}</td>
                      <td className="p-3 text-right">
                        ${parseFloat(ing.cost_per_unit).toFixed(2)}
                      </td>
                      <td className="p-3">{ing.supplier_name || "-"}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setIngredientForm(ing);
                            setEditingIngredientId(ing.id);
                            setShowIngredientForm(true);
                          }}
                          className="mr-2 text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteIngredient(ing.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ingredients.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  No ingredients yet
                </div>
              )}
            </div>
          </>
        )}

        {/* Recipes View */}
        {viewMode === "recipes" && (
          <>
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => setShowRecipeForm(true)}
                className="rounded-lg bg-coffee px-4 py-2 text-white hover:bg-coffee/90"
              >
                + Link Ingredient to Menu Item
              </button>
            </div>

            {showRecipeForm && (
              <div className="glass-card mb-6">
                <h2 className="mb-4 text-lg font-semibold">New Recipe Link</h2>
                <form onSubmit={handleRecipeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Menu Item *</label>
                    <select
                      required
                      value={recipeForm.menu_item_id}
                      onChange={(e) =>
                        setRecipeForm({ ...recipeForm, menu_item_id: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    >
                      <option value="">Select menu item</option>
                      {menuItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Ingredient *</label>
                    <select
                      required
                      value={recipeForm.ingredient_id}
                      onChange={(e) =>
                        setRecipeForm({ ...recipeForm, ingredient_id: e.target.value })
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
                    <label className="block text-sm font-medium">
                      Quantity Needed *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={recipeForm.quantity_needed}
                      onChange={(e) =>
                        setRecipeForm({
                          ...recipeForm,
                          quantity_needed: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRecipeForm(false)}
                      className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-coffee px-4 py-2 text-white"
                    >
                      Link
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Recipes List */}
            <div className="space-y-6">
              {Object.keys(groupedRecipes).length === 0 ? (
                <div className="glass-card py-12 text-center text-gray-500">
                  No recipes yet. Link ingredients to menu items above.
                </div>
              ) : (
                Object.keys(groupedRecipes).map((itemName) => (
                  <div key={itemName} className="glass-card">
                    <h3 className="mb-4 text-lg font-semibold">{itemName}</h3>
                    <div className="space-y-2">
                      {groupedRecipes[itemName].map((recipe) => (
                        <div
                          key={recipe.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <p className="font-semibold">
                              {recipe.ingredients?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {recipe.quantity_needed} {recipe.ingredients?.unit}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteRecipe(recipe.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;
