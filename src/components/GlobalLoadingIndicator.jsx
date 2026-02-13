import LoadingSpinner from "./ui/LoadingSpinner.jsx";

const GlobalLoadingIndicator = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[9999] rounded-full border border-coffee/15 bg-white/85 p-2 shadow-soft backdrop-blur">
      <LoadingSpinner size="sm" />
    </div>
  );
};

export default GlobalLoadingIndicator;
