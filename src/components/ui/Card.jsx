const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-ui-default border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
