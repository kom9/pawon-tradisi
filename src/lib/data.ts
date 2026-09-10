import { createClient } from "./supabase/browser";
import type { Article, Order, Product, Profile } from "./types";
import { FALLBACK_ARTICLES, FALLBACK_ORDERS, FALLBACK_PRODUCTS } from "./demo-data";

/**
 * Data Access Layer — selalu aman dipanggil:
 * - Jika NEXT_PUBLIC_SUPABASE_URL terkonfigurasi → query Supabase
 * - Jika gagal / belum dikonfigurasi → fallback ke Demo Mode (data lokal)
 */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

async function safeQuery<T>(
  table: string,
  run: (client: ReturnType<typeof createClient>) => Promise<T | null>
): Promise<{ data: T | null; demo: boolean }> {
  if (!isSupabaseConfigured()) return { data: null, demo: true };
  try {
    const client = createClient();
    const data = await run(client);
    return { data, demo: false };
  } catch {
    // Kegagalan jaringan/tables belum ada → demo mode agar UI tetap jalan
    return { data: null, demo: true };
  }
}

// ---------- PRODUK ----------

export async function getProducts(category?: string): Promise<{
  products: Product[];
  demo: boolean;
}> {
  const { data, demo } = await safeQuery<Product[]>("products", async (client) => {
    let query = client
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (category && category !== "Semua Kue") query = query.eq("category", category);
    const { data, error } = await query;
    if (error) throw error;
    return data as Product[];
  });

  let products = data && data.length > 0 ? data : FALLBACK_PRODUCTS;
  if (demo || !data || data.length === 0) {
    products =
      category && category !== "Semua Kue"
        ? FALLBACK_PRODUCTS.filter((p) => p.category === category)
        : FALLBACK_PRODUCTS;
  }
  return { products, demo: demo || !data || data.length === 0 };
}

// ---------- ARTIKEL ----------

export async function getArticles(opts?: {
  category?: string;
  search?: string;
  limit?: number;
}): Promise<{ articles: Article[]; demo: boolean }> {
  const { data, demo } = await safeQuery<Article[]>("articles", async (client) => {
    let query = client.from("articles").select("*").order("published_at", { ascending: false });
    if (opts?.category && opts.category !== "Semua Cerita")
      query = query.eq("category", opts.category);
    if (opts?.limit) query = query.limit(opts.limit);
    const { data, error } = await query;
    if (error) throw error;
    return data as Article[];
  });

  let list = data && data.length > 0 ? data : FALLBACK_ARTICLES;
  if (demo || !data || data.length === 0) {
    list = FALLBACK_ARTICLES;
  }
  if (opts?.category && opts.category !== "Semua Cerita")
    list = list.filter((a) => a.category === opts.category);
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    list = list.filter(
      (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
    );
  }
  if (opts?.limit) list = list.slice(0, opts.limit);
  return { articles: list, demo: demo || !data || data.length === 0 };
}

export async function getFeaturedArticle(): Promise<Article> {
  const { articles } = await getArticles({ limit: 20 });
  return articles.find((a) => a.is_featured) ?? articles[0];
}

export async function getPopularArticles(): Promise<Article[]> {
  const { articles } = await getArticles({});
  return [...articles].sort((a, b) => b.views - a.views).slice(0, 4);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, demo } = await safeQuery<Article | null>("articles", async (client) => {
    const { data, error } = await client.from("articles").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data as Article | null;
  });
  if (data) return data;
  if (demo) return FALLBACK_ARTICLES.find((a) => a.slug === slug) ?? null;
  return FALLBACK_ARTICLES.find((a) => a.slug === slug) ?? null;
}

// ---------- PESANAN (client-side, untuk admin dashboard) ----------

export async function getOrders(): Promise<{ orders: Order[]; demo: boolean }> {
  const { data, demo } = await safeQuery<Order[]>("orders", async (client) => {
    const { data, error } = await client.from("orders").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data as Order[];
  });
  if (data && data.length > 0) return { orders: data, demo: false };
  return { orders: FALLBACK_ORDERS, demo: true };
}

export async function updateOrderStatusServer(orderId: string, status: Order["status"]) {
  if (!isSupabaseConfigured()) return { ok: false, demo: true };
  try {
    const client = createClient();
    const { error } = await client.from("orders").update({ status }).eq("id", orderId);
    if (error) throw error;
    return { ok: true, demo: false };
  } catch {
    return { ok: false, demo: true };
  }
}

// ---------- UTIL ----------

export function formatRupiah(num: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

export const ORDER_STATUS_LABEL: Record<Order["status"], string> = {
  diterima: "Diterima • Siap Olah",
  sedang_dikukus: "Sedang Dikukus",
  sedang_ditata: "Sedang Ditata Tampah",
  siap_kirim: "Siap Kirim",
  menunggu_pembayaran: "Menunggu Pembayaran",
  selesai: "Selesai",
};

export const ORDER_STATUS_STYLE: Record<Order["status"], string> = {
  diterima: "bg-status-fresh text-status-freshText border-status-freshText/20",
  sedang_dikukus: "bg-status-amber text-status-amberText border-status-amberText/20",
  sedang_ditata: "bg-status-steam text-status-steamText border-status-steamText/20",
  siap_kirim: "bg-status-fresh text-status-freshText border-status-freshText/20",
  menunggu_pembayaran: "bg-status-pay text-status-payText border-status-payText/20",
  selesai: "bg-status-done text-status-doneText border-status-doneText/20",
};
