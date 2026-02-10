import { useNavigate } from "react-router-dom";
import Section from "../components/ui/Section.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Card from "../components/ui/Card.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import Reveal from "../components/Reveal.jsx";

// Hero image - local asset with fallback
// User should supply actual file at src/assets/hero/sea-view.jpg
// import heroImage from "../assets/hero/sea-view.jpg";
const heroFallback = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80";

// Signature Desserts images - local assets with fallbacks
// User should supply actual files at src/assets/food/
// import tiramisuImg from "../assets/food/tiramisu.jpg";
// import fondantImg from "../assets/food/chocolate-fondant.jpg";
// import cheesecakeImg from "../assets/food/cheesecake.jpg";
// import pavlovaImg from "../assets/food/pavlova.jpg";
// import cremeBruleeImg from "../assets/food/creme-brulee.jpg";
// import affogatoImg from "../assets/food/affogato.jpg";
const dessertImages = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80",
    title: "Tiramisu",
    alt: "Classic Italian tiramisu",
    description: "Espresso-soaked ladyfingers with mascarpone"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    title: "Chocolate Fondant",
    alt: "Warm chocolate fondant",
    description: "Molten center with vanilla gelato"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
    title: "Cheesecake",
    alt: "Creamy New York cheesecake",
    description: "New York style with berry compote"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
    title: "Pavlova",
    alt: "Fresh pavlova with seasonal fruits",
    description: "Crispy meringue with seasonal fruits"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?auto=format&fit=crop&w=600&q=80",
    title: "Crème Brûlée",
    alt: "Classic French crème brûlée",
    description: "Caramelized vanilla custard"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80",
    title: "Affogato",
    alt: "Espresso affogato",
    description: "Vanilla gelato drowned in espresso"
  }
];

// Coffee & Latte Art image
// import coffeeImg from "../assets/food/latte-art.jpg";
const coffeeImage = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80";

// Sea View Vibes images - local assets with fallbacks
// User should supply actual files at src/assets/vibes/
// import vibes1Img from "../assets/vibes/terrace-view.jpg";
// import vibes2Img from "../assets/vibes/sunset-dining.jpg";
// import vibes3Img from "../assets/vibes/night-ambiance.jpg";
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
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=900&q=80",
    alt: "Night ambiance at Plan B"
  }
];

// Trust strip items
const trustItems = ["Sea View", "Desserts", "Coffee", "Live Music"];

// Highlights
const highlights = [
  { label: "Good for watching sport", active: true },
  { label: "Live music", active: true },
  { label: "Sea view terrace", active: true },
  { label: "Pet friendly", active: true },
  { label: "Open late", active: true }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-primary">
      {/* ===================================================================
          HERO SECTION
          Full viewport with soft overlay + gradient, big headline, 
          subline, two CTAs, and trust strip
          =================================================================== */}
      <section className="relative min-h-[90vh] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroFallback}
            alt="Plan B sea view terrace"
            className="h-full w-full object-cover"
          />
          {/* Soft overlay + gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-coffee-dark/50 via-coffee-dark/40 to-coffee-dark/70" />
        </div>

        {/* Hero Content */}
        <div className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
          <div className="max-w-4xl space-y-8">
            <Reveal>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-7xl">
                Your Coastal Escape Awaits
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl lg:text-2xl">
                Experience the perfect blend of sea views, artisan coffee, and unforgettable flavors at Plan B.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/menu")}
                  className="bg-white text-coffee-dark hover:bg-surface-muted"
                >
                  Explore Menu
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/booking")}
                  className="border-white/60 text-white hover:bg-white/10"
                >
                  Reserve a Table
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Trust Strip */}
          <Reveal delay={0.3}>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-12">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm md:gap-x-6">
                {trustItems.map((item, index) => (
                  <span key={index} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-olive-light" />
                    <span className="text-xs font-medium tracking-wide text-white/90 md:text-sm">
                      {item}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================================================================
          SECTION 1: SIGNATURE DESSERTS
          3-6 cards with local food images
          =================================================================== */}
      <Section className="section-padding">
        <div className="mx-auto max-w-6xl space-y-10">
          <Reveal>
            <SectionHeading
              eyebrow="Sweet endings"
              title="Signature Desserts"
              subtitle="Handcrafted desserts with coastal café charm — each one a little escape."
              align="center"
            />
          </Reveal>
          
          {/* Desktop: Grid of Cards | Mobile: Horizontal scroll */}
          <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {dessertImages.map((dessert, index) => (
              <Reveal key={dessert.id} delay={index * 0.05}>
                <Card className="group overflow-hidden p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dessert.image}
                      alt={dessert.alt}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/60 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-sm font-semibold text-white">
                      {dessert.title}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-text-secondary">{dessert.description}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* Mobile: Horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:hidden">
            {dessertImages.map((dessert) => (
              <div
                key={dessert.id}
                className="flex-shrink-0"
              >
                <Card className="w-64 overflow-hidden p-0">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={dessert.image}
                      alt={dessert.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/60 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-sm font-semibold text-white">
                      {dessert.title}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-text-secondary">{dessert.description}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===================================================================
          SECTION 2: COFFEE & LATTE ART
          Showcase section with image and short story
          =================================================================== */}
      <Section className="section-padding bg-surface-muted/50">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Big Image */}
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl shadow-lg">
                <img
                  src={coffeeImage}
                  alt="Latte art at Plan B"
                  className="h-80 w-full object-cover lg:h-[28rem]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-coffee-dark/30" />
              </div>
            </Reveal>
            
            {/* Text Content */}
            <Reveal delay={0.1}>
              <div className="space-y-6">
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-coffee">
                  Crafted with care
                </span>
                <h2 className="text-balance text-3xl font-semibold text-text-primary md:text-4xl">
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
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ===================================================================
          SECTION 3: SEA VIEW VIBES
          2-3 large images showcasing the ambiance
          =================================================================== */}
      <Section className="section-padding">
        <div className="mx-auto max-w-6xl space-y-10">
          <Reveal>
            <SectionHeading
              eyebrow="The ambiance"
              title="Sea View Vibes"
              subtitle="Your table awaits — overlooking the coast where every meal is a moment."
              align="center"
            />
          </Reveal>
          
          {/* Asymmetric grid: 1 large + 2 smaller on desktop */}
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            {/* Large featured image */}
            <Reveal className="md:row-span-2">
              <div className="group relative h-64 overflow-hidden rounded-2xl md:h-full">
                <img
                  src={seaViewImages[0].image}
                  alt={seaViewImages[0].alt}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/40 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              </div>
            </Reveal>

            {/* Two smaller images stacked */}
            {seaViewImages.slice(1).map((item, index) => (
              <Reveal key={item.id} delay={(index + 1) * 0.1}>
                <div className="group relative h-48 overflow-hidden rounded-2xl md:h-64">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/40 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ===================================================================
          SECTION 4: HIGHLIGHTS
          Chips/badges for features like "Good for watching sport", "Live music"
          =================================================================== */}
      <Section className="section-padding bg-surface-muted/30">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="space-y-8 text-center">
              <SectionHeading
                eyebrow="What we offer"
                title="Highlights"
                subtitle="Everything you need for the perfect outing."
                align="center"
              />
              
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                {highlights.filter(h => h.active).map((highlight, index) => (
                  <Badge 
                    key={index} 
                    variant="info" 
                    className="px-4 py-2 text-sm"
                  >
                    {highlight.label}
                  </Badge>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ===================================================================
          SECTION 5: CALL TO ACTION
          Menu + Gallery buttons
          =================================================================== */}
      <Section className="section-padding">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="rounded-3xl bg-coffee-dark px-8 py-16 text-center text-white shadow-layered md:px-12">
              <div className="mx-auto max-w-2xl space-y-6">
                <h2 className="text-balance text-3xl font-semibold md:text-4xl lg:text-5xl">
                  Ready to experience Plan B?
                </h2>
                <p className="text-lg text-white/80">
                  Explore our full menu or browse the gallery to see what awaits.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={() => navigate("/menu")}
                    className="bg-white text-coffee-dark hover:bg-surface-muted"
                  >
                    View Full Menu
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/gallery")}
                    className="border-white/50 text-white hover:bg-white/10"
                  >
                    Browse Gallery
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
};

export default Home;
