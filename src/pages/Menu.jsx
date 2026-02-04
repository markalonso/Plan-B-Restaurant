import { useMemo, useState } from "react";
import Reveal from "../components/Reveal.jsx";
import Stagger, { StaggerItem } from "../components/Stagger.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import GlassPanel from "../components/ui/GlassPanel.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import menuData from "../data/menu.json";

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

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categoryOptions = useMemo(
    () => ["All", ...menuData.categories],
    []
  );

  const normalizedCategory = normalizeValue(activeCategory);

  const popularItems = menuData.items.filter((item) => item.popular);

  const filteredItems = useMemo(() => {
    if (normalizedCategory === "all") {
      return menuData.items;
    }
    return menuData.items.filter((item) => {
      const itemCategory = normalizeValue(item.category || "");
      return itemCategory === normalizedCategory;
    });
  }, [normalizedCategory]);

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
          {popularItems.map((item) => (
            <StaggerItem key={item.id}>
              <Card className="group flex gap-4 transition duration-200 hover:-translate-y-1 hover:shadow-layered">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded-2xl object-cover"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <span className="text-sm font-semibold text-brand-primary">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </Card>
            </StaggerItem>
          ))}
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

        {filteredItems.length === 0 ? (
          <Card className="flex flex-col gap-3">
            <p className="text-sm text-slate-600">
              No items match this category yet.
            </p>
            <Button variant="secondary" onClick={() => setActiveCategory("All")}>
              Show all items
            </Button>
          </Card>
        ) : (
          <Stagger className="grid gap-6 md:grid-cols-2">
            {filteredItems.map((item) => (
              <StaggerItem key={item.id}>
                <Card className="group space-y-3 transition duration-200 hover:-translate-y-1 hover:shadow-layered">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-44 w-full rounded-2xl object-cover"
                  />
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <span className="text-sm font-semibold text-brand-primary">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{item.description}</p>
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
