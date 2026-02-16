const PrintKitchenTicket = ({ order, orderItems, selectedTable, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header - Don't print */}
        <div className="flex items-center justify-between border-b p-4 print:hidden">
          <h2 className="text-lg font-semibold">Kitchen Ticket</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Print Content */}
        <div className="p-6">
          <div id="kitchen-ticket" className="print-content">
            {/* Restaurant Header */}
            <div className="mb-4 border-b-2 border-dashed border-gray-400 pb-4 text-center">
              <h1 className="text-2xl font-bold">PLAN B RESTAURANT</h1>
              <p className="text-lg font-semibold">KITCHEN TICKET</p>
            </div>

            {/* Order Info */}
            <div className="mb-4 space-y-1 text-lg">
              <div className="flex justify-between font-bold">
                <span>Order #:</span>
                <span>{order.order_number}</span>
              </div>
              {order.session_type === "dine_in" && selectedTable && (
                <div className="flex justify-between font-bold">
                  <span>Table:</span>
                  <span>{selectedTable.number}</span>
                </div>
              )}
              {order.session_type !== "dine_in" && (
                <div className="flex justify-between font-bold">
                  <span>Type:</span>
                  <span className="uppercase">{order.session_type.replace("_", " ")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4 border-y-2 border-dashed border-gray-400 py-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="pb-2 text-left">QTY</th>
                    <th className="pb-2 text-left">ITEM</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.filter(item => !item.is_deleted).map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-3 text-xl font-bold">{item.quantity}</td>
                      <td className="py-3">
                        <div className="text-lg font-semibold">{item.item_name}</div>
                        {item.modifications && (
                          <div className="mt-1 text-sm italic text-gray-700">
                            {item.modifications}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mb-4 rounded border-2 border-gray-400 bg-gray-100 p-3">
                <p className="font-bold">SPECIAL NOTES:</p>
                <p className="mt-1 text-lg">{order.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 border-t-2 border-dashed border-gray-400 pt-4 text-center">
              <p className="text-lg font-bold">
                Printed: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Print Button - Don't print */}
        <div className="border-t p-4 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Print Kitchen Ticket
          </button>
        </div>
      </div>

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #kitchen-ticket,
          #kitchen-ticket * {
            visibility: visible;
          }
          #kitchen-ticket {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            font-family: monospace;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintKitchenTicket;
