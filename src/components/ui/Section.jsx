import { motion } from "framer-motion";
import { revealVariants, viewportConfig } from "../../lib/motion.js";

/**
 * Section component with optional fade-in animation on scroll
 * Uses Framer Motion for premium reveal animations
 */
const Section = ({
  children,
  className = "",
  animate = true,
  id,
  delay = 0
}) => {
  if (!animate) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      transition={{ delay }}
    >
      {children}
    </motion.section>
  );
};

export default Section;
