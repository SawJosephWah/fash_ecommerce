export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  size: string;   // Added to match your Validator/Schema
  color: string;  // Added to match your Validator/Schema
}

// Data required to create an order
export interface CreateOrderRequest {
  items: OrderItem[];
  bill: number;
}

// Full Order object returned from the server
export interface Order extends CreateOrderRequest {
  _id: string;
  userId: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}


export interface OrderResponse {
  status: string;
  data: {
    order: Order;
  };
}

export interface AllOrdersResponse {
  status: string;
  results: number;
  data: Order[];
}

// Define the response type for the confirmation (Matches the Order model)
export interface ConfirmOrderResponse {
  _id: string;
  userId: string;
  items: OrderItem[];
  bill: number;
  status: string;
  customer: string;
  stripeSessionId: string;
}

export interface ApiResponse<T> {
  status: string;
  data: Order[];
}