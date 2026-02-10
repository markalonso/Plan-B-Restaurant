import { motion } from "framer-motion";
import { buttonGlowVariants } from "../../lib/motion.js";

// Base styles for all buttons
const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-ui-default px-5 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary";

const variants = {
  primary:
    "bg-coffee text-white shadow-soft hover:bg-coffee-dark btn-sheen",
  secondary:
    "bg-white text-text-primary border border-coffee/15 shadow-soft hover:bg-surface-muted",
  outline:
    "border border-coffee/20 text-text-primary hover:bg-surface-muted",
  ghost: "text-text-primary hover:bg-surface-muted",
  "ghost-light": "text-white hover:bg-white/10 border border-white/30"
};

const sizes = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3"
};

// Loading spinner component
const LoadingSpinner = () => (
  <svg
    className="h-4 w-4 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  loading = false,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type="button"
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${
        isDisabled ? "cursor-not-allowed opacity-60" : ""
      }`}
      variants={buttonGlowVariants}
      initial="initial"
      whileHover={isDisabled ? undefined : "hover"}
      whileTap={isDisabled ? undefined : "tap"}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
