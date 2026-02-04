import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

const Stagger = ({ children, className = "", animateOnView = true }) => {
  const motionProps = animateOnView
    ? { whileInView: "show", viewport: { once: true, amount: 0.2 } }
    : { animate: "show" };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = "" }) => {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
};

export default Stagger;
