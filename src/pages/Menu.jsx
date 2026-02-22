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
const toSlug = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const MOST_POPULAR_CATEGORY = "Most Popular";
const whatsappNumber = "201005260787";
const fallbackImage =
  "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80";
const MENU_DESCRIPTION =
  "Explore breakfast, coffee, burgers, seafood and desserts at Plan B Restaurant & Cafe, Hurghada Cornish Street, with sea-view dining and menu categories.";

const formatPrice = (price) => {
  if (typeof price === "string") return price.includes("EGP") ? price : `EGP ${price}`;
  if (typeof price === "number") return `EGP ${price}`;
  return "EGP";
};

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

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
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
      acc[String(category.id)] = category.name;
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

  const categoryOptions = useMemo(() => {
    const names = categories
      .map((category) => category.name)
      .filter(Boolean)
      .filter((name) => normalizeValue(name) !== normalizeValue(MOST_POPULAR_CATEGORY));

    return ["All", ...(hasPopularItems ? [MOST_POPULAR_CATEGORY] : []), ...names];
  }, [categories, hasPopularItems]);

  const categoryBySlug = useMemo(
    () =>
      categoryOptions.reduce((acc, category) => {
        const slug = toSlug(category);
        if (slug) {
          acc[slug] = category;
        }
        return acc;
      }, {}),
    [categoryOptions]
  );

  const filteredItems = useMemo(() => {
    const normalizedCategory = normalizeValue(activeCategory);
    const query = normalizeValue(searchQuery);

    return uniqueItems.filter((item) => {
      const categoryName = categoryNameById[String(item.category_id)] || item.category_name || item.category_id || "";

      const categoryMatch =
        normalizedCategory === "all"
          ? true
          : normalizedCategory === normalizeValue(MOST_POPULAR_CATEGORY)
            ? Boolean(item.is_popular ?? item.popular)
            : normalizeValue(categoryName) === normalizedCategory;

      if (!categoryMatch) return false;
      if (!query) return true;

      const haystack = `${item.name ?? ""} ${item.description ?? ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [activeCategory, categoryNameById, searchQuery, uniqueItems]);

  useEffect(() => {
    const applyCategoryFromHash = () => {
      const hash = window.location.hash.replace("#", "").trim();
      if (!hash) {
        setActiveCategory("All");
        return;
      }

      const decoded = decodeURIComponent(hash);
      const matchedCategory = categoryBySlug[toSlug(decoded)];
      if (matchedCategory) {
        setActiveCategory(matchedCategory);
      }
    };

    applyCategoryFromHash();
    window.addEventListener("hashchange", applyCategoryFromHash);

    return () => window.removeEventListener("hashchange", applyCategoryFromHash);
  }, [categoryBySlug]);

  useEffect(() => {
    const pageUrl = `${window.location.origin}/menu`;
    const previousTitle = document.title;
    const previousDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";

    document.title = "Menu | Plan B Restaurant & Cafe – Hurghada Cornish Street";

    updateHeadTag({
      selector: 'meta[name="description"]',
      createTag: "meta",
      attributeName: "name",
      attributeValue: "description",
      content: MENU_DESCRIPTION
    });

    updateHeadTag({
      selector: 'meta[property="og:title"]',
      createTag: "meta",
      attributeName: "property",
      attributeValue: "og:title",
      content: "Menu | Plan B Restaurant & Cafe – Hurghada Cornish Street"
    });

    updateHeadTag({
      selector: 'meta[property="og:description"]',
      createTag: "meta",
      attributeName: "property",
      attributeValue: "og:description",
      content: MENU_DESCRIPTION
    });

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      canonical.setAttribute("data-menu-meta", "true");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);

    return () => {
      document.title = previousTitle;
      const descriptionTag = document.querySelector('meta[name="description"]');
      if (descriptionTag) descriptionTag.setAttribute("content", previousDescription);
      document.querySelectorAll('[data-menu-meta="true"]').forEach((node) => node.remove());
    };
  }, []);

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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openDishFromPick = (pick) => {
    const match = uniqueItems.find((item) => normalizeValue(item.name) === normalizeValue(pick.name));
    const dish = match || pick;
    setSelectedDish(dish);

    const dishCategoryName = categoryNameById[String(dish.category_id)] || dish.category || dish.category_name;
    if (dishCategoryName) {
      setActiveCategory(dishCategoryName);
      window.history.replaceState(null, "", `/menu#${toSlug(dishCategoryName)}`);
    }
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);

    if (normalizeValue(category) === "all") {
      window.history.replaceState(null, "", "/menu");
      return;
    }

    window.history.replaceState(null, "", `/menu#${toSlug(category)}`);
  };

  const reserveWhatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi Plan B, I'd like to reserve a table. Name: __, Guests: __, Time: __"
  )}`;

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-6xl space-y-8">
        <nav aria-label="Breadcrumb" className="text-sm text-text-muted">
          <ol className="flex items-center gap-2">
            <li><Link to="/" className="transition hover:text-text-primary">Home</Link></li>
            <li aria-hidden="true">&gt;</li>
            <li className="text-text-primary">Menu</li>
          </ol>
        </nav>

        <Reveal>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-text-primary md:text-4xl">Menu</h1>
            <p className="max-w-3xl text-sm text-text-secondary md:text-base">
              Explore our menu at Plan B Restaurant & Cafe in Hurghada — from breakfast and specialty coffee to
              burgers, seafood, and desserts. Visit us on Cornish Street for relaxed sea-view dining.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => window.open(reserveWhatsappLink, "_blank", "noopener,noreferrer")}>Reserve on WhatsApp</Button>
              <button
                type="button"
                onClick={() => setShowReserveHelp(true)}
                className="text-sm font-medium text-coffee underline decoration-coffee/40 underline-offset-4 transition hover:text-coffee-dark"
              >
                How reservations work
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <SectionHeading eyebrow="Menu" title="House Comfort Picks" subtitle="Popular picks guests order most." />
        </Reveal>

        <Stagger className="grid gap-4 md:grid-cols-2" animateOnView={false}>
          {comfortPicks.map((item) => (
            <StaggerItem key={item.id}>
              <Card className="group flex cursor-pointer gap-4 p-4 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-layered" hoverable={false}>
                <button type="button" onClick={() => openDishFromPick(item)} className="flex w-full gap-4 text-left">
                  <img
                    src={item.image_url || item.image || fallbackImage}
                    alt={`${item.name} at Plan B Restaurant & Cafe Hurghada`}
                    className="h-20 w-20 rounded-2xl object-cover"
                    loading="lazy"
                    decoding="async"
                  />
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
              <label htmlFor="menu-search" className="text-sm font-medium text-text-primary">Search menu</label>
              <span className="text-xs text-text-muted">{filteredItems.length} results</span>
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
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={activeCategory === category ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleCategorySelect(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {loading ? (
          <MenuItemSkeleton count={4} />
        ) : filteredItems.length === 0 ? (
          <Card className="flex flex-col gap-3" hoverable={false}>
            <p className="text-sm text-text-secondary">No dishes match your current filters.</p>
            <Button variant="secondary" onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}>Show all items</Button>
          </Card>
        ) : (
          <Stagger className="grid gap-4 sm:grid-cols-2" animateOnView={false}>
            {filteredItems.map((item, index) => (
              <StaggerItem key={item.id}>
                <Card className="group cursor-pointer space-y-3 p-4 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-layered" hoverable={false}>
                  <button type="button" onClick={() => setSelectedDish(item)} className="w-full space-y-3 text-left">
                    <img
                      src={item.image_url || item.image || fallbackImage}
                      alt={`${item.name} at Plan B Restaurant & Cafe Hurghada`}
                      className="h-44 w-full rounded-2xl object-cover"
                      loading={index < 2 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-base font-semibold text-text-primary md:text-lg">{item.name}</h2>
                      <span className="shrink-0 text-sm font-semibold text-coffee">{formatPrice(item.price)}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-text-secondary">{item.description}</p>
                  </button>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
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
          <div className="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-xl md:rounded-3xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={selectedDish.image_url || selectedDish.image || fallbackImage}
              alt={`${selectedDish.name} at Plan B Restaurant & Cafe Hurghada`}
              className="h-56 w-full rounded-2xl object-cover"
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold text-text-primary">{selectedDish.name}</h3>
                <span className="text-sm font-semibold text-coffee">{formatPrice(selectedDish.price)}</span>
              </div>
              <p className="text-sm text-text-secondary">{selectedDish.description}</p>
            </div>
            <div className="mt-5 flex gap-2">
              <Button className="flex-1" onClick={() => window.open(reserveWhatsappLink, "_blank", "noopener,noreferrer")}>Reserve on WhatsApp</Button>
              <Button variant="secondary" onClick={() => setSelectedDish(null)}>Close</Button>
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
            <p className="text-sm text-text-secondary">Send us your name, number of guests, and preferred time on WhatsApp. Our team confirms your table quickly.</p>
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setShowReserveHelp(false)}>Got it</Button>
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
