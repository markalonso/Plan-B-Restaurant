import { useEffect, useMemo, useState, useCallback } from "react";
import Section from "../components/ui/Section.jsx";
import Button from "../components/ui/Button.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import GalleryGrid from "../components/gallery/GalleryGrid.jsx";
import Lightbox from "../components/gallery/Lightbox.jsx";
import { GallerySkeleton } from "../components/ui/Skeleton.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { resolveFirstExistingTable } from "../lib/adminTableResolver.js";
import { useGlobalLoading } from "../context/LoadingContext.jsx";

const normalizeValue = (value) => value.toLowerCase().trim();
const uncategorizedLabel = "uncategorized";
const getImageCategoryName = (image, categoryNameById) =>
  image.category || categoryNameById[image.category_id] || "";

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeImage, setActiveImage] = useState(null);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });
  const { startLoading, stopLoading } = useGlobalLoading();

  // Filter images based on active tab
  const categoryNameById = useMemo(() => {
    return categories.reduce((acc, category) => {
      if (category.id) {
        acc[category.id] = category.name;
      }
      return acc;
    }, {});
  }, [categories]);

  const filteredImages = useMemo(() => {
    if (normalizeValue(activeTab) === "all") {
      return images;
    }
    return images.filter(
      (item) =>
        normalizeValue(getImageCategoryName(item, categoryNameById)) ===
        normalizeValue(activeTab)
    );
  }, [activeTab, images, categoryNameById]);

  const publicCategories = useMemo(
    () => categories.filter((category) => normalizeValue(category.name || "") !== uncategorizedLabel),
    [categories]
  );

  const tabs = useMemo(() => ["All", ...publicCategories.map((category) => category.name)], [publicCategories]);

  // Load images from Supabase
  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      setStatus({ loading: true, error: "" });
      startLoading();

      try {
        const categoryTable = await resolveFirstExistingTable([
          "gallery_categories",
          "gallery_category"
        ]);

        const [imagesRes, categoriesRes] = await Promise.all([
          supabase
            .from("gallery_images")
            .select("*")
            .order("created_at", { ascending: false }),
          categoryTable
            ? supabase
                .from(categoryTable)
                .select("id, name, sort_order")
                .order("sort_order", { ascending: true })
                .order("name", { ascending: true })
            : Promise.resolve({ data: [], error: null })
        ]);

        if (!isMounted) return;

        if (imagesRes.error) {
          setStatus({ loading: false, error: imagesRes.error.message });
          return;
        }

        setImages(imagesRes.data ?? []);

        if (!categoriesRes.error && (categoriesRes.data?.length ?? 0) > 0) {
          setCategories(categoriesRes.data ?? []);
        } else {
          const names = [...new Set((imagesRes.data ?? []).map((image) => image.category).filter(Boolean))];
          setCategories(names.map((name, index) => ({ id: `${name}-${index}`, name, sort_order: index })));
        }

        setStatus({ loading: false, error: "" });
      } finally {
        stopLoading();
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  // Lightbox navigation handlers
  const handleImageClick = useCallback((image) => {
    setActiveImage(image);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setActiveImage(null);
  }, []);

  const handleNextImage = useCallback(() => {
    if (!activeImage || filteredImages.length <= 1) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === activeImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setActiveImage(filteredImages[nextIndex]);
  }, [activeImage, filteredImages]);

  const handlePrevImage = useCallback(() => {
    if (!activeImage || filteredImages.length <= 1) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === activeImage.id);
    const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setActiveImage(filteredImages[prevIndex]);
  }, [activeImage, filteredImages]);

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-coffee-dark/5 to-transparent pb-8 pt-24">
        <div className="mx-auto max-w-6xl px-6">
          <Section animate={false}>
            <SectionHeading
              eyebrow="Gallery"
              title="A glimpse inside Plan B"
              subtitle="Coastal vibes, clean design, and warm moments captured."
              align="center"
            />
          </Section>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 pb-16">
        {/* Filter Tabs */}
        <Section className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab}
                type="button"
                variant={activeTab === tab ? "primary" : "secondary"}
                size="sm"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </Section>

        {/* Gallery Grid */}
        <Section>
          {status.loading ? (
            <GallerySkeleton count={6} />
          ) : status.error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
              <p className="text-sm text-rose-600">{status.error}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <GalleryGrid
              images={filteredImages}
              onImageClick={handleImageClick}
            />
          )}
        </Section>

        {/* Image count */}
        {!status.loading && !status.error && filteredImages.length > 0 && (
          <p className="mt-8 text-center text-sm text-text-muted">
            Showing {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"}
            {activeTab !== "All" && ` in ${activeTab}`}
          </p>
        )}
      </div>

      {/* Lightbox */}
      {activeImage && (
        <Lightbox
          image={activeImage}
          images={filteredImages}
          onClose={handleCloseLightbox}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}
    </div>
  );
};

export default Gallery;
