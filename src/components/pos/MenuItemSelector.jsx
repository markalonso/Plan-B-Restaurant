import { useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";

const MenuItemSelector = ({
  menuItems,
  menuCategories,
  currentOrder,
  orderItems,
  onItemsChange,
  onRefresh,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category_id === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddItem = async (menuItem) => {
    try {
      // Check if item already exists in order
      const existingItem = orderItems.find(
        (oi) => oi.menu_item_id === menuItem.id
      );

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from("order_items")
          .update({
            quantity: existingItem.quantity + 1,
            total_price: (existingItem.quantity + 1) * existingItem.unit_price,
          })
          .eq("id", existingItem.id);

        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase.from("order_items").insert([
          {
            order_id: currentOrder.id,
            menu_item_id: menuItem.id,
            item_name: menuItem.name,
            quantity: 1,
            unit_price: menuItem.price,
            total_price: menuItem.price,
          },
        ]);

        if (error) throw error;
      }

      onRefresh();
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item to order");
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Menu Items</h2>
        <p className="text-sm text-text-secondary">
          Order: {currentOrder.order_number}
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
            selectedCategory === "all"
              ? "bg-coffee text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {menuCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
              selectedCategory === category.id
                ? "bg-coffee text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleAddItem(item)}
            className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-all hover:border-coffee hover:shadow-md"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="mb-2 h-24 w-full rounded object-cover"
              />
            )}
            <h3 className="font-semibold text-text-primary">{item.name}</h3>
            {item.description && (
              <p className="mt-1 text-xs text-text-secondary line-clamp-2">
                {item.description}
              </p>
            )}
            <p className="mt-2 font-bold text-coffee">
              ${parseFloat(item.price).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No menu items found
        </div>
      )}
    </div>
  );
};

export default MenuItemSelector;
