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

const normalizeValue = (value) => value.trim().toLowerCase();

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
            sort_order: 0
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

  const categoryOptions = useMemo(
    () => ["All", ...categories.map((category) => category.name)],
    [categories]
  );

  const normalizedCategory = normalizeValue(activeCategory);

  const filteredItems = useMemo(() => {
    if (normalizedCategory === "all") {
      return items;
    }

    return items.filter((item) => {
      const name = categoryNameById[item.category_id] || item.category_id || "";
      return normalizeValue(name) === normalizedCategory;
    });
  }, [categoryNameById, items, normalizedCategory]);

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-6xl space-y-10">
        <Reveal>
          <SectionHeading
            eyebrow="Menu"
            title="House Comfort Picks"
            subtitle="Curated favorites for slow evenings and easy mornings."
          />
        </Reveal>

        <Stagger className="grid gap-6 md:grid-cols-2" animateOnView={false}>
          {comfortPicks.map((item) => (
            <StaggerItem key={item.id}>
              <Card className="group flex gap-4 transition duration-200 hover:-translate-y-1 hover:shadow-layered">
                <img
                  src={item.image_url || item.image || fallbackImage}
                  alt={item.name}
                  className="h-24 w-24 rounded-2xl object-cover"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {item.name}
                    </h3>
                    <span className="text-sm font-semibold text-coffee">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">{item.description}</p>
                </div>
              </Card>
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

        <Reveal delay={0.15}>
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
          <Stagger className="grid gap-6 md:grid-cols-2" animateOnView={false}>
            {filteredItems.map((item) => (
              <StaggerItem key={item.id}>
                <Card className="group space-y-3 transition duration-200 hover:-translate-y-1 hover:shadow-layered">
                  <img
                    src={item.image_url || item.image || fallbackImage}
                    alt={item.name}
                    className="h-44 w-full rounded-2xl object-cover"
                  />
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {item.name}
                    </h3>
                    <span className="text-sm font-semibold text-coffee">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">{item.description}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
};

export default Menu;
