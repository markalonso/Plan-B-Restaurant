import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient.js";

const BusinessDayPanel = ({ businessDay, onClose, onRefresh }) => {
  const [openingBalance, setOpeningBalance] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (businessDay) {
      loadDayReport();
    }
  }, [businessDay]);

  const loadDayReport = async () => {
    if (!businessDay) return;

    setLoading(true);
    try {
      // Get all transactions for this business day
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("*, orders(*)")
        .gte("created_at", businessDay.opened_at)
        .eq("payment_status", "completed");

      if (error) throw error;

      // Calculate totals by payment method
      const cashTotal = transactions
        ?.filter((t) => t.payment_method === "cash")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

      const cardTotal = transactions
        ?.filter((t) => t.payment_method === "card")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

      const transferTotal = transactions
        ?.filter((t) => t.payment_method === "transfer")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

      const otherTotal = transactions
        ?.filter((t) => t.payment_method === "other")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

      const totalSales = cashTotal + cardTotal + transferTotal + otherTotal;

      setReportData({
        transactions: transactions?.length || 0,
        cashTotal,
        cardTotal,
        transferTotal,
        otherTotal,
        totalSales,
      });
    } catch (error) {
      console.error("Error loading day report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDay = async () => {
    if (!openingBalance || openingBalance < 0) {
      alert("Please enter a valid opening balance");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from("business_days").insert([{
        opened_at: new Date().toISOString(),
        opening_balance: openingBalance,
        opened_by: user?.id,
        is_active: true,
      }]);

      if (error) throw error;

      // Log action
      await supabase.from("audit_logs").insert([{
        action: "open_business_day",
        table_name: "business_days",
        user_id: user?.id,
        user_email: user?.email,
        details: { opening_balance: openingBalance },
      }]);

      alert("Business day opened successfully!");
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error opening business day:", error);
      alert("Error opening business day");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDay = async () => {
    if (!businessDay) return;
    if (!reportData) return;

    if (!confirm("Are you sure you want to close the business day? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const closingBalance = parseFloat(businessDay.opening_balance) + reportData.cashTotal;

      const { error } = await supabase
        .from("business_days")
        .update({
          closed_at: new Date().toISOString(),
          closing_balance: closingBalance,
          total_sales: reportData.totalSales,
          total_transactions: reportData.transactions,
          cash_sales: reportData.cashTotal,
          card_sales: reportData.cardTotal,
          transfer_sales: reportData.transferTotal,
          other_sales: reportData.otherTotal,
          closed_by: user?.id,
          is_active: false,
        })
        .eq("id", businessDay.id);

      if (error) throw error;

      // Log action
      await supabase.from("audit_logs").insert([{
        action: "close_business_day",
        table_name: "business_days",
        record_id: businessDay.id,
        user_id: user?.id,
        user_email: user?.email,
        details: { total_sales: reportData.totalSales },
      }]);

      alert("Business day closed successfully!");
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error closing business day:", error);
      alert("Error closing business day");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold">Business Day Management</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6">
          {!businessDay ? (
            /* Open Business Day Form */
            <div>
              <h3 className="mb-4 text-lg font-semibold">Open Business Day</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Opening Balance (Cash)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(parseFloat(e.target.value) || 0)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="0.00"
                />
              </div>
              <button
                onClick={handleOpenDay}
                disabled={loading}
                className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Opening..." : "Open Business Day"}
              </button>
            </div>
          ) : (
            /* End of Day Report */
            <div>
              <h3 className="mb-4 text-lg font-semibold">End of Day Report</h3>
              
              <div className="mb-6 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  Opened: {new Date(businessDay.opened_at).toLocaleString()}
                </p>
                <p className="text-sm text-blue-800">
                  Opening Balance: ${parseFloat(businessDay.opening_balance).toFixed(2)}
                </p>
              </div>

              {loading ? (
                <div className="py-8 text-center">Loading report...</div>
              ) : reportData ? (
                <div className="space-y-4">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-bold">{reportData.transactions}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-gray-600">Total Sales</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${reportData.totalSales.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method Breakdown */}
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-3 font-semibold">Payment Methods</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cash</span>
                        <span className="font-semibold">
                          ${reportData.cashTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Card</span>
                        <span className="font-semibold">
                          ${reportData.cardTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transfer</span>
                        <span className="font-semibold">
                          ${reportData.transferTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Other</span>
                        <span className="font-semibold">
                          ${reportData.otherTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expected Cash */}
                  <div className="rounded-lg bg-yellow-50 p-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Expected Cash</span>
                      <span>
                        ${(parseFloat(businessDay.opening_balance) + reportData.cashTotal).toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Opening + Cash Sales
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={handleCloseDay}
                    disabled={loading}
                    className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? "Closing..." : "Close Business Day"}
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDayPanel;
