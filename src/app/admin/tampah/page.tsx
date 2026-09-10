"use client";

import { useEffect, useState } from "react";
import { AdminSidebar, AdminHeader } from "@/components/AdminShell";
import { Icon } from "@/components/Navbar";
import { getProducts, formatRupiah } from "@/lib/data";
import type { Product } from "@/lib/types";

export default function AdminTampahPage() {
  const [bundles, setBundles] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(({ products }) => setBundles(products.filter((p) => p.is_bundle)));
  }, []);

  return (
    <div className="min-h-screen bg-surface-canvas">
      <AdminSidebar />
      <div className="lg:ml-72">
        <AdminHeader greeting="Paket Tampah & Bundel" />
        <main className="p-6 lg:p-10">
          <h1 className="font-display text-headlineSm font-semibold">Kelola Paket Tampah</h1>
          <p className="mt-1 text-bodyMd text-ink-variant">
            Atur harga, komposisi isi, dan kuota harian tiap paket bundel.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {bundles.map((b) => (
              <div key={b.id} className="editorial-border rounded-card bg-white p-5">
                <img src={b.image_url} alt={b.name} className="h-40 w-full rounded-DEFAULT object-cover" />
                <h2 className="mt-4 font-display text-titleLg font-semibold">{b.name}</h2>
                <p className="mt-1 text-bodySm text-ink-variant">{b.unit}</p>
                <p className="mt-3 text-titleLg font-bold text-primary">{formatRupiah(b.price)}</p>
                <div className="mt-4 flex items-center justify-between border-t border-outline-editorial pt-4">
                  <span className="text-bodySm text-ink-variant">
                    Kuota: {(b.stock_capacity ?? 0) - (b.stock_sold ?? 0)} tersisa
                  </span>
                  <button className="flex items-center gap-1.5 rounded-DEFAULT border border-outline-editorial px-3 py-1.5 text-bodySm font-semibold hover:bg-surface-low">
                    <Icon name="edit" className="text-base" />
                    Ubah Paket
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
