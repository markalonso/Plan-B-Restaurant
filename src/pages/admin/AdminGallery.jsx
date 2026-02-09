import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";

const categories = ["Space", "Food", "Moments"];

const emptyForm = {
  category: "Space",
  title: "",
  description: "",
  alt_text: ""
};

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const loadImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus({ loading: false, error: error.message, success: "" });
      return;
    }

    setImages(data ?? []);
  };

  useEffect(() => {
    loadImages();
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

    const fileExt = file.name.split(".").pop();
    const filePath = `gallery/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setStatus({ loading: false, error: uploadError.message, success: "" });
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("gallery")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData?.publicUrl;

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

    setFormData(emptyForm);
    setFile(null);
    setStatus({
      loading: false,
      error: "",
      success: "Image added to the gallery."
    });
    await loadImages();
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
    await loadImages();
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

    await loadImages();
  };

  const sortedImages = useMemo(() => images, [images]);

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-semibold text-neutral-slate">Gallery</h1>
        <p className="mt-2 text-sm text-neutral-slate/70">
          Upload and manage the public gallery images.
        </p>
      </div>

      <form className="glass-card space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold text-neutral-slate">Add image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="w-full rounded-lg border border-accent-sand/40 px-4 py-2 text-sm"
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <select
            value={formData.category}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, category: event.target.value }))
            }
            className="w-full rounded-lg border border-accent-sand/40 px-4 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
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
            className="w-full rounded-lg border border-accent-sand/40 px-4 py-2 text-sm"
          />
        </div>
        <textarea
          rows="3"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, description: event.target.value }))
          }
          className="w-full rounded-lg border border-accent-sand/40 px-4 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Alt text (optional)"
          value={formData.alt_text}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, alt_text: event.target.value }))
          }
          className="w-full rounded-lg border border-accent-sand/40 px-4 py-2 text-sm"
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
          className="rounded-lg bg-brand-primary px-4 py-2 text-xs font-semibold text-white"
          disabled={status.loading}
        >
          {status.loading ? "Uploading..." : "Add to gallery"}
        </button>
      </form>

      <div className="glass-card space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-neutral-slate">
            Gallery images
          </h2>
          <span className="text-xs text-neutral-slate/60">
            {sortedImages.length} total
          </span>
        </div>
        {sortedImages.length === 0 ? (
          <p className="text-sm text-neutral-slate/60">
            No gallery images yet. Add the first one above.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedImages.map((image) => (
              <div
                key={image.id}
                className="rounded-lg border border-slate-100 p-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || image.title || "Gallery image"}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-neutral-slate">
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
                    <p className="text-xs text-neutral-slate/60">{image.category}</p>
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
                    className="w-full rounded-lg border border-accent-sand/40 px-3 py-2 text-xs"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
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
                    className="w-full rounded-lg border border-accent-sand/40 px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    defaultValue={image.alt_text || ""}
                    onBlur={(event) =>
                      handleUpdate(image.id, { alt_text: event.target.value })
                    }
                    placeholder="Alt text"
                    className="w-full rounded-lg border border-accent-sand/40 px-3 py-2 text-xs"
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
                    className="w-full rounded-lg border border-accent-sand/40 px-3 py-2 text-xs"
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
