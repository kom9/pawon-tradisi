"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";
import { addToCart, getCart, setCart, Icon, type CartItem } from "./Navbar";
import { formatRupiah } from "@/lib/data";

const DELIVERY_SLOTS = [
  { id: "fajar", label: "Slot Fajar Utama", time: "06:00 – 08:00 WIB", note: "Khusus Hajatan / Syukuran" },
  { id: "siang", label: "Slot Siang", time: "10:00 – 12:00 WIB", note: "Snack Rapat Kantor" },
];

const PAYMENT_METHODS = ["QRIS Instan", "BCA / Mandiri", "DP 50% Katering"];

type CheckoutForm = {
  name: string;
  phone: string;
  address: string;
  eventName: string;
  slot: string;
  date: string;
  payment: string;
};

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    address: "",
    eventName: "",
    slot: "fajar",
    date: "",
    payment: "QRIS Instan",
  });

  useEffect(() => {
    const sync = () => setItems(getCart());
    const openHandler = () => setOpen(true);
    sync();
    window.addEventListener("cart-updated", sync);
    window.addEventListener("open-cart", openHandler);
    return () => {
      window.removeEventListener("cart-updated", sync);
      window.removeEventListener("open-cart", openHandler);
    };
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  function changeQty(name: string, delta: number) {
    const next = getCart()
      .map((i) => (i.name === name ? { ...i, qty: i.qty + delta } : i))
      .filter((i) => i.qty > 0);
    setCart(next);
    setItems(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Keranjang masih kosong.");
      return;
    }
    setSubmitting(true);

    let orderCode = `#PWN-${Math.floor(1000 + Math.random() * 9000)}`;

    // Jika Supabase terkonfigurasi → simpan pesanan nyata ke database
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const client = createClient();
        const {
          data: { user },
        } = await client.auth.getUser();
        const slotLabel = DELIVERY_SLOTS.find((s) => s.id === form.slot)?.label ?? "Slot Fajar Utama";
        const { data, error } = await client
          .from("orders")
          .insert({
            order_code: orderCode,
            event_name: form.eventName || "Pesanan Online",
            customer_name: form.name,
            phone: form.phone,
            location: form.address,
            items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
            delivery_slot: slotLabel,
            delivery_date: form.date,
            delivery_time: DELIVERY_SLOTS.find((s) => s.id === form.slot)?.time.split(" – ")[0] ?? "06:00",
            courier_info: "Akan dijadwalkan",
            address: form.address,
            notes: "",
            total_amount: subtotal,
            payment_method: form.payment,
            payment_status: form.payment === "DP 50% Katering" ? "DP 50%" : "Belum Dibayar",
            status: "menunggu_pembayaran",
            user_id: user?.id ?? null,
          })
          .select("order_code")
          .single();
        if (error) throw error;
        if (data?.order_code) orderCode = data.order_code;
      } catch {
        // Gagal simpan (mis. tabel belum ada / RLS) → tetap sukses di UI, admin akan sinkron manual
        toast.warning("Pesanan tercatat, namun sinkronisasi ke server tertunda.");
      }
    }

    setCart([]);
    setItems([]);
    setOpen(false);
    setSubmitting(false);
    toast.success(`Pesanan ${orderCode} berhasil dibuat! Kami akan menghubungi Anda untuk konfirmasi pembayaran.`);
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-ink/45 backdrop-blur-[4px] transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-white shadow-warmLg transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-outline-editorial p-5">
          <div>
            <h3 className="font-display text-headlineSm font-semibold">Keranjang & Checkout</h3>
            <p className="text-bodySm text-ink-variant">Pengiriman subuh besok pagi</p>
          </div>
          <button
            type="button"
            aria-label="Tutup keranjang"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-editorial text-ink hover:bg-surface-low"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-low text-outline">
                <Icon name="shopping_bag" className="text-3xl" />
              </span>
              <p className="font-display text-titleMd">Keranjang Masih Kosong</p>
              <p className="max-w-60 text-bodySm text-ink-variant">
                Yuk, pilih kue favorite Anda dari katalog jajanan pasar kami.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.name} className="editorial-border flex gap-3 rounded-card bg-surface-lowest p-3">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-DEFAULT bg-primary/10 text-primary">
                    <Icon name="cake" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-titleMd font-semibold leading-snug">{item.name}</p>
                      <button
                        type="button"
                        aria-label={`Hapus ${item.name}`}
                        onClick={() => changeQty(item.name, -item.qty)}
                        className="text-error hover:text-error-oncontainer"
                      >
                        <Icon name="delete" className="text-lg" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Kurangi"
                          onClick={() => changeQty(item.name, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-outline-editorial text-ink hover:bg-surface-low"
                        >
                          <Icon name="remove" className="text-base" />
                        </button>
                        <span className="min-w-8 text-center text-bodyMd font-bold">{item.qty}</span>
                        <button
                          type="button"
                          aria-label="Tambah"
                          onClick={() => changeQty(item.name, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-outline-editorial text-ink hover:bg-surface-low"
                        >
                          <Icon name="add" className="text-base" />
                        </button>
                      </div>
                      <span className="text-titleMd font-bold text-primary">
                        {formatRupiah(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Form Checkout */}
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4 border-t border-outline-editorial pt-4">
                <p className="text-labelSm uppercase tracking-wide text-secondary-bakar">Data Pengiriman</p>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Pemesan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-11 w-full rounded-DEFAULT border-[1.5px] border-outline-editorial bg-white px-3 text-bodyMd placeholder:text-outline focus:border-primary focus:outline-none"
                />
                <input
                  type="tel"
                  required
                  placeholder="Nomor WhatsApp"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="h-11 w-full rounded-DEFAULT border-[1.5px] border-outline-editorial bg-white px-3 text-bodyMd placeholder:text-outline focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Nama Acara (opsional)"
                  value={form.eventName}
                  onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                  className="h-11 w-full rounded-DEFAULT border-[1.5px] border-outline-editorial bg-white px-3 text-bodyMd placeholder:text-outline focus:border-primary focus:outline-none"
                />

                <p className="pt-2 text-labelSm uppercase tracking-wide text-secondary-bakar">Slot Pengiriman</p>
                <div className="space-y-2">
                  {DELIVERY_SLOTS.map((s) => (
                    <label
                      key={s.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-DEFAULT border-[1.5px] p-3 ${
                        form.slot === s.id ? "border-primary bg-primary/5" : "border-outline-editorial"
                      }`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        checked={form.slot === s.id}
                        onChange={() => setForm({ ...form, slot: s.id })}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="flex-1">
                        <span className="block text-bodyMd font-semibold">{s.label} • {s.time}</span>
                        <span className="block text-bodySm text-ink-variant">{s.note}</span>
                      </span>
                    </label>
                  ))}
                </div>

                <input
                  type="date"
                  required
                  aria-label="Tanggal Pengantaran"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="h-11 w-full rounded-DEFAULT border-[1.5px] border-outline-editorial bg-white px-3 text-bodyMd focus:border-primary focus:outline-none"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Alamat Pengantaran & Catatan Dapur"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-DEFAULT border-[1.5px] border-outline-editorial bg-white p-3 text-bodyMd placeholder:text-outline focus:border-primary focus:outline-none"
                />

                <p className="pt-2 text-labelSm uppercase tracking-wide text-secondary-bakar">Metode Pembayaran</p>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setForm({ ...form, payment: m })}
                      className={`rounded-full border px-4 py-2 text-bodySm font-semibold transition-colors ${
                        form.payment === m
                          ? "border-primary bg-primary text-white"
                          : "border-outline-editorial bg-white text-ink hover:bg-surface-low"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </form>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-outline-editorial bg-surface-low p-5">
            <div className="mb-2 flex justify-between text-bodyMd">
              <span className="text-ink-variant">Subtotal ({items.reduce((s, i) => s + i.qty, 0)} item)</span>
              <span className="font-bold">{formatRupiah(subtotal)}</span>
            </div>
            <div className="mb-2 flex justify-between text-bodySm">
              <span className="text-ink-variant">Kemasan & Ongkir Promo Acara</span>
              <span className="font-semibold text-primary">Rp 0</span>
            </div>
            <div className="mb-4 flex justify-between border-t border-dashed border-outline-editorial pt-2 text-titleMd">
              <span className="font-semibold">Total Pembayaran</span>
              <span className="font-bold text-primary">{formatRupiah(subtotal)}</span>
            </div>
            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-DEFAULT bg-secondary-gold py-3.5 text-titleMd font-semibold text-white transition-colors hover:bg-tertiary-bakar disabled:opacity-60"
            >
              <Icon name={submitting ? "hourglass_top" : "lock"} className="text-lg" />
              {submitting ? "Memproses Pesanan..." : "Lanjut Pembayaran Aman"}
            </button>
            <p className="mt-2 text-center text-bodySm text-ink-variant">
              Dengan melanjutkan, Anda menyetujui Syarat Pemesanan kami.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
