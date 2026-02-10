import { motion } from "framer-motion";
import { cardVariants } from "../../lib/motion.js";

const Card = ({ children, className = "", hoverable = true }) => {
  if (hoverable) {
    return (
      <motion.div
        className={`rounded-ui-default border border-coffee/10 bg-white/85 p-6 backdrop-blur ${className}`}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`rounded-ui-default border border-coffee/10 bg-white/85 p-6 shadow-soft backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
