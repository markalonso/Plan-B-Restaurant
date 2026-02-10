import { useNavigate } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import Stagger, { StaggerItem } from "../components/Stagger.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Divider from "../components/ui/Divider.jsx";
import GlassPanel from "../components/ui/GlassPanel.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";

const heroImages = [
  "https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80"
];

const signatureMoments = [
  {
    title: "Comfort favorites",
    subtitle: "Approachable plates, done right.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Coffee & drinks",
    subtitle: "From slow sips to late-night refresh.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Evening ambience",
    subtitle: "Music low. Conversation up.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Private moments",
    subtitle: "Birthdays and small celebrations, curated.",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80"
  }
];

const reviews = [
  {
    name: "Nadia",
    quote: "Soft lighting, easy vibe, and the food feels just right."
  },
  {
    name: "Omar",
    quote: "Perfect for late-night coffee and a calm conversation."
  },
  {
    name: "Layla",
    quote: "Clean, modern, and welcoming. The staff confirmed everything fast."
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-primary">
      <section className="section-padding">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <div className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-coffee">
                PLAN B · RESTAURANT & CAFE
              </span>
              <h1 className="text-balance text-4xl font-semibold text-text-primary md:text-5xl lg:text-6xl">
                Chill nights. Comfort food. Good company.
              </h1>
              <p className="text-balance text-base text-text-secondary md:text-lg">
                A modern spot on Hurghada's Cornish Street for calm evenings,
                signature plates, and an easy atmosphere.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => navigate("/booking")}>
                  Request a table
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/menu")}
                >
                  Explore menu
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-text-muted">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-coffee" />
                  Daily 09:00–02:00
                </span>
                <Divider className="hidden h-3 w-6 md:block" />
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-coffee" />
                  Cornish Street
                </span>
                <Divider className="hidden h-3 w-6 md:block" />
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-coffee" />
                  WhatsApp confirmation
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative grid gap-4 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-3xl">
                <img
                  src={heroImages[0]}
                  alt="Plan B interior"
                  className="h-56 w-full object-cover transition duration-500 group-hover:-translate-y-1"
                />
              </div>
              <div className="group relative overflow-hidden rounded-3xl">
                <img
                  src={heroImages[1]}
                  alt="Plan B plates"
                  className="h-56 w-full object-cover transition duration-500 group-hover:-translate-y-1"
                />
              </div>
              <div className="group relative overflow-hidden rounded-3xl sm:col-span-2">
                <img
                  src={heroImages[2]}
                  alt="Plan B night atmosphere"
                  className="h-60 w-full object-cover transition duration-500 group-hover:-translate-y-1"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-3xl border border-coffee/10" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1421622548261-c45bfe178854?auto=format&fit=crop&w=1800&q=80"
            alt="Night mood"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-coffee-dark/80" />
        </div>
        <div className="relative section-padding">
          <div className="mx-auto max-w-4xl text-center text-white">
            <Reveal>
              <h2 className="text-balance text-3xl font-semibold md:text-4xl">
                A calm glow after sunset.
              </h2>
              <p className="mt-3 text-sm text-white/80 md:text-base">
                Soft light, warm plates, and a space made for staying longer.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-6xl space-y-8">
          <Reveal>
            <SectionHeading
              eyebrow="Signature moments"
              title="Small rituals, memorable nights."
              subtitle="Every table has a story, every plate is intentional."
            />
          </Reveal>
          <Stagger className="grid gap-6 md:grid-cols-2">
            {signatureMoments.map((moment) => (
              <StaggerItem key={moment.title}>
                <Card className="group flex items-center gap-4 transition duration-200 hover:-translate-y-1 hover:shadow-layered">
                  <img
                    src={moment.image}
                    alt={moment.title}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="text-base font-semibold text-text-primary">
                      {moment.title}
                    </p>
                    <p className="text-sm text-text-secondary">{moment.subtitle}</p>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <Reveal>
            <GlassPanel className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80"
                alt="Slow mornings"
                className="h-52 w-full rounded-2xl object-cover"
              />
              <h3 className="text-xl font-semibold text-text-primary">
                Slow mornings
              </h3>
              <p className="text-sm text-text-secondary">
                Easy brunch, smooth coffee, and bright coastal light.
              </p>
            </GlassPanel>
          </Reveal>
          <Reveal delay={0.1}>
            <GlassPanel className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
                alt="Glowing nights"
                className="h-52 w-full rounded-2xl object-cover"
              />
              <h3 className="text-xl font-semibold text-text-primary">
                Glowing nights
              </h3>
              <p className="text-sm text-text-secondary">
                Dinner, drinks, and a relaxed rhythm — personally confirmed on
                WhatsApp.
              </p>
            </GlassPanel>
          </Reveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-6xl space-y-6">
          <Reveal>
            <SectionHeading
              eyebrow="Why Plan B"
              title="Simple, personal, comfortable."
              subtitle=""
            />
          </Reveal>
          <Stagger className="grid gap-4 md:grid-cols-3">
            {[
              "Every request is confirmed by our team — no stress.",
              "Comfort food and familiar flavors, made with care.",
              "A clean, modern space with a calm coastal mood."
            ].map((item) => (
              <StaggerItem key={item}>
                <Card className="flex items-start gap-3">
                  <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-olive-light text-coffee-dark">
                    ✦
                  </span>
                  <p className="text-sm text-text-secondary">{item}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-6xl space-y-6">
          <Reveal>
            <SectionHeading
              eyebrow="Reviews"
              title="Loved by locals & travelers."
              subtitle="A few words from guests. More reviews coming soon."
            />
          </Reveal>
          <Stagger className="grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <StaggerItem key={review.name}>
                <Card className="space-y-4">
                  <div className="flex gap-1 text-caramel">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary">"{review.quote}"</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">
                    {review.name}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="rounded-3xl bg-coffee-dark px-8 py-10 text-white shadow-layered md:px-12">
              <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold">Planning a night out?</h2>
                  <p className="text-sm text-white/80">
                    Send a reservation request — we'll confirm on WhatsApp.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 md:justify-end">
                  <Button onClick={() => navigate("/booking")}
                    className="bg-white text-coffee-dark hover:-translate-y-0.5"
                  >
                    Request a table
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
