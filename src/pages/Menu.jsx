import { useEffect, useMemo, useState } from "react";
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
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-skywash-600">
            Menu
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900 md:text-5xl">
            Our signature favorites
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            From sunrise brunch to late-night bites, discover a calm, curated
            menu with light coastal flavors.
          </p>
        </div>

        <section className="space-y-6">
          <h2 className="section-title">Popular Picks</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {loading ? (
              <p className="text-sm text-slate-500">Loading menu…</p>
            ) : (
              popularItems.map((item) => (
                <div key={item.id} className="glass-card flex gap-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <span className="text-sm font-semibold text-skywash-600">
                        EGP {item.price}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {categoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === category
                    ? "border-skywash-500 bg-skywash-500 text-white"
                    : "border-slate-200 text-slate-600 hover:border-skywash-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {loading ? (
              <p className="text-sm text-slate-500">Loading menu…</p>
            ) : (
              displayItems.map((item) => (
                <div key={item.id} className="glass-card">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-44 w-full rounded-2xl object-cover"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <span className="text-sm font-semibold text-skywash-600">
                      EGP {item.price}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Menu;
