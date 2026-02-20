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
  { id: 1, icon: "wave", label: "Sea View", description: "Coastal views & sunset vibes" },
  {
    id: 2,
    icon: "dessert",
    label: "Desserts & Coffee",
    description: "Handcrafted desserts & specialty coffee"
  },
  { id: 3, icon: "group", label: "Groups & Birthdays", description: "Celebrations & group seating" },
  { id: 4, icon: "family", label: "Kids Area", description: "Comfortable for families" },
  { id: 5, icon: "music", label: "Live Music", description: "Weekend evenings" }
];

// Signature Food & Desserts images - "Made to Be Enjoyed" section
const signatureItems = [
  {
    id: 1,
    image: "/assets/planb/home/home-grid-1.jpg.png",
    title: "Signature Cocktails",
    alt: "Tropical cocktail served at Plan B Restaurant"
  },
  {
    id: 2,
    image: "/assets/planb/home/home-grid-2.jpg.png",
    title: "Specialty Coffee",
    alt: "Specialty latte coffee at Plan B"
  },
  {
    id: 3,
    image: "/assets/planb/home/home-grid-3.jpg.png",
    title: "Desserts",
    alt: "Dessert plates served at Plan B"
  },
  {
    id: 4,
    image: "/assets/planb/home/home-grid-4.jpg.png",
    title: "Fresh Salads",
    alt: "Fresh salad dish at Plan B"
  },
  {
    id: 5,
    image: "/assets/planb/home/home-grid-5.jpg.png",
    title: "Main Dishes",
    alt: "Grilled chicken main dish at Plan B"
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

const reviewItems = [
  {
    name: "Lee Hayes",
    rating: 5,
    time: "2 days ago",
    badge: "NEW",
    text: "Good place, to chill and enjoy some food or a drink. Nice view, friendly staff and pleasant atmosphere with a little music too.",
    details: [],
    extra: "Food: 5/5 • Service: 5/5 • Atmosphere: 5/5"
  },
  {
    name: "Nermeen",
    rating: 5,
    time: "3 days ago",
    badge: "NEW",
    text: "",
    details: ["Breakfast • E£1–200"],
    extra: "Food: 5/5 • Service: 5/5 • Atmosphere: 5/5"
  },
  {
    name: "Ahmed Zeka",
    rating: 5,
    time: "3 days ago",
    badge: "NEW",
    text: "",
    details: [],
    extra: "Food: 5/5 • Service: 5/5 • Atmosphere: 5/5"
  },
  {
    name: "Labeb Atef",
    rating: 5,
    time: "2 weeks ago",
    badge: "NEW",
    text: "",
    details: ["E£1–200", "Group size: 9+ people", "Wait time: No wait"],
    extra: ""
  }
];

const HighlightIcon = ({ type }) => {
  const iconProps = {
    className: "h-7 w-7 text-coffee",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true
  };

  if (type === "wave") {
    return (
      <svg {...iconProps}>
        <path d="M3 14C5 14 5 10 7 10C9 10 9 14 11 14C13 14 13 10 15 10C17 10 17 14 19 14C20 14 20.5 13 21 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 18C5 18 5 14 7 14C9 14 9 18 11 18C13 18 13 14 15 14C17 14 17 18 19 18C20 18 20.5 17 21 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "dessert") {
    return (
      <svg {...iconProps}>
        <path d="M5 20H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 20V13.5C7 10.46 9.46 8 12.5 8H16.5V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 8C11 6.9 11.9 6 13 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "group") {
    return (
      <svg {...iconProps}>
        <circle cx="8" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4.5 18C4.5 15.51 6.51 13.5 9 13.5H15C17.49 13.5 19.5 15.51 19.5 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "family") {
    return (
      <svg {...iconProps}>
        <circle cx="8" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="1.75" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 19V17.5C5 15.84 6.34 14.5 8 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M19 19V17.5C19 15.84 17.66 14.5 16 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9.5 19V17.25C9.5 15.73 10.73 14.5 12.25 14.5H11.75C13.27 14.5 14.5 15.73 14.5 17.25V19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="M8 17V8L16 12.5L8 17Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M18.5 8.5C20.5 10.5 20.5 13.5 18.5 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [desktopReviewIndex, setDesktopReviewIndex] = useState(0);
  const [reviewCardsPerView, setReviewCardsPerView] = useState(3);
  const [isReviewsPaused, setIsReviewsPaused] = useState(false);
  const { startLoading, stopLoading } = useGlobalLoading();
  const reducedMotion = prefersReducedMotion();
  const reviewPages = Math.max(1, reviewItems.length - reviewCardsPerView + 1);

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
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setReviewCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setReviewCardsPerView(2);
      } else {
        setReviewCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);

    return () => {
      window.removeEventListener("resize", updateCardsPerView);
    };
  }, []);

  useEffect(() => {
    if (desktopReviewIndex > reviewPages - 1) {
      setDesktopReviewIndex(0);
    }
  }, [desktopReviewIndex, reviewPages]);

  useEffect(() => {
    if (isReviewsPaused || reviewPages <= 1) return;

    const intervalId = window.setInterval(() => {
      setDesktopReviewIndex((prev) => (prev + 1) % reviewPages);
    }, 4000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isReviewsPaused, reviewPages]);

  const nextDesktopReview = () => {
    setDesktopReviewIndex((prev) => (prev + 1) % reviewPages);
  };

  const prevDesktopReview = () => {
    setDesktopReviewIndex((prev) => (prev - 1 + reviewPages) % reviewPages);
  };

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

    const existingSchema = document.getElementById("home-seo-schema");
    if (existingSchema) {
      existingSchema.remove();
    }

    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.id = "home-seo-schema";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["LocalBusiness", "Restaurant"],
          name: "Plan B Restaurant & Cafe",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Gold Star Mall, Cornish Street",
            addressLocality: "Hurghada",
            addressCountry: "EG"
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              opens: "09:00",
              closes: "02:00"
            }
          ],
          servesCuisine: ["Seafood", "Grill", "Burgers", "Desserts"],
          telephone: "+201005260787",
          sameAs: ["https://www.google.com/maps?q=Plan+B+Cafe+%26+Restaurant+Hurghada"]
        },
        {
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          }))
        }
      ]
    });
    document.head.appendChild(schemaScript);

    return () => {
      document.title = previousTitle;
      if (descriptionTag) {
        descriptionTag.setAttribute("content", previousDescription);
      }
      const cleanupSchema = document.getElementById("home-seo-schema");
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
            alt="Sea view restaurant in Hurghada"
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
                className="flex flex-shrink-0 items-center gap-3 rounded-2xl border border-coffee/10 bg-surface-primary px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                variants={highlightItemVariants}
                whileHover="hover"
              >
                <span>
                  <HighlightIcon type={item.icon} />
                </span>
                <div>
                  <p className="text-sm font-bold text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-secondary">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Desktop: Grid */}
          <div className="hidden gap-4 md:grid md:grid-cols-5">
            {highlights.map((item) => (
              <motion.div
                key={item.id}
                className="flex flex-col items-center gap-2 rounded-2xl border border-coffee/10 bg-surface-primary px-4 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                variants={highlightItemVariants}
                whileHover="hover"
              >
                <span>
                  <HighlightIcon type={item.icon} />
                </span>
                <p className="text-sm font-bold text-text-primary">{item.label}</p>
                <p className="text-xs text-text-secondary">{item.description}</p>
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
                alt="Sunset sea view at Plan B Restaurant Hurghada"
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

      <section
        id="google-reviews"
        aria-labelledby="google-reviews-heading"
        className="relative overflow-hidden bg-[linear-gradient(180deg,#f8f6f3_0%,#f3eee7_40%,#efeae3_100%)] py-12 md:py-14"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(#8c6b4f_1px,transparent_1px)] [background-size:14px_14px]" />
        <div className="relative mx-auto max-w-[90rem] px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="google-reviews-heading" className="text-balance text-3xl font-semibold text-text-primary md:text-4xl">Google Reviews</h2>
              <p className="mt-1 text-sm text-text-secondary">Rated 5/5 on Google</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">5.0 <span className="text-[#d4a017] text-2xl md:text-3xl">★★★★★</span></p>
              <p className="mt-1 text-xs text-text-secondary">Based on real Google reviews</p>
            </div>
            <a
              href="https://www.google.com/maps/place/Plan+B+Caf%C3%A9+%26+Restaurant/@27.2585772,33.823205,17z/data=!4m8!3m7!1s0x14528756b4e5a9a7:0x4f65db9fe1cfb206!8m2!3d27.2585725!4d33.8257799!9m1!1b1!16s%2Fg%2F11yy_zfvpv?entry=ttu&g_ep=EgoyMDI2MDIxOC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-coffee/20 bg-white px-4 py-2 text-sm font-medium text-text-primary shadow-soft transition-colors hover:bg-surface-muted"
            >
              View on Google Maps
            </a>
          </div>

          <div
            className="mt-6 overflow-hidden"
            onMouseEnter={() => setIsReviewsPaused(true)}
            onMouseLeave={() => setIsReviewsPaused(false)}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${desktopReviewIndex * (100 / reviewCardsPerView)}%)` }}
            >
              {reviewItems.map((review, index) => {
                const activeIndex = Math.min(reviewItems.length - 1, desktopReviewIndex + Math.floor(reviewCardsPerView / 2));
                const isActive = index === activeIndex;

                return (
                  <article key={review.name} className="flex-shrink-0 px-2" style={{ width: `${100 / reviewCardsPerView}%` }}>
                    <div className={`relative flex h-[210px] flex-col overflow-hidden rounded-[26px] border border-neutral-200 bg-white p-4 shadow-[0_8px_20px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(0,0,0,0.1)] ${isActive ? "scale-[1.03] opacity-100" : "scale-100 opacity-90"}`}>
                      <span className="pointer-events-none absolute -left-1 top-0 text-7xl font-serif text-neutral-900/5">“</span>
                      <div className="relative z-10 flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{review.name}</p>
                          <p className="text-xs text-neutral-500">{review.time}</p>
                        </div>
                        <span className="text-xs font-semibold text-[#4285F4]" aria-label="Google badge">G</span>
                      </div>
                      <p className="relative z-10 mt-2 text-sm text-[#d4a017]" aria-label={`${review.rating} star rating`}>{"★★★★★"}</p>
                      <div className="relative z-10 mt-2 flex-1 space-y-1 text-sm text-neutral-700">
                        {review.text && <p className="line-clamp-3">{review.text}</p>}
                        {review.details.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                        {review.extra && <p className="line-clamp-2 text-neutral-800">{review.extra}</p>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={prevDesktopReview}
                aria-label="Previous review slide"
                className="rounded-full border border-coffee/20 bg-white px-2.5 py-1 text-xs text-text-primary"
              >
                ←
              </button>
              {Array.from({ length: reviewPages }).map((_, index) => (
                <button
                  key={`review-dot-${index}`}
                  type="button"
                  onClick={() => setDesktopReviewIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${desktopReviewIndex === index ? "bg-coffee" : "bg-coffee/25"}`}
                  aria-label={`Go to review slide ${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={nextDesktopReview}
                aria-label="Next review slide"
                className="rounded-full border border-coffee/20 bg-white px-2.5 py-1 text-xs text-text-primary"
              >
                →
              </button>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-text-secondary">Reviews shown are from Google.</p>
        </div>
      </section>

      <Section className="pb-8 pt-12 md:pb-10 md:pt-14">
        <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-2">
          <motion.div
            className="flex h-full flex-col rounded-3xl border border-coffee/10 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md md:p-7"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <h3 className="text-2xl font-semibold text-text-primary md:text-3xl">Visit Plan B on the Cornish</h3>
            <div className="mt-3 space-y-2 text-text-secondary leading-relaxed">
              <p>Find us at Gold Star Mall on Cornish Street, Hurghada — with relaxed sea view seating and easy access from the main promenade.</p>
              <p>Looking for a restaurant in Hurghada with sea view seating? Plan B offers breakfast, coffee, sunset drinks, and dinner in a comfortable coastal atmosphere.</p>
              <p>Open daily from 9:00 AM to 2:00 AM. Reserve easily via WhatsApp for quick confirmation.</p>
            </div>
            <div className="mt-4 space-y-2 text-sm text-text-secondary">
              <a href="https://www.google.com/maps/place/Plan+B+Caf%C3%A9+%26+Restaurant/@27.2585772,33.823205,17z/data=!4m8!3m7!1s0x14528756b4e5a9a7:0x4f65db9fe1cfb206!8m2!3d27.2585725!4d33.8257799!9m1!1b1!16s%2Fg%2F11yy_zfvpv?entry=ttu&g_ep=EgoyMDI2MDIxOC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-surface-muted/70"><span aria-hidden="true">📍</span> Location: Gold Star Mall, Cornish Street, Hurghada</a>
              <p className="flex items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-surface-muted/70"><span aria-hidden="true">🕘</span> Hours: Open daily 9:00 AM – 2:00 AM</p>
              <p className="flex items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-surface-muted/70"><span aria-hidden="true">💬</span> Reservations: WhatsApp confirmation</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={() => navigate("/booking")} variant="secondary" size="sm">
                Reserve on WhatsApp
              </Button>
              <Button onClick={() => navigate("/contact")} variant="ghost" size="sm">
                Contact &amp; Location
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="flex h-full flex-col rounded-3xl border border-coffee/10 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md md:p-7"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
          >
            <h3 className="text-xl font-semibold text-text-primary">Quick Info</h3>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-text-secondary md:text-[15px]">
              {[
                ["Cuisine", "Seafood • Grill • Burgers • Salads"],
                ["Best for", "Sea view • Families • Groups"],
                ["Hours", "Daily 9:00–2:00"],
                ["Reservations", "WhatsApp confirmation"]
              ].map(([label, value]) => (
                <li key={label} className="rounded-xl px-2 py-1 transition-colors hover:bg-surface-muted/70">
                  <span className="font-medium text-text-primary">{label}:</span> {value}
                </li>
              ))}
            </ul>
          </motion.div>
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
                    alt={image.alt_text || image.title || "Dining atmosphere and dishes at Plan B Restaurant Hurghada"}
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
                  size="lg"
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
