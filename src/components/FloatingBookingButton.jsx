import { useNavigate } from "react-router-dom";

const FloatingBookingButton = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/booking")}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-skywash-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-skywash-700"
    >
      Book a table
    </button>
  );
};

export default FloatingBookingButton;
