const GlassPanel = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-ui-default border border-white/70 bg-white/50 p-6 shadow-layered backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
