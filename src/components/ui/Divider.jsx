const Divider = ({ className = "" }) => {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent ${className}`}
    />
  );
};

export default Divider;
