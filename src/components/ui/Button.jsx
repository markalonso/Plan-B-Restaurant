const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-ui-default px-5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50";

const variants = {
  primary:
    "bg-slate-900 text-white shadow-layered hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-soft",
  secondary:
    "bg-white text-slate-900 border border-slate-200 shadow-soft hover:-translate-y-0.5 hover:bg-slate-50",
  outline:
    "border border-slate-300 text-slate-900 hover:-translate-y-0.5 hover:bg-slate-50",
  ghost: "text-slate-900 hover:bg-slate-100"
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
