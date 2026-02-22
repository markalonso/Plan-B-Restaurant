import { useEffect, useMemo, useState } from "react";
import Reveal from "../components/Reveal.jsx";
import Stagger, { StaggerItem } from "../components/Stagger.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import GlassPanel from "../components/ui/GlassPanel.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import menuData from "../data/menu.json";
import { supabase } from "../lib/supabaseClient.js";
import { MenuItemSkeleton } from "../components/ui/Skeleton.jsx";
import { useGlobalLoading } from "../context/LoadingContext.jsx";
import { resolveFirstExistingTable } from "../lib/adminTableResolver.js";

const normalizeValue = (value) => String(value ?? "").trim().toLowerCase();

const MOST_POPULAR_CATEGORY = "Most Popular";

const formatPrice = (price) => {
  if (typeof price === "string") {
    return price.includes("EGP") ? price : `EGP ${price}`;
  }
  if (typeof price === "number") {
    return `EGP ${price}`;
  }
  return "EGP";
};

const fallbackImage =
  "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80";

const reserveWhatsAppLink = `https://wa.me/201005260787?text=${encodeURIComponent(
  "Hi, I'd like to reserve a table at Plan B."
)}`;

const enhanceDescription = (description) => {
  if (!description) return "";
  const cleanDescription = description.trim().replace(/\.$/, "");
  return `Thoughtfully prepared with ${cleanDescription.toLowerCase()}.`;
};

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [comfortPicks, setComfortPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { startLoading, stopLoading } = useGlobalLoading();

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

        if (!isMounted) {
          return;
        }

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
        if (isMounted) {
          setLoading(false);
        }
        stopLoading();
      }
    };

    loadMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryNameById = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const uniqueItems = useMemo(() => {
    const seen = new Set();
    return items.filter((item) => {
      if (!item?.id || seen.has(item.id)) return false;
      seen.add(item.id);
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

    return [
      "All",
      ...(hasPopularItems ? [MOST_POPULAR_CATEGORY] : []),
      ...names
    ];
  }, [categories, hasPopularItems]);

  const normalizedCategory = normalizeValue(activeCategory);

  const filteredItems = useMemo(() => {
    if (normalizedCategory === "all") {
      return uniqueItems;
    }

    if (normalizedCategory === normalizeValue(MOST_POPULAR_CATEGORY)) {
      return uniqueItems.filter((item) => Boolean(item.is_popular ?? item.popular));
    }

    return uniqueItems.filter((item) => {
      const name = categoryNameById[item.category_id] || item.category_id || "";
      return normalizeValue(name) === normalizedCategory;
    });
  }, [categoryNameById, normalizedCategory, uniqueItems]);

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-6xl space-y-10">
        <Reveal>
          <SectionHeading
            eyebrow="Menu"
            title="House Comfort Picks"
            subtitle="Explore the full menu at Plan B Restaurant & Cafe in Hurghada — from breakfast and specialty coffee to gourmet burgers and fresh seafood."
          />
          <div className="mt-3 space-y-1 text-sm text-text-secondary">
            <p>Join us on Cornish Street for relaxed sea-view dining.</p>
            <p>Crafted for lingering breakfasts, sunset burgers, and fresh coastal plates.</p>
          </div>
        </Reveal>

        <Stagger className="grid gap-6 md:grid-cols-2" animateOnView={false}>
          {comfortPicks.map((item) => (
            <StaggerItem key={item.id}>
              <a href={reserveWhatsAppLink} target="_blank" rel="noreferrer" className="block">
                <Card className="group flex gap-3 p-3 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-layered md:gap-4 md:p-5">
                  <div className="h-20 w-20 overflow-hidden rounded-xl shadow-sm md:h-24 md:w-24 md:rounded-2xl">
                    <img
                      src={item.image_url || item.image || fallbackImage}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-200 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-text-primary md:text-lg">
                        {item.name}
                      </h3>
                      <span className="whitespace-nowrap text-sm font-bold text-coffee md:text-base">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary md:text-sm">{enhanceDescription(item.description)}</p>
                    <p className="text-xs font-medium text-coffee/80">Reserve this experience →</p>
                  </div>
                </Card>
              </a>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <GlassPanel className="space-y-3">
            <h3 className="text-xl font-semibold text-text-primary">
              Comfort, made with care.
            </h3>
            <p className="text-sm text-text-secondary">
              Familiar flavors, clean ingredients, and a calm coastal mood — day
              to night.
            </p>
          </GlassPanel>
        </Reveal>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-coffee/20 to-transparent" />

        <Reveal delay={0.15}>
          <p className="text-xs tracking-wide text-text-secondary/80">
            Over 60 freshly prepared dishes across 11 curated categories.
          </p>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => (
              <Button
                key={category}
                type="button"
                variant={activeCategory === category ? "primary" : "secondary"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </Reveal>

        {loading ? (
          <MenuItemSkeleton count={4} />
        ) : filteredItems.length === 0 ? (
          <Card className="flex flex-col gap-3">
            <p className="text-sm text-text-secondary">
              No items match this category yet.
            </p>
            <Button variant="secondary" onClick={() => setActiveCategory("All")}>
              Show all items
            </Button>
          </Card>
        ) : (
          <Stagger className="grid gap-3 md:grid-cols-2 md:gap-6" animateOnView={false}>
            {filteredItems.map((item) => (
              <StaggerItem key={item.id}>
                <a href={reserveWhatsAppLink} target="_blank" rel="noreferrer" className="block">
                  <Card className="group flex items-start gap-3 p-3 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-layered md:block md:space-y-3 md:p-5">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl shadow-sm md:h-44 md:w-full md:rounded-2xl">
                      <img
                        src={item.image_url || item.image || fallbackImage}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-200 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="min-w-0 space-y-1.5 md:space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-semibold text-text-primary md:text-lg">
                          {item.name}
                        </h3>
                        <span className="whitespace-nowrap text-sm font-bold text-coffee md:text-base">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary md:text-sm">{enhanceDescription(item.description)}</p>
                      <p className="text-xs font-medium text-coffee/80">Reserve this experience →</p>
                    </div>
                  </Card>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
};

export default Menu;
