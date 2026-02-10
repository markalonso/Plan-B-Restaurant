/**
 * InfoList component - Displays a list of info items with icons
 * Clean and minimal design for contact/about pages
 */
const InfoList = ({ items, className = "" }) => {
  return (
    <ul className={`space-y-4 ${className}`}>
      {items.map((item) => (
        <li key={item.label || item.value} className="flex items-start gap-3">
          {item.icon && (
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-olive-light/50 text-coffee">
              {item.icon}
            </span>
          )}
          <div>
            {item.label && (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                {item.label}
              </p>
            )}
            <p className="text-text-primary">{item.value}</p>
            {item.subtext && (
              <p className="mt-0.5 text-sm text-text-secondary">{item.subtext}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default InfoList;
