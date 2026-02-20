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
import { useGlobalLoading } from "../context/LoadingContext.jsx";

// Hero image - Plan B sea view terrace
const heroImage = "/assets/planb/home/hero-sea-view.jpg.png";

// Highlight strip items
const highlights = [
  { id: 1, icon: "🌊", label: "Sea View", description: "Coastal views & sunset vibes" },
  {
    id: 2,
    icon: "🍰",
    label: "Desserts & Coffee",
    description: "Handcrafted desserts & specialty coffee"
  },
  { id: 3, icon: "🎉", label: "Groups & Birthdays", description: "Celebrations & group seating" },
  { id: 4, icon: "👶", label: "Kids Area", description: "Comfortable for families" },
  { id: 5, icon: "🎵", label: "Live Music", description: "Weekend evenings" }
];

// Signature Food & Desserts images - "Made to Be Enjoyed" section
const signatureItems = [
  {
    id: 1,
    image: "/assets/planb/home/home-grid-1.jpg.png",
    title: "Signature Cocktails",
    alt: "Cocktail at Plan B Restaurant & Cafe"
  },
  {
    id: 2,
    image: "/assets/planb/home/home-grid-2.jpg.png",
    title: "Specialty Coffee",
    alt: "Specialty coffee at Plan B"
  },
  {
    id: 3,
    image: "/assets/planb/home/home-grid-3.jpg.png",
    title: "Desserts",
    alt: "Desserts served at Plan B"
  },
  {
    id: 4,
    image: "/assets/planb/home/home-grid-4.jpg.png",
    title: "Fresh Salads",
    alt: "Fresh salad plate at Plan B"
  },
  {
    id: 5,
    image: "/assets/planb/home/home-grid-5.jpg.png",
    title: "Main Dishes",
    alt: "Chicken main dish served at Plan B"
  }
];

// The Atmosphere section image - sunset seating with sea view
const vibeImage = "/assets/planb/home/home-atmosphere.jpg.png";

const faqItems = [
  {
    question: "Where is Plan B Restaurant & Cafe located?",
    answer: "Gold Star Mall, Cornish Street, Hurghada — with sea view seating."
  },
  {
    question: "What are your opening hours?",
    answer: "We're open daily from 9:00 AM to 2:00 AM."
  },
  {
    question: "Do you have live music?",
    answer: "Yes — live music on selected weekend evenings."
  },
  {
    question: "Is Plan B family friendly?",
    answer: "Yes. We have a comfortable setting for families and a kids-friendly area."
  },
  {
    question: "How do I reserve a table?",
    answer: "Send your request on WhatsApp and we confirm personally."
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { startLoading, stopLoading } = useGlobalLoading();
  const reducedMotion = prefersReducedMotion();

  // Load gallery images from Supabase
  useEffect(() => {
    let isMounted = true;

    const loadGalleryImages = async () => {
      startLoading();
      try {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

        if (!isMounted) return;

        if (!error && data) {
          setGalleryImages(data);
        }
      } finally {
        if (isMounted) {
          setGalleryLoading(false);
        }
        stopLoading();
      }
    };

    loadGalleryImages();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content") || "";

    document.title = "Plan B Restaurant & Cafe | Sea View Dining in Hurghada";

    let descriptionTag = metaDescription;
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute(
      "content",
      "Sea view restaurant & cafe on Cornish Street, Hurghada. Seafood, grills, burgers, desserts & coffee. Open daily 9 AM–2 AM. Reserve on WhatsApp."
    );

    const existingSchema = document.getElementById("home-faq-schema");
    if (existingSchema) {
      existingSchema.remove();
    }

    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.id = "home-faq-schema";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    });
    document.head.appendChild(schemaScript);

    return () => {
      document.title = previousTitle;
      if (descriptionTag) {
        descriptionTag.setAttribute("content", previousDescription);
      }
      const cleanupSchema = document.getElementById("home-faq-schema");
      if (cleanupSchema) {
        cleanupSchema.remove();
      }
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
          <div className="absolute inset-0 bg-gradient-to-b from-coffee-dark/45 via-coffee-dark/35 to-coffee-dark/80" />
        </div>

        {/* Hero Content - Centered */}
        <motion.div 
          className="relative flex min-h-screen items-center justify-center px-6 text-center"
          variants={heroContentVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-3xl space-y-5">
            {/* Title */}
            <motion.div
              className="flex flex-col items-center gap-4"
              variants={heroItemVariants}
            >
              <h1 className="text-balance text-4xl font-bold text-white md:text-6xl lg:text-7xl">
                Plan B Restaurant &amp; Cafe
              </h1>
              <img 
                src="/assets/planb/home/logo-planb.png" 
                alt="Plan B" 
                className="w-28 md:w-40 lg:w-48"
              />
            </motion.div>
            
            {/* Subtitle */}
            <motion.p 
              className="mx-auto max-w-xl text-lg text-white/90 md:text-xl lg:text-2xl"
              variants={heroItemVariants}
            >
              Sea view dining on Cornish Street — seafood, grills, burgers, desserts &amp; specialty coffee.
            </motion.p>

            <motion.div
              className="mx-auto max-w-4xl text-center text-sm text-white/85 md:text-base"
              variants={heroItemVariants}
            >
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 leading-relaxed">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">🕘</span>
                  Open Daily 9:00 AM – 2:00 AM
                </span>
                <span className="text-white/60" aria-hidden="true">•</span>
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">🌊</span>
                  Sea View
                </span>
                <span className="text-white/60" aria-hidden="true">•</span>
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">🎵</span>
                  Live Music (Weekends)
                </span>
                <span className="text-white/60" aria-hidden="true">•</span>
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">👨‍👩‍👧</span>
                  Family Friendly
                </span>
              </div>
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
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
          className="pointer-events-none absolute bottom-20 left-1/2 z-10 -translate-x-1/2 sm:bottom-10"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0.25 : 1.2, duration: reducedMotion ? 0.2 : 0.45 }}
        >
          <div className="flex flex-col items-center gap-2 text-white/80">
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/75 sm:text-xs">
              Scroll
            </span>
            <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/65 bg-white/10 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-sm">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-white/95"
                animate={reducedMotion ? {} : { y: [0, 12, 0], opacity: [1, 0.45, 1] }}
                transition={
                  reducedMotion
                    ? {}
                    : { duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.35 }
                }
              />
            </div>
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
            title="Food, Coffee & Coastal Favorites"
            subtitle="Fresh plates, great coffee, and a relaxed sea view atmosphere — from morning to late night."
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
                Sea View Comfort, Day to Night
              </h2>
              <p className="mt-6 text-text-secondary leading-relaxed">
                Plan B is where the coast meets comfort — a relaxed spot for breakfast, coffee, sunset drinks, and dinner. Come for fresh seafood, grills, burgers, and desserts, and stay for the warm atmosphere, good music, and friendly service. Perfect for families, couples, and groups looking for a quality place on the Cornish.
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

      <Section className="pb-8 pt-12 md:pb-10 md:pt-14">
        <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-2">
          <div className="flex h-full flex-col rounded-3xl border border-coffee/10 bg-white p-6 shadow-sm md:p-7">
            <h2 className="text-2xl font-semibold text-text-primary md:text-3xl">Visit Plan B on the Cornish</h2>
            <p className="mt-3 text-text-secondary leading-relaxed">
              Find us at Gold Star Mall on Cornish Street, Hurghada. Easy to reach, sea view seating, and open daily from 9 AM to 2 AM. For reservations, message us on WhatsApp and we&apos;ll confirm quickly.
            </p>
            <div className="mt-4 space-y-2 text-sm text-text-secondary">
              <p className="inline-flex items-center gap-2"><span aria-hidden="true">📍</span> Gold Star Mall, Cornish Street, Hurghada</p>
              <p className="inline-flex items-center gap-2"><span aria-hidden="true">🕘</span> Open Daily 9:00 AM – 2:00 AM</p>
              <p className="inline-flex items-center gap-2"><span aria-hidden="true">💬</span> Reservations confirmed on WhatsApp</p>
            </div>
          </div>
          <div className="flex h-full flex-col rounded-3xl border border-coffee/10 bg-white p-6 shadow-sm md:p-7">
            <h3 className="text-xl font-semibold text-text-primary">Quick Info</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-text-secondary md:text-[15px]">
              <li><span className="mr-2" aria-hidden="true">🍽️</span><span className="font-medium text-text-primary">Cuisine:</span> Seafood • Grill • Burgers • Salads</li>
              <li><span className="mr-2" aria-hidden="true">🌊</span><span className="font-medium text-text-primary">Best for:</span> Sea view • Families • Groups</li>
              <li><span className="mr-2" aria-hidden="true">🕘</span><span className="font-medium text-text-primary">Hours:</span> Daily 9:00–2:00</li>
              <li><span className="mr-2" aria-hidden="true">💬</span><span className="font-medium text-text-primary">Reservations:</span> WhatsApp confirmation</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section className="pb-8 pt-2">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-coffee/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-text-primary">⭐ Google Reviews</p>
            <p className="mt-1 text-sm text-text-secondary">Connected section for review highlights.</p>
          </div>
          <div className="rounded-2xl border border-coffee/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-text-primary">🕘 Open Daily</p>
            <p className="mt-1 text-sm text-text-secondary">From 9:00 AM to 2:00 AM, every day.</p>
          </div>
          <div className="rounded-2xl border border-coffee/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-text-primary">💬 Reservations</p>
            <p className="mt-1 text-sm text-text-secondary">Quick confirmations through WhatsApp.</p>
          </div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 5: GALLERY PREVIEW
          ================================================================ */}
      <Section className="section-padding">
        <div className="mx-auto max-w-6xl space-y-10">
          <SectionHeading
            eyebrow="Gallery"
            title="A Glimpse Inside"
            subtitle="A quick look at our space, plates, and moments by the sea."
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

      <Section className="pb-6 pt-10 md:pt-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Everything you need before your visit."
            align="center"
          />

          <div className="mt-8 space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-2xl border border-coffee/10 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className={`text-base text-text-primary ${isOpen ? "font-semibold" : "font-medium"}`}>
                      {item.question}
                    </span>
                    <span className="text-xl font-medium text-coffee" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-coffee/10 bg-surface-muted/35 px-5 py-4 text-[15px] text-text-primary/90">
                      {item.answer}
                    </div>
                  </motion.div>
                </div>
              );
            })}
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
                Reserve Your Table at Plan B
              </h2>
              <p className="text-lg text-white/80">
                Send a quick request — we confirm on WhatsApp. Open daily 9:00 AM to 2:00 AM.
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
