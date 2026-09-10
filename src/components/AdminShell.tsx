"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { Icon } from "./Navbar";
import { formatRupiah } from "@/lib/data";

const NAV_ITEMS = [
  { href: "/admin", label: "Ringkasan Toko", icon: "dashboard", key: "dashboard" },
  { href: "/admin/pesanan", label: "Pesanan Masuk", icon: "receipt_long", badge: "13 Baru" },
  { href: "/admin/katalog", label: "Katalog & Stok Harian", icon: "bakery_dining" },
  { href: "/admin/tampah", label: "Paket Tampah", icon: "inventory_2" },
  { href: "/admin/cerita", label: "Cerita Nusantara", icon: "menu_book" },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: "settings" },
];

export function AdminSidebar({ userName = "Mbak Parni", userRole = "Kepala Dapur Subuh" }: { userName?: string; userRole?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        await createClient().auth.signOut();
      } catch {}
    }
    router.push("/masuk");
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-outline-editorial bg-white lg:flex">
      <div className="border-b border-outline-editorial p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white">
            <Icon name="bakery_dining" className="text-2xl" />
          </span>
          <div>
            <p className="font-display text-titleMd font-semibold">Toko Kue Bu Rohayah</p>
            <p className="text-bodySm text-ink-variant">Portal Pengelola Dapur</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-DEFAULT bg-secondary-gold py-2.5 text-bodyMd font-semibold text-white hover:bg-tertiary-bakar"
        >
          <Icon name="add_circle" className="text-lg" />
          Buat Pesanan Manual
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-DEFAULT px-4 py-3 text-bodyMd font-semibold transition-colors ${
                active ? "bg-primary/10 text-primary" : "text-ink-variant hover:bg-surface-low hover:text-ink"
              }`}
            >
              <Icon name={item.icon} className="text-xl" />
              <span className="flex-1">{item.label}</span>
              {"badge" in item && item.badge && (
                <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold text-ink">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-outline-editorial p-4">
        <Link href="#" className="flex items-center gap-3 rounded-DEFAULT px-4 py-2.5 text-bodyMd font-semibold text-ink-variant hover:bg-surface-low">
          <Icon name="help" className="text-xl" />
          Bantuan Dapur
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-DEFAULT px-4 py-2.5 text-bodyMd font-semibold text-error hover:bg-error-container/40"
        >
          <Icon name="logout" className="text-xl" />
          Keluar Akun
        </button>
        <div className="editorial-border mt-4 flex items-center gap-3 rounded-DEFAULT bg-surface-low p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-bodyMd font-bold text-white">
            {userName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </span>
          <div>
            <p className="text-bodySm font-bold">{userName}</p>
            <p className="text-[11px] text-ink-variant">{userRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function AdminHeader({ greeting = "Selamat Pagi, Dapur Utama" }: { greeting?: string }) {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <header className="sticky top-0 z-30 border-b border-outline-editorial bg-surface-canvas/95 px-6 py-4 backdrop-blur-md lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-headlineSm font-semibold">{greeting}</h1>
            <span className="hidden rounded-full bg-status-fresh px-3 py-1 text-labelSm font-semibold text-status-freshText sm:block">
              Dapur Aktif (Produksi Subuh)
            </span>
          </div>
          <p className="mt-1 text-bodySm text-ink-variant">
            {today} • Shift 04:00 – 12:00 WIB
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            aria-label="Pilih cabang dapur"
            className="h-10 rounded-DEFAULT border-[1.5px] border-outline-editorial bg-white px-3 text-bodySm font-semibold focus:border-primary focus:outline-none"
          >
            <option>Dapur Pusat Menteng (Jakarta Pusat)</option>
            <option>Dapur Satelit Wijaya (Jakarta Selatan)</option>
            <option>Dapur Satelit Serpong (Tangerang)</option>
          </select>
          <button type="button" aria-label="Notifikasi" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-outline-editorial bg-white text-ink hover:bg-surface-low">
            <Icon name="notifications" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary-container" />
          </button>
        </div>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-bodySm text-ink-variant">
        <Icon name="thermostat" className="text-base text-primary" />
        Standar Halal & Higienis — Suhu Kukusan: 98°C • Optimal
      </p>
    </header>
  );
}

/** Kartu KPI untuk dashboard admin */
export function KpiCard({ title, value, sub, icon, trend }: { title: string; value: string; sub?: string; icon: string; trend?: string }) {
  return (
    <div className="editorial-border rounded-card bg-white p-5 transition-shadow hover:shadow-warm">
      <div className="flex items-start justify-between">
        <p className="text-labelSm uppercase tracking-wide text-ink-variant">{title}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon name={icon} className="text-xl" />
        </span>
      </div>
      <p className="mt-2 font-display text-headlineMd font-semibold text-ink">{value}</p>
      {sub && <p className="mt-1 text-bodySm text-ink-variant">{sub}</p>}
      {trend && (
        <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-status-fresh px-2.5 py-1 text-[11px] font-bold text-status-freshText">
          <Icon name="trending_up" className="text-sm" />
          {trend}
        </p>
      )}
    </div>
  );
}
