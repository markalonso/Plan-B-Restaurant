const variants = {
  info: "bg-brand-light text-brand-primary",
  accent: "bg-accent-caramel/20 text-accent-caramel",
  subtle: "bg-accent-sand/30 text-neutral-slate/70"
};

const Badge = ({ children, variant = "info", className = "" }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-sans text-xs font-medium ${
        variants[variant]
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
