import { useMemo, useState } from "react";
import Reveal from "../components/Reveal.jsx";
import Stagger, { StaggerItem } from "../components/Stagger.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";

const tabs = ["All", "Space", "Food", "Moments"];

const galleryItems = [
  {
    id: 1,
    category: "Space",
    caption: "Evening glow",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    category: "Food",
    caption: "Comfort plates",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    category: "Moments",
    caption: "Late-night calm",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    category: "Space",
    caption: "Soft interiors",
    image:
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    category: "Food",
    caption: "Signature bites",
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 6,
    category: "Moments",
    caption: "Golden hour",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 7,
    category: "Space",
    caption: "Quiet corners",
    image:
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 8,
    category: "Food",
    caption: "Fresh plates",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 9,
    category: "Moments",
    caption: "Soft gatherings",
    image:
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 10,
    category: "Space",
    caption: "Clean lines",
    image:
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1100&q=80"
  },
  {
    id: 11,
    category: "Food",
    caption: "Warm plates",
    image:
      "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 12,
    category: "Moments",
    caption: "Night rhythm",
    image:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80"
  }
];

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeImage, setActiveImage] = useState(null);

  const filteredItems = useMemo(() => {
    if (activeTab === "All") {
      return galleryItems;
    }
    return galleryItems.filter((item) => item.category === activeTab);
  }, [activeTab]);

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
              >
                {tab}
              </Button>
            ))}
          </div>
        </Reveal>

        <Stagger>
          <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
            {filteredItems.map((item) => (
              <StaggerItem key={item.id}>
                <Card className="group break-inside-avoid overflow-hidden p-0">
                  <button
                    type="button"
                    onClick={() => setActiveImage(item)}
                    className="relative block w-full"
                  >
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-brand-deep/70 via-brand-deep/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                      <p className="p-4 text-sm font-semibold text-white">
                        {item.caption}
                      </p>
                    </div>
                  </button>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </div>

      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-deep/80 p-6">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setActiveImage(null)}
            aria-label="Close"
          />
          <div className="relative max-w-4xl">
            <img
              src={activeImage.image}
              alt={activeImage.caption}
              className="max-h-[85vh] w-full rounded-3xl object-cover shadow-layered"
            />
            <p className="mt-4 text-center text-sm text-white/80">
              {activeImage.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
