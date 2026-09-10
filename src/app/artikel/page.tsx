"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Navbar, Icon } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/ProductCard";
import { getArticles, getFeaturedArticle, getPopularArticles } from "@/lib/data";
import type { Article } from "@/lib/types";

const ARTICLE_CATEGORIES = [
  "Semua Cerita",
  "Filosofi Tradisi",
  "Panduan Acara",
  "Tips Dapur",
  "Resep Warisan",
  "Panduan Hajatan",
  "Eksplorasi Kuliner",
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function ArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featured, setFeatured] = useState<Article | null>(null);
  const [popular, setPopular] = useState<Article[]>([]);
  const [category, setCategory] = useState("Semua Cerita");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    getArticles({}).then(({ articles }) => {
      setArticles(articles);
      const f = articles.find((a) => a.is_featured) ?? articles[0];
      setFeatured(f);
    });
    getPopularArticles().then(setPopular);
  }, []);

  const filtered = useMemo(() => {
    let list = articles.filter((a) => a.id !== featured?.id);
    if (category !== "Semua Cerita") list = list.filter((a) => a.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
    }
    return list;
  }, [articles, category, search, featured]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Navbar active="Cerita Rasa" />
      <main>
        {/* Hero editorial */}
        <section className="border-b border-outline-editorial bg-surface-low py-12 lg:py-16">
          <div className="mx-auto max-w-site px-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-labelMd font-semibold text-primary">
                <Icon name="menu_book" className="text-base" />
                Jurnal Kuliner & Warisan Pasar
              </span>
              <h1 className="mt-4 font-display text-headlineLg font-semibold text-ink lg:text-display">
                Cerita Rasa & Filosofi Kue Tradisional
              </h1>
              <p className="mt-4 text-bodyLg text-ink-variant">
                Kumpulan wawasan, panduan hajatan, dan resep warisan dari dapur kami.
              </p>
              <div className="relative mx-auto mt-8 max-w-xl">
                <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="text"
                  placeholder="Cari artikel, makna filosofis, resep, atau panduan katering..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="h-12 w-full rounded-full border-[1.5px] border-outline-editorial bg-white pl-12 pr-4 text-bodyMd focus:border-primary focus:outline-none"
                />
              </div>
              <div className="no-scrollbar mt-5 flex flex-wrap justify-center gap-2">
                {ARTICLE_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setCategory(c); setPage(1); }}
                    className={`rounded-full border px-4 py-2 text-bodySm font-semibold transition-colors ${
                      category === c
                        ? "border-primary bg-primary text-white"
                        : "editorial-border bg-white text-ink hover:bg-surface-low"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured */}
        {featured && (
          <section className="mx-auto max-w-site px-4 py-12 md:px-6 lg:px-8">
            <Link
              href={`/artikel/${featured.slug}`}
              className="editorial-border group grid overflow-hidden rounded-card bg-white shadow-warm transition-shadow hover:shadow-warmLg lg:grid-cols-12"
            >
              <div className="relative lg:col-span-7">
                <img src={featured.image_url} alt={featured.title} className="aspect-[16/10] w-full object-cover lg:h-full" />
                <span className="absolute left-4 top-4 rounded-full bg-secondary-gold px-3 py-1 text-labelSm uppercase text-white">
                  Pilihan Redaksi
                </span>
              </div>
              <div className="flex flex-col p-6 lg:col-span-5 lg:p-10">
                <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-labelSm uppercase text-primary">
                  {featured.category}
                </span>
                <h2 className="mt-4 flex-1 font-display text-headlineMd font-semibold leading-snug group-hover:text-primary lg:text-headlineLg">
                  {featured.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-bodyMd text-ink-variant">{featured.excerpt}</p>
                <div className="mt-6 flex items-center justify-between border-t border-outline-editorial pt-4">
                  <span className="flex items-center gap-2 text-bodySm text-ink-variant">
                    <Icon name="person" className="text-base" /> {featured.author}
                  </span>
                  <span className="flex items-center gap-1.5 text-bodySm text-ink-variant">
                    <Icon name="schedule" className="text-base" /> Baca {featured.read_time} Menit
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Grid + Sidebar */}
        <section className="mx-auto max-w-site gap-10 px-4 pb-16 md:px-6 lg:grid lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-8">
            <h2 className="mb-6 font-display text-headlineMd font-semibold">
              Artikel & Wawasan Terbaru
              <span className="ml-2 align-middle text-bodySm font-normal text-ink-variant">
                (Menampilkan {pageItems.length} dari {filtered.length} artikel)
              </span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {pageItems.map((a) => (
                <Link
                  key={a.id}
                  href={`/artikel/${a.slug}`}
                  className="editorial-border group flex flex-col overflow-hidden rounded-card bg-white transition-shadow hover:shadow-warm"
                >
                  <img src={a.image_url} alt={a.title} className="aspect-[16/9] w-full object-cover" loading="lazy" />
                  <div className="flex flex-1 flex-col p-5">
                    <span className="w-fit rounded-full bg-status-amber px-2.5 py-1 text-labelSm uppercase text-status-amberText">
                      {a.category}
                    </span>
                    <h3 className="mt-3 flex-1 font-display text-titleLg font-semibold leading-snug line-clamp-2 group-hover:text-primary">
                      {a.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-bodySm text-ink-variant">{a.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-bodySm text-ink-variant">
                      <span className="flex items-center gap-1.5">
                        <Icon name="person" className="text-base" /> {a.author}
                      </span>
                      <span>{formatDate(a.published_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="editorial-border flex h-10 w-10 items-center justify-center rounded-DEFAULT bg-white text-ink disabled:opacity-40"
                  aria-label="Halaman sebelumnya"
                >
                  <Icon name="chevron_left" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i + 1)}
                    className={`h-10 w-10 rounded-DEFAULT text-bodyMd font-semibold ${
                      page === i + 1 ? "bg-primary text-white" : "editorial-border bg-white text-ink"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="editorial-border flex h-10 w-10 items-center justify-center rounded-DEFAULT bg-white text-ink disabled:opacity-40"
                  aria-label="Halaman berikutnya"
                >
                  <Icon name="chevron_right" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="mt-12 space-y-6 lg:col-span-4 lg:mt-0">
            <div className="editorial-border rounded-card bg-white p-6">
              <h3 className="flex items-center gap-2 font-display text-titleLg font-semibold">
                <Icon name="local_fire_department" className="text-secondary-gold" />
                Artikel Terpopuler
              </h3>
              <ul className="mt-4 space-y-4">
                {popular.map((a, i) => (
                  <li key={a.id}>
                    <Link href={`/artikel/${a.slug}`} className="group flex gap-4">
                      <span className="font-display text-headlineSm font-semibold text-outline-editorial">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="line-clamp-2 text-bodyMd font-semibold leading-snug group-hover:text-primary">
                          {a.title}
                        </p>
                        <p className="mt-1 text-bodySm text-ink-variant">
                          {(a.views / 1000).toFixed(1)}k pembaca • {a.category}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="batik-bg-pattern rounded-card p-6 text-white">
              <h3 className="font-display text-titleLg font-semibold">Buletin Dapur</h3>
              <p className="mt-2 text-bodySm text-white/80">
                Dapatkan e-book "Panduan Kue Hajatan Lengkap" + resep rahasia tiap bulan.
              </p>
              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Terima kasih! E-book telah dikirimkan ke email Anda.");
                }}
              >
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  className="h-11 w-full rounded-DEFAULT border-[1.5px] border-white/20 bg-white/10 px-3 text-bodyMd text-white placeholder:text-white/50 focus:border-primary-fixed-dim focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Alamat Email"
                  className="h-11 w-full rounded-DEFAULT border-[1.5px] border-white/20 bg-white/10 px-3 text-bodyMd text-white placeholder:text-white/50 focus:border-primary-fixed-dim focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-DEFAULT bg-secondary-gold py-3 text-bodyMd font-semibold text-white hover:bg-tertiary-bakar"
                >
                  <Icon name="download" className="text-lg" />
                  Daftar & Unduh E-Book
                </button>
              </form>
            </div>

            <div className="editorial-border rounded-card bg-white p-6">
              <h3 className="font-display text-titleLg font-semibold">Konsultasi Katering</h3>
              <p className="mt-2 text-bodySm text-ink-variant">
                Bingung hitung porsi tampah untuk acara Anda? Tanya langsung ke tim kami.
              </p>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-DEFAULT bg-primary py-3 text-bodyMd font-semibold text-white hover:bg-primary-deep"
              >
                <Icon name="chat" className="text-lg" />
                Hubungi Spesialis Katering
              </a>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
