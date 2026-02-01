import { NavLink } from "react-router-dom";

const highlights = [
  {
    title: "Premium brunch",
    description: "Seasonal ingredients crafted into light, bright flavors."
  },
  {
    title: "Signature coffee",
    description: "Specialty beans with soft notes of caramel and citrus."
  },
  {
    title: "Evening ambience",
    description: "Golden lighting, calm music, and a refined coastal mood."
  }
];

const faqs = [
  {
    question: "Do you take walk-ins?",
    answer: "Yes, walk-ins are welcome based on availability."
  },
  {
    question: "Do you host private events?",
    answer: "Absolutely. We offer curated menus and flexible spaces."
  },
  {
    question: "Is there outdoor seating?",
    answer: "Yes, we have a breezy outdoor terrace."
  }
];

const Home = () => {
  return (
    <div className="bg-slate-50">
      <section className="section-padding">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-skywash-600">
              Plan B · Restaurant & Cafe
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              A clean, premium escape for bright mornings and calm nights.
            </h1>
            <p className="text-base text-slate-600 md:text-lg">
              Inspired by sky and sea tones, Plan B delivers modern comfort, refined
              flavors, and an atmosphere designed for slow, beautiful moments.
            </p>
            <div className="flex flex-wrap gap-4">
              <NavLink
                to="/booking"
                className="rounded-full bg-skywash-600 px-6 py-3 text-sm font-semibold text-white shadow-soft"
              >
                Book a table
              </NavLink>
              <NavLink
                to="/menu"
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700"
              >
                Explore menu
              </NavLink>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card flex min-h-[220px] items-end bg-gradient-to-br from-skywash-100 via-white to-skywash-200">
              <p className="text-sm font-semibold text-slate-700">
                Ocean breeze interiors
              </p>
            </div>
            <div className="glass-card flex min-h-[220px] items-end bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center">
              <p className="text-sm font-semibold text-white drop-shadow">
                Crafted plates
              </p>
            </div>
            <div className="glass-card flex min-h-[220px] items-end bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center sm:col-span-2">
              <p className="text-sm font-semibold text-white drop-shadow">
                Evening glow
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title">About Plan B</h2>
          <p className="mt-4 max-w-3xl text-base text-slate-600 md:text-lg">
            Plan B is a modern retreat along Hurghada’s Cornish Street. We pair
            minimalist design with warm hospitality, offering a menu that moves
            from sunrise brunch to late-night bites.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title">Highlights</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="glass-card">
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-slate-900">
              Opening Hours
            </h3>
            <p className="mt-3 text-slate-600">Daily 09:00 – 02:00</p>
          </div>
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-slate-900">Location</h3>
            <p className="mt-3 text-slate-600">
              Hurghada, Cornish Street, Gold Star Mall
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title">Reviews</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div key={item} className="glass-card">
                <p className="text-sm text-slate-600">
                  “Placeholder review for a beautiful guest experience. We keep
                  the space calm and refined.”
                </p>
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  Guest {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title">FAQ</h2>
          <div className="mt-6 grid gap-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="glass-card">
                <h3 className="text-base font-semibold text-slate-900">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
