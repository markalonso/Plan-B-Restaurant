import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Section from "../components/ui/Section.jsx";
import Button from "../components/ui/Button.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import {
  heroContentVariants,
  heroItemVariants,
  scrollIndicatorVariants,
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
  revealVariants
} from "../lib/motion.js";
import { supabase } from "../lib/supabaseClient.js";

// Hero image - use fallback since local assets may not exist
// For production, add actual images to public/assets/hero/
const heroImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80";

// Highlight strip items
const highlights = [
  { id: 1, icon: "🌊", label: "Sea View", description: "Stunning coastal views" },
  { id: 2, icon: "🍰", label: "Desserts & Coffee", description: "Handcrafted treats" },
  { id: 3, icon: "🎉", label: "Groups & Birthdays", description: "Private celebrations" },
  { id: 4, icon: "👶", label: "Kids Area", description: "Family friendly" },
  { id: 5, icon: "🎵", label: "Live Music", description: "Weekend vibes" }
];

// Signature Food & Desserts images
const signatureItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80",
    title: "Tiramisu",
    alt: "Classic Italian tiramisu"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    title: "Specialty Coffee",
    alt: "Artisan latte art"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    title: "Chocolate Fondant",
    alt: "Warm chocolate fondant"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
    title: "Cheesecake",
    alt: "Creamy New York cheesecake"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    title: "Fresh Cuisine",
    alt: "Signature dishes"
  }
];

// The Vibe section image
const vibeImage = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80";

const Home = () => {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

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
            <motion.h1 
              className="text-balance text-5xl font-bold text-white md:text-6xl lg:text-7xl"
              variants={heroItemVariants}
            >
              Plan B
            </motion.h1>
            
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
                className="bg-white px-8 py-3 text-base text-coffee-dark hover:bg-surface-muted"
              >
                View Menu
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/gallery")}
                className="border-2 border-white/60 px-8 py-3 text-base text-white hover:bg-white/10"
              >
                Gallery
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          variants={scrollIndicatorVariants}
          initial="initial"
          animate={["animate", "bounce"]}
        >
          <div className="flex flex-col items-center gap-2 text-white/70">
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
          </div>
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
              {signatureItems.slice(0, 6).map((item, index) => (
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
                  className="bg-white px-8 py-3 text-base text-coffee-dark hover:bg-surface-muted"
                >
                  Book a Table
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/contact")}
                  className="px-8 py-3 text-base text-white hover:bg-white/10"
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
