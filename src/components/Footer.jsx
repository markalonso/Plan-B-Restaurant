const Footer = () => {
  return (
    <footer className="border-t border-accent-sand/30 bg-white/80">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 font-sans text-sm text-neutral-slate/70 md:grid-cols-3">
        <div>
          <p className="font-serif text-base font-semibold text-neutral-slate">Plan B</p>
          <p className="mt-2">Premium restaurant & cafe in Hurghada.</p>
        </div>
        <div>
          <p className="font-medium text-neutral-slate">Hours</p>
          <p className="mt-2">Daily 09:00 – 02:00</p>
        </div>
        <div>
          <p className="font-medium text-neutral-slate">Location</p>
          <p className="mt-2">Hurghada, Cornish Street, Gold Star Mall</p>
          <a
            className="mt-3 inline-flex items-center gap-2 text-brand-primary transition-all duration-normal hover:text-accent-caramel"
            href="https://wa.me/201005260787"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp +20 100 526 0787
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
