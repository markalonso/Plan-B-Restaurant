const variants = {
  info: "bg-olive-light/50 text-coffee-dark",
  accent: "bg-white/70 text-coffee",
  subtle: "bg-surface-muted text-text-secondary"
};

const Badge = ({ children, variant = "info", className = "" }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        variants[variant]
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
