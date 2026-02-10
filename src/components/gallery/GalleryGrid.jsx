import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cardImageVariants, cardOverlayVariants, staggerItem, staggerContainer, viewportConfig } from "../../lib/motion.js";

/**
 * GalleryGrid component - Masonry-like grid with CSS columns
 * - Stable keys using image name/path
 * - No flicker on filter changes (grid stays mounted)
 * - Smooth loading with blur placeholder
 * - Premium hover animations
 */
const GalleryGrid = ({ images, onImageClick }) => {
  const fallbackImage =
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80";

  // Track which images have loaded for smooth transitions
  const [loadedImages, setLoadedImages] = useState(new Set());
  const gridRef = useRef(null);

  const handleImageLoad = (imageId) => {
    setLoadedImages((prev) => new Set([...prev, imageId]));
  };

  // Generate stable key from image path or id
  const getStableKey = (image) => {
    return image.id || image.image_url || `gallery-${image.title}`;
  };

  if (!images || images.length === 0) {
    return (
      <div className="rounded-2xl border border-coffee/10 bg-white/50 p-8 text-center">
        <p className="text-text-secondary">No images in this category yet.</p>
      </div>
    );
  }

  return (
    <motion.div
      ref={gridRef}
      className="columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {images.map((image) => {
        const key = getStableKey(image);
        const isLoaded = loadedImages.has(image.id);

        return (
          <motion.div
            key={key}
            className="group relative break-inside-avoid overflow-hidden rounded-2xl bg-surface-muted"
            variants={staggerItem}
          >
            <motion.button
              type="button"
              onClick={() => onImageClick(image)}
              className="relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-coffee/50"
              aria-label={`View ${image.title || "gallery image"}`}
              whileHover="hover"
              initial="initial"
            >
              {/* Blur placeholder */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-surface-muted to-coffee/5"
                initial={{ opacity: 1 }}
                animate={{ opacity: isLoaded ? 0 : 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Image with zoom on hover */}
              <motion.img
                src={image.image_url || fallbackImage}
                alt={image.alt_text || image.title || "Plan B gallery"}
                className="w-full"
                loading="lazy"
                onLoad={() => handleImageLoad(image.id)}
                style={{
                  aspectRatio: "auto",
                  objectFit: "cover"
                }}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ 
                  opacity: isLoaded ? 1 : 0, 
                  scale: isLoaded ? 1 : 1.02 
                }}
                transition={{ duration: 0.5 }}
                variants={cardImageVariants}
              />

              {/* Hover overlay with title */}
              <motion.div 
                className="absolute inset-0 flex items-end bg-gradient-to-t from-coffee-dark/80 via-coffee-dark/20 to-transparent"
                variants={cardOverlayVariants}
              >
                <div className="w-full p-4">
                  {image.title && (
                    <p className="text-sm font-semibold text-white">
                      {image.title}
                    </p>
                  )}
                  {image.category && (
                    <p className="mt-1 text-xs text-white/70">
                      {image.category}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Category badge */}
              {image.category && (
                <motion.div 
                  className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-coffee-dark backdrop-blur-sm"
                  variants={cardOverlayVariants}
                >
                  {image.category}
                </motion.div>
              )}
            </motion.button>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default GalleryGrid;
