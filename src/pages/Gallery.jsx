import { useEffect, useMemo, useState } from "react";
import Reveal from "../components/Reveal.jsx";
import Stagger, { StaggerItem } from "../components/Stagger.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import { supabase } from "../lib/supabaseClient.js";

const tabs = ["All", "Space", "Food", "Moments"];

const normalizeValue = (value) => value.toLowerCase().trim();
const fallbackImage =
  "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80";

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeImage, setActiveImage] = useState(null);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });

  const filteredImages = useMemo(() => {
    if (normalizeValue(activeTab) === "all") {
      return images;
    }
    return images.filter(
      (item) => normalizeValue(item.category) === normalizeValue(activeTab)
    );
  }, [activeTab, images]);

  useEffect(() => {
    let isMounted = true;
    const loadImages = async () => {
      setStatus({ loading: true, error: "" });
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) {
        return;
      }

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

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-6xl space-y-8">
        <Reveal>
          <SectionHeading
            eyebrow="GALLERY"
            title="A glimpse inside Plan B"
            subtitle="Clean lines, warm light, and calm nights."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab}
                type="button"
                variant={activeTab === tab ? "primary" : "secondary"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="transition duration-200 hover:-translate-y-0.5"
              >
                {tab}
              </Button>
            ))}
          </div>
        </Reveal>

        {status.loading ? (
          <Card>
            <p className="text-sm text-text-secondary">Loading gallery…</p>
          </Card>
        ) : status.error ? (
          <Card>
            <p className="text-sm text-rose-500">{status.error}</p>
          </Card>
        ) : filteredImages.length === 0 ? (
          <Card>
            <p className="text-sm text-text-secondary">
              No images yet for this category.
            </p>
          </Card>
        ) : (
          <Stagger animateOnView={false}>
            <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
              {filteredImages.map((item) => (
                <StaggerItem key={item.id}>
                  <Card className="group break-inside-avoid overflow-hidden p-0">
                    <button
                      type="button"
                      onClick={() => setActiveImage(item)}
                      className="relative block w-full"
                    >
                      <img
                        src={item.image_url || fallbackImage}
                        alt={item.alt_text || item.title || "Plan B gallery"}
                        className="w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-brand-deep/70 via-brand-deep/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                        <p className="p-4 text-sm font-semibold text-white">
                          {item.title || item.description || "Plan B moments"}
                        </p>
                      </div>
                    </button>
                  </Card>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        )}
      </div>

      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee-dark/80 p-6">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setActiveImage(null)}
            aria-label="Close"
          />
          <div className="relative max-w-4xl">
            <img
              src={activeImage.image_url || fallbackImage}
              alt={activeImage.alt_text || activeImage.title || "Plan B gallery"}
              className="max-h-[85vh] w-full rounded-3xl object-cover shadow-layered"
            />
            <p className="mt-4 text-center text-sm text-white/80">
              {activeImage.title || activeImage.description || "Plan B moments"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
