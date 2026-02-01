import { NavLink } from "react-router-dom";

const Events = () => {
  return (
    <div className="section-padding">
      <div className="mx-auto max-w-6xl space-y-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-skywash-600">
            Events
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900 md:text-5xl">
            Private dining & celebrations
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Plan B hosts birthdays, intimate gatherings, and stylish private
            dining with curated menus.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            "Private dining",
            "Birthdays",
            "Small parties"
          ].map((item) => (
            <div key={item} className="glass-card">
              <h3 className="text-lg font-semibold text-slate-900">{item}</h3>
              <p className="mt-2 text-sm text-slate-600">
                Tailored menus, calming ambience, and attentive service.
              </p>
            </div>
          ))}
        </div>

        <section className="glass-card flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Request an event
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Share your guest count and preferred date. We will follow up on
              WhatsApp with details.
            </p>
          </div>
          <NavLink
            to="/booking?type=group"
            className="rounded-full bg-skywash-600 px-6 py-3 text-sm font-semibold text-white"
          >
            Request an event
          </NavLink>
        </section>
      </div>
    </div>
  );
};

export default Events;
