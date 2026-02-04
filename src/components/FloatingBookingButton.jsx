import { useNavigate } from "react-router-dom";
import Button from "./ui/Button.jsx";

const FloatingBookingButton = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button onClick={() => navigate("/booking")}>Book a table</Button>
    </div>
  );
};

export default FloatingBookingButton;
