import Link from "next/link";
import { Icon } from "./Navbar";

export function Footer() {
  return (
    <footer className="border-t border-outline-editorial bg-surface-low">
      <div className="mx-auto grid max-w-site gap-10 px-4 py-14 md:grid-cols-4 md:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
              <Icon name="bakery_dining" className="text-xl" />
            </span>
            <div className="leading-tight">
              <span className="block font-display text-titleMd font-semibold">
                Toko Kue Bu Rohayah
              </span>
              <span className="block text-bodySm text-ink-variant">Sejak 1987 • Halal</span>
            </div>
          </div>
          <p className="mt-4 text-bodySm text-ink-variant">
            Dapur Pusat: Jl. Warisan Rasa No. 18, Kebayoran Baru, Jakarta Selatan.
            Produksi & pengiriman setiap hari 02:00–18:00 WIB.
          </p>
          <div className="mt-4 flex items-center gap-2 text-bodySm font-semibold text-secondary-gold">
            <Icon name="verified" className="text-base" />
            Sertifikasi Halal ID311200021482
          </div>
        </div>

        <div>
          <h4 className="text-labelSm uppercase tracking-wide text-secondary-bakar">Pusaka Rasa</h4>
          <ul className="mt-4 space-y-2.5 text-bodySm">
            <li><Link href="/#kualitas" className="text-ink-variant hover:text-primary">Tentang Dapur Kami</Link></li>
            <li><Link href="/artikel" className="text-ink-variant hover:text-primary">Filosofi Jajan Pasar</Link></li>
            <li><Link href="/#katalog" className="text-ink-variant hover:text-primary">Katalog Kue Basah</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-labelSm uppercase tracking-wide text-secondary-bakar">Layanan Acara</h4>
          <ul className="mt-4 space-y-2.5 text-bodySm">
            <li><Link href="/#tampah" className="text-ink-variant hover:text-primary">Snack Box Hajatan</Link></li>
            <li><Link href="/#tampah" className="text-ink-variant hover:text-primary">Paket Tampah & Box</Link></li>
            <li>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Toko%20Kue%20Bu%20Rohayah%2C%20saya%20ingin%20konsultasi%20katering%20acara."
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-variant hover:text-primary"
              >
                Kontak & Katering
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-labelSm uppercase tracking-wide text-secondary-bakar">Bantuan & Panduan</h4>
          <ul className="mt-4 space-y-2.5 text-bodySm">
            <li><Link href="/artikel/cara-menyimpan-kue-basah-santan" className="text-ink-variant hover:text-primary">Panduan Penyimpanan</Link></li>
            <li><Link href="/#kualitas" className="text-ink-variant hover:text-primary">Kebijakan Pengiriman Subuh</Link></li>
            <li><Link href="/#kualitas" className="text-ink-variant hover:text-primary">Jaminan Kualitas</Link></li>
          </ul>
          <div className="mt-4 flex gap-2">
            {["QRIS", "BCA VA", "Mandiri", "GoPay"].map((m) => (
              <span key={m} className="editorial-border rounded-DEFAULT bg-white px-2 py-1 text-[10px] font-bold text-ink-variant">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-outline-editorial">
        <div className="mx-auto flex max-w-site flex-col items-center justify-between gap-2 px-4 py-5 text-bodySm text-ink-variant md:flex-row md:px-6 lg:px-8">
          <span>© 2025 Toko Kue Bu Rohayah. Melestarikan cita rasa asli Nusantara.</span>
          <span>Bahan alami tanpa pengawet sintetis.</span>
        </div>
      </div>
    </footer>
  );
}
