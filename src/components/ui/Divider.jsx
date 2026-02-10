const Divider = ({ className = "" }) => {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-coffee/15 to-transparent ${className}`}
    />
  );
};

export default Divider;
