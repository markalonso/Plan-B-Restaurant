import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";
import { uploadImageToGalleryBucket } from "../../lib/uploadImage.js";

const uncategorizedCategory = "Uncategorized";

const emptyForm = {
  category: uncategorizedCategory,
  title: "",
  description: "",
  alt_text: ""
};

const emptyCategoryForm = {
  name: "",
  sort_order: 0
};

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const loadData = async () => {
    const [imagesRes, categoriesRes] = await Promise.all([
      supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("gallery_categories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true })
    ]);

    if (imagesRes.error) {
      setStatus({ loading: false, error: imagesRes.error.message, success: "" });
      return;
    }

    if (categoriesRes.error) {
      setStatus({ loading: false, error: categoriesRes.error.message, success: "" });
      return;
    }

    const nextCategories = categoriesRes.data ?? [];

    setImages(imagesRes.data ?? []);
    setCategories(nextCategories);
    setFormData((prev) => ({
      ...prev,
      category:
        nextCategories.find((category) => category.name === prev.category)?.name ||
        nextCategories[0]?.name ||
        uncategorizedCategory
    }));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    if (!file) {
      setStatus({
        loading: false,
        error: "Please choose an image to upload.",
        success: ""
      });
      return;
    }

    try {
      const { publicUrl: imageUrl, filePath } = await uploadImageToGalleryBucket({
        file,
        folder: "gallery"
      });

      const { error: insertError } = await supabase.from("gallery_images").insert([
        {
          category: formData.category,
          title: formData.title || null,
          description: formData.description || null,
          alt_text: formData.alt_text || null,
          image_url: imageUrl,
          storage_path: filePath
        }
      ]);

      if (insertError) {
        setStatus({ loading: false, error: insertError.message, success: "" });
        return;
      }
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: "" });
      return;
    }

    setFormData((prev) => ({ ...emptyForm, category: prev.category }));
    setFile(null);
    setStatus({
      loading: false,
      error: "",
      success: "Image added to the gallery."
    });
    await loadData();
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();

    const normalizedName = categoryForm.name.trim();
    if (!normalizedName) {
      return;
    }

    const { error } = await supabase.from("gallery_categories").insert([
      {
        name: normalizedName,
        sort_order: Number(categoryForm.sort_order) || 0
      }
    ]);

    if (error) {
      setStatus({ loading: false, error: error.message, success: "" });
      return;
    }

    setCategoryForm(emptyCategoryForm);
    setStatus({ loading: false, error: "", success: "Category saved." });
    await loadData();
  };

  const handleCategoryDelete = async (categoryName) => {
    if (categoryName === uncategorizedCategory) {
      setStatus({
        loading: false,
        error: "Uncategorized cannot be deleted.",
        success: ""
      });
      return;
    }

    const confirmed = window.confirm(
      `Delete category \"${categoryName}\"? Existing images will move to ${uncategorizedCategory}.`
    );

    if (!confirmed) {
      return;
    }

    setStatus({ loading: true, error: "", success: "" });

    const { error: moveError } = await supabase
      .from("gallery_images")
      .update({ category: uncategorizedCategory })
      .eq("category", categoryName);

    if (moveError) {
      setStatus({ loading: false, error: moveError.message, success: "" });
      return;
    }

    const { error: deleteError } = await supabase
      .from("gallery_categories")
      .delete()
      .eq("name", categoryName);

    if (deleteError) {
      setStatus({ loading: false, error: deleteError.message, success: "" });
      return;
    }

    setStatus({
      loading: false,
      error: "",
      success: `Category \"${categoryName}\" deleted. Images moved to ${uncategorizedCategory}.`
    });
    await loadData();
  };

  const handleDelete = async (image) => {
    const confirmed = window.confirm("Delete this image from the gallery?");
    if (!confirmed) {
      return;
    }

    setStatus({ loading: true, error: "", success: "" });

    if (image.storage_path) {
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove([image.storage_path]);
      if (storageError) {
        setStatus({ loading: false, error: storageError.message, success: "" });
        return;
      }
    }

    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", image.id);

    if (error) {
      setStatus({ loading: false, error: error.message, success: "" });
      return;
    }

    setStatus({
      loading: false,
      error: "",
      success: "Image deleted."
    });
    await loadData();
  };

  const handleUpdate = async (id, updates) => {
    const { error } = await supabase
      .from("gallery_images")
      .update(updates)
      .eq("id", id);

    if (error) {
      setStatus({ loading: false, error: error.message, success: "" });
      return;
    }

    await loadData();
  };

  const sortedImages = useMemo(() => images, [images]);

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Gallery</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Upload and manage the public gallery images.
        </p>
      </div>

      <form className="glass-card space-y-4" onSubmit={handleCategorySubmit}>
        <h2 className="text-lg font-semibold text-text-primary">Gallery categories</h2>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_auto]">
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
        </div>

        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-2xl border border-coffee/10 px-3 py-2"
            >
              <span className="text-sm text-text-primary">{category.name}</span>
              <button
                type="button"
                onClick={() => handleCategoryDelete(category.name)}
                className="text-xs font-semibold text-rose-500"
                disabled={category.name === uncategorizedCategory}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </form>

      <form className="glass-card space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold text-text-primary">Add image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <select
            value={formData.category}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, category: event.target.value }))
            }
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Title (optional)"
            value={formData.title}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, title: event.target.value }))
            }
            className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
          />
        </div>
        <textarea
          rows="3"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, description: event.target.value }))
          }
          className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Alt text (optional)"
          value={formData.alt_text}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, alt_text: event.target.value }))
          }
          className="w-full rounded-2xl border border-coffee/15 px-4 py-2 text-sm"
        />
        {status.error && (
          <p className="text-xs font-medium text-rose-500">{status.error}</p>
        )}
        {status.success && (
          <p className="text-xs font-medium text-emerald-600">
            {status.success}
          </p>
        )}
        <button
          type="submit"
          className="rounded-full bg-coffee px-4 py-2 text-xs font-semibold text-white"
          disabled={status.loading}
        >
          {status.loading ? "Uploading..." : "Add to gallery"}
        </button>
      </form>

      <div className="glass-card space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Gallery images
          </h2>
          <span className="text-xs text-text-muted">
            {sortedImages.length} total
          </span>
        </div>
        {sortedImages.length === 0 ? (
          <p className="text-sm text-text-muted">
            No gallery images yet. Add the first one above.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedImages.map((image) => (
              <div
                key={image.id}
                className="rounded-2xl border border-coffee/10 p-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || image.title || "Gallery image"}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-text-primary">
                        {image.title || "Untitled image"}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDelete(image)}
                        className="text-xs font-semibold text-rose-500"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-xs text-text-muted">{image.category}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <select
                    defaultValue={image.category}
                    onChange={(event) =>
                      handleUpdate(image.id, {
                        category: event.target.value
                      })
                    }
                    className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    defaultValue={image.title || ""}
                    onBlur={(event) =>
                      handleUpdate(image.id, { title: event.target.value })
                    }
                    placeholder="Title"
                    className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    defaultValue={image.alt_text || ""}
                    onBlur={(event) =>
                      handleUpdate(image.id, { alt_text: event.target.value })
                    }
                    placeholder="Alt text"
                    className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
                  />
                  <textarea
                    rows="2"
                    defaultValue={image.description || ""}
                    onBlur={(event) =>
                      handleUpdate(image.id, {
                        description: event.target.value
                      })
                    }
                    placeholder="Description"
                    className="w-full rounded-2xl border border-coffee/15 px-3 py-2 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
