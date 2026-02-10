import { motion } from "framer-motion";
import { revealVariants, viewportConfig } from "../lib/motion.js";

const Reveal = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
