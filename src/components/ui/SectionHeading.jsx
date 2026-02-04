const SectionHeading = ({ eyebrow, title, subtitle, align = "left" }) => {
  const alignStyles = {
    left: "text-left items-start",
    center: "text-center items-center"
  };

  return (
    <div className={`flex flex-col gap-3 ${alignStyles[align]}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-3xl font-semibold text-slate-900 md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-balance text-sm text-slate-600 md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
