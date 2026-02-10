import { useNavigate } from "react-router-dom";
import Section from "../components/ui/Section.jsx";
import FeatureGrid from "../components/ui/FeatureGrid.jsx";
import Button from "../components/ui/Button.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";

// Hero image - use fallback since local assets may not exist
// For production, add actual images to public/assets/hero/
const heroFallback = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80";

// Signature Desserts images
const dessertImages = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80",
    title: "Tiramisu",
    alt: "Classic Italian tiramisu"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    title: "Chocolate Fondant",
    alt: "Warm chocolate fondant"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
    title: "Cheesecake",
    alt: "Creamy New York cheesecake"
  }
];

// Coffee & Latte Art image
const coffeeImage = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80";

// Sea View images
const seaViewImages = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    alt: "Sea view terrace at Plan B"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80",
    alt: "Sunset dining by the sea"
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-primary">
      {/* Hero Section - Full width with overlay */}
      <section className="relative min-h-[85vh] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroFallback}
            alt="Plan B sea view terrace"
            className="h-full w-full object-cover"
          />
          {/* Soft overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-coffee-dark/40 via-coffee-dark/30 to-coffee-dark/60" />
        </div>

        {/* Hero Content */}
        <div className="relative flex min-h-[85vh] items-center justify-center px-6 text-center">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-balance text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
              Plan B — Sea View • Food • Vibes
            </h1>
            <p className="mx-auto max-w-xl text-base text-white/90 md:text-lg">
              Where the coast meets comfort — breakfast to late night.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                onClick={() => navigate("/menu")}
                className="bg-white text-coffee-dark hover:bg-surface-muted"
              >
                View Menu
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/gallery")}
                className="border-white/50 text-white hover:bg-white/10"
              >
                Gallery
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Desserts Section */}
      <Section className="section-padding">
        <div className="mx-auto max-w-6xl space-y-8">
          <SectionHeading
            eyebrow="Sweet endings"
            title="Signature Desserts"
            subtitle="Handcrafted desserts with coastal café charm."
            align="center"
          />
          <FeatureGrid
            items={dessertImages}
            columns={3}
            scrollOnMobile={true}
          />
        </div>
      </Section>

      {/* Coffee & Latte Art Section */}
      <Section className="section-padding bg-surface-muted/50">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Big Image */}
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src={coffeeImage}
                alt="Latte art at Plan B"
                className="h-80 w-full object-cover lg:h-[28rem]"
                loading="lazy"
              />
            </div>
            
            {/* Text Content */}
            <div className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-coffee">
                Crafted with care
              </span>
              <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
                Coffee & Latte Art
              </h2>
              <p className="text-text-secondary">
                Every cup tells a story. Our baristas craft beautiful latte art using
                locally roasted beans — from classic espresso to creative seasonal drinks.
                Start your morning slow or fuel your afternoon with intention.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-olive" />
                  <span className="text-sm text-text-muted">Specialty roasts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-olive" />
                  <span className="text-sm text-text-muted">Latte art</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-olive" />
                  <span className="text-sm text-text-muted">Cold brews</span>
                </div>
              </div>
              <Button onClick={() => navigate("/menu")} variant="secondary">
                See Drinks Menu
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Sea View Vibes Section */}
      <Section className="section-padding">
        <div className="mx-auto max-w-6xl space-y-8">
          <SectionHeading
            eyebrow="Location"
            title="Sea View Vibes"
            subtitle="Your table awaits — overlooking the coast."
            align="center"
          />
          
          {/* Two images: side-by-side on desktop, stacked on mobile */}
          <div className="grid gap-6 md:grid-cols-2">
            {seaViewImages.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 md:h-80"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/50 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
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
                Ready to experience Plan B?
              </h2>
              <p className="text-white/80">
                Book your table or stop by — we're open daily from 9 AM to 2 AM.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button
                  onClick={() => navigate("/booking")}
                  className="bg-white text-coffee-dark hover:bg-surface-muted"
                >
                  Reserve a Table
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/contact")}
                  className="text-white hover:bg-white/10"
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

export default Home;
