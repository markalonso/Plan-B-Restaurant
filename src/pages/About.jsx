import { useNavigate } from "react-router-dom";
import Section from "../components/ui/Section.jsx";
import Button from "../components/ui/Button.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";

// Vibe images - using Unsplash fallbacks (ready for local images at /src/assets/vibes/)
const vibeImages = {
  seaView: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  interior: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80",
  ambiance: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=900&q=80"
};

const storyBlocks = [
  {
    id: "view",
    eyebrow: "The View",
    title: "Where the Sea Meets Your Table",
    description:
      "Perched on Hurghada's Cornish Street, Plan B offers an uninterrupted view of the Red Sea. Watch the sunset paint the water gold while you sip your coffee, or catch the moonlight dancing on the waves during a late dinner. Every seat is a window to the coast.",
    image: vibeImages.seaView,
    imageAlt: "Sea view from Plan B terrace",
    imagePosition: "right"
  },
  {
    id: "food",
    eyebrow: "The Food",
    title: "Comfort Made Fresh",
    description:
      "Our kitchen blends familiar favorites with creative twists. From all-day breakfast to signature desserts, every dish is crafted with care and local ingredients. Whether you crave a hearty meal or a light bite, we've got something that feels just right.",
    image: vibeImages.interior,
    imageAlt: "Plan B restaurant interior",
    imagePosition: "left"
  },
  {
    id: "vibe",
    eyebrow: "The Vibe",
    title: "Casual, Warm, Intentional",
    description:
      "Plan B isn't just a place to eat — it's a place to be. Low lighting, good music, and a space designed for connection. Come for breakfast, stay for sunset drinks. Bring a friend or come alone with a book. There's no rush here.",
    image: vibeImages.ambiance,
    imageAlt: "Plan B evening ambiance",
    imagePosition: "right"
  }
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-coffee-dark/5 to-transparent pb-8 pt-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Section animate={false}>
            <SectionHeading
              eyebrow="Our Story"
              title="More Than a Restaurant"
              subtitle="Plan B is where coastal calm meets comfort food — a space to slow down, connect, and enjoy."
              align="center"
            />
          </Section>
        </div>
      </div>

      {/* Story Sections - Alternating Image/Text */}
      {storyBlocks.map((block, index) => (
        <Section key={block.id} className="section-padding">
          <div className="mx-auto max-w-6xl">
            <div
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                block.imagePosition === "left" ? "lg:grid-flow-dense" : ""
              }`}
            >
              {/* Text Content */}
              <div
                className={`space-y-6 ${
                  block.imagePosition === "left" ? "lg:col-start-2" : ""
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-coffee">
                  {block.eyebrow}
                </span>
                <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
                  {block.title}
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {block.description}
                </p>
              </div>

              {/* Image */}
              <div
                className={`relative overflow-hidden rounded-3xl ${
                  block.imagePosition === "left" ? "lg:col-start-1 lg:row-start-1" : ""
                }`}
              >
                <img
                  src={block.image}
                  alt={block.imageAlt}
                  className="h-72 w-full object-cover lg:h-96"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/20 to-transparent" />
              </div>
            </div>
          </div>
        </Section>
      ))}

      {/* Values Section */}
      <Section className="section-padding bg-surface-muted/50">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            eyebrow="What We Believe"
            title="Simple Things, Done Well"
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "☀️",
                title: "Calm & Welcoming",
                description: "A space where you feel at home from the first step."
              },
              {
                icon: "🍽️",
                title: "Fresh & Familiar",
                description: "Comfort food made with care and quality ingredients."
              },
              {
                icon: "🌊",
                title: "Coastal Soul",
                description: "The sea is always in view, and the vibe is always easy."
              }
            ].map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-coffee/10 bg-white/50 p-6 text-center"
              >
                <span className="text-3xl">{value.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-text-primary">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="section-padding">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-coffee-dark px-8 py-12 text-center text-white shadow-layered md:px-12">
            <div className="mx-auto max-w-2xl space-y-4">
              <h2 className="text-3xl font-semibold md:text-4xl">
                Come Experience Plan B
              </h2>
              <p className="text-white/80">
                We'd love to have you. Stop by for coffee, stay for dinner.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button
                  onClick={() => navigate("/booking")}
                  variant="secondary"
                >
                  Reserve a Table
                </Button>
                <Button
                  variant="ghost-light"
                  onClick={() => navigate("/contact")}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default About;
