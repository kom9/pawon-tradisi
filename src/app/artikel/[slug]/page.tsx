import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar, Icon } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getArticleBySlug, getPopularArticles } from "@/lib/data";
import { WhatsAppCTA } from "@/components/ProductCard";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ArtikelDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();
  const popular = await getPopularArticles();

  return (
    <>
      <Navbar active="Cerita Rasa" />
      <main className="mx-auto max-w-editorial px-4 py-12 md:px-6 lg:py-16">
        <nav className="flex items-center gap-2 text-bodySm text-ink-variant" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">Beranda</Link>
          <Icon name="chevron_right" className="text-base" />
          <Link href="/artikel" className="hover:text-primary">Cerita Rasa</Link>
          <Icon name="chevron_right" className="text-base" />
          <span className="line-clamp-1 text-ink">{article.category}</span>
        </nav>

        <span className="mt-8 inline-block rounded-full bg-status-amber px-3 py-1 text-labelSm uppercase text-status-amberText">
          {article.category}
        </span>
        <h1 className="mt-4 font-display text-headlineLg font-semibold leading-tight text-ink lg:text-display">
          {article.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-bodySm text-ink-variant">
          <span className="flex items-center gap-1.5">
            <Icon name="person" className="text-base" /> {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="schedule" className="text-base" /> Baca {article.read_time} menit
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="visibility" className="text-base" /> {article.views.toLocaleString("id-ID")} pembaca
          </span>
          <span>{formatDate(article.published_at)}</span>
        </div>

        <div className="editorial-border mt-8 overflow-hidden rounded-card bg-white shadow-warm">
          <img src={article.image_url} alt={article.title} className="aspect-[16/8] w-full object-cover" />
        </div>

        <div className="mt-10 space-y-5">
          {article.content.split("\n\n").map((para, i) => (
            <p key={i} className="text-bodyLg leading-relaxed text-ink-variant">
              {para}
            </p>
          ))}
        </div>

        <div className="editorial-border mt-12 rounded-card bg-surface-low p-6">
          <p className="text-labelSm uppercase tracking-wide text-secondary-bakar">Artikel Terpopuler Lainnya</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {popular.slice(0, 2).map((a) => (
              <Link key={a.id} href={`/artikel/${a.slug}`} className="group flex items-center gap-3">
                <img src={a.image_url} alt={a.title} className="h-16 w-20 rounded-DEFAULT object-cover" />
                <p className="line-clamp-2 text-bodyMd font-semibold leading-snug group-hover:text-primary">
                  {a.title}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 text-bodyMd font-semibold text-primary hover:underline"
          >
            <Icon name="arrow_back" className="text-lg" />
            Kembali ke semua cerita
          </Link>
        </div>
      </main>

      <div className="pb-16">
        <WhatsAppCTA />
      </div>
      <Footer />
    </>
  );
}
