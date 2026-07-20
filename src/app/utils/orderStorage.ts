import { CartItem, Order, AnalyticsData, CompletedOrderRecord, CancelledItemRecord } from "../types/menu";

const STORAGE_KEY = "hotel_orders";
const ANALYTICS_KEY = "hotel_analytics";

export function getOrders(): Record<string, Order> {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function getOrderByTable(tableNumber: string): Order | null {
  const orders = getOrders();
  return orders[tableNumber] || null;
}

export function saveOrder(tableNumber: string, items: CartItem[]) {
  const orders = getOrders();
  const existingOrder = orders[tableNumber];
  const now = Date.now();

  const updatedItems = items.map(item => {
    const existingItem = existingOrder?.items.find(i => i.id === item.id);
    return {
      ...item,
      status: existingItem?.status || "pending" as const,
      orderedAt: existingItem?.orderedAt ?? now,
    };
  });

  orders[tableNumber] = {
    tableNumber,
    items: updatedItems,
    cancelledItems: existingOrder?.cancelledItems || [],
    timestamp: existingOrder?.timestamp || now,
    status: 'active',
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function updateItemStatus(tableNumber: string, itemId: string, status: "pending" | "cooking" | "delivered") {
  const orders = getOrders();
  const order = orders[tableNumber];
  if (order) {
    order.items = order.items.map(item =>
      item.id === itemId ? { ...item, status } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
}

export function cancelItem(tableNumber: string, itemId: string): boolean {
  const orders = getOrders();
  const order = orders[tableNumber];
  if (!order) return false;

  const itemToCancel = order.items.find(i => i.id === itemId);
  if (!itemToCancel) return false;

  const FOUR_MINUTES = 4 * 60 * 1000;
  const orderedAt = itemToCancel.orderedAt || order.timestamp;
  if (Date.now() - orderedAt > FOUR_MINUTES) return false;

  const cancelledItem: CartItem = {
    ...itemToCancel,
    status: "cancelled",
    cancelledAt: Date.now(),
  };

  order.items = order.items.filter(i => i.id !== itemId);
  order.cancelledItems = [...(order.cancelledItems || []), cancelledItem];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

  const analytics = getAnalytics();
  const record: CancelledItemRecord = {
    tableNumber,
    itemName: itemToCancel.name,
    itemPrice: itemToCancel.price,
    quantity: itemToCancel.quantity,
    cancelledAt: Date.now(),
  };
  analytics.cancelledItems.push(record);
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));

  return true;
}

export function completeOrder(tableNumber: string) {
  const orders = getOrders();
  if (orders[tableNumber]) {
    orders[tableNumber].status = 'completed';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
}

export function clearOrder(tableNumber: string, revenue: number) {
  const orders = getOrders();
  const order = orders[tableNumber];
  if (order) {
    const analytics = getAnalytics();
    const record: CompletedOrderRecord = {
      tableNumber,
      items: order.items,
      cancelledItems: order.cancelledItems || [],
      revenue,
      timestamp: order.timestamp,
      completedAt: Date.now(),
    };
    analytics.completedOrders.push(record);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));

    delete orders[tableNumber];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
}

export function getAnalytics(): AnalyticsData {
  const stored = localStorage.getItem(ANALYTICS_KEY);
  return stored ? JSON.parse(stored) : { completedOrders: [], cancelledItems: [] };
}

export function getRatings(): Array<{ tableNumber: string; rating: number; comment: string; timestamp: number }> {
  const stored = localStorage.getItem("hotel_ratings");
  return stored ? JSON.parse(stored) : [];
}
