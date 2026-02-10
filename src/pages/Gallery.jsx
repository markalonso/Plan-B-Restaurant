import { useEffect, useMemo, useState, useCallback } from "react";
import Section from "../components/ui/Section.jsx";
import Button from "../components/ui/Button.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import GalleryGrid from "../components/gallery/GalleryGrid.jsx";
import Lightbox from "../components/gallery/Lightbox.jsx";
import { supabase } from "../lib/supabaseClient.js";

const tabs = ["All", "Space", "Food", "Moments"];

const normalizeValue = (value) => value.toLowerCase().trim();

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeImage, setActiveImage] = useState(null);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });

  // Filter images based on active tab
  const filteredImages = useMemo(() => {
    if (normalizeValue(activeTab) === "all") {
      return images;
    }
    return images.filter(
      (item) => normalizeValue(item.category || "") === normalizeValue(activeTab)
    );
  }, [activeTab, images]);

  // Load images from Supabase
  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      setStatus({ loading: true, error: "" });

      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        setStatus({ loading: false, error: error.message });
        return;
      }

      setImages(data ?? []);
      setStatus({ loading: false, error: "" });
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
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="space-y-3 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-coffee/30 border-t-coffee" />
                <p className="text-sm text-text-muted">Loading gallery...</p>
              </div>
            </div>
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
