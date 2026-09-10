"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminSidebar, AdminHeader } from "@/components/AdminShell";
import { Icon } from "@/components/Navbar";
import { getProducts, formatRupiah } from "@/lib/data";
import type { Product } from "@/lib/types";

export default function AdminKatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [demo, setDemo] = useState(false);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(({ products, demo }) => {
      setProducts(products);
      setDemo(demo);
      const map: Record<string, boolean> = {};
      products.forEach((p) => {
        const pct = (p.stock_sold ?? 0) / (p.stock_capacity ?? 1);
        map[p.id] = pct < 1;
      });
      setOpenMap(map);
      setLoading(false);
    });
  }, []);

  const totalValue = products.reduce(
    (s, p) => s + p.price * ((p.stock_capacity ?? 0) - (p.stock_sold ?? 0)),
    0
  );

  return (
    <div className="min-h-screen bg-surface-canvas">
      <AdminSidebar />
      <div className="lg:ml-72">
        <AdminHeader greeting="Katalog & Stok Harian" />
        {demo && (
          <div className="bg-status-amber px-6 py-2 text-center text-bodySm font-semibold text-status-amberText lg:px-10">
            Mode Demo: stok contoh ditampilkan. Hubungkan Supabase untuk update stok live.
          </div>
        )}
        <main className="p-6 lg:p-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-headlineSm font-semibold">Kelola Katalog & Stok</h1>
              <p className="text-bodySm text-ink-variant">
                {products.length} jenis aktif • Nilai stok tersisa ± {formatRupiah(totalValue)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toast.success("Form kue baru dibuka.")}
              className="flex items-center gap-2 rounded-DEFAULT bg-primary px-5 py-2.5 text-bodyMd font-semibold text-white hover:bg-primary-deep"
            >
              <Icon name="add_circle" className="text-lg" />
              Tambah Kue Baru
            </button>
          </div>

          {loading ? (
            <div className="editorial-border rounded-card bg-white p-10 text-center text-bodyMd text-ink-variant">Memuat...</div>
          ) : (
            <div className="editorial-border overflow-hidden rounded-card bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left">
                  <thead>
                    <tr className="bg-surface-low text-labelSm uppercase text-ink-variant">
                      <th className="px-4 py-3">Kue</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3 text-right">Harga</th>
                      <th className="px-4 py-3">Stok Terjual / Kapasitas</th>
                      <th className="px-4 py-3 text-center">Order Dibuka</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const pct = Math.round(((p.stock_sold ?? 0) / (p.stock_capacity ?? 1)) * 100);
                      const color = pct >= 100 ? "bg-error" : pct >= 90 ? "bg-secondary-gold" : "bg-primary";
                      return (
                        <tr key={p.id} className="border-b border-outline-editorial/60 hover:bg-surface-low/70">
                          <td className="flex items-center gap-3 px-4 py-4">
                            <img src={p.image_url} alt={p.name} className="h-12 w-12 rounded-DEFAULT object-cover" />
                            <div>
                              <p className="text-bodyMd font-bold">{p.name}</p>
                              <p className="text-bodySm text-ink-variant">{p.unit}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-surface-low px-3 py-1 text-bodySm font-semibold text-ink-variant">
                              {p.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right font-bold">{formatRupiah(p.price)}</td>
                          <td className="px-4 py-4">
                            <div className="h-2 w-40 rounded-full bg-surface-high">
                              <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                            </div>
                            <p className="mt-1 text-bodySm text-ink-variant">
                              {p.stock_sold}/{p.stock_capacity} ({pct}%)
                            </p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={openMap[p.id]}
                              onClick={() => {
                                setOpenMap({ ...openMap, [p.id]: !openMap[p.id] });
                                toast.success(
                                  `${p.name}: order ${!openMap[p.id] ? "dibuka" : "ditutup"}${demo ? " (demo)" : ""}`
                                );
                              }}
                              className={`relative h-6 w-11 rounded-full transition-colors ${openMap[p.id] ? "bg-primary" : "bg-outline-variant"}`}
                            >
                              <span
                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                                  openMap[p.id] ? "left-[22px]" : "left-0.5"
                                }`}
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
