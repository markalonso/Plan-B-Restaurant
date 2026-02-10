const GlassPanel = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-ui-default border border-coffee/8 bg-white/60 p-6 shadow-layered backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
