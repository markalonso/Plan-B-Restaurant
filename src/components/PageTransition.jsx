import { motion } from "framer-motion";
import { pageTransition } from "../lib/motion.js";

/**
 * PageTransition component for route-level animations
 * Wraps page content with fade + rise animation
 * Respects prefers-reduced-motion via motion.js config
 */
const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
