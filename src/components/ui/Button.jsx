const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-ui-default px-5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee/40";

const variants = {
  primary:
    "bg-coffee text-white shadow-soft hover:-translate-y-0.5 hover:bg-coffee-dark hover:shadow-md",
  secondary:
    "bg-white text-text-primary border border-coffee/15 shadow-soft hover:-translate-y-0.5 hover:bg-surface-muted",
  outline:
    "border border-coffee/20 text-text-primary hover:-translate-y-0.5 hover:bg-surface-muted",
  ghost: "text-text-primary hover:bg-surface-muted"
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
