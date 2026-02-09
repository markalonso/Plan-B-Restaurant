const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-ui-default px-5 py-2.5 text-sm font-sans font-medium transition-all duration-normal ease-gentle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40";

const variants = {
  primary:
    "bg-brand-primary text-white shadow-soft hover:-translate-y-0.5 hover:shadow-hover",
  secondary:
    "bg-white text-neutral-slate border border-accent-sand/50 shadow-soft hover:-translate-y-0.5 hover:bg-brand-light/50",
  outline:
    "border border-accent-sand text-neutral-slate hover:-translate-y-0.5 hover:bg-brand-light/30",
  ghost: "text-neutral-slate hover:bg-brand-light/50"
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
