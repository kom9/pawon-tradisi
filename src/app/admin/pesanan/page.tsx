"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminSidebar, AdminHeader } from "@/components/AdminShell";
import { Icon } from "@/components/Navbar";
import { getOrders, ORDER_STATUS_LABEL, ORDER_STATUS_STYLE, updateOrderStatusServer, formatRupiah } from "@/lib/data";
import type { Order, OrderStatus } from "@/lib/types";

const ALL_STATUSES: OrderStatus[] = [
  "diterima",
  "sedang_dikukus",
  "sedang_ditata",
  "siap_kirim",
  "menunggu_pembayaran",
  "selesai",
];

export default function AdminPesananPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [demo, setDemo] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(({ orders, demo }) => {
      setOrders(orders);
      setDemo(demo);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.order_code.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.event_name.toLowerCase().includes(q)
    );
  }, [orders, search]);

  async function changeStatus(order: Order, status: OrderStatus) {
    const { ok } = await updateOrderStatusServer(order.id, status);
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    if (ok) toast.success(`${order.order_code} → ${ORDER_STATUS_LABEL[status]}`);
    else toast.message(`${order.order_code} (demo): status → ${ORDER_STATUS_LABEL[status]}`);
  }

  return (
    <div className="min-h-screen bg-surface-canvas">
      <AdminSidebar />
      <div className="lg:ml-72">
        <AdminHeader greeting="Manajemen Pesanan" />
        {demo && (
          <div className="bg-status-amber px-6 py-2 text-center text-bodySm font-semibold text-status-amberText lg:px-10">
            Mode Demo: pesanan contoh ditampilkan. Hubungkan Supabase untuk data live.
          </div>
        )}
        <main className="p-6 lg:p-10">
          <div className="editorial-border overflow-hidden rounded-card bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-editorial p-5">
              <div>
                <h1 className="font-display text-headlineSm font-semibold">Semua Pesanan</h1>
                <p className="text-bodySm text-ink-variant">{filtered.length} pesanan ditemukan</p>
              </div>
              <div className="relative">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="text"
                  placeholder="Cari kode, nama, atau acara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-72 rounded-DEFAULT border border-outline-editorial bg-white pl-10 pr-4 text-bodySm focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="bg-surface-low text-labelSm uppercase text-ink-variant">
                    <th className="px-4 py-3">Kode</th>
                    <th className="px-4 py-3">Pemesan & Acara</th>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3">Status Produksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-bodyMd text-ink-variant">Memuat...</td></tr>
                  ) : (
                    filtered.map((o) => (
                      <tr key={o.id} className="border-b border-outline-editorial/60 hover:bg-surface-low/70">
                        <td className="px-4 py-4 font-mono text-bodySm font-bold text-primary">{o.order_code}</td>
                        <td className="px-4 py-4">
                          <p className="text-bodyMd font-bold">{o.event_name}</p>
                          <p className="text-bodySm text-ink-variant">{o.customer_name} • {o.location}</p>
                        </td>
                        <td className="px-4 py-4 text-bodySm text-ink-variant">
                          {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                        </td>
                        <td className="px-4 py-4 text-right font-bold">{formatRupiah(o.total_amount)}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-block rounded-full border px-3 py-1 text-labelSm font-semibold ${ORDER_STATUS_STYLE[o.status]}`}>
                              {ORDER_STATUS_LABEL[o.status]}
                            </span>
                            <select
                              aria-label={`Ubah status ${o.order_code}`}
                              value={o.status}
                              onChange={(e) => changeStatus(o, e.target.value as OrderStatus)}
                              className="h-8 rounded-DEFAULT border border-outline-editorial bg-white px-2 text-bodySm font-semibold focus:border-primary focus:outline-none"
                            >
                              {ALL_STATUSES.map((s) => (
                                <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
