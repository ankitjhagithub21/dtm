export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export type PaymentMethod = "cod" | "online";
export type OrderStatus = "confirmed";

export interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  landmark?: string;
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedTime: string;
}

export type NewOrderDetails = Omit<
  OrderDetails,
  "orderId" | "status" | "createdAt" | "estimatedTime"
>;

export interface OrderStore {
  orders: OrderDetails[];
  currentOrder: OrderDetails | null;
  placeOrder: (order: NewOrderDetails) => OrderDetails;
  clearCurrentOrder: () => void;
}
