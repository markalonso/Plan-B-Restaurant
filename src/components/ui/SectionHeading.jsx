const SectionHeading = ({ eyebrow, title, subtitle, align = "left" }) => {
  const alignStyles = {
    left: "text-left items-start",
    center: "text-center items-center"
  };

  return (
    <div className={`flex flex-col gap-3 ${alignStyles[align]}`}>
      {eyebrow && (
        <span className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-accent-olive">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance font-serif text-3xl font-semibold text-neutral-slate md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-balance font-sans text-sm text-neutral-slate/70 md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
