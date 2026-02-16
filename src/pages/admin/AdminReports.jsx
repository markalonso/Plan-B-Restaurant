import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { supabase } from "../../lib/supabaseClient.js";
import { useGlobalLoading } from "../../context/LoadingContext.jsx";

const AdminReports = () => {
  const { startLoading, stopLoading } = useGlobalLoading();
  const [reportType, setReportType] = useState("business_day"); // business_day, sales, tax, profit
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Set default dates (last 30 days)
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);
    
    setDateTo(today.toISOString().split("T")[0]);
    setDateFrom(monthAgo.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (dateFrom && dateTo) {
      triggerLoadReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, dateFrom, dateTo]);

  const triggerLoadReport = async () => {
    startLoading();
    try {
      switch (reportType) {
        case "business_day":
          await loadBusinessDayReport();
          break;
        case "sales":
          await loadSalesReport();
          break;
        case "tax":
          await loadTaxReport();
          break;
        case "profit":
          await loadProfitReport();
          break;
      }
    } catch (error) {
      console.error("Error loading report:", error);
    } finally {
      stopLoading();
    }
  };

  const loadBusinessDayReport = async () => {
    const { data, error } = await supabase
      .from("business_days")
      .select("*")
      .gte("opened_at", dateFrom)
      .lte("opened_at", dateTo)
      .order("opened_at", { ascending: false });

    if (error) throw error;

    const totals = (data || []).reduce(
      (acc, day) => ({
        total_sales: acc.total_sales + parseFloat(day.total_sales || 0),
        total_transactions: acc.total_transactions + (day.total_transactions || 0),
        cash_sales: acc.cash_sales + parseFloat(day.cash_sales || 0),
        card_sales: acc.card_sales + parseFloat(day.card_sales || 0),
        transfer_sales: acc.transfer_sales + parseFloat(day.transfer_sales || 0),
      }),
      { total_sales: 0, total_transactions: 0, cash_sales: 0, card_sales: 0, transfer_sales: 0 }
    );

    setReportData({ days: data || [], totals });
  };

  const loadSalesReport = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "completed")
      .eq("is_deleted", false)
      .gte("completed_at", dateFrom)
      .lte("completed_at", dateTo);

    if (error) throw error;

    const byType = (data || []).reduce(
      (acc, order) => {
        const type = order.session_type;
        if (!acc[type]) {
          acc[type] = { count: 0, subtotal: 0, discount: 0, tax: 0, total: 0 };
        }
        acc[type].count += 1;
        acc[type].subtotal += parseFloat(order.subtotal || 0);
        acc[type].discount += parseFloat(order.discount_amount || 0);
        acc[type].tax += parseFloat(order.tax_amount || 0);
        acc[type].total += parseFloat(order.total || 0);
        return acc;
      },
      {}
    );

    const totals = Object.values(byType).reduce(
      (acc, type) => ({
        count: acc.count + type.count,
        subtotal: acc.subtotal + type.subtotal,
        discount: acc.discount + type.discount,
        tax: acc.tax + type.tax,
        total: acc.total + type.total,
      }),
      { count: 0, subtotal: 0, discount: 0, tax: 0, total: 0 }
    );

    setReportData({ byType, totals, orders: data || [] });
  };

  const loadTaxReport = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "completed")
      .eq("is_deleted", false)
      .eq("session_type", "dine_in")
      .gte("completed_at", dateFrom)
      .lte("completed_at", dateTo);

    if (error) throw error;

    const totalTax = (data || []).reduce(
      (sum, order) => sum + parseFloat(order.tax_amount || 0),
      0
    );

    const taxByDate = (data || []).reduce((acc, order) => {
      const date = new Date(order.completed_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + parseFloat(order.tax_amount || 0);
      return acc;
    }, {});

    setReportData({ totalTax, taxByDate, orders: data || [] });
  };

  const loadProfitReport = async () => {
    // Get completed orders with items
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*, order_items(*, menu_items(*))")
      .eq("status", "completed")
      .eq("is_deleted", false)
      .gte("completed_at", dateFrom)
      .lte("completed_at", dateTo);

    if (ordersError) throw ordersError;

    // Get recipes with ingredient costs
    const { data: recipes, error: recipesError } = await supabase
      .from("recipes")
      .select("*, ingredients(cost_per_unit)")
      .eq("is_deleted", false);

    if (recipesError) throw recipesError;

    // Get expenses
    const { data: expenses, error: expensesError } = await supabase
      .from("expenses")
      .select("*")
      .eq("is_deleted", false)
      .gte("expense_date", dateFrom)
      .lte("expense_date", dateTo);

    if (expensesError) throw expensesError;

    // Calculate COGS
    let totalCOGS = 0;
    const recipeMap = recipes.reduce((acc, recipe) => {
      if (!acc[recipe.menu_item_id]) acc[recipe.menu_item_id] = [];
      acc[recipe.menu_item_id].push({
        quantity: parseFloat(recipe.quantity_needed),
        cost: parseFloat(recipe.ingredients?.cost_per_unit || 0),
      });
      return acc;
    }, {});

    (orders || []).forEach((order) => {
      order.order_items?.forEach((item) => {
        if (recipeMap[item.menu_item_id]) {
          const itemCOGS = recipeMap[item.menu_item_id].reduce(
            (sum, ing) => sum + ing.quantity * ing.cost,
            0
          );
          totalCOGS += itemCOGS * item.quantity;
        }
      });
    });

    const totalRevenue = (orders || []).reduce(
      (sum, order) => sum + parseFloat(order.total || 0),
      0
    );

    const totalExpenses = (expenses || []).reduce(
      (sum, exp) => sum + parseFloat(exp.amount || 0),
      0
    );

    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    setReportData({
      totalRevenue,
      totalCOGS,
      totalExpenses,
      grossProfit,
      netProfit,
      profitMargin,
      orderCount: orders?.length || 0,
    });
  };

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-text-primary">
            Business Reports
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Comprehensive business analytics and insights
          </p>
        </div>

        {/* Report Type Selector */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setReportType("business_day")}
            className={`whitespace-nowrap rounded-lg px-4 py-2 font-semibold ${
              reportType === "business_day"
                ? "bg-coffee text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Business Days
          </button>
          <button
            onClick={() => setReportType("sales")}
            className={`whitespace-nowrap rounded-lg px-4 py-2 font-semibold ${
              reportType === "sales"
                ? "bg-coffee text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Sales by Type
          </button>
          <button
            onClick={() => setReportType("tax")}
            className={`whitespace-nowrap rounded-lg px-4 py-2 font-semibold ${
              reportType === "tax"
                ? "bg-coffee text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Tax Collected
          </button>
          <button
            onClick={() => setReportType("profit")}
            className={`whitespace-nowrap rounded-lg px-4 py-2 font-semibold ${
              reportType === "profit"
                ? "bg-coffee text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Profit Analysis
          </button>
        </div>

        {/* Date Filter */}
        <div className="glass-card mb-6">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="mt-1 rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="mt-1 rounded-lg border px-3 py-2"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={triggerLoadReport}
                className="rounded-lg bg-coffee px-4 py-2 text-white hover:bg-coffee/90"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        {reportData && (
          <>
            {/* Business Day Report */}
            {reportType === "business_day" && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="mt-1 text-2xl font-bold text-green-600">
                      ${reportData.totals.total_sales.toFixed(2)}
                    </p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Transactions</p>
                    <p className="mt-1 text-2xl font-bold">
                      {reportData.totals.total_transactions}
                    </p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Cash Sales</p>
                    <p className="mt-1 text-2xl font-bold">
                      ${reportData.totals.cash_sales.toFixed(2)}
                    </p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Card Sales</p>
                    <p className="mt-1 text-2xl font-bold">
                      ${reportData.totals.card_sales.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="glass-card overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-right">Sales</th>
                        <th className="p-3 text-right">Transactions</th>
                        <th className="p-3 text-right">Cash</th>
                        <th className="p-3 text-right">Card</th>
                        <th className="p-3 text-right">Transfer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.days.map((day) => (
                        <tr key={day.id} className="border-b">
                          <td className="p-3">
                            {new Date(day.opened_at).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-right font-semibold">
                            ${parseFloat(day.total_sales).toFixed(2)}
                          </td>
                          <td className="p-3 text-right">{day.total_transactions}</td>
                          <td className="p-3 text-right">
                            ${parseFloat(day.cash_sales).toFixed(2)}
                          </td>
                          <td className="p-3 text-right">
                            ${parseFloat(day.card_sales).toFixed(2)}
                          </td>
                          <td className="p-3 text-right">
                            ${parseFloat(day.transfer_sales).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sales Report */}
            {reportType === "sales" && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="mt-1 text-2xl font-bold">
                      {reportData.totals.count}
                    </p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="mt-1 text-2xl font-bold text-green-600">
                      ${reportData.totals.total.toFixed(2)}
                    </p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Total Discounts</p>
                    <p className="mt-1 text-2xl font-bold text-orange-600">
                      ${reportData.totals.discount.toFixed(2)}
                    </p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Total Tax</p>
                    <p className="mt-1 text-2xl font-bold">
                      ${reportData.totals.tax.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="glass-card">
                  <h3 className="mb-4 text-lg font-semibold">Sales by Order Type</h3>
                  <div className="space-y-3">
                    {Object.keys(reportData.byType).map((type) => {
                      const data = reportData.byType[type];
                      return (
                        <div
                          key={type}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div>
                            <p className="font-semibold capitalize">
                              {type.replace("_", " ")}
                            </p>
                            <p className="text-sm text-gray-600">
                              {data.count} orders
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-coffee">
                              ${data.total.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-600">
                              Avg: ${(data.total / data.count).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tax Report */}
            {reportType === "tax" && (
              <div className="space-y-6">
                <div className="glass-card">
                  <h3 className="text-lg font-semibold">Tax Summary</h3>
                  <p className="mt-4 text-4xl font-bold text-coffee">
                    ${reportData.totalTax.toFixed(2)}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Total Tax Collected (14% on Dine-in)
                  </p>
                </div>

                <div className="glass-card">
                  <h3 className="mb-4 text-lg font-semibold">Tax by Date</h3>
                  <div className="space-y-2">
                    {Object.entries(reportData.taxByDate).map(([date, amount]) => (
                      <div key={date} className="flex justify-between border-b pb-2">
                        <span>{date}</span>
                        <span className="font-semibold">${amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Profit Report */}
            {reportType === "profit" && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="mt-1 text-2xl font-bold text-green-600">
                      ${reportData.totalRevenue.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {reportData.orderCount} orders
                    </p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Cost of Goods Sold</p>
                    <p className="mt-1 text-2xl font-bold text-red-600">
                      ${reportData.totalCOGS.toFixed(2)}
                    </p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Operating Expenses</p>
                    <p className="mt-1 text-2xl font-bold text-orange-600">
                      ${reportData.totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Gross Profit</p>
                    <p className="mt-1 text-2xl font-bold">
                      ${reportData.grossProfit.toFixed(2)}
                    </p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Net Profit</p>
                    <p
                      className={`mt-1 text-2xl font-bold ${
                        reportData.netProfit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ${reportData.netProfit.toFixed(2)}
                    </p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm text-gray-600">Profit Margin</p>
                    <p
                      className={`mt-1 text-2xl font-bold ${
                        reportData.profitMargin >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {reportData.profitMargin.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="glass-card">
                  <h3 className="mb-4 text-lg font-semibold">Profit Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span>Revenue</span>
                      <span className="font-semibold">
                        ${reportData.totalRevenue.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>- COGS</span>
                      <span className="font-semibold text-red-600">
                        -${reportData.totalCOGS.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2 font-semibold">
                      <span>= Gross Profit</span>
                      <span>${reportData.grossProfit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>- Expenses</span>
                      <span className="font-semibold text-red-600">
                        -${reportData.totalExpenses.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 text-lg font-bold">
                      <span>= Net Profit</span>
                      <span
                        className={
                          reportData.netProfit >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        ${reportData.netProfit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
