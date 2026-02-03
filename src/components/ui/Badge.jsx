const variants = {
  info: "bg-brand-light/50 text-brand-deep",
  accent: "bg-white/70 text-brand-primary",
  subtle: "bg-slate-100 text-slate-600"
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
