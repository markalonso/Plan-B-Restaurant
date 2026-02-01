import { useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1100&q=80"
];

const Gallery = () => {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-skywash-600">
            Gallery
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900 md:text-5xl">
            A glimpse inside Plan B
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Soft light, warm textures, and clean lines for every occasion.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className="group relative overflow-hidden rounded-3xl"
            >
              <img
                src={image}
                alt={`Plan B gallery ${index + 1}`}
                className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/10 opacity-0 transition group-hover:opacity-100" />
            </button>
          ))}
        </div>

        {activeImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-6">
            <button
              type="button"
              className="absolute inset-0"
              onClick={() => setActiveImage(null)}
              aria-label="Close"
            />
            <img
              src={activeImage}
              alt="Selected"
              className="relative max-h-[85vh] w-full max-w-4xl rounded-3xl object-cover shadow-soft"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
