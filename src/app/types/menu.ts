export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  mealTime?: "breakfast" | "lunch" | "dinner";
  subcategory?: string;
  description?: string;
  image?: string;
note?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  status?: "pending" | "cooking" | "delivered" | "cancelled";
  orderedAt?: number;
  cancelledAt?: number;
}

export interface Order {
  tableNumber: string;
  items: CartItem[];
  cancelledItems?: CartItem[];
  timestamp: number;
  status: 'active' | 'completed';
}

export interface CompletedOrderRecord {
  tableNumber: string;
  items: CartItem[];
  cancelledItems: CartItem[];
  revenue: number;
  timestamp: number;
  completedAt: number;
}

export interface CancelledItemRecord {
  tableNumber: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
  cancelledAt: number;
}

export interface AnalyticsData {
  completedOrders: CompletedOrderRecord[];
  cancelledItems: CancelledItemRecord[];
}

export interface RatingRecord {
  tableNumber: string;
  rating: number;
  comment: string;
  timestamp: number;
}
