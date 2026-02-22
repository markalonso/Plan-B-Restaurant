import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import Stagger, { StaggerItem } from "../components/Stagger.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import menuData from "../data/menu.json";
import { supabase } from "../lib/supabaseClient.js";
import { MenuItemSkeleton } from "../components/ui/Skeleton.jsx";
import { useGlobalLoading } from "../context/LoadingContext.jsx";
import { resolveFirstExistingTable } from "../lib/adminTableResolver.js";

const normalizeValue = (value) => String(value ?? "").trim().toLowerCase();
const whatsappNumber = "201005260787";

const formatPrice = (price) => {
  if (typeof price === "string") {
    return price.includes("EGP") ? price : `EGP ${price}`;
  }
  if (typeof price === "number") {
    return `EGP ${price}`;
  }
  return "EGP";
};

const extractNumericPrice = (price) => {
  const numeric = Number.parseFloat(String(price ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
};

const toSlug = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "menu";

const fallbackImage =
  "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80";

const MENU_DESCRIPTION =
  "Explore breakfast, coffee, burgers, seafood and desserts at Plan B Restaurant & Cafe, Hurghada Cornish Street, with sea-view dining and menu categories.";

const updateHeadTag = ({ selector, createTag, attributeName, attributeValue, content }) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement(createTag);
    element.setAttribute(attributeName, attributeValue);
    element.setAttribute("data-menu-meta", "true");
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const buildOptimizedImage = (rawUrl, width, useWebp = false) => {
  const url = rawUrl || fallbackImage;

  if (!/^https?:\/\//i.test(url)) {
    return url;
  }

  try {
    const parsed = new URL(url);
    parsed.searchParams.set("q", "78");
    parsed.searchParams.set("w", String(width));
    parsed.searchParams.set("fit", "crop");
    parsed.searchParams.set("auto", "format");
    if (useWebp) {
      parsed.searchParams.set("fm", "webp");
      parsed.searchParams.set("format", "webp");
    }
    return parsed.toString();
  } catch {
    return url;
  }
};

const MenuImage = ({ src, alt, eager = false }) => {
  const [loaded, setLoaded] = useState(false);
  const safeSrc = src || fallbackImage;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-muted" style={{ aspectRatio: "4 / 3" }}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-coffee/10" aria-hidden="true" />}
      <picture>
        <source
          type="image/webp"
          srcSet={[360, 540, 720]
            .map((size) => `${buildOptimizedImage(safeSrc, size, true)} ${size}w`)
            .join(", ")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <img
          src={buildOptimizedImage(safeSrc, 720)}
          srcSet={[360, 540, 720]
            .map((size) => `${buildOptimizedImage(safeSrc, size)} ${size}w`)
            .join(", ")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={alt}
          width="720"
          height="540"
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition duration-200 ease-out group-hover:scale-[1.03] ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </picture>
    </div>
  );
};

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategorySlug, setActiveCategorySlug] = useState("all");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [comfortPicks, setComfortPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState(null);
  const [showReserveHelp, setShowReserveHelp] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isCategoryBarSticky, setIsCategoryBarSticky] = useState(false);
  const { startLoading, stopLoading } = useGlobalLoading();

  const categoryNavRef = useRef(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    let isMounted = true;

    const loadMenu = async () => {
      setLoading(true);
      startLoading();

      try {
        const comfortTable = await resolveFirstExistingTable([
          "menu_comfort_picks",
          "comfort_picks",
          "home_comfort_picks"
        ]);

        const [categoriesRes, itemsRes, picksRes] = await Promise.all([
          supabase
            .from("menu_categories")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("name", { ascending: true }),
          supabase
            .from("menu_items")
            .select("*")
            .eq("is_available", true)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false }),
          comfortTable
            ? supabase
                .from(comfortTable)
                .select("*")
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: false })
            : Promise.resolve({ data: [], error: null })
        ]);

        if (!isMounted) return;

        if (!categoriesRes.error && !itemsRes.error) {
          setCategories(categoriesRes.data ?? []);
          setItems(itemsRes.data ?? []);
        } else {
          setCategories((menuData.categories ?? []).map((name, index) => ({ id: name, name, sort_order: index })));
          setItems((menuData.items ?? []).map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image_url: item.image,
            category_id: item.category,
            is_available: true,
            sort_order: 0,
            is_popular: Boolean(item.popular)
          })));
        }

        if (!picksRes.error && (picksRes.data?.length ?? 0) > 0) {
          setComfortPicks(picksRes.data);
        } else {
          setComfortPicks((menuData.items ?? []).filter((item) => item.popular));
        }
      } finally {
        if (isMounted) setLoading(false);
        stopLoading();
      }
    };

    loadMenu();

    return () => {
      isMounted = false;
    };
  }, [startLoading, stopLoading]);

  const categoryNameById = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const uniqueItems = useMemo(() => {
    const seen = new Set();
    return items.filter((item) => {
      const idKey = String(item?.id ?? "");
      if (!idKey || seen.has(idKey)) return false;
      seen.add(idKey);
      return true;
    });
  }, [items]);

  const hasPopularItems = useMemo(
    () => uniqueItems.some((item) => Boolean(item.is_popular ?? item.popular)),
    [uniqueItems]
  );

  const categorySections = useMemo(() => {
    const base = categories
      .filter((category) => Boolean(category.name))
      .map((category) => ({
        id: category.id,
        name: category.name,
        slug: toSlug(category.name)
      }));

    if (hasPopularItems) {
      return [{ id: "popular", name: "Most Popular", slug: "most-popular" }, ...base];
    }

    return base;
  }, [categories, hasPopularItems]);

  const groupedItems = useMemo(() => {
    const query = normalizeValue(searchQuery);

    return categorySections
      .map((section) => {
        const sectionItems = uniqueItems.filter((item) => {
          const isPopularSection = section.slug === "most-popular";
          const categoryName = categoryNameById[item.category_id] || item.category_id || "";
          const belongsToSection = isPopularSection
            ? Boolean(item.is_popular ?? item.popular)
            : normalizeValue(categoryName) === normalizeValue(section.name);

          if (!belongsToSection) return false;
          if (!query) return true;

          const haystack = `${item.name ?? ""} ${item.description ?? ""}`.toLowerCase();
          return haystack.includes(query);
        });

        return { ...section, items: sectionItems };
      })
      .filter((section) => section.items.length > 0 || !searchQuery.trim());
  }, [categoryNameById, categorySections, searchQuery, uniqueItems]);

  const resultsCount = useMemo(
    () => groupedItems.reduce((sum, section) => sum + section.items.length, 0),
    [groupedItems]
  );

  const menuLastUpdated = useMemo(() => {
    const timestamps = uniqueItems
      .map((item) => item.updated_at || item.created_at)
      .filter(Boolean)
      .map((value) => new Date(value).getTime())
      .filter(Number.isFinite);

    if (!timestamps.length) return null;
    return new Date(Math.max(...timestamps)).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }, [uniqueItems]);

  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
    const pageUrl = `${window.location.origin}/menu`;
    const ogImage = buildOptimizedImage(uniqueItems[0]?.image_url || uniqueItems[0]?.image || fallbackImage, 1200, true);

    document.title = "Menu | Plan B Restaurant & Cafe – Hurghada Cornish Street";

    updateHeadTag({
      selector: 'meta[name="description"]',
      createTag: "meta",
      attributeName: "name",
      attributeValue: "description",
      content: MENU_DESCRIPTION
    });

    const socialTags = [
      ["property", "og:title", "Menu | Plan B Restaurant & Cafe – Hurghada Cornish Street"],
      ["property", "og:description", MENU_DESCRIPTION],
      ["property", "og:type", "website"],
      ["property", "og:url", pageUrl],
      ["property", "og:image", ogImage],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", "Menu | Plan B Restaurant & Cafe – Hurghada Cornish Street"],
      ["name", "twitter:description", MENU_DESCRIPTION],
      ["name", "twitter:image", ogImage]
    ];

    socialTags.forEach(([attributeName, attributeValue, content]) => {
      updateHeadTag({
        selector: `meta[${attributeName}="${attributeValue}"]`,
        createTag: "meta",
        attributeName,
        attributeValue,
        content
      });
    });

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      canonical.setAttribute("data-menu-meta", "true");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);

    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.id = "menu-seo-schema";

    const menuSectionsSchema = categorySections.map((section) => {
      const sectionGroup = groupedItems.find((entry) => entry.slug === section.slug);
      return {
        "@type": "MenuSection",
        name: section.name,
        hasMenuItem: (sectionGroup?.items || []).map((item) => {
          const numericPrice = extractNumericPrice(item.price);
          return {
            "@type": "MenuItem",
            name: item.name,
            description: item.description,
            ...(numericPrice
              ? {
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "EGP",
                    price: numericPrice
                  }
                }
              : {})
          };
        })
      };
    });

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["Restaurant", "LocalBusiness"],
          name: "Plan B Restaurant & Cafe",
          url: pageUrl,
          telephone: "+201005260787",
          openingHours: "Mo-Su 09:00-02:00",
          servesCuisine: ["Seafood", "Grill", "Burgers", "Pizza", "Pasta", "Coffee", "Desserts", "Cocktails"],
          address: {
            "@type": "PostalAddress",
            streetAddress: "Gold Star Mall, Cornish Street",
            addressLocality: "Hurghada",
            addressCountry: "EG"
          },
          hasMenu: {
            "@type": "Menu",
            name: "Plan B Restaurant & Cafe Menu",
            url: pageUrl,
            hasMenuSection: menuSectionsSchema
          }
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: window.location.origin
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Menu",
              item: pageUrl
            }
          ]
        }
      ]
    });

    const existingSchema = document.getElementById("menu-seo-schema");
    if (existingSchema) existingSchema.remove();
    document.head.appendChild(schemaScript);

    return () => {
      document.title = previousTitle;
      const descriptionTag = document.querySelector('meta[name="description"]');
      if (descriptionTag) {
        descriptionTag.setAttribute("content", previousDescription);
      }
      document.querySelectorAll('[data-menu-meta="true"]').forEach((element) => element.remove());
      const cleanupSchema = document.getElementById("menu-seo-schema");
      if (cleanupSchema) cleanupSchema.remove();
    };
  }, [categorySections, groupedItems, uniqueItems]);

  useEffect(() => {
    const handleHashNavigation = () => {
      const nextHash = window.location.hash.replace("#", "").trim();
      if (!nextHash) {
        setActiveCategorySlug("all");
        return;
      }

      const sectionExists = categorySections.some((section) => section.slug === nextHash);
      if (sectionExists) {
        setActiveCategorySlug(nextHash);

        const target = sectionRefs.current[nextHash];
        if (target) {
          window.setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 80);
        }
      }
    };

    handleHashNavigation();
    window.addEventListener("hashchange", handleHashNavigation);

    return () => {
      window.removeEventListener("hashchange", handleHashNavigation);
    };
  }, [categorySections]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 900);
      if (categoryNavRef.current) {
        const top = categoryNavRef.current.getBoundingClientRect().top;
        setIsCategoryBarSticky(top <= 80);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const reserveWhatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi Plan B, I'd like to reserve a table. Name: __, Guests: __, Time: __"
  )}`;

  const navigateToCategory = (slug) => {
    setActiveCategorySlug(slug);

    if (slug === "all") {
      window.history.replaceState(null, "", "/menu");
      if (categoryNavRef.current) {
        categoryNavRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    window.history.replaceState(null, "", `/menu#${slug}`);
    const section = sectionRefs.current[slug];
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openDishFromPick = (pick) => {
    const normalizedName = normalizeValue(pick.name);
    const dish = uniqueItems.find((item) => normalizeValue(item.name) === normalizedName) || pick;

    setSelectedDish(dish);

    const matchedSection = groupedItems.find((section) =>
      section.items.some((item) => normalizeValue(item.name) === normalizedName)
    );

    if (matchedSection?.slug) {
      navigateToCategory(matchedSection.slug);
    }
  };

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-6xl space-y-8">
        <nav aria-label="Breadcrumb" className="text-sm text-text-muted">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="transition hover:text-text-primary">Home</Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li className="text-text-primary">Menu</li>
          </ol>
        </nav>

        <Reveal>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-text-primary md:text-4xl">Menu</h1>
            <p className="max-w-3xl text-sm text-text-secondary md:text-base">
              Explore our menu at Plan B Restaurant & Cafe in Hurghada — from breakfast and specialty coffee to
              burgers, seafood, and desserts. Visit us on Cornish Street for relaxed sea-view dining across multiple
              categories.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button className="!px-5" onClick={() => window.open(reserveWhatsappLink, "_blank", "noopener,noreferrer")}>
                Reserve on WhatsApp
              </Button>
              <button
                type="button"
                onClick={() => setShowReserveHelp(true)}
                className="text-sm font-medium text-coffee underline decoration-coffee/40 underline-offset-4 transition hover:text-coffee-dark"
              >
                How reservations work
              </button>
            </div>
            {menuLastUpdated && <p className="text-xs text-text-muted">Menu last updated: {menuLastUpdated}</p>}
          </div>
        </Reveal>

        <Reveal>
          <SectionHeading
            eyebrow="Menu"
            title="House Comfort Picks"
            subtitle="Popular picks guests order most."
          />
        </Reveal>

        <Stagger className="grid gap-4 md:grid-cols-2" animateOnView={false}>
          {comfortPicks.map((item) => (
            <StaggerItem key={item.id}>
              <Card className="group flex cursor-pointer gap-4 p-4 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-layered" hoverable={false}>
                <button type="button" onClick={() => openDishFromPick(item)} className="flex w-full gap-4 text-left">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                    <MenuImage
                      src={item.image_url || item.image || fallbackImage}
                      alt={`${item.name} at Plan B Restaurant & Cafe Hurghada`}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-text-primary md:text-lg">{item.name}</h3>
                      <span className="text-xs font-semibold text-coffee md:text-sm">{formatPrice(item.price)}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{item.description}</p>
                  </div>
                </button>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="space-y-3" ref={categoryNavRef}>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="menu-search" className="text-sm font-medium text-text-primary">
                Search menu
              </label>
              <span className="text-xs text-text-muted">{resultsCount} results</span>
            </div>
            <div className="relative">
              <input
                id="menu-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by dish or ingredient"
                className="w-full rounded-ui-default border border-coffee/15 bg-white/90 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-coffee/35 focus:ring-2 focus:ring-coffee/15"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none text-text-muted transition hover:text-text-primary"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div
              className={`sticky top-20 z-30 -mx-2 rounded-2xl px-2 py-2 transition duration-200 ease-out ${
                isCategoryBarSticky ? "bg-white/85 shadow-md backdrop-blur" : "bg-transparent"
              }`}
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-surface-primary to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-surface-primary to-transparent" />
                <div className="scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto px-1">
                  <Button
                    type="button"
                    variant={activeCategorySlug === "all" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => navigateToCategory("all")}
                    className="snap-start whitespace-nowrap"
                  >
                    All
                  </Button>
                  {categorySections.map((category) => (
                    <Button
                      key={category.slug}
                      type="button"
                      variant={activeCategorySlug === category.slug ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => navigateToCategory(category.slug)}
                      className="snap-start whitespace-nowrap"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {loading ? (
          <MenuItemSkeleton count={4} />
        ) : groupedItems.every((section) => section.items.length === 0) ? (
          <Card className="flex flex-col gap-3" hoverable={false}>
            <p className="text-sm text-text-secondary">No dishes match your search right now.</p>
            <Button variant="secondary" onClick={() => setSearchQuery("")}>Clear search</Button>
          </Card>
        ) : (
          <div className="space-y-10">
            {groupedItems.map((section, sectionIndex) => (
              <section
                key={section.slug}
                id={section.slug}
                ref={(node) => {
                  sectionRefs.current[section.slug] = node;
                }}
                className="scroll-mt-36 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-text-primary">{section.name}</h2>
                  <span className="text-xs text-text-muted">{section.items.length} items</span>
                </div>

                <Stagger className="grid gap-4 sm:grid-cols-2" animateOnView={false}>
                  {section.items.map((item, itemIndex) => (
                    <StaggerItem key={`${section.slug}-${item.id}`}>
                      <Card className="group cursor-pointer space-y-3 p-4 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-layered" hoverable={false}>
                        <button type="button" onClick={() => setSelectedDish(item)} className="w-full space-y-3 text-left">
                          <MenuImage
                            src={item.image_url || item.image || fallbackImage}
                            alt={`${item.name} at Plan B Restaurant & Cafe Hurghada`}
                            eager={sectionIndex === 0 && itemIndex < 2}
                          />
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-semibold text-text-primary md:text-lg">{item.name}</h3>
                            <span className="shrink-0 text-sm font-semibold text-coffee">{formatPrice(item.price)}</span>
                          </div>
                          <p className="text-sm leading-relaxed text-text-secondary">{item.description}</p>
                        </button>
                      </Card>
                    </StaggerItem>
                  ))}
                </Stagger>

                <button
                  type="button"
                  onClick={() => categoryNavRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="text-xs font-medium text-coffee underline decoration-coffee/40 underline-offset-4 transition hover:text-coffee-dark"
                >
                  Back to categories
                </button>
              </section>
            ))}
          </div>
        )}
      </div>

      {selectedDish && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm md:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedDish.name} details`}
          onClick={() => setSelectedDish(null)}
        >
          <div
            className="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-xl md:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <MenuImage
              src={selectedDish.image_url || selectedDish.image || fallbackImage}
              alt={`${selectedDish.name} at Plan B Restaurant & Cafe Hurghada`}
              eager
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold text-text-primary">{selectedDish.name}</h3>
                <span className="text-sm font-semibold text-coffee">{formatPrice(selectedDish.price)}</span>
              </div>
              <p className="text-sm text-text-secondary">{selectedDish.description}</p>
            </div>
            <div className="mt-5 flex gap-2">
              <Button
                className="flex-1"
                onClick={() => window.open(reserveWhatsappLink, "_blank", "noopener,noreferrer")}
              >
                Reserve on WhatsApp
              </Button>
              <Button variant="secondary" onClick={() => setSelectedDish(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {showReserveHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="How reservations work"
          onClick={() => setShowReserveHelp(false)}
        >
          <Card className="max-w-md space-y-3" hoverable={false}>
            <h3 className="text-lg font-semibold text-text-primary">How reservations work</h3>
            <p className="text-sm text-text-secondary">
              Send us your name, number of guests, and preferred time on WhatsApp. Our team confirms your table quickly.
            </p>
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setShowReserveHelp(false)}>
                Got it
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-5 z-40 rounded-full border border-coffee/15 bg-white/90 px-3 py-2 text-xs font-semibold text-text-primary shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Back to top
        </button>
      )}
    </div>
  );
};

export default Menu;
