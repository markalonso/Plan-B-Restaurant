import { useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";
import PrintKitchenTicket from "./PrintKitchenTicket.jsx";
import PrintReceipt from "./PrintReceipt.jsx";

const OrderPanel = ({
  order,
  orderItems,
  selectedTable,
  userRole,
  onOrderUpdate,
  onClose,
  onRefresh,
}) => {
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(order.discount_percent || 0);
  const [showSplitBill, setShowSplitBill] = useState(false);
  const [showMergeTable, setShowMergeTable] = useState(false);
  const [showPrintKitchen, setShowPrintKitchen] = useState(false);
  const [showPrintReceipt, setShowPrintReceipt] = useState(false);

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = order.session_type === "dine_in" ? afterDiscount * 0.14 : 0;
  const deliveryFee = parseFloat(order.delivery_fee || 0);
  const total = afterDiscount + taxAmount + deliveryFee;

  // Update item quantity
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      // Soft delete
      await supabase
        .from("order_items")
        .update({ is_deleted: true })
        .eq("id", itemId);
    } else {
      const item = orderItems.find((i) => i.id === itemId);
      await supabase
        .from("order_items")
        .update({
          quantity: newQuantity,
          total_price: newQuantity * parseFloat(item.unit_price),
        })
        .eq("id", itemId);
    }
    onRefresh();
  };

  // Apply discount
  const handleApplyDiscount = async () => {
    const maxDiscount = userRole === "owner" ? 100 : 15;
    if (discountPercent > maxDiscount) {
      alert(`Maximum discount for ${userRole} is ${maxDiscount}%`);
      return;
    }

    try {
      const { error } = await supabase
        .from("orders")
        .update({ discount_percent: discountPercent })
        .eq("id", order.id);

      if (error) throw error;

      // Log action
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("audit_logs").insert([{
        action: "apply_discount",
        table_name: "orders",
        record_id: order.id,
        user_id: user?.id,
        user_email: user?.email,
        details: { discount_percent: discountPercent, order_number: order.order_number },
      }]);

      setShowDiscount(false);
      onRefresh();
    } catch (error) {
      console.error("Error applying discount:", error);
      alert("Error applying discount");
    }
  };

  // Print kitchen ticket
  const handlePrintKitchen = async () => {
    try {
      // Mark items as printed and deduct inventory
      const now = new Date().toISOString();
      const unprintedItems = orderItems.filter((item) => !item.printed_at);

      for (const item of unprintedItems) {
        await supabase
          .from("order_items")
          .update({ printed_at: now, status: "preparing" })
          .eq("id", item.id);
      }

      // Log action
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("audit_logs").insert([{
        action: "print_kitchen_ticket",
        table_name: "orders",
        record_id: order.id,
        user_id: user?.id,
        user_email: user?.email,
        details: { order_number: order.order_number, item_count: unprintedItems.length },
      }]);

      setShowPrintKitchen(true);
      onRefresh();
    } catch (error) {
      console.error("Error printing kitchen ticket:", error);
      alert("Error printing kitchen ticket");
    }
  };

  // Close and pay
  const handleCloseAndPay = async () => {
    if (orderItems.length === 0) {
      alert("Cannot close an empty order");
      return;
    }

    if (!confirm("Close this order and proceed to payment?")) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Generate transaction number
      const { data: txnNumber } = await supabase.rpc("generate_transaction_number");

      // Create transaction
      const { data: transaction, error: txnError } = await supabase
        .from("transactions")
        .insert([{
          transaction_number: txnNumber,
          order_id: order.id,
          amount: total,
          payment_method: "cash", // Default, can be changed
          payment_status: "completed",
          created_by: user?.id,
        }])
        .select()
        .single();

      if (txnError) throw txnError;

      // Update order status
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (orderError) throw orderError;

      // Update table status if dine-in
      if (order.table_id) {
        await supabase
          .from("tables")
          .update({ status: "available" })
          .eq("id", order.table_id);
      }

      // Log action
      await supabase.from("audit_logs").insert([{
        action: "close_and_pay",
        table_name: "orders",
        record_id: order.id,
        user_id: user?.id,
        user_email: user?.email,
        details: {
          order_number: order.order_number,
          transaction_number: txnNumber,
          amount: total,
        },
      }]);

      alert("Order completed successfully!");
      setShowPrintReceipt(true);
    } catch (error) {
      console.error("Error closing order:", error);
      alert("Error closing order");
    }
  };

  // Split bill
  const handleSplitBill = async (splitCount) => {
    if (splitCount < 2) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const itemsPerSplit = Math.ceil(orderItems.length / splitCount);

      for (let i = 0; i < splitCount; i++) {
        const splitItems = orderItems.slice(
          i * itemsPerSplit,
          (i + 1) * itemsPerSplit
        );

        // Generate new order number
        const { data: orderNumber } = await supabase.rpc("generate_order_number");

        // Create split order
        const { data: splitOrder, error: orderError } = await supabase
          .from("orders")
          .insert([{
            order_number: orderNumber,
            table_id: order.table_id,
            session_type: order.session_type,
            status: "pending",
            created_by: user?.id,
          }])
          .select()
          .single();

        if (orderError) throw orderError;

        // Move items to split order
        for (const item of splitItems) {
          await supabase
            .from("order_items")
            .update({ order_id: splitOrder.id })
            .eq("id", item.id);
        }

        // Record split
        await supabase.from("bill_splits").insert([{
          original_order_id: order.id,
          split_order_id: splitOrder.id,
          split_by: user?.id,
        }]);
      }

      // Log action
      await supabase.from("audit_logs").insert([{
        action: "split_bill",
        table_name: "orders",
        record_id: order.id,
        user_id: user?.id,
        user_email: user?.email,
        details: { order_number: order.order_number, split_count: splitCount },
      }]);

      alert("Bill split successfully!");
      onClose();
    } catch (error) {
      console.error("Error splitting bill:", error);
      alert("Error splitting bill");
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            {order.session_type === "dine_in" && selectedTable
              ? `Table ${selectedTable.number}`
              : order.session_type.replace("_", " ").toUpperCase()}
          </h2>
          <p className="text-sm text-text-secondary">{order.order_number}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      {/* Customer Details for Delivery */}
      {order.session_type === "delivery" && (
        <div className="mb-4 rounded-lg bg-purple-50 p-3 text-sm">
          <p className="font-semibold">{order.customer_name}</p>
          <p className="text-gray-600">{order.customer_phone}</p>
          <p className="text-gray-600">{order.customer_address}</p>
        </div>
      )}

      {/* Order Items */}
      <div className="mb-4 max-h-60 space-y-2 overflow-y-auto">
        {orderItems.filter(item => !item.is_deleted).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border p-2"
          >
            <div className="flex-1">
              <p className="font-semibold">{item.item_name}</p>
              {item.modifications && (
                <p className="text-xs text-gray-500">{item.modifications}</p>
              )}
              <p className="text-sm text-gray-600">
                ${parseFloat(item.unit_price).toFixed(2)} each
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 hover:bg-gray-300"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 hover:bg-gray-300"
              >
                +
              </button>
              <span className="ml-2 w-16 text-right font-semibold">
                ${parseFloat(item.total_price).toFixed(2)}
              </span>
            </div>
          </div>
        ))}

        {orderItems.filter(item => !item.is_deleted).length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No items in this order
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discountPercent > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({discountPercent}%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        {order.session_type === "dine_in" && (
          <div className="flex justify-between text-sm">
            <span>Tax (14%)</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
        )}

        {deliveryFee > 0 && (
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between border-t pt-2 text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlePrintKitchen}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Print Kitchen
          </button>
          <button
            onClick={() => setShowDiscount(true)}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
          >
            Discount
          </button>
          <button
            onClick={() => setShowSplitBill(true)}
            className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
          >
            Split Bill
          </button>
          <button
            onClick={() => setShowMergeTable(true)}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Merge Table
          </button>
        </div>

        <button
          onClick={handleCloseAndPay}
          className="w-full rounded-lg bg-green-600 px-4 py-3 text-base font-semibold text-white hover:bg-green-700"
        >
          Close & Pay - ${total.toFixed(2)}
        </button>
      </div>

      {/* Discount Modal */}
      {showDiscount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Apply Discount</h3>
            <p className="mb-4 text-sm text-gray-600">
              Max discount: {userRole === "owner" ? "Unlimited" : "15%"}
            </p>
            <input
              type="number"
              min="0"
              max={userRole === "owner" ? "100" : "15"}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
              placeholder="Enter discount %"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowDiscount(false)}
                className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyDiscount}
                className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Split Bill Modal */}
      {showSplitBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Split Bill</h3>
            <div className="space-y-2">
              {[2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    handleSplitBill(count);
                    setShowSplitBill(false);
                  }}
                  className="w-full rounded-lg border p-3 text-left hover:bg-gray-50"
                >
                  Split into {count} bills
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSplitBill(false)}
              className="mt-4 w-full rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Print Kitchen Ticket */}
      {showPrintKitchen && (
        <PrintKitchenTicket
          order={order}
          orderItems={orderItems}
          selectedTable={selectedTable}
          onClose={() => setShowPrintKitchen(false)}
        />
      )}

      {/* Print Receipt */}
      {showPrintReceipt && (
        <PrintReceipt
          order={order}
          orderItems={orderItems}
          selectedTable={selectedTable}
          subtotal={subtotal}
          discount={discountAmount}
          tax={taxAmount}
          deliveryFee={deliveryFee}
          total={total}
          onClose={() => {
            setShowPrintReceipt(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default OrderPanel;
