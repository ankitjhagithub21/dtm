"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OrderDetails } from "@/types/order";
import type { MenuItem } from "@/data/menuItems";
import type { MenuCategory } from "@/data/menuItems";

interface AdminDashboardClientProps {
  initialOrders: OrderDetails[];
  initialMenuItems: MenuItem[];
  initialStats: {
    totalOrdersToday: number;
    revenueToday: number;
    pendingOrders: number;
    popularItem: string | null;
  };
}

type Tab = "dashboard" | "orders" | "menu";
type OrderStatus = "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

export default function AdminDashboardClient({
  initialOrders,
  initialMenuItems,
  initialStats,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [orders, setOrders] = useState<OrderDetails[]>(initialOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [stats, setStats] = useState(initialStats);
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "all">("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [newOrderNotification, setNewOrderNotification] = useState<string | null>(null);

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.push("/");
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const showNewOrderNotification = (orderNumber: string) => {
    setNewOrderNotification(orderNumber);
    setTimeout(() => setNewOrderNotification(null), 5000);
  };

  // Realtime subscription for new orders
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("orders-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          showNewOrderNotification(payload.new.order_number as string);
          // Refresh orders
          try {
            const response = await fetch("/api/admin/orders");
            const data = await response.json();
            if (data.orders) {
              setOrders(data.orders);
            }
          } catch (error) {
            console.error("Failed to refresh orders:", error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const previousOrders = [...orders];
    const orderIndex = orders.findIndex((o) => o.orderId === orderId);
    
    if (orderIndex === -1) return;

    // Optimistic update
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = { ...updatedOrders[orderIndex], status: newStatus };
    setOrders(updatedOrders);

    try {
      const order = orders[orderIndex];
      const dbOrderId = order.dbId;

      if (!dbOrderId) {
        throw new Error("Order database ID not found");
      }

      const statusResponse = await fetch(`/api/admin/orders/${dbOrderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!statusResponse.ok) {
        throw new Error("Failed to update status");
      }

      // Refresh stats
      const statsResponse = await fetch("/api/admin/stats");
      const statsData = await statsResponse.json();
      if (statsData.stats) {
        setStats(statsData.stats);
      }

      showToast("Order status updated successfully");
    } catch (error) {
      console.error("Failed to update order status:", error);
      setOrders(previousOrders);
      showToast("Failed to update order status", "error");
    }
  };

  // Menu CRUD operations
  const handleCreateMenuItem = async (data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    category: MenuCategory;
    image_url: string;
    badge?: string | null;
    is_veg: boolean;
    sort_order: number;
  }) => {
    try {
      const response = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create menu item");
      }

      // Refresh menu items
      const menuResponse = await fetch("/api/admin/menu");
      const menuData = await menuResponse.json();
      if (menuData.items) {
        setMenuItems(menuData.items);
      }

      showToast("Menu item created successfully");
    } catch (error) {
      console.error("Failed to create menu item:", error);
      showToast("Failed to create menu item", "error");
    }
  };

  const handleUpdateMenuItem = async (id: string, data: Partial<MenuItem>) => {
    try {
      const response = await fetch(`/api/admin/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update menu item");
      }

      // Refresh menu items
      const menuResponse = await fetch("/api/admin/menu");
      const menuData = await menuResponse.json();
      if (menuData.items) {
        setMenuItems(menuData.items);
      }

      showToast("Menu item updated successfully");
    } catch (error) {
      console.error("Failed to update menu item:", error);
      showToast("Failed to update menu item", "error");
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/menu/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete menu item");
      }

      // Refresh menu items
      const menuResponse = await fetch("/api/admin/menu");
      const menuData = await menuResponse.json();
      if (menuData.items) {
        setMenuItems(menuData.items);
      }

      showToast("Menu item deleted successfully");
    } catch (error) {
      console.error("Failed to delete menu item:", error);
      showToast("Failed to delete menu item", "error");
    }
  };

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    const previousItems = [...menuItems];
    const itemIndex = menuItems.findIndex((item) => item.dbId === id);
    
    if (itemIndex === -1) return;

    // Optimistic update
    const updatedItems = [...menuItems];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], isAvailable: !isAvailable };
    setMenuItems(updatedItems);

    try {
      const response = await fetch(`/api/admin/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: !isAvailable }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle availability");
      }

      showToast("Availability updated successfully");
    } catch (error) {
      console.error("Failed to toggle availability:", error);
      setMenuItems(previousItems);
      showToast("Failed to update availability", "error");
    }
  };

  const filteredOrders = orderFilter === "all" 
    ? orders 
    : orders.filter((order) => order.status === orderFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 rounded-xl px-4 py-3 text-sm font-semibold ${
              toast.type === "success" 
                ? "bg-green-500/20 border border-green-500/40 text-green-200" 
                : "bg-red-500/20 border border-red-500/40 text-red-200"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Order Notification */}
      <AnimatePresence>
        {newOrderNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-4 right-4 z-50 rounded-xl border border-amber-500/40 bg-amber-500/20 px-4 py-3 text-sm font-semibold text-amber-200"
          >
            🔔 New order: {newOrderNotification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen">
        {/* Sidebar - Desktop */}
        <aside className="hidden w-64 flex-shrink-0 border-r border-stone-800/60 bg-stone-950/50 p-6 lg:block">
          <h2 className="font-serif text-xl text-stone-100 mb-8">Admin Dashboard</h2>
          <nav className="space-y-2">
            {[
              { id: "dashboard" as Tab, label: "Dashboard" },
              { id: "orders" as Tab, label: "Orders" },
              { id: "menu" as Tab, label: "Menu" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-stone-400 hover:bg-stone-900/60 hover:text-stone-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-8">
            <button
              onClick={handleLogout}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-stone-400 transition-colors hover:bg-stone-900/60 hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
         
          {/* Mobile Tabs */}
          <div className="mb-6 flex gap-2 lg:hidden">
            {[
              { id: "dashboard" as Tab, label: "Dashboard" },
              { id: "orders" as Tab, label: "Orders" },
              { id: "menu" as Tab, label: "Menu" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-stone-900/60 text-stone-400 hover:bg-stone-900/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardStats stats={stats} />
                <RecentOrders orders={orders.slice(0, 5)} />
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <OrdersManagement
                  orders={filteredOrders}
                  filter={orderFilter}
                  onFilterChange={setOrderFilter}
                  expandedOrderId={expandedOrderId}
                  onExpand={setExpandedOrderId}
                  onUpdateStatus={updateOrderStatus}
                />
              </motion.div>
            )}

            {activeTab === "menu" && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MenuManagement
                  items={menuItems}
                  onCreate={handleCreateMenuItem}
                  onUpdate={handleUpdateMenuItem}
                  onDelete={handleDeleteMenuItem}
                  onToggleAvailability={handleToggleAvailability}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Dashboard Stats Component
function DashboardStats({ stats }: { stats: AdminDashboardClientProps["initialStats"] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon="📦"
        label="Today's Orders"
        value={stats.totalOrdersToday}
        color="amber"
      />
      <StatCard
        icon="💰"
        label="Today's Revenue"
        value={`₹${stats.revenueToday}`}
        color="green"
      />
      <StatCard
        icon="⏳"
        label="Pending Orders"
        value={stats.pendingOrders}
        color="amber"
      />
      <StatCard
        icon="🔥"
        label="Popular Item"
        value={stats.popularItem || "N/A"}
        color="orange"
      />
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: "amber" | "green" | "orange" }) {
  const colorClasses = {
    amber: "bg-amber-500/20 text-amber-400",
    green: "bg-green-500/20 text-green-400",
    orange: "bg-orange-500/20 text-orange-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-stone-800/60 bg-stone-900/70 p-6 shadow-lg shadow-black/20 backdrop-blur"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClasses[color]} text-2xl`}>
        {icon}
      </div>
      <p className="mt-4 text-sm font-semibold text-stone-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-stone-100">{value}</p>
    </motion.div>
  );
}

// Recent Orders Component
function RecentOrders({ orders }: { orders: OrderDetails[] }) {
  return (
    <div className="mt-8">
      <h2 className="font-serif text-2xl text-stone-100 mb-6">Recent Orders</h2>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-stone-800/60 bg-stone-900/70 p-8 text-center">
          <p className="text-stone-400">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, index) => (
            <motion.div
              key={order.orderId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-2xl border border-stone-800/60 bg-stone-900/70 p-4 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-stone-100">{order.orderId}</p>
                  <p className="text-sm text-stone-400">{order.customerName}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Orders Management Component
function OrdersManagement({
  orders,
  filter,
  onFilterChange,
  expandedOrderId,
  onExpand,
  onUpdateStatus,
}: {
  orders: OrderDetails[];
  filter: OrderStatus | "all";
  onFilterChange: (filter: OrderStatus | "all") => void;
  expandedOrderId: string | null;
  onExpand: (id: string | null) => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}) {
  const filters: (OrderStatus | "all")[] = ["all", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
              filter === f
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : "bg-stone-900/60 text-stone-400 border border-stone-800/60 hover:bg-stone-900/80"
            }`}
          >
            {f === "all" ? "All" : f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-stone-800/60 bg-stone-900/70 p-8 text-center">
          <p className="text-stone-400">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              isExpanded={expandedOrderId === order.orderId}
              onExpand={() => onExpand(expandedOrderId === order.orderId ? null : order.orderId)}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  isExpanded,
  onExpand,
  onUpdateStatus,
}: {
  order: OrderDetails;
  isExpanded: boolean;
  onExpand: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}) {
  const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    const flow: Record<OrderStatus, OrderStatus[]> = {
      confirmed: ["preparing", "cancelled"],
      preparing: ["out_for_delivery", "cancelled"],
      out_for_delivery: ["delivered", "cancelled"],
      delivered: [],
      cancelled: [],
    };
    return flow[currentStatus] || [];
  };

  const nextStatuses = getNextStatuses(order.status);

  return (
    <motion.div
      layout
      className="rounded-2xl border border-stone-800/60 bg-stone-900/70 backdrop-blur overflow-hidden"
    >
      <div
        className="cursor-pointer p-4"
        onClick={onExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-semibold text-stone-100">{order.orderId}</p>
            <p className="text-sm text-stone-400">{order.customerName} • {order.phone}</p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={order.status} />
            <p className="text-sm font-semibold text-amber-400">₹{order.total}</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-stone-800/60"
          >
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Items</p>
                <div className="space-y-2">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-stone-300">{item.name} × {item.quantity}</span>
                      <span className="text-stone-400">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Delivery Address</p>
                <p className="text-sm text-stone-300">{order.address}</p>
                {order.landmark && <p className="text-sm text-stone-400">Landmark: {order.landmark}</p>}
              </div>

              {order.specialInstructions && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Special Instructions</p>
                  <p className="text-sm text-stone-300">{order.specialInstructions}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Actions</p>
                <div className="flex flex-wrap gap-2">
                  {nextStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(order.orderId, status);
                      }}
                      className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
                    >
                      {status.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const statusConfig: Record<OrderStatus, { color: string; label: string }> = {
    confirmed: { color: "bg-amber-500/20 text-amber-200", label: "Confirmed" },
    preparing: { color: "bg-blue-500/20 text-blue-200", label: "Preparing" },
    out_for_delivery: { color: "bg-purple-500/20 text-purple-200", label: "Out for Delivery" },
    delivered: { color: "bg-green-500/20 text-green-200", label: "Delivered" },
    cancelled: { color: "bg-red-500/20 text-red-200", label: "Cancelled" },
  };

  const config = statusConfig[status];

  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${config.color}`}>
      {config.label}
    </span>
  );
}

// Menu Management Component
function MenuManagement({
  items,
  onCreate,
  onUpdate,
  onDelete,
  onToggleAvailability,
}: {
  items: MenuItem[];
  onCreate: (data: any) => void;
  onUpdate: (id: string, data: Partial<MenuItem>) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
}) {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = (data: any) => {
    if (editingItem) {
      onUpdate(editingItem.dbId!, data);
    } else {
      onCreate(data);
    }
    handleCloseModal();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl text-stone-100">Menu Items</h2>
        <button
          onClick={handleCreate}
          className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 shadow-md shadow-amber-900/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-700/40 hover:brightness-110 active:scale-95"
        >
          Add New Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-stone-800/60 bg-stone-900/70 p-8 text-center">
          <p className="text-stone-400">No menu items found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => onDelete(item.dbId!)}
              onToggleAvailability={() => onToggleAvailability(item.dbId!, item.isAvailable ?? true)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <MenuModal
            item={editingItem}
            onSave={handleSave}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}: {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
}) {
  return (
    <motion.div
      layout
      className={`rounded-2xl border border-stone-800/60 bg-stone-900/70 p-4 backdrop-blur ${
        !(item.isAvailable ?? true) ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-stone-100 truncate">{item.name}</p>
            {!(item.isAvailable ?? true) && (
              <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white bg-red-500/20">
                Unavailable
              </span>
            )}
            {item.badge && (
              <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white bg-amber-500/20">
                {item.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-stone-400">{item.category}</p>
          <p className="text-sm font-semibold text-amber-400">₹{item.price}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAvailability}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              item.isAvailable ?? true
                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
            }`}
          >
            {item.isAvailable ?? true ? "Available" : "Unavailable"}
          </button>
          <button
            onClick={onEdit}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-stone-400 transition-colors hover:bg-stone-800 hover:text-stone-200"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-stone-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Menu Modal Component
function MenuModal({
  item,
  onSave,
  onClose,
}: {
  item: MenuItem | null;
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    slug: item?.id || "",
    description: item?.description || "",
    price: item?.price || 0,
    category: (item?.category as MenuCategory) || "Momos",
    image_url: item?.image || "",
    badge: item?.badge || "",
    is_veg: item?.isVeg ?? true,
    sort_order: 0,
  });

  // Reset form when item changes
  useEffect(() => {
    setFormData({
      name: item?.name || "",
      slug: item?.id || "",
      description: item?.description || "",
      price: item?.price || 0,
      category: (item?.category as MenuCategory) || "Momos",
      image_url: item?.image || "",
      badge: item?.badge || "",
      is_veg: item?.isVeg ?? true,
      sort_order: 0,
    });
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl rounded-2xl border border-stone-800/60 bg-stone-900/95 p-6 shadow-xl shadow-black/30 backdrop-blur"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif text-2xl text-stone-100 mb-6">
          {item ? "Edit Menu Item" : "Add New Menu Item"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-stone-200">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
              placeholder="Item name"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-stone-200">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
              placeholder="item-slug"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-stone-200">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
              placeholder="Item description"
              rows={3}
              required
            />
          </div>

          <div className="">
            <div>
              <label className="text-sm font-semibold text-stone-200">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
                placeholder="99"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-stone-200">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as MenuCategory }))}
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none transition-colors focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
                required
              >
                <option value="Momos">Momos</option>
                <option value="Sandwiches">Sandwiches</option>
                <option value="Burgers">Burgers</option>
                <option value="Soya Chaap">Soya Chaap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-stone-200">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-stone-200">Badge (optional)</label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
              placeholder="Bestseller, New, etc."
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_veg}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_veg: e.target.checked }))}
                className="h-4 w-4 rounded border-stone-700 bg-stone-950/60 text-amber-500 focus:ring-amber-500/20"
              />
              <span className="text-sm font-semibold text-stone-200">Vegetarian</span>
            </label>
          </div>

          <div>
            <label className="text-sm font-semibold text-stone-200">Sort Order</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950/60 px-4 py-3 text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
              placeholder="0"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-stone-700 bg-stone-950/60 px-6 py-3 text-sm font-semibold text-stone-400 transition-colors hover:bg-stone-900/60 hover:text-stone-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold uppercase tracking-wider text-stone-950 shadow-md shadow-amber-900/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-700/40 hover:brightness-110 active:scale-95"
            >
              {item ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
