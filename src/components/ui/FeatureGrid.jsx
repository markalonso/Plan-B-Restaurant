import { motion } from "framer-motion";
import { staggerContainer, staggerItem, cardImageVariants, cardOverlayVariants, viewportConfig } from "../../lib/motion.js";

/**
 * FeatureGrid component for displaying images in a responsive grid
 * - Mobile: horizontal scroll
 * - Desktop: grid layout
 * - Premium Framer Motion animations
 */
const FeatureGrid = ({
  items,
  columns = 3,
  className = "",
  imageClassName = "",
  scrollOnMobile = true
}) => {
  const gridColsClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4"
  };

  if (scrollOnMobile) {
    return (
      <motion.div
        className={className}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Mobile: horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:hidden">
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              className="flex-shrink-0"
              variants={staggerItem}
            >
              <div className="relative h-56 w-64 overflow-hidden rounded-2xl">
                <img
                  src={item.image}
                  alt={item.alt || item.title || ""}
                  className={`h-full w-full object-cover ${imageClassName}`}
                  loading="lazy"
                />
                {item.title && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-coffee-dark/70 to-transparent p-4">
                    <span className="text-sm font-semibold text-white">
                      {item.title}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className={`hidden gap-6 md:grid ${gridColsClass[columns] || gridColsClass[3]}`}>
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              className="group"
              variants={staggerItem}
              whileHover="hover"
              initial="initial"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <motion.img
                  src={item.image}
                  alt={item.alt || item.title || ""}
                  className={`h-64 w-full object-cover ${imageClassName}`}
                  loading="lazy"
                  variants={cardImageVariants}
                />
                {item.title && (
                  <motion.div 
                    className="absolute inset-0 flex items-end bg-gradient-to-t from-coffee-dark/70 to-transparent p-4"
                    variants={cardOverlayVariants}
                  >
                    <span className="text-sm font-semibold text-white">
                      {item.title}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`grid gap-6 ${gridColsClass[columns] || gridColsClass[3]} ${className}`}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id || index}
          className="group"
          variants={staggerItem}
          whileHover="hover"
          initial="initial"
        >
          <div className="relative overflow-hidden rounded-2xl">
            <motion.img
              src={item.image}
              alt={item.alt || item.title || ""}
              className={`h-64 w-full object-cover ${imageClassName}`}
              loading="lazy"
              variants={cardImageVariants}
            />
            {item.title && (
              <motion.div 
                className="absolute inset-0 flex items-end bg-gradient-to-t from-coffee-dark/70 to-transparent p-4"
                variants={cardOverlayVariants}
              >
                <span className="text-sm font-semibold text-white">
                  {item.title}
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeatureGrid;
