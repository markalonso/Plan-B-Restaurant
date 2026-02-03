import { useEffect, useMemo, useState } from "react";
import Reveal from "../components/Reveal.jsx";
import Stagger, { StaggerItem } from "../components/Stagger.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import GlassPanel from "../components/ui/GlassPanel.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import { supabase } from "../lib/supabaseClient.js";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadMenu = async () => {
      setLoading(true);
      const [categoryRes, itemRes] = await Promise.all([
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
      ]);

      if (isMounted) {
        setCategories(categoryRes.data ?? []);
        setItems(itemRes.data ?? []);
        setLoading(false);
      }
    };

    loadMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryOptions = useMemo(
    () => ["All", ...categories.map((category) => category.name)],
    [categories]
  );

  const popularItems = items.filter((item) => item.is_popular);

  const itemsWithCategory = useMemo(() => {
    const lookup = categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});

    return items.map((item) => ({
      ...item,
      category_name: lookup[item.category_id]
    }));
  }, [categories, items]);

  const displayItems = useMemo(() => {
    if (activeCategory === "All") {
      return itemsWithCategory;
    }
    return itemsWithCategory.filter(
      (item) => item.category_name === activeCategory
    );
  }, [activeCategory, itemsWithCategory]);

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

        <Stagger className="grid gap-6 md:grid-cols-2">
          {loading ? (
            <p className="text-sm text-slate-500">Loading menu…</p>
          ) : (
            popularItems.map((item) => (
              <StaggerItem key={item.id}>
                <Card className="group flex gap-4 transition duration-200 hover:-translate-y-1 hover:shadow-layered">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <span className="text-sm font-semibold text-brand-primary">
                        EGP {item.price}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </StaggerItem>
            ))
          )}
        </Stagger>

        <Reveal delay={0.1}>
          <GlassPanel className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">
              Comfort, made with care.
            </h3>
            <p className="text-sm text-slate-600">
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

        <Stagger className="grid gap-6 md:grid-cols-2">
          {loading ? (
            <p className="text-sm text-slate-500">Loading menu…</p>
          ) : (
            displayItems.map((item) => (
              <StaggerItem key={item.id}>
                <Card className="group space-y-3 transition duration-200 hover:-translate-y-1 hover:shadow-layered">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-44 w-full rounded-2xl object-cover"
                  />
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <span className="text-sm font-semibold text-brand-primary">
                      EGP {item.price}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {item.description}
                  </p>
                </Card>
              </StaggerItem>
            ))
          )}
        </Stagger>
      </div>
    </div>
  );
};

export default Menu;
