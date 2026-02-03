import { useNavigate } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import Stagger, { StaggerItem } from "../components/Stagger.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import GlassPanel from "../components/ui/GlassPanel.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";

const scenarios = [
  {
    title: "Birthday dinner",
    description: "A calm space, candlelight, and a menu that feels personal."
  },
  {
    title: "Small celebration",
    description: "Intimate gatherings with a relaxed, premium rhythm."
  },
  {
    title: "Private dining",
    description: "A curated table for milestones and meaningful moments."
  }
];

const steps = [
  "Tell us your guest count and date",
  "We reply on WhatsApp",
  "We plan the details together"
];

const Events = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-neutral-offwhite">
      <section className="section-padding">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="overflow-hidden rounded-3xl shadow-layered">
              <div className="relative h-64 w-full md:h-80">
                <img
                  src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=80"
                  alt="Plan B events"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-brand-deep/65" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <span className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
                    Events
                  </span>
                  <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
                    Celebrations with a calm glow.
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/80 md:text-base">
                    An elegant, welcoming space for birthdays, private dining, and
                    small gatherings.
                  </p>
                  <div className="mt-5">
                    <Button
                      onClick={() => navigate("/booking?mode=event")}
                      className="bg-white text-brand-deep"
                    >
                      Request an event
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-6xl space-y-8">
          <Reveal>
            <SectionHeading
              eyebrow="Occasions"
              title="Thoughtful details, effortless hosting."
              subtitle=""
            />
          </Reveal>
          <Stagger className="grid gap-6 md:grid-cols-3">
            {scenarios.map((scenario) => (
              <StaggerItem key={scenario.title}>
                <Card className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {scenario.description}
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
            <GlassPanel className="space-y-6">
              <SectionHeading
                eyebrow="How it works"
                title="A simple, personal process."
                subtitle=""
              />
              <Stagger className="grid gap-4 md:grid-cols-3">
                {steps.map((step) => (
                  <StaggerItem key={step}>
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-light text-brand-deep">
                        ✓
                      </span>
                      {step}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </GlassPanel>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Events;
