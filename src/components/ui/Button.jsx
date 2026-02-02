const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-ui-default px-5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50";

const variants = {
  primary:
    "bg-brand-primary text-white shadow-layered hover:-translate-y-0.5 hover:shadow-soft",
  secondary:
    "bg-white/80 text-neutral-slate border border-white/70 shadow-soft hover:-translate-y-0.5",
  ghost: "text-neutral-slate hover:bg-white/60"
};

const sizes = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3"
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <button
      type="button"
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
