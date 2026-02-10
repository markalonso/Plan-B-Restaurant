import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Section from "../components/ui/Section.jsx";
import Button from "../components/ui/Button.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import {
  heroContentVariants,
  heroItemVariants,
  highlightStripContainer,
  highlightItemVariants,
  staggerContainer,
  staggerItem,
  cardImageVariants,
  cardOverlayVariants,
  galleryPreviewContainer,
  galleryPreviewItem,
  viewportConfig,
  imageRevealVariants,
  revealVariants,
  prefersReducedMotion
} from "../lib/motion.js";
import { supabase } from "../lib/supabaseClient.js";

// Hero image - Plan B sea view terrace
const heroImage = "/assets/planb/home/hero-sea-view.jpg.png";

// Highlight strip items
const highlights = [
  { id: 1, icon: "🌊", label: "Sea View", description: "Stunning coastal views" },
  { id: 2, icon: "🍰", label: "Desserts & Coffee", description: "Handcrafted treats" },
  { id: 3, icon: "🎉", label: "Groups & Birthdays", description: "Private celebrations" },
  { id: 4, icon: "👶", label: "Kids Area", description: "Family friendly" },
  { id: 5, icon: "🎵", label: "Live Music", description: "Weekend vibes" }
];

// Signature Food & Desserts images - "Made to Be Enjoyed" section
const signatureItems = [
  {
    id: 1,
    image: "/assets/planb/home/home-grid-1.jpg.png",
    title: "Signature Cocktails",
    alt: "Blue cocktail"
  },
  {
    id: 2,
    image: "/assets/planb/home/home-grid-2.jpg.png",
    title: "Specialty Coffee",
    alt: "Artisan latte art"
  },
  {
    id: 3,
    image: "/assets/planb/home/home-grid-3.jpg.png",
    title: "Desserts",
    alt: "Cheesecake plates"
  },
  {
    id: 4,
    image: "/assets/planb/home/home-grid-4.jpg.png",
    title: "Fresh Salads",
    alt: "Fresh salad"
  },
  {
    id: 5,
    image: "/assets/planb/home/home-grid-5.jpg.png",
    title: "Main Dishes",
    alt: "Featured main dish"
  }
];

// The Atmosphere section image - sunset seating with sea view
const vibeImage = "/assets/planb/home/home-atmosphere.jpg.png";

const Home = () => {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const reducedMotion = prefersReducedMotion();

  // Load gallery images from Supabase
  useEffect(() => {
    let isMounted = true;

    const loadGalleryImages = async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!isMounted) return;

      if (!error && data) {
        setGalleryImages(data);
      }
      setGalleryLoading(false);
    };

    loadGalleryImages();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-surface-primary">
      {/* ================================================================
          SECTION 1: HERO - Full viewport with animated content
          ================================================================ */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Plan B sea view terrace"
            className="h-full w-full object-cover"
          />
          {/* Soft gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-coffee-dark/30 via-coffee-dark/20 to-coffee-dark/70" />
        </div>

        {/* Hero Content - Centered */}
        <motion.div 
          className="relative flex min-h-screen items-center justify-center px-6 text-center"
          variants={heroContentVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-3xl space-y-6">
            {/* Title */}
            <motion.div
              className="flex flex-col items-center gap-4"
              variants={heroItemVariants}
            >
              <h1 className="text-balance text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                PLAN
              </h1>
              <img 
                src="/assets/planb/home/logo-planb.png" 
                alt="Plan B" 
                className="w-32 md:w-48 lg:w-56"
              />
            </motion.div>
            
            {/* Subtitle */}
            <motion.p 
              className="mx-auto max-w-xl text-lg text-white/90 md:text-xl lg:text-2xl"
              variants={heroItemVariants}
            >
              Sea View • Food • Desserts • Drinks
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4 pt-6"
              variants={heroItemVariants}
            >
              <Button
                onClick={() => navigate("/menu")}
                variant="secondary"
              >
                View Menu
              </Button>
              <Button
                onClick={() => navigate("/gallery")}
                variant="ghost-light"
              >
                Gallery
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0.3 : 1.5, duration: reducedMotion ? 0.2 : 0.5 }}
        >
          <motion.div 
            className="flex flex-col items-center gap-2 text-white/70"
            animate={reducedMotion ? {} : { y: [0, 8, 0] }}
            transition={reducedMotion ? {} : { duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ================================================================
          SECTION 2: HIGHLIGHT STRIP - Horizontal highlights
          ================================================================ */}
      <motion.section 
        className="border-b border-coffee/10 bg-white py-6"
        variants={highlightStripContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <div className="mx-auto max-w-6xl px-6">
          {/* Mobile: Horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide md:hidden">
            {highlights.map((item) => (
              <motion.div
                key={item.id}
                className="flex flex-shrink-0 items-center gap-3 rounded-2xl border border-coffee/10 bg-surface-primary px-5 py-4"
                variants={highlightItemVariants}
                whileHover="hover"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-muted">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Desktop: Grid */}
          <div className="hidden gap-4 md:grid md:grid-cols-5">
            {highlights.map((item) => (
              <motion.div
                key={item.id}
                className="flex flex-col items-center gap-2 rounded-2xl border border-coffee/10 bg-surface-primary px-4 py-5 text-center"
                variants={highlightItemVariants}
                whileHover="hover"
              >
                <span className="text-3xl">{item.icon}</span>
                <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                <p className="text-xs text-text-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ================================================================
          SECTION 3: SIGNATURE FOOD & DESSERTS
          ================================================================ */}
      <Section className="section-padding">
        <div className="mx-auto max-w-6xl space-y-10">
          <SectionHeading
            eyebrow="Taste the experience"
            title="Made to Be Enjoyed"
            subtitle="Handcrafted desserts, specialty coffee, and fresh cuisine with coastal café charm."
            align="center"
          />
          
          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {signatureItems.slice(0, 3).map((item) => (
              <motion.div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl"
                variants={staggerItem}
                whileHover="hover"
                initial="initial"
              >
                <motion.img
                  src={item.image}
                  alt={item.alt}
                  className="h-72 w-full object-cover lg:h-80"
                  loading="lazy"
                  variants={cardImageVariants}
                />
                <motion.div 
                  className="absolute inset-0 flex items-end bg-gradient-to-t from-coffee-dark/80 via-coffee-dark/20 to-transparent p-5"
                  variants={cardOverlayVariants}
                >
                  <span className="text-lg font-semibold text-white">{item.title}</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Second row - 2 items centered */}
          <motion.div
            className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {signatureItems.slice(3, 5).map((item) => (
              <motion.div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl"
                variants={staggerItem}
                whileHover="hover"
                initial="initial"
              >
                <motion.img
                  src={item.image}
                  alt={item.alt}
                  className="h-64 w-full object-cover"
                  loading="lazy"
                  variants={cardImageVariants}
                />
                <motion.div 
                  className="absolute inset-0 flex items-end bg-gradient-to-t from-coffee-dark/80 via-coffee-dark/20 to-transparent p-5"
                  variants={cardOverlayVariants}
                >
                  <span className="text-lg font-semibold text-white">{item.title}</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 4: THE VIBE - Large image with text
          ================================================================ */}
      <section className="relative overflow-hidden bg-surface-muted/50">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center lg:grid-cols-2">
            {/* Large Image */}
            <motion.div 
              className="relative h-[400px] overflow-hidden lg:h-[600px]"
              variants={imageRevealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              <img
                src={vibeImage}
                alt="Plan B interior ambiance"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-muted/30 lg:bg-gradient-to-l" />
            </motion.div>

            {/* Text Block */}
            <motion.div 
              className="px-6 py-12 lg:px-12 lg:py-16"
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-coffee">
                The atmosphere
              </span>
              <h2 className="mt-4 text-balance text-3xl font-semibold text-text-primary md:text-4xl lg:text-5xl">
                A place to relax, meet, and enjoy the moment
              </h2>
              <p className="mt-6 text-text-secondary leading-relaxed">
                Plan B isn't just a place to eat — it's where the coast meets comfort. Low lighting, 
                good music, and a space designed for connection. Come for breakfast, stay for sunset 
                drinks. Bring a friend or come alone with a book. There's no rush here.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button onClick={() => navigate("/about")} variant="secondary">
                  Our Story
                </Button>
                <Button onClick={() => navigate("/gallery")} variant="ghost">
                  View Gallery
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 5: GALLERY PREVIEW
          ================================================================ */}
      <Section className="section-padding">
        <div className="mx-auto max-w-6xl space-y-10">
          <SectionHeading
            eyebrow="Gallery"
            title="A Glimpse Inside"
            subtitle="Coastal vibes, warm moments, and unforgettable experiences."
            align="center"
          />

          {galleryLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="h-48 animate-pulse rounded-2xl bg-surface-muted"
                />
              ))}
            </div>
          ) : galleryImages.length > 0 ? (
            <motion.div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              variants={galleryPreviewContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              {galleryImages.map((image) => (
                <motion.div
                  key={image.id}
                  className="group relative overflow-hidden rounded-2xl"
                  variants={galleryPreviewItem}
                  whileHover="hover"
                  initial="initial"
                >
                  <motion.img
                    src={image.image_url}
                    alt={image.alt_text || image.title || "Plan B gallery"}
                    className="h-48 w-full object-cover lg:h-56"
                    loading="lazy"
                    variants={cardImageVariants}
                  />
                  <motion.div 
                    className="absolute inset-0 flex items-end bg-gradient-to-t from-coffee-dark/70 to-transparent p-4"
                    variants={cardOverlayVariants}
                  >
                    {image.title && (
                      <span className="text-sm font-semibold text-white">{image.title}</span>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              variants={galleryPreviewContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              {/* Fallback: Show signature items when no gallery images */}
              {signatureItems.map((item, index) => (
                <motion.div
                  key={`fallback-${index}`}
                  className="group relative overflow-hidden rounded-2xl"
                  variants={galleryPreviewItem}
                  whileHover="hover"
                  initial="initial"
                >
                  <motion.img
                    src={item.image}
                    alt={item.alt}
                    className="h-48 w-full object-cover lg:h-56"
                    loading="lazy"
                    variants={cardImageVariants}
                  />
                  <motion.div 
                    className="absolute inset-0 flex items-end bg-gradient-to-t from-coffee-dark/70 to-transparent p-4"
                    variants={cardOverlayVariants}
                  >
                    <span className="text-sm font-semibold text-white">{item.title}</span>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="flex justify-center">
            <Button onClick={() => navigate("/gallery")} variant="secondary">
              View Full Gallery
            </Button>
          </div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 6: FINAL CTA
          ================================================================ */}
      <Section className="section-padding">
        <div className="mx-auto max-w-6xl">
          <motion.div 
            className="relative overflow-hidden rounded-3xl bg-coffee-dark px-8 py-16 text-center text-white shadow-layered md:px-12 md:py-20"
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {/* Decorative elements */}
            <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
            
            <div className="relative mx-auto max-w-2xl space-y-6">
              <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                Ready to visit Plan B?
              </h2>
              <p className="text-lg text-white/80">
                Book your table or stop by — we're open daily from 9 AM to 2 AM.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button
                  onClick={() => navigate("/booking")}
                  variant="secondary"
                >
                  Book a Table
                </Button>
                <Button
                  onClick={() => navigate("/contact")}
                  variant="ghost-light"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
