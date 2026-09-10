import Link from "next/link";
import { Icon } from "@/components/Navbar";

type Props = {
  name: string;
  category: string;
  price: number;
  unit: string;
  badges: string[];
  imageUrl: string;
  description: string;
  onAdd: () => void;
};

export function ProductCard({ name, category, price, unit, badges, imageUrl, description, onAdd }: Props) {
  return (
    <article className="group editorial-border flex flex-col overflow-hidden rounded-card bg-white transition-shadow hover:shadow-warm">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-low">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {badges.includes("Fresh Pagi Ini") && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-labelSm uppercase text-white">
            Dibuat Pagi Ini • Hari Ini
          </span>
        )}
        {badges
          .filter((b) => b !== "Fresh Pagi Ini")
          .map((b) => (
            <span
              key={b}
              className="absolute right-3 top-3 rounded-full bg-status-amber px-3 py-1 text-labelSm uppercase text-status-amberText"
            >
              {b}
            </span>
          ))}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-labelSm uppercase tracking-wide text-secondary-bakar">{category}</p>
        <h3 className="mt-1.5 font-display text-headlineSm font-semibold text-ink">{name}</h3>
        <p className="mt-1 text-bodySm text-ink-variant">
          {unit} • Daun pisang alami
        </p>
        <p className="mt-2 line-clamp-2 text-bodySm text-ink-variant">{description}</p>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="text-bodySm text-ink-variant">Harga</p>
            <p className="text-titleLg font-bold text-ink">{formatPrice(price)}</p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-1.5 rounded-DEFAULT bg-primary px-4 py-2.5 text-bodyMd font-semibold text-white transition-colors hover:bg-primary-deep"
          >
            <Icon name="add_shopping_cart" className="text-base" />
            Tambah
          </button>
        </div>
      </div>
    </article>
  );
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export function SectionHeading({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-labelSm uppercase tracking-[0.08em] text-secondary-bakar">{kicker}</p>
      <h2 className="mt-2 font-display text-headlineLg font-semibold text-ink">{title}</h2>
      {sub && <p className="mt-3 text-bodyMd text-ink-variant">{sub}</p>}
    </div>
  );
}

export function WhatsAppCTA() {
  return (
    <section className="mx-auto max-w-site px-4 md:px-6 lg:px-8">
      <div className="batik-bg-pattern rounded-hero p-8 text-white md:p-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="text-labelSm uppercase tracking-wide text-primary-fixed-dim">Konsultasi Katering</p>
            <h2 className="mt-2 font-display text-headlineLg font-semibold">
              Butuh Penawaran Khusus untuk Acara Besar?
            </h2>
            <p className="mt-3 text-bodyMd text-white/85">
              Tim katering kami siap membantu menyusun paket tampah dan snack box untuk resepsi,
              arisan, hingga seminar — lengkap dengan simulasi porsi.
            </p>
          </div>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Toko%20Kue%20Bu%20Rohayah%2C%20saya%20ingin%20konsultasi%20katering%20acara."
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-DEFAULT bg-secondary-gold px-6 py-3.5 text-titleMd font-semibold text-white transition-colors hover:bg-tertiary-bakar"
          >
            <Icon name="chat" className="text-xl" />
            Hubungi Spesialis Katering
          </a>
        </div>
      </div>
    </section>
  );
}
