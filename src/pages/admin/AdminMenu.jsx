import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";

const emptyCategory = { name: "", sort_order: 0 };
const emptyItem = {
  name: "",
  description: "",
  price: "",
  image_url: "",
  category_id: "",
  is_popular: false,
  is_available: true,
  sort_order: 0
};

const AdminMenu = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [itemForm, setItemForm] = useState(emptyItem);

  const loadMenu = async () => {
    const [categoryRes, itemRes] = await Promise.all([
      supabase
        .from("menu_categories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("menu_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
    ]);
    setCategories(categoryRes.data ?? []);
    setItems(itemRes.data ?? []);
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    await supabase.from("menu_categories").insert([categoryForm]);
    setCategoryForm(emptyCategory);
    await loadMenu();
  };

  const handleItemSubmit = async (event) => {
    event.preventDefault();
    await supabase.from("menu_items").insert([
      {
        ...itemForm,
        price: Number(itemForm.price)
      }
    ]);
    setItemForm(emptyItem);
    await loadMenu();
  };

  const handleItemUpdate = async (id, updates) => {
    await supabase.from("menu_items").update(updates).eq("id", id);
    await loadMenu();
  };

  const handleDelete = async (table, id) => {
    await supabase.from(table).delete().eq("id", id);
    await loadMenu();
  };

  const handleCategoryUpdate = async (id, updates) => {
    await supabase.from("menu_categories").update(updates).eq("id", id);
    await loadMenu();
  };

  const categoryName = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Menu</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage menu categories and items in real time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="glass-card space-y-3" onSubmit={handleCategorySubmit}>
          <h2 className="text-lg font-semibold text-slate-900">
            Add category
          </h2>
          <input
            type="text"
            placeholder="Category name"
            value={categoryForm.name}
            onChange={(event) =>
              setCategoryForm((prev) => ({ ...prev, name: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
            required
          />
          <input
            type="number"
            placeholder="Sort order"
            value={categoryForm.sort_order}
            onChange={(event) =>
              setCategoryForm((prev) => ({
                ...prev,
                sort_order: Number(event.target.value)
              }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white"
          >
            Save category
          </button>
        </form>

        <form className="glass-card space-y-3" onSubmit={handleItemSubmit}>
          <h2 className="text-lg font-semibold text-slate-900">Add item</h2>
          <input
            type="text"
            placeholder="Item name"
            value={itemForm.name}
            onChange={(event) =>
              setItemForm((prev) => ({ ...prev, name: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
            required
          />
          <textarea
            rows="3"
            placeholder="Description"
            value={itemForm.description}
            onChange={(event) =>
              setItemForm((prev) => ({
                ...prev,
                description: event.target.value
              }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={itemForm.price}
            onChange={(event) =>
              setItemForm((prev) => ({ ...prev, price: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={itemForm.image_url}
            onChange={(event) =>
              setItemForm((prev) => ({
                ...prev,
                image_url: event.target.value
              }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
          />
          <select
            value={itemForm.category_id}
            onChange={(event) =>
              setItemForm((prev) => ({
                ...prev,
                category_id: event.target.value
              }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={itemForm.is_popular}
                onChange={(event) =>
                  setItemForm((prev) => ({
                    ...prev,
                    is_popular: event.target.checked
                  }))
                }
              />
              Popular
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={itemForm.is_available}
                onChange={(event) =>
                  setItemForm((prev) => ({
                    ...prev,
                    is_available: event.target.checked
                  }))
                }
              />
              Available
            </label>
          </div>
          <input
            type="number"
            placeholder="Sort order"
            value={itemForm.sort_order}
            onChange={(event) =>
              setItemForm((prev) => ({
                ...prev,
                sort_order: Number(event.target.value)
              }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white"
          >
            Save item
          </button>
        </form>
      </div>

      <div className="glass-card space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Menu items</h2>
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-100 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {item.name}
                </p>
                <p className="text-xs text-slate-500">
                  {categoryName[item.category_id] || "Uncategorized"}
                </p>
                <p className="text-xs text-slate-500">EGP {item.price}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete("menu_items", item.id)}
                className="text-xs font-semibold text-rose-500"
              >
                Delete
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                type="text"
                defaultValue={item.name}
                onBlur={(event) =>
                  handleItemUpdate(item.id, { name: event.target.value })
                }
                placeholder="Name"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs"
              />
              <select
                defaultValue={item.category_id}
                onChange={(event) =>
                  handleItemUpdate(item.id, { category_id: event.target.value })
                }
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <textarea
                rows="2"
                defaultValue={item.description || ""}
                onBlur={(event) =>
                  handleItemUpdate(item.id, { description: event.target.value })
                }
                placeholder="Description"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs"
              />
              <input
                type="text"
                defaultValue={item.image_url || ""}
                onBlur={(event) =>
                  handleItemUpdate(item.id, {
                    image_url: event.target.value
                  })
                }
                placeholder="Image URL"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs"
              />
              <input
                type="number"
                step="0.01"
                defaultValue={item.price}
                onBlur={(event) =>
                  handleItemUpdate(item.id, {
                    price: Number(event.target.value)
                  })
                }
                placeholder="Price"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs"
              />
              <input
                type="number"
                defaultValue={item.sort_order}
                onBlur={(event) =>
                  handleItemUpdate(item.id, {
                    sort_order: Number(event.target.value)
                  })
                }
                placeholder="Sort order"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs"
              />
              <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={item.is_popular}
                    onChange={(event) =>
                      handleItemUpdate(item.id, {
                        is_popular: event.target.checked
                      })
                    }
                  />
                  Popular
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={item.is_available}
                    onChange={(event) =>
                      handleItemUpdate(item.id, {
                        is_available: event.target.checked
                      })
                    }
                  />
                  Available
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3"
          >
            <div className="grid gap-2 md:grid-cols-2">
              <input
                type="text"
                defaultValue={category.name}
                onBlur={(event) =>
                  handleCategoryUpdate(category.id, {
                    name: event.target.value
                  })
                }
                className="rounded-2xl border border-slate-200 px-3 py-2 text-xs"
              />
              <input
                type="number"
                defaultValue={category.sort_order}
                onBlur={(event) =>
                  handleCategoryUpdate(category.id, {
                    sort_order: Number(event.target.value)
                  })
                }
                className="rounded-2xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => handleDelete("menu_categories", category.id)}
              className="text-xs font-semibold text-rose-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminMenu;
