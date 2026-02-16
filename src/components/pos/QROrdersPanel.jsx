import { supabase } from "../../lib/supabaseClient.js";

const QROrdersPanel = ({ orders, onClose, onRefresh }) => {
  const handleAcceptOrder = async (orderId) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ qr_order_status: "accepted", status: "confirmed" })
        .eq("id", orderId);

      if (error) throw error;

      // Log action
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("audit_logs").insert([{
        action: "accept_qr_order",
        table_name: "orders",
        record_id: orderId,
        user_id: user?.id,
        user_email: user?.email,
      }]);

      onRefresh();
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("Error accepting order");
    }
  };

  const handleRejectOrder = async (orderId) => {
    if (!confirm("Are you sure you want to reject this QR order?")) return;

    try {
      const { error } = await supabase
        .from("orders")
        .update({ qr_order_status: "rejected", status: "cancelled" })
        .eq("id", orderId);

      if (error) throw error;

      // Log action
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("audit_logs").insert([{
        action: "reject_qr_order",
        table_name: "orders",
        record_id: orderId,
        user_id: user?.id,
        user_email: user?.email,
      }]);

      onRefresh();
    } catch (error) {
      console.error("Error rejecting order:", error);
      alert("Error rejecting order");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="h-full max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold">Pending QR Orders</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Orders List */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 80px)" }}>
          {orders.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No pending QR orders
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  {/* Order Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-lg">
                        Table {order.tables?.number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.order_number}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-coffee">
                        ${parseFloat(order.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-3 space-y-1 border-t pt-2">
                    {order.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.quantity}x {item.item_name}
                        </span>
                        <span>${parseFloat(item.total_price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="mb-3 rounded bg-yellow-50 p-2 text-sm">
                      <p className="font-semibold text-yellow-800">Notes:</p>
                      <p className="text-yellow-700">{order.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectOrder(order.id)}
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QROrdersPanel;
