import { useEffect, useCallback } from "react";

/**
 * Lightbox component for viewing gallery images
 * - Click image opens overlay
 * - ESC closes
 * - Next/prev arrows for navigation
 * - Click outside closes
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
    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!image) return null;

  const currentIndex = images?.findIndex((img) => img.id === image.id) ?? -1;
  const hasMultiple = images && images.length > 1;
  const hasPrev = hasMultiple && currentIndex > 0;
  const hasNext = hasMultiple && currentIndex < images.length - 1;

  const fallbackImage =
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-coffee-dark/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Backdrop - click to close */}
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close lightbox"
      />

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition duration-200 hover:bg-white/20"
        aria-label="Close"
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
      </button>

      {/* Previous button */}
      {hasPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition duration-200 hover:bg-white/20"
          aria-label="Previous image"
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
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition duration-200 hover:bg-white/20"
          aria-label="Next image"
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
        </button>
      )}

      {/* Image container */}
      <div className="relative z-0 max-h-[90vh] max-w-[90vw] px-4 md:max-w-4xl">
        <img
          src={image.image_url || fallbackImage}
          alt={image.alt_text || image.title || "Gallery image"}
          className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-xl"
          style={{ maxWidth: "100%" }}
        />

        {/* Caption */}
        {(image.title || image.description) && (
          <div className="mt-4 text-center">
            {image.title && (
              <p className="text-lg font-semibold text-white">{image.title}</p>
            )}
            {image.description && (
              <p className="mt-1 text-sm text-white/70">{image.description}</p>
            )}
          </div>
        )}

        {/* Image counter */}
        {hasMultiple && (
          <p className="mt-2 text-center text-sm text-white/50">
            {currentIndex + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
