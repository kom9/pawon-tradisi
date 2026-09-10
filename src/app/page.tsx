"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Navbar, Icon, addToCart } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard, SectionHeading, WhatsAppCTA } from "@/components/ProductCard";
import { CATEGORY_TABS, FALLBACK_PRODUCTS } from "@/lib/demo-data";
import { formatRupiah, getProducts } from "@/lib/data";
import type { Product } from "@/lib/types";

const HERO_STATS = [
  { value: "50+", label: "Varian Jajanan Pasar" },
  { value: "4.9", label: "Rating dari 2.4k Pembeli" },
  { value: "10.000+", label: "Tampah Terkirim" },
];

const QUALITY_PILLARS = [
  {
    icon: "health_and_safety",
    title: "Jaminan Higienis & Halal",
    desc: "Produksi bersertifikat halal dengan standar keamanan pangan HACCP di setiap batch produksi.",
  },
  {
    icon: "menu_book",
    title: "Resep Pusaka Turun-Temurun",
    desc: "Racikan asli warisan tiga generasi — takaran dan tekniknya tidak berubah sejak 1987.",
  },
  {
    icon: "eco",
    title: "Kemasan Ramah Lingkungan",
    desc: "Tampah bambu anyam, besek, dan daun pisang — minim plastik, kembali ke tradisi.",
  },
  {
    icon: "schedule",
    title: "Pengiriman Tepat Waktu",
    desc: "Armada kurir subuh khusus. Sampai di tempat acara Anda sebelum tamu duduk.",
  },
];

const REVIEWS = [
  {
    name: "Ratna Saraswati",
    origin: "Bintaro, Tangerang Selatan",
    text: "Klepon dan kue lumpurnya juara! Dikirim subuh masih hangat dan manis gula arennya terasa asli. Langganan tiap arisan.",
    stars: 5,
  },
  {
    name: "Agung Wicaksono",
    origin: "General Affairs Manager, Jakarta",
    text: "Snack box untuk rapat kantor selalu rapi dan elegan. Pengiriman tepat waktu, tidak pernah telat. Sangat direkomendasikan untuk event kantor.",
    stars: 5,
  },
  {
    name: "Maya Kusuma",
    origin: "Depok",
    text: "Tampah hantaran lamaran adatnya cantik banget, pita dan kartu kaligrafinya detail. Tamu-tamu sampai memotret duluan sebelum menyantap!",
    stars: 5,
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [category, setCategory] = useState<string>("Semua Kue");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProducts().then(({ products, demo }) => {
      setProducts(products);
      setDemoMode(demo);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "Semua Kue") list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return list;
  }, [products, category, search]);

  const singleItems = filtered.filter((p) => !p.is_bundle);
  const bundles = products.filter((p) => p.is_bundle);
  const tampahAgung = bundles.find((b) => b.slug === "tampah-tamu-agung-80");
  const tampahSedang = bundles.find((b) => b.slug === "tampah-sedang-keluarga-40");
  const snackBox = bundles.find((b) => b.slug === "snack-box-besek-satuan");

  function handleAdd(p: Product) {
    addToCart({ name: p.name, qty: 1, price: p.price });
    toast.success(`${p.name} masuk keranjang!`, {
      description: `${p.unit} • ${formatRupiah(p.price)}`,
    });
  }

  return (
    <>
      <Navbar />
      {demoMode && (
        <div className="bg-status-amber px-4 py-2 text-center text-bodySm font-semibold text-status-amberText">
          Mode Demo: data contoh ditampilkan. Hubungkan Supabase untuk data live.
        </div>
      )}

      <main>
        {/* ============ HERO ============ */}
        <section className="mx-auto max-w-site px-4 pb-14 pt-10 md:px-6 lg:px-8 lg:pb-20 lg:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-labelMd font-semibold text-primary">
                <Icon name="wb_twilight" className="text-base" />
                Dibuat Segar Setiap Subuh • 100% Halal
              </span>
              <h1 className="mt-5 font-display text-display font-semibold leading-tight text-ink lg:text-[44px]">
                Kelezatan Kue Tradisional Asli, <em className="text-primary">Dibuat Segar</em> Setiap Fajar.
              </h1>
              <p className="mt-5 max-w-lg text-bodyLg text-ink-variant">
                Jajanan pasar warisan resep tiga generasi — dari klepon gula aren meluber hingga
                paket tampah hajatan lengkap. Dikukus subuh ini, sampai di meja Anda sebelum jam 8.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#katalog"
                  className="flex items-center gap-2 rounded-DEFAULT bg-primary px-6 py-3.5 text-titleMd font-semibold text-white transition-colors hover:bg-primary-deep"
                >
                  <Icon name="restaurant_menu" className="text-xl" />
                  Pesan Sekarang
                </a>
                <a
                  href="#tampah"
                  className="flex items-center gap-2 rounded-DEFAULT border-[1.5px] border-primary px-6 py-3.5 text-titleMd font-semibold text-primary transition-colors hover:bg-primary/5"
                >
                  <Icon name="inventory_2" className="text-xl" />
                  Lihat Paket Tampah Acara
                </a>
              </div>
              <div className="mt-10 flex divide-x divide-outline-editorial">
                {HERO_STATS.map((s, i) => (
                  <div key={s.label} className={i === 0 ? "pr-8" : "px-8"}>
                    <p className="font-display text-headlineSm font-semibold text-primary">{s.value}</p>
                    <p className="mt-1 text-bodySm text-ink-variant">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual bento */}
            <div className="relative hidden lg:block">
              <div className="editorial-border overflow-hidden rounded-hero bg-surface-low shadow-warm">
                <img
                  src="/images/kue/tampah-agung.svg"
                  alt="Tampah Tamu Agung kue tradisional"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="editorial-border absolute -bottom-6 -left-6 w-56 rounded-card bg-white p-4 shadow-warm">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-status-fresh text-status-freshText">
                    <Icon name="verified" className="text-xl" />
                  </span>
                  <div>
                    <p className="text-bodyMd font-bold text-ink">Garansi Segar Subuh</p>
                    <p className="text-bodySm text-ink-variant">Sampai sebelum 08:00 WIB</p>
                  </div>
                </div>
              </div>
              <div className="editorial-border absolute -right-4 top-8 rounded-full bg-white px-5 py-2.5 shadow-warm">
                <span className="text-bodySm font-bold text-secondary-gold">★ 4.9 Pembeli Puas</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ FILTER KATEGORI ============ */}
        <div id="katalog" className="sticky top-16 z-30 border-y border-outline-editorial bg-surface-canvas/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-site items-center gap-3 px-4 py-3 md:px-6 lg:px-8">
            <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
              {CATEGORY_TABS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-bodySm font-semibold transition-colors ${
                    category === c
                      ? "border-primary bg-primary text-white"
                      : "editorial-border bg-white text-ink hover:bg-surface-low"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative hidden md:block">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="text"
                placeholder="Cari klepon, lemper..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-56 rounded-full border border-outline-editorial bg-white pl-10 pr-4 text-bodySm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ============ GRID PRODUK ============ */}
        <section className="mx-auto max-w-site px-4 py-14 md:px-6 lg:px-8">
          <SectionHeading
            kicker="Katalog Jajanan Pasar"
            title="Pilihan Kue Basah Unggulan Kami"
            sub="Semua kue dikukus dan dipanggang subuh ini, dikirim sebelum layu — tanpa pengawet sintetis."
          />
          {singleItems.length === 0 ? (
            <div className="editorial-border mx-auto max-w-md rounded-card bg-white p-10 text-center">
              <Icon name="search_off" className="text-4xl text-outline" />
              <p className="mt-3 font-display text-titleLg">Belum Ada Kue di Kategori Ini</p>
              <p className="mt-1 text-bodySm text-ink-variant">Coba pilih kategori lain atau cari dengan kata kunci berbeda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {singleItems.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  category={p.category}
                  price={p.price}
                  unit={p.unit}
                  badges={p.badges}
                  imageUrl={p.image_url}
                  description={p.description}
                  onAdd={() => handleAdd(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ============ PAKET TAMPAH ============ */}
        <section id="tampah" className="border-y border-outline-editorial bg-surface-low py-16 lg:py-20">
          <div className="mx-auto max-w-site px-4 md:px-6 lg:px-8">
            <SectionHeading
              kicker="Paket Acara & Hajatan"
              title="Paket Tampah Anyaman Bambu & Besek Eksklusif"
              sub="Satu panggilan, seluruh kebutuhan kudapan acara Anda beres — lengkap dengan pita dan kartu kaligrafi."
            />
            <div className="grid gap-6 lg:grid-cols-3">
              {tampahAgung && (
                <div className="editorial-border overflow-hidden rounded-card bg-white shadow-warm lg:col-span-2">
                  <div className="grid md:grid-cols-5">
                    <div className="relative md:col-span-2">
                      <img src={tampahAgung.image_url} alt={tampahAgung.name} className="h-full w-full object-cover" />
                      <span className="absolute left-3 top-3 rounded-full bg-secondary-gold px-3 py-1 text-labelSm uppercase text-white">
                        Paling Diminati Resepsi
                      </span>
                    </div>
                    <div className="flex flex-col p-6 md:col-span-3">
                      <p className="text-labelSm uppercase tracking-wide text-secondary-bakar">Kue Tampah Sultan</p>
                      <h3 className="mt-2 font-display text-headlineSm font-semibold">{tampahAgung.name}</h3>
                      <p className="mt-2 flex-1 text-bodySm text-ink-variant">{tampahAgung.description}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-titleLg font-bold text-ink">{formatRupiah(tampahAgung.price)}</p>
                        <button
                          type="button"
                          onClick={() => handleAdd(tampahAgung)}
                          className="rounded-DEFAULT bg-primary px-5 py-2.5 text-bodyMd font-semibold text-white hover:bg-primary-deep"
                        >
                          Pesan Tampah Ini
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-6">
                {tampahSedang && (
                  <div className="editorial-border flex flex-1 gap-4 rounded-card bg-white p-5">
                    <img src={tampahSedang.image_url} alt={tampahSedang.name} className="h-24 w-24 rounded-DEFAULT object-cover" />
                    <div className="flex flex-1 flex-col">
                      <h3 className="font-display text-titleLg font-semibold">{tampahSedang.name}</h3>
                      <p className="mt-1 flex-1 text-bodySm text-ink-variant">Kue campur pilihan dapur, cocok arisan & rapat 10–15 orang.</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="font-bold text-primary">{formatRupiah(tampahSedang.price)}</p>
                        <button
                          type="button"
                          onClick={() => handleAdd(tampahSedang)}
                          className="rounded-DEFAULT bg-primary px-4 py-2 text-bodySm font-semibold text-white hover:bg-primary-deep"
                        >
                          Pilih Paket Ini
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {snackBox && (
                  <div className="editorial-border flex flex-1 gap-4 rounded-card bg-white p-5">
                    <img src={snackBox.image_url} alt={snackBox.name} className="h-24 w-24 rounded-DEFAULT object-cover" />
                    <div className="flex flex-1 flex-col">
                      <h3 className="font-display text-titleLg font-semibold">{snackBox.name}</h3>
                      <p className="mt-1 flex-1 text-bodySm text-ink-variant">Isi 3 kue + 1 air mineral + sendok kayu. Min. 20 box.</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="font-bold text-primary">{formatRupiah(snackBox.price)}</p>
                        <button
                          type="button"
                          onClick={() => handleAdd(snackBox)}
                          className="rounded-DEFAULT bg-primary px-4 py-2 text-bodySm font-semibold text-white hover:bg-primary-deep"
                        >
                          Pesan Box
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Banner garansi */}
            <div className="editorial-border mt-6 flex flex-col items-center justify-between gap-4 rounded-card bg-white p-6 md:flex-row">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-status-fresh text-status-freshText">
                  <Icon name="local_shipping" className="text-2xl" />
                </span>
                <div>
                  <p className="text-titleMd font-bold">Garansi Pengiriman Subuh</p>
                  <p className="text-bodySm text-ink-variant">
                    Pesanan hajatan tiba di lokasi sebelum 08:00 WIB atau kita ganti dengan kue segar batch berikutnya — gratis.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-primary/10 px-4 py-2 text-bodySm font-bold text-primary">Slot Fajar Terbatas: 15 Tampah/Hari</span>
            </div>
          </div>
        </section>

        {/* ============ KEUNGGULAN ============ */}
        <section id="kualitas" className="mx-auto max-w-site px-4 py-16 md:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            kicker="Jaminan Kualitas"
            title="Mengapa Toko Kue Bu Rohayah Berbeda?"
            sub="Empat hal yang tidak pernah kami kompromikan sejak dapur pertama kami menyala tahun 1987."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {QUALITY_PILLARS.map((p) => (
              <div key={p.title} className="editorial-border rounded-card bg-white p-6 transition-shadow hover:shadow-warm">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon name={p.icon} className="text-2xl" />
                </span>
                <h3 className="mt-4 font-display text-titleLg font-semibold">{p.title}</h3>
                <p className="mt-2 text-bodySm text-ink-variant">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CERITA RASA TEASER ============ */}
        <section id="cerita" className="border-y border-outline-editorial bg-surface-low py-16 lg:py-20">
          <div className="mx-auto max-w-site px-4 md:px-6 lg:px-8">
            <SectionHeading
              kicker="Cerita Rasa"
              title="Filosofi di Balik Aroma Daun Pisang & Santan"
              sub="Setiap kue menyimpan cerita dan makna warisan Nusantara."
            />
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  img: "/images/artikel/klepon-filosofi.svg",
                  tag: "Warisan Tradisi",
                  title: "Mengapa Gula Aren Organik Tak Pernah Bisa Digantikan Sirup Pabrik",
                  time: "4 menit baca",
                },
                {
                  img: "/images/artikel/daun-suji.svg",
                  tag: "Bahan Baku Alami",
                  title: "Kombinasi Daun Suji & Pandan Wangi: Pewarna Hijau Sejati",
                  time: "3 menit baca",
                },
              ].map((a) => (
                <Link key={a.title} href="/artikel" className="editorial-border group overflow-hidden rounded-card bg-white transition-shadow hover:shadow-warm">
                  <div className="grid sm:grid-cols-5">
                    <img src={a.img} alt={a.title} className="aspect-[4/3] object-cover sm:col-span-2 sm:h-full" />
                    <div className="flex flex-col p-5 sm:col-span-3">
                      <p className="text-labelSm uppercase tracking-wide text-secondary-bakar">{a.tag}</p>
                      <h3 className="mt-2 flex-1 font-display text-headlineSm font-semibold leading-snug group-hover:text-primary">
                        {a.title}
                      </h3>
                      <p className="mt-3 flex items-center gap-1.5 text-bodySm text-ink-variant">
                        <Icon name="schedule" className="text-base" /> {a.time}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/artikel"
                className="inline-flex items-center gap-2 rounded-DEFAULT border-[1.5px] border-primary px-6 py-3 text-bodyMd font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                Baca Seluruh Cerita
                <Icon name="arrow_forward" className="text-lg" />
              </Link>
            </div>
          </div>
        </section>

        {/* ============ ULASAN ============ */}
        <section className="mx-auto max-w-site px-4 py-16 md:px-6 lg:px-8 lg:py-20">
          <SectionHeading kicker="Ulasan Pelanggan" title="Kata Mereka yang Telah Menikmati" />
          <div className="grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="editorial-border rounded-card bg-white p-6">
                <div className="flex gap-0.5 text-secondary-gold">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Icon key={i} name="star" className="text-base" />
                  ))}
                </div>
                <p className="mt-4 text-bodyMd text-ink-variant italic">“{r.text}”</p>
                <div className="mt-5 flex items-center gap-3 border-t border-outline-editorial pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-bodyMd font-bold text-primary">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-bodyMd font-bold">{r.name}</p>
                    <p className="text-bodySm text-ink-variant">{r.origin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CTA KATERING ============ */}
        <div className="pb-16 lg:pb-24">
          <WhatsAppCTA />
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </>
  );
}
