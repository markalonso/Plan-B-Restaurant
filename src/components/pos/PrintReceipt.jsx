const PrintReceipt = ({
  order,
  orderItems,
  selectedTable,
  subtotal,
  discount,
  tax,
  deliveryFee,
  total,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header - Don't print */}
        <div className="flex items-center justify-between border-b p-4 print:hidden">
          <h2 className="text-lg font-semibold">Receipt</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Print Content */}
        <div className="p-6">
          <div id="receipt" className="print-content">
            {/* Restaurant Header */}
            <div className="mb-4 border-b-2 border-gray-400 pb-4 text-center">
              <h1 className="text-2xl font-bold">PLAN B RESTAURANT</h1>
              <p className="text-sm">123 Main Street</p>
              <p className="text-sm">Phone: (555) 123-4567</p>
              <p className="text-sm">www.planbrestaurant.com</p>
            </div>

            {/* Order Info */}
            <div className="mb-4 space-y-1">
              <div className="flex justify-between">
                <span className="font-semibold">Receipt #:</span>
                <span>{order.order_number}</span>
              </div>
              {order.session_type === "dine_in" && selectedTable && (
                <div className="flex justify-between">
                  <span className="font-semibold">Table:</span>
                  <span>{selectedTable.number}</span>
                </div>
              )}
              {order.session_type !== "dine_in" && (
                <div className="flex justify-between">
                  <span className="font-semibold">Type:</span>
                  <span className="uppercase">{order.session_type.replace("_", " ")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-semibold">Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Time:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Customer Details for Delivery */}
            {order.session_type === "delivery" && (
              <div className="mb-4 rounded border border-gray-300 bg-gray-50 p-3">
                <p className="font-semibold">Delivery To:</p>
                <p>{order.customer_name}</p>
                <p>{order.customer_phone}</p>
                <p className="text-sm">{order.customer_address}</p>
              </div>
            )}

            {/* Items */}
            <div className="mb-4 border-y border-gray-300 py-3">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="pb-2">Item</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.filter(item => !item.is_deleted).map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-2">{item.item_name}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right">
                        ${parseFloat(item.unit_price).toFixed(2)}
                      </td>
                      <td className="py-2 text-right">
                        ${parseFloat(item.total_price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mb-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({order.discount_percent}%):</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              {tax > 0 && (
                <div className="flex justify-between">
                  <span>Tax (14%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              )}

              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between border-t-2 border-gray-400 pt-2 text-xl font-bold">
                <span>TOTAL:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 border-t border-gray-300 pt-4 text-center text-sm">
              <p className="font-semibold">Thank you for dining with us!</p>
              <p className="mt-2">Please visit us again soon</p>
              <p className="mt-4 text-xs text-gray-500">
                This is an official receipt
              </p>
            </div>
          </div>
        </div>

        {/* Print Button - Don't print */}
        <div className="border-t p-4 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
          >
            Print Receipt
          </button>
        </div>
      </div>

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt,
          #receipt * {
            visibility: visible;
          }
          #receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            font-family: 'Courier New', monospace;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintReceipt;
