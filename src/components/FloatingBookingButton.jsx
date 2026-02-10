import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getDuration, easings, prefersReducedMotion } from "../lib/motion.js";
import Button from "./ui/Button.jsx";

const FloatingBookingButton = () => {
  const navigate = useNavigate();
  const reducedMotion = prefersReducedMotion();

  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.8, y: reducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: reducedMotion ? 0.1 : 0.5,
        duration: getDuration("slow"),
        ease: easings.premium
      }}
    >
      <Button onClick={() => navigate("/booking")}>Book a table</Button>
    </motion.div>
  );
};

export default FloatingBookingButton;
