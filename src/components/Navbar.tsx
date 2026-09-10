"use client";

import { useState } from "react";
import Link from "next/link";

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

/** Keranjang belanja sederhana berbasis localStorage, tersinkron antar halaman */
export type CartItem = { name: string; qty: number; price: number; unit?: string };

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("pawon_cart") ?? "[]");
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  localStorage.setItem("pawon_cart", JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: CartItem) {
  const items = getCart();
  const existing = items.find((i) => i.name === item.name);
  if (existing) existing.qty += item.qty;
  else items.push(item);
  setCart(items);
}

const NAV_LINKS = [
  { href: "/#katalog", label: "Katalog Kue" },
  { href: "/#tampah", label: "Paket Tampah & Box" },
  { href: "/artikel", label: "Cerita Rasa" },
  { href: "/#kualitas", label: "Jaminan Kualitas" },
];

export function Navbar({ active }: { active?: string }) {
  const [cartCount, setCartCount] = useState(0);
  const [open, setOpen] = useState(false);

  useState(() => {
    if (typeof window !== "undefined") {
      const update = () => {
        const items = getCart();
        setCartCount(items.reduce((s, i) => s + i.qty, 0));
      };
      update();
      window.addEventListener("cart-updated", update);
      return () => window.removeEventListener("cart-updated", update);
    }
  });

  return (
    <header className="sticky top-0 z-40 border-b border-outline-editorial bg-surface-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-site items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <Icon name="bakery_dining" className="text-xl" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-titleMd font-semibold text-ink">
              Toko Kue Bu Rohayah
            </span>
            <span className="block text-bodySm text-ink-variant">
              Artisan Jajanan Pasar
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`rounded-DEFAULT px-3 py-2 text-bodyMd font-semibold transition-colors hover:bg-surface-low ${
                active === l.label ? "text-primary" : "text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/masuk"
            className="hidden rounded-DEFAULT px-3 py-2 text-bodyMd font-semibold text-ink hover:bg-surface-low sm:block"
          >
            Masuk Akun
          </Link>
          <Link
            href="/#tampah"
            className="hidden rounded-DEFAULT bg-primary px-4 py-2 text-bodyMd font-semibold text-white transition-colors hover:bg-primary-deep md:block"
          >
            Pesan Tampah
          </Link>
          <button
            type="button"
            aria-label="Keranjang"
            onClick={() => window.dispatchEvent(new Event("open-cart"))}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-outline-editorial bg-white text-ink hover:bg-surface-low"
          >
            <Icon name="shopping_bag" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary-container px-1 text-[10px] font-bold text-ink">
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-editorial bg-white text-ink lg:hidden"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-outline-editorial bg-white px-4 py-3 lg:hidden">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="block rounded-DEFAULT px-3 py-2.5 text-bodyMd font-semibold text-ink hover:bg-surface-low"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/masuk"
            className="block rounded-DEFAULT px-3 py-2.5 text-bodyMd font-semibold text-primary hover:bg-surface-low"
            onClick={() => setOpen(false)}
          >
            Masuk Akun
          </Link>
        </nav>
      )}
    </header>
  );
}
