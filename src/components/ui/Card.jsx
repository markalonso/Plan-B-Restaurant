const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-ui-default border border-coffee/10 bg-white/85 p-6 shadow-soft backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
