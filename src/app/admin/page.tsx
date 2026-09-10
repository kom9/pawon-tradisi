"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminSidebar, AdminHeader, KpiCard } from "@/components/AdminShell";
import { Icon } from "@/components/Navbar";
import { getOrders, ORDER_STATUS_LABEL, ORDER_STATUS_STYLE, updateOrderStatusServer } from "@/lib/data";
import { formatRupiah } from "@/lib/data";
import type { Order, OrderStatus } from "@/lib/types";
import { FALLBACK_PRODUCTS } from "@/lib/demo-data";

const STATUS_FILTERS: { key: string; label: (n: number) => string; match: (o: Order) => boolean }[] = [
  { key: "semua", label: (n) => `Semua (${n})`, match: () => true },
  { key: "produksi", label: (n) => `Perlu Dikukus (${n})`, match: (o) => o.status === "sedang_dikukus" || o.status === "sedang_ditata" },
  { key: "siap", label: (n) => `Siap Kirim (${n})`, match: (o) => o.status === "siap_kirim" },
];

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  diterima: "sedang_dikukus",
  sedang_dikukus: "sedang_ditata",
  sedang_ditata: "siap_kirim",
  siap_kirim: "selesai",
  menunggu_pembayaran: "diterima",
  selesai: null,
};

const DISPATCH_FLEET = [
  { route: "Rute A — Jakarta Pusat & Sudirman", driver: "Mas Joko (Mobil Van Dingin)", load: "4 Tampah Sultan, 30 Snack Box", depart: "05:45 WIB", status: "Loading Box", color: "bg-status-amber text-status-amberText" },
  { route: "Rute B — Kebayoran & Pondok Indah", driver: "Mas Bambang (Blindvan 02)", load: "7 Tampah, 20 Box Hajatan", depart: "06:15 WIB", status: "Siap Berangkat", color: "bg-status-fresh text-status-freshText" },
  { route: "Rute C — Kuningan & Tebet", driver: "Mas Slamet (Motor Keranjang Dapur)", load: "12 Pesanan Satuan Pagi", depart: "06:00 WIB", status: "Siap di Parkiran", color: "bg-status-fresh text-status-freshText" },
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [demo, setDemo] = useState(false);
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(({ orders, demo }) => {
      setOrders(orders);
      setDemo(demo);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(
    () => orders.filter(STATUS_FILTERS.find((f) => f.key === filter)!.match),
    [orders, filter]
  );

  const kpi = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total_amount, 0);
    const subuh = orders.filter((o) => o.delivery_time < "10:00").length;
    return {
      revenue,
      count: orders.length,
      subuh,
      tampah: orders.filter((o) => o.event_name.toLowerCase().includes("tampah")).length,
    };
  }, [orders]);

  async function advanceStatus(order: Order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    const { ok } = await updateOrderStatusServer(order.id, next);
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)));
    if (ok) toast.success(`${order.order_code} → ${ORDER_STATUS_LABEL[next]}`);
    else toast.message(`${order.order_code} (demo): status → ${ORDER_STATUS_LABEL[next]}`);
  }

  const stockItems = FALLBACK_PRODUCTS.filter((p) => ["p1", "p2", "p3", "p6"].includes(p.id));
  const ownerNote =
    "Hiasan daun pisang kepang mawar wajib untuk Tampah Sultan Ibu Ratna. Standar kukus kelapa parut: 98°C, jangan lebih.";

  return (
    <div className="min-h-screen bg-surface-canvas">
      <AdminSidebar />
      <div className="lg:ml-72">
        <AdminHeader />

        {demo && (
          <div className="bg-status-amber px-6 py-2 text-center text-bodySm font-semibold text-status-amberText lg:px-10">
            Mode Demo: pesanan contoh ditampilkan. Hubungkan Supabase untuk data live & update status.
          </div>
        )}

        <main className="space-y-6 p-6 lg:p-10">
          {/* Banner pesanan baru */}
          <div className="editorial-border flex flex-wrap items-center justify-between gap-3 rounded-card bg-white p-4">
            <p className="flex items-center gap-2 text-bodyMd">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-container opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-secondary-container" />
              </span>
              <span className="font-semibold text-primary font-mono">#PWN-8833</span>
              Tampah Tamu Agung ({formatRupiah(448500)}) berhasil disinkronkan dari checkout pelanggan online.
            </p>
            <span className="rounded-full bg-status-steam px-3 py-1 text-labelSm font-semibold text-status-steamText">
              Sinkron Real-time
            </span>
          </div>

          {/* KPI Grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Total Pendapatan Hari Ini"
              value={formatRupiah(kpi.revenue)}
              sub={`+${formatRupiah(448500)} baru masuk`}
              icon="payments"
              trend="+14% vs kemarin"
            />
            <KpiCard
              title="Total Pesanan Masuk"
              value={`${kpi.count} Pesanan`}
              sub={`${kpi.subuh} Subuh 06:00 • ${kpi.count - kpi.subuh} Siang 11:00`}
              icon="receipt_long"
            />
            <KpiCard
              title="Paket Tampah Aktif"
              value={`${kpi.tampah} Tampah`}
              sub="Jadwal kirim 06:00–10:00 WIB"
              icon="inventory_2"
            />
            <KpiCard
              title="Status Stok Dapur"
              value="92% Kapasitas"
              sub="Klepon & Lemper hampir habis!"
              icon="bakery_dining"
            />
          </div>

          {/* Split: tabel + sidebar */}
          <div className="grid gap-6 xl:grid-cols-12">
            {/* Tabel pesanan */}
            <section className="editorial-border overflow-hidden rounded-card bg-white xl:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-editorial p-5">
                <div>
                  <h2 className="font-display text-titleLg font-semibold">Pesanan Hari Ini</h2>
                  <p className="text-bodySm text-ink-variant">Menampilkan {filtered.length} dari {orders.length} pesanan</p>
                </div>
                <div className="flex gap-2">
                  {STATUS_FILTERS.map((f) => {
                    const n = orders.filter(f.match).length;
                    return (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setFilter(f.key)}
                        className={`rounded-full border px-3.5 py-1.5 text-bodySm font-semibold transition-colors ${
                          filter === f.key
                            ? "border-primary bg-primary text-white"
                            : "editorial-border bg-white text-ink hover:bg-surface-low"
                        }`}
                      >
                        {f.label(n)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left">
                  <thead>
                    <tr className="bg-surface-low text-labelSm uppercase text-ink-variant">
                      <th className="px-4 py-3">ID Pesanan</th>
                      <th className="px-4 py-3">Pemesan & Acara</th>
                      <th className="px-4 py-3">Jadwal Kirim</th>
                      <th className="px-4 py-3 text-right">Nilai</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="p-8 text-center text-bodyMd text-ink-variant">Memuat pesanan...</td></tr>
                    ) : (
                      filtered.map((o) => (
                        <tr key={o.id} className="border-b border-outline-editorial/60 transition-colors hover:bg-surface-low/70">
                          <td className="px-4 py-4 font-mono text-bodySm font-bold text-primary">{o.order_code}</td>
                          <td className="px-4 py-4">
                            <p className="text-bodyMd font-bold leading-snug">{o.event_name}</p>
                            <p className="text-bodySm text-ink-variant">{o.customer_name} • {o.location}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-bodyMd font-semibold">{o.delivery_time} WIB</p>
                            <p className="text-bodySm text-ink-variant">{o.courier_info}</p>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <p className="text-bodyMd font-bold">{formatRupiah(o.total_amount)}</p>
                            <p className="text-[11px] text-ink-variant">{o.payment_status}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-block rounded-full border px-3 py-1 text-labelSm font-semibold ${ORDER_STATUS_STYLE[o.status]}`}>
                              {ORDER_STATUS_LABEL[o.status]}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-center gap-1">
                              <button
                                type="button"
                                title="Cetak Resi & Label Kurir"
                                onClick={() => toast.success(`Resi ${o.order_code} dikirim ke printer.`)}
                                className="flex h-9 w-9 items-center justify-center rounded-DEFAULT text-ink-variant hover:bg-surface-low hover:text-primary"
                              >
                                <Icon name="print" className="text-lg" />
                              </button>
                              <button
                                type="button"
                                title="Detail Pesanan"
                                onClick={() =>
                                  toast(`${o.order_code} — ${o.event_name}`, {
                                    description: `${o.customer_name} • ${o.location} • ${formatRupiah(o.total_amount)}`,
                                  })
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-DEFAULT text-ink-variant hover:bg-surface-low hover:text-primary"
                              >
                                <Icon name="visibility" className="text-lg" />
                              </button>
                              {NEXT_STATUS[o.status] && (
                                <button
                                  type="button"
                                  title={`Lanjutkan ke: ${ORDER_STATUS_LABEL[NEXT_STATUS[o.status]!]}`}
                                  onClick={() => advanceStatus(o)}
                                  className="flex h-9 w-9 items-center justify-center rounded-DEFAULT text-primary hover:bg-primary/10"
                                >
                                  <Icon name="check_circle" className="text-lg" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Sidebar kanan */}
            <div className="space-y-6 xl:col-span-4">
              {/* Stok harian */}
              <section className="editorial-border rounded-card bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-titleLg font-semibold">Stok Kue Harian</h2>
                  <button type="button" className="flex items-center gap-1.5 rounded-DEFAULT border border-outline-editorial px-3 py-1.5 text-bodySm font-semibold hover:bg-surface-low">
                    <Icon name="refresh" className="text-base" />
                    Sinkron
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  {stockItems.map((p) => {
                    const pct = Math.round(((p.stock_sold ?? 0) / (p.stock_capacity ?? 1)) * 100);
                    const left = (p.stock_capacity ?? 0) - (p.stock_sold ?? 0);
                    const color = pct >= 100 ? "bg-error" : pct >= 90 ? "bg-secondary-gold" : "bg-primary";
                    return (
                      <div key={p.id}>
                        <div className="flex items-center justify-between text-bodySm">
                          <span className="font-semibold">{p.name}</span>
                          <span className="text-ink-variant">
                            {left > 0 ? `Tersisa ${left}` : "Habis • Order Ditutup"}
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 w-full rounded-full bg-surface-high">
                          <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <div className="mt-1 flex justify-between text-[11px] text-ink-variant">
                          <span>{p.stock_sold}/{p.stock_capacity} terjual</span>
                          <span className="font-semibold">{pct >= 100 ? "Ditutup" : `${pct}%`}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-DEFAULT border border-outline-editorial py-2.5 text-bodyMd font-semibold hover:bg-surface-low"
                >
                  <Icon name="tune" className="text-lg" />
                  Kelola Seluruh 38 Jenis Kue
                </button>
              </section>

              {/* Pesan khusus dapur */}
              <section className="editorial-border rounded-card bg-surface-low p-5">
                <h2 className="flex items-center gap-2 font-display text-titleLg font-semibold">
                  <Icon name="campaign" className="text-secondary-gold" />
                  Pesan Khusus Dapur
                </h2>
                <div className="mt-3 rounded-DEFAULT border-l-4 border-secondary-gold bg-white p-4">
                  <p className="text-bodyMd leading-relaxed">{ownerNote}</p>
                  <p className="mt-3 text-bodySm font-semibold text-ink-variant">
                    — Bu Rohayah (Owner) • 04:15 WIB
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Armada pengiriman */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-titleLg font-semibold">Jadwal Keberangkatan Armada Pengiriman Subuh</h2>
              <button type="button" className="flex items-center gap-1.5 text-bodySm font-semibold text-primary hover:underline">
                <Icon name="route" className="text-base" />
                Lihat Peta Rute Kurir
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {DISPATCH_FLEET.map((f) => (
                <div key={f.route} className="editorial-border rounded-card bg-white p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-bodyMd font-bold leading-snug">{f.route}</h3>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${f.color}`}>
                      {f.status}
                    </span>
                  </div>
                  <p className="mt-2 text-bodySm text-ink-variant">{f.driver}</p>
                  <p className="text-bodySm text-ink-variant">Muatan: {f.load}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-bodySm font-bold text-primary">
                    <Icon name="schedule" className="text-base" />
                    Berangkat {f.depart}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
    );
}
