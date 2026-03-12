import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "./Icons";

const BackButton = ({ fallback = "/", label = "Back" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallback);
  };

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      onClick={handleBack}
      type="button"
    >
      <ChevronLeft size={16} />
      {label}
    </button>
  );
};

export default BackButton;
