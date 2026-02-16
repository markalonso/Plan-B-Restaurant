import { useState } from "react";

const TableGrid = ({ tables, onTableSelect, onToggleQR, onCreateTakeaway, onCreateDelivery }) => {
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    phone: "",
    address: "",
    delivery_fee: "5.00",
  });

  const getTableStatusColor = (table) => {
    if (table.status === "disabled") return "bg-gray-300 text-gray-600";
    if (table.status === "occupied") return "bg-red-500 text-white";
    if (table.status === "reserved") return "bg-yellow-500 text-white";
    return "bg-green-500 text-white";
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    onCreateDelivery(deliveryDetails);
    setShowDeliveryForm(false);
    setDeliveryDetails({ name: "", phone: "", address: "", delivery_fee: "5.00" });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Tables</h2>
        <div className="flex gap-2">
          <button
            onClick={onCreateTakeaway}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            New Takeaway
          </button>
          <button
            onClick={() => setShowDeliveryForm(true)}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            New Delivery
          </button>
        </div>
      </div>

      {/* Delivery Form Modal */}
      {showDeliveryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">New Delivery Order</h3>
            <form onSubmit={handleDeliverySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryDetails.name}
                  onChange={(e) =>
                    setDeliveryDetails({ ...deliveryDetails, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={deliveryDetails.phone}
                  onChange={(e) =>
                    setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Address *
                </label>
                <textarea
                  required
                  value={deliveryDetails.address}
                  onChange={(e) =>
                    setDeliveryDetails({ ...deliveryDetails, address: e.target.value })
                  }
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Fee
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={deliveryDetails.delivery_fee}
                  onChange={(e) =>
                    setDeliveryDetails({ ...deliveryDetails, delivery_fee: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeliveryForm(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tables Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`relative cursor-pointer rounded-lg p-4 text-center transition-transform hover:scale-105 ${getTableStatusColor(
              table
            )}`}
            onClick={() => table.status !== "disabled" && onTableSelect(table)}
          >
            <div className="text-2xl font-bold">T{table.number}</div>
            <div className="mt-1 text-xs opacity-90">{table.status}</div>

            {/* QR Order Badge */}
            {table.qr_order_count > 0 && (
              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                {table.qr_order_count}
              </div>
            )}

            {/* QR Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleQR(table.id, table.qr_enabled);
              }}
              className={`mt-2 rounded px-2 py-1 text-xs font-semibold ${
                table.qr_enabled
                  ? "bg-white/20 text-white"
                  : "bg-black/20 text-white/70 line-through"
              }`}
            >
              QR
            </button>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-green-500"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-500"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-yellow-500"></div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-gray-300"></div>
          <span>Disabled</span>
        </div>
      </div>
    </div>
  );
};

export default TableGrid;
