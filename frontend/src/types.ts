export type UserRole = "USER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  status: "ACTIVE" | "SOLD" | "REMOVED";
  seller: User;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  priceAtPurchase: number;
  seller: User;
}

export interface Order {
  id: number;
  buyer: User;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Toys",
  "Automotive",
  "Health & Beauty",
  "Collectibles",
  "Other",
] as const;
