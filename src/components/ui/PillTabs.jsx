const PillTabs = ({ options, active, onChange }) => {
  return (
    <div className="inline-flex flex-wrap gap-2 rounded-xl bg-brand-light/50 p-1.5 shadow-soft">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-lg px-4 py-2 font-sans text-xs font-medium transition-all duration-normal ease-gentle md:text-sm ${
            active === option
              ? "bg-brand-primary text-white shadow-soft"
              : "text-neutral-slate/80 hover:bg-white/60"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default PillTabs;
