const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-ui-default border border-accent-sand/30 bg-white/90 p-6 shadow-soft backdrop-blur transition-all duration-normal ease-gentle ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
