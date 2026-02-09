const GlassPanel = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-ui-default border border-accent-sand/25 bg-white/70 p-6 shadow-soft backdrop-blur transition-all duration-normal ease-gentle ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
