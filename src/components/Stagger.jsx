import { motion } from "framer-motion";
import { staggerContainer, staggerItem, viewportConfig } from "../lib/motion.js";

const Stagger = ({ children, className = "", animateOnView = true }) => {
  const motionProps = animateOnView
    ? { whileInView: "visible", viewport: viewportConfig }
    : { animate: "visible" };

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = "" }) => {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
};

export default Stagger;
