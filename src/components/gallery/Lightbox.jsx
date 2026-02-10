import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { modalBackdropVariants, modalContentVariants } from "../../lib/motion.js";

/**
 * Lightbox component for viewing gallery images
 * - Click image opens overlay
 * - ESC closes
 * - Next/prev arrows for navigation
 * - Click outside closes
 * - Premium motion animations
 */
const Lightbox = ({ image, images, onClose, onNext, onPrev }) => {
  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          if (onNext) onNext();
          break;
        case "ArrowLeft":
          if (onPrev) onPrev();
          break;
        default:
          break;
      }
    },
    [onClose, onNext, onPrev]
  );

  // Add keyboard listener
  useEffect(() => {
    if (!image) return;
    
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown, image]);

  const currentIndex = images?.findIndex((img) => img.id === image?.id) ?? -1;
  const hasMultiple = images && images.length > 1;
  const hasPrev = hasMultiple && currentIndex > 0;
  const hasNext = hasMultiple && currentIndex < images.length - 1;

  const fallbackImage =
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80";

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-coffee-dark/90 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Close button */}
          <motion.button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition duration-200 hover:bg-white/20"
            aria-label="Close"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>

          {/* Previous button */}
          {hasPrev && (
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition duration-200 hover:bg-white/20"
              aria-label="Previous image"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </motion.button>
          )}

          {/* Next button */}
          {hasNext && (
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition duration-200 hover:bg-white/20"
              aria-label="Next image"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </motion.button>
          )}

          {/* Image container */}
          <motion.div
            className="relative z-0 max-h-[90vh] max-w-[90vw] px-4 md:max-w-4xl"
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <img
              src={image.image_url || fallbackImage}
              alt={image.alt_text || image.title || "Gallery image"}
              className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-xl"
              style={{ maxWidth: "100%" }}
            />

            {/* Caption */}
            {(image.title || image.description) && (
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {image.title && (
                  <p className="text-lg font-semibold text-white">{image.title}</p>
                )}
                {image.description && (
                  <p className="mt-1 text-sm text-white/70">{image.description}</p>
                )}
              </motion.div>
            )}

            {/* Image counter */}
            {hasMultiple && (
              <motion.p
                className="mt-2 text-center text-sm text-white/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentIndex + 1} / {images.length}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
