export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number; // dalam rupiah penuh
  unit: string;
  badges: string[];
  description: string;
  image_url: string;
  is_bundle: boolean;
  is_active: boolean;
  stock_capacity: number | null;
  stock_sold: number | null;
  sort_order: number;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  read_time: number; // menit
  views: number;
  is_featured: boolean;
  published_at: string;
  image_url: string;
};

export type OrderStatus =
  | "diterima"
  | "sedang_dikukus"
  | "sedang_ditata"
  | "siap_kirim"
  | "menunggu_pembayaran"
  | "selesai";

export type Order = {
  id: string;
  order_code: string; // #PWN-XXXX
  event_name: string;
  customer_name: string;
  phone: string;
  location: string;
  items: OrderItem[];
  delivery_slot: string;
  delivery_date: string;
  delivery_time: string;
  courier_info: string;
  address: string;
  notes: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  status: OrderStatus;
  created_at: string;
};

export type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  role: "customer" | "staff" | "admin";
  created_at: string;
};
