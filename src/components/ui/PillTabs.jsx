const PillTabs = ({ options, active, onChange }) => {
  return (
    <div className="inline-flex flex-wrap gap-2 rounded-full bg-white/60 p-1 shadow-soft">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition duration-200 md:text-sm ${
            active === option
              ? "bg-coffee text-white shadow-layered"
              : "text-text-secondary hover:bg-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default PillTabs;
