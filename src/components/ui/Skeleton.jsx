import { motion } from "framer-motion";

/**
 * Skeleton component for loading states
 * Uses shimmer animation for premium loading feel
 */
const Skeleton = ({ 
  className = "", 
  variant = "rectangular",
  width,
  height 
}) => {
  const baseClasses = "overflow-hidden bg-gradient-to-r from-surface-muted via-white/50 to-surface-muted bg-[length:200%_100%]";
  
  const variantClasses = {
    rectangular: "rounded-lg",
    circular: "rounded-full",
    text: "rounded h-4",
    card: "rounded-2xl"
  };

  const style = {
    width: width || "100%",
    height: height || (variant === "text" ? "1rem" : "100%")
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      animate={{
        backgroundPosition: ["200% 0", "-200% 0"]
      }}
      transition={{
        duration: 1.5,
        ease: "linear",
        repeat: Infinity
      }}
    />
  );
};

/**
 * Card skeleton for menu/gallery loading
 */
export const CardSkeleton = ({ className = "" }) => {
  return (
    <div className={`rounded-2xl border border-coffee/10 bg-white/85 p-6 ${className}`}>
      <Skeleton variant="rectangular" height="176px" className="mb-4 rounded-2xl" />
      <Skeleton variant="text" width="60%" className="mb-2" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
};

/**
 * Gallery image skeleton
 */
export const GallerySkeleton = ({ count = 6 }) => {
  return (
    <div className="columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="break-inside-avoid">
          <Skeleton 
            variant="card" 
            height={`${150 + Math.random() * 100}px`} 
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
};

/**
 * Menu item skeleton
 */
export const MenuItemSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Skeleton;
