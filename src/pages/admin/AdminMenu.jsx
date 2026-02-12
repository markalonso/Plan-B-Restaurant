import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";
import { uploadImageToGalleryBucket } from "../../lib/uploadImage.js";
import { resolveFirstExistingTable } from "../../lib/adminTableResolver.js";

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
const emptyComfortPick = {
  name: "",
  description: "",
  price: "",
  image_url: "",
  sort_order: 0
};

const AdminMenu = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [comfortPicks, setComfortPicks] = useState([]);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [itemForm, setItemForm] = useState(emptyItem);
  const [comfortForm, setComfortForm] = useState(emptyComfortPick);
  const [itemFile, setItemFile] = useState(null);
  const [comfortFile, setComfortFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [comfortSourceTable, setComfortSourceTable] = useState("menu_comfort_picks");

  const loadMenu = async () => {
    const resolvedComfortTable = await resolveFirstExistingTable([
      "menu_comfort_picks",
      "comfort_picks",
      "home_comfort_picks"
    ]);

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

    if (resolvedComfortTable) {
      const { data } = await supabase
        .from(resolvedComfortTable)
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      setComfortPicks(data ?? []);
      setComfortSourceTable(resolvedComfortTable);
      return;
    }

    const fallbackComfort = (itemRes.data ?? []).filter((item) => item.is_popular);
    setComfortPicks(fallbackComfort);
    setComfortSourceTable("menu_items");
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

    let imageUrl = itemForm.image_url;

    if (itemFile) {
      const { publicUrl } = await uploadImageToGalleryBucket({
        file: itemFile,
        folder: "menu"
      });
      imageUrl = publicUrl;
    }

    await supabase.from("menu_items").insert([
      {
        ...itemForm,
        image_url: imageUrl,
        price: Number(itemForm.price)
      }
    ]);
    setItemForm(emptyItem);
    setItemFile(null);
    await loadMenu();
  };

  const handleComfortSubmit = async (event) => {
    event.preventDefault();

    let imageUrl = comfortForm.image_url;

    if (comfortFile) {
      const { publicUrl } = await uploadImageToGalleryBucket({
        file: comfortFile,
        folder: "menu"
      });
      imageUrl = publicUrl;
    }

    if (comfortSourceTable === "menu_items") {
      await supabase.from("menu_items").insert([
        {
          ...comfortForm,
          image_url: imageUrl,
          price: Number(comfortForm.price),
          is_popular: true,
          is_available: true,
          category_id: categories[0]?.id ?? null
        }
      ]);
    } else {
      await supabase.from(comfortSourceTable).insert([
        {
          ...comfortForm,
          image_url: imageUrl,
          price: Number(comfortForm.price)
        }
      ]);
    }

    setComfortForm(emptyComfortPick);
    setComfortFile(null);
    await loadMenu();
  };

  const handleItemUpdate = async (id, updates) => {
    await supabase.from("menu_items").update(updates).eq("id", id);
    await loadMenu();
  };

  const handleComfortUpdate = async (id, updates) => {
    if (comfortSourceTable === "menu_items") {
      await supabase
        .from("menu_items")
        .update({ ...updates, is_popular: true })
        .eq("id", id);
    } else {
      await supabase.from(comfortSourceTable).update(updates).eq("id", id);
    }
    await loadMenu();
  };

  const handleDelete = async (table, id) => {
    await supabase.from(table).delete().eq("id", id);
    await loadMenu();
  };

  const handleCategoryDelete = async (id) => {
    await supabase.from("menu_items").update({ category_id: null }).eq("category_id", id);
    await supabase.from("menu_categories").delete().eq("id", id);
    setStatusMessage("Category deleted. Existing items were moved to Uncategorized.");
    await loadMenu();
  };

  const handleCategoryUpdate = async (id, updates) => {
    await supabase.from("menu_categories").update(updates).eq("id", id);
    await loadMenu();
  };

  const uploadItemImage = async (id, file) => {
    if (!file) {
      return;
    }

    const { publicUrl } = await uploadImageToGalleryBucket({ file, folder: "menu" });
    await handleItemUpdate(id, { image_url: publicUrl });
  };

  const uploadComfortImage = async (id, file) => {
    if (!file) {
      return;
    }

    const { publicUrl } = await uploadImageToGalleryBucket({ file, folder: "menu" });
    await handleComfortUpdate(id, { image_url: publicUrl });
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
        <h1 className="text-3xl font-semibold text-text-primary">Menu</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Manage menu categories and items in real time.
        </p>
        {statusMessage && <p className="mt-2 text-xs text-text-secondary">{statusMessage}</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="glass-card space-y-3" onSubmit={handleCategorySubmit}>
          <h2 className="text-lg font-semibold text-text-primary">
            Add category
          </h2>
          <input
            type="text"
            placeholder="Category name"
            value={categoryForm.name}
            onChange={(event) =>
              setCategoryForm((prev) => ({ ...prev, name: event.target.value }))
            }
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
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
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-coffee px-4 py-2 text-xs font-semibold text-white"
          >
            Save category
          </button>
        </form>

        <form className="glass-card space-y-3" onSubmit={handleItemSubmit}>
          <h2 className="text-lg font-semibold text-text-primary">Add item</h2>
          <input
            type="text"
            placeholder="Item name"
            value={itemForm.name}
            onChange={(event) =>
              setItemForm((prev) => ({ ...prev, name: event.target.value }))
            }
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
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
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={itemForm.price}
            onChange={(event) =>
              setItemForm((prev) => ({ ...prev, price: event.target.value }))
            }
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
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
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setItemFile(event.target.files?.[0] || null)}
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
          />
          <select
            value={itemForm.category_id}
            onChange={(event) =>
              setItemForm((prev) => ({
                ...prev,
                category_id: event.target.value
              }))
            }
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
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
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-coffee px-4 py-2 text-xs font-semibold text-white"
          >
            Save item
          </button>
        </form>
      </div>

      <form className="glass-card space-y-3" onSubmit={handleComfortSubmit}>
        <h2 className="text-lg font-semibold text-text-primary">Add House Comfort Pick</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Title"
            value={comfortForm.name}
            onChange={(event) =>
              setComfortForm((prev) => ({ ...prev, name: event.target.value }))
            }
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={comfortForm.price}
            onChange={(event) =>
              setComfortForm((prev) => ({ ...prev, price: event.target.value }))
            }
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
            required
          />
          <textarea
            rows="2"
            placeholder="Description"
            value={comfortForm.description}
            onChange={(event) =>
              setComfortForm((prev) => ({ ...prev, description: event.target.value }))
            }
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={comfortForm.image_url}
            onChange={(event) =>
              setComfortForm((prev) => ({ ...prev, image_url: event.target.value }))
            }
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setComfortFile(event.target.files?.[0] || null)}
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Sort order"
            value={comfortForm.sort_order}
            onChange={(event) =>
              setComfortForm((prev) => ({
                ...prev,
                sort_order: Number(event.target.value)
              }))
            }
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-coffee px-4 py-2 text-xs font-semibold text-white"
        >
          Save comfort pick
        </button>
      </form>

      <div className="glass-card space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Menu items</h2>
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-coffee/10 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {item.name}
                </p>
                <p className="text-xs text-text-muted">
                  {categoryName[item.category_id] || "Uncategorized"}
                </p>
                <p className="text-xs text-text-muted">EGP {item.price}</p>
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
                className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
              />
              <select
                defaultValue={item.category_id}
                onChange={(event) =>
                  handleItemUpdate(item.id, { category_id: event.target.value })
                }
                className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
              >
                <option value="">Uncategorized</option>
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
                className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
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
                className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => uploadItemImage(item.id, event.target.files?.[0])}
                className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
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
                className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
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
                className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
              />
              <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
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
        <h2 className="text-lg font-semibold text-text-primary">House Comfort Picks</h2>
        {comfortPicks.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-coffee/10 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                <p className="text-xs text-text-muted">EGP {item.price}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(comfortSourceTable, item.id)}
                className="text-xs font-semibold text-rose-500"
              >
                Delete
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                type="text"
                defaultValue={item.name}
                onBlur={(event) => handleComfortUpdate(item.id, { name: event.target.value })}
                placeholder="Title"
                className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
              />
              <input
                type="number"
                step="0.01"
                defaultValue={item.price}
                onBlur={(event) =>
                  handleComfortUpdate(item.id, { price: Number(event.target.value) })
                }
                placeholder="Price"
                className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
              />
              <textarea
                rows="2"
                defaultValue={item.description || ""}
                onBlur={(event) =>
                  handleComfortUpdate(item.id, { description: event.target.value })
                }
                placeholder="Description"
                className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
              />
              <input
                type="text"
                defaultValue={item.image_url || ""}
                onBlur={(event) =>
                  handleComfortUpdate(item.id, { image_url: event.target.value })
                }
                placeholder="Image URL"
                className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => uploadComfortImage(item.id, event.target.files?.[0])}
                className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
              />
              <input
                type="number"
                defaultValue={item.sort_order}
                onBlur={(event) =>
                  handleComfortUpdate(item.id, { sort_order: Number(event.target.value) })
                }
                placeholder="Sort order"
                className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Categories</h2>
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-coffee/10 p-3"
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
                className="rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
              />
              <input
                type="number"
                defaultValue={category.sort_order}
                onBlur={(event) =>
                  handleCategoryUpdate(category.id, {
                    sort_order: Number(event.target.value)
                  })
                }
                className="rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => handleCategoryDelete(category.id)}
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
