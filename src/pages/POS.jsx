import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { useGlobalLoading } from "../context/LoadingContext.jsx";
import TableGrid from "../components/pos/TableGrid.jsx";
import OrderPanel from "../components/pos/OrderPanel.jsx";
import MenuItemSelector from "../components/pos/MenuItemSelector.jsx";
import QROrdersPanel from "../components/pos/QROrdersPanel.jsx";
import BusinessDayPanel from "../components/pos/BusinessDayPanel.jsx";
import POSHeader from "../components/pos/POSHeader.jsx";

const POS = () => {
  const { startLoading, stopLoading } = useGlobalLoading();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [qrOrders, setQROrders] = useState([]);
  const [businessDay, setBusinessDay] = useState(null);
  const [userRole, setUserRole] = useState("cashier"); // or "owner"
  const [showQRPanel, setShowQRPanel] = useState(false);
  const [showBusinessDayPanel, setShowBusinessDayPanel] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load initial data
  useEffect(() => {
    loadTables();
    loadMenuData();
    loadQROrders();
    loadActiveBusinessDay();
    checkUserRole();
  }, [refreshTrigger]);

  // Load tables
  const loadTables = async () => {
    try {
      const { data, error } = await supabase
        .from("tables")
        .select("*")
        .order("number", { ascending: true });

      if (error) throw error;

      // Count pending QR orders per table
      const tablesWithQR = await Promise.all(
        (data || []).map(async (table) => {
          const { count } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .eq("table_id", table.id)
            .eq("is_qr_order", true)
            .eq("qr_order_status", "pending");

          return {
            ...table,
            qr_order_count: count || 0,
          };
        })
      );

      setTables(tablesWithQR);
    } catch (error) {
      console.error("Error loading tables:", error);
    }
  };

  // Load menu data
  const loadMenuData = async () => {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        supabase
          .from("menu_categories")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("menu_items")
          .select("*")
          .eq("is_available", true)
          .order("sort_order", { ascending: true }),
      ]);

      setMenuCategories(categoriesRes.data || []);
      setMenuItems(itemsRes.data || []);
    } catch (error) {
      console.error("Error loading menu data:", error);
    }
  };

  // Load QR orders
  const loadQROrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, tables(number), order_items(*)")
        .eq("is_qr_order", true)
        .eq("qr_order_status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQROrders(data || []);
    } catch (error) {
      console.error("Error loading QR orders:", error);
    }
  };

  // Load active business day
  const loadActiveBusinessDay = async () => {
    try {
      const { data, error } = await supabase
        .from("business_days")
        .select("*")
        .eq("is_active", true)
        .order("opened_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setBusinessDay(data);
    } catch (error) {
      console.error("Error loading business day:", error);
    }
  };

  // Check user role
  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user is owner/admin
      const { data, error } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (data?.role === "owner") {
        setUserRole("owner");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  // Handle table selection
  const handleTableSelect = async (table) => {
    setSelectedTable(table);
    startLoading();
    try {
      // Check if table has an active order
      const { data: existingOrder, error: orderError } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("table_id", table.id)
        .eq("status", "pending")
        .single();

      if (existingOrder) {
        setCurrentOrder(existingOrder);
        setOrderItems(existingOrder.order_items || []);
      } else {
        setCurrentOrder(null);
        setOrderItems([]);
      }
    } catch (error) {
      console.error("Error loading table order:", error);
    } finally {
      stopLoading();
    }
  };

  // Create new session
  const createNewSession = async (sessionType, customerDetails = {}) => {
    if (!businessDay) {
      alert("Please open a business day first!");
      return;
    }

    startLoading();
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Generate order number
      const { data: orderNumber } = await supabase.rpc("generate_order_number");

      const orderData = {
        order_number: orderNumber,
        table_id: sessionType === "dine_in" ? selectedTable?.id : null,
        session_type: sessionType,
        customer_name: customerDetails.name,
        customer_phone: customerDetails.phone,
        customer_address: customerDetails.address,
        delivery_fee: customerDetails.delivery_fee || 0,
        status: "pending",
        created_by: user?.id,
      };

      const { data: newOrder, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      // Log action
      await supabase.from("audit_logs").insert([{
        action: `created_${sessionType}_order`,
        table_name: "orders",
        record_id: newOrder.id,
        user_id: user?.id,
        user_email: user?.email,
        details: { order_number: newOrder.order_number },
      }]);

      setCurrentOrder(newOrder);
      setOrderItems([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Error creating session");
    } finally {
      stopLoading();
    }
  };

  // Toggle QR for table
  const toggleTableQR = async (tableId, currentStatus) => {
    try {
      const { error } = await supabase
        .from("tables")
        .update({ qr_enabled: !currentStatus })
        .eq("id", tableId);

      if (error) throw error;

      // Log action
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("audit_logs").insert([{
        action: `toggle_qr_${!currentStatus ? "enabled" : "disabled"}`,
        table_name: "tables",
        record_id: tableId,
        user_id: user?.id,
        user_email: user?.email,
      }]);

      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error toggling QR:", error);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-surface-primary">
      <POSHeader
        businessDay={businessDay}
        onShowQROrders={() => setShowQRPanel(true)}
        onShowBusinessDay={() => setShowBusinessDayPanel(true)}
        qrOrderCount={qrOrders.length}
      />

      <div className="p-4">
        {!businessDay && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
            <p className="font-semibold">⚠️ Business Day Not Open</p>
            <p className="text-sm">Please open a business day to start taking orders.</p>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
          {/* Left side - Tables or Menu */}
          <div>
            {!currentOrder ? (
              <TableGrid
                tables={tables}
                onTableSelect={handleTableSelect}
                onToggleQR={toggleTableQR}
                onCreateTakeaway={() => createNewSession("takeaway")}
                onCreateDelivery={(details) => createNewSession("delivery", details)}
              />
            ) : (
              <MenuItemSelector
                menuItems={menuItems}
                menuCategories={menuCategories}
                currentOrder={currentOrder}
                orderItems={orderItems}
                onItemsChange={setOrderItems}
                onRefresh={handleRefresh}
              />
            )}
          </div>

          {/* Right side - Order Panel */}
          <div>
            {currentOrder && (
              <OrderPanel
                order={currentOrder}
                orderItems={orderItems}
                selectedTable={selectedTable}
                userRole={userRole}
                onOrderUpdate={setCurrentOrder}
                onClose={() => {
                  setCurrentOrder(null);
                  setOrderItems([]);
                  setSelectedTable(null);
                  handleRefresh();
                }}
                onRefresh={handleRefresh}
              />
            )}
          </div>
        </div>
      </div>

      {/* QR Orders Panel */}
      {showQRPanel && (
        <QROrdersPanel
          orders={qrOrders}
          onClose={() => setShowQRPanel(false)}
          onRefresh={handleRefresh}
        />
      )}

      {/* Business Day Panel */}
      {showBusinessDayPanel && (
        <BusinessDayPanel
          businessDay={businessDay}
          onClose={() => setShowBusinessDayPanel(false)}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default POS;
