"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { Icon } from "@/components/Navbar";

const BENEFITS = [
  { icon: "sell", title: "Akses Harga Katering Khusus", desc: "Diskon member hingga 12% untuk pemesanan tampah dan snack box." },
  { icon: "local_shipping", title: "Pantau Pengiriman Subuh Live", desc: "Kurir kami aktif mulai 05.30 WIB — pantau posisinya real-time." },
  { icon: "redeem", title: "Reward Poin Manis", desc: "Setiap Rp 10.000 belanja = 1 poin. Tukar dengan kue gratis." },
];

export default function MasukPage() {
  return (
    <Suspense>
      <MasukForm />
    </Suspense>
  );
}

function MasukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [role, setRole] = useState<"customer" | "staff">("customer");
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!supabaseConfigured) {
      setError("Mode Demo: autentikasi belum aktif. Konfigurasikan Supabase terlebih dahulu.");
      setLoading(false);
      return;
    }

    try {
      const client = createClient();
      const email = identity.includes("@") ? identity : `${identity}@pawon.local`;

      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Ambil role dari profiles untuk routing yang benar
      const { data: profile } = await client.from("profiles").select("role").single();
      const isStaff = profile?.role === "staff" || profile?.role === "admin";

      if (redirectTo) router.push(redirectTo);
      else router.push(isStaff ? "/admin" : "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email atau kata sandi salah.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (!supabaseConfigured) {
      setError("Mode Demo: Google Sign-in belum aktif. Konfigurasikan Supabase terlebih dahulu.");
      return;
    }
    const client = createClient();
    await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo ?? "/"}` },
    });
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Panel kiri — branding */}
      <section className="batik-bg-pattern relative hidden flex-col justify-between p-10 text-white lg:flex lg:p-14">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
            <Icon name="bakery_dining" className="text-2xl" />
          </span>
          <div>
            <p className="font-display text-titleLg font-semibold">Toko Kue Bu Rohayah</p>
            <p className="text-bodySm text-white/70">Cita Rasa Luhur Nusantara</p>
          </div>
        </div>

        <div className="max-w-lg">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-labelMd font-semibold">
            <Icon name="wb_twilight" className="text-base" />
            Dibuat Segar Setiap Subuh • 100% Halal
          </span>
          <h1 className="mt-6 font-display text-[40px] font-semibold leading-tight">
            Kehangatan Tradisi, <em className="text-primary-fixed-dim">Kelezatan Tanpa Kompromi.</em>
          </h1>

          <div className="editorial-border mt-8 overflow-hidden rounded-card bg-white/10 p-4 backdrop-blur-sm" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
            <div className="flex items-center gap-4">
              <img src="/images/kue/tampah-agung.svg" alt="Koleksi Tampah Agung" className="h-20 w-28 rounded-DEFAULT object-cover" />
              <div>
                <span className="rounded-full bg-secondary-gold px-2.5 py-1 text-labelSm uppercase text-white">Koleksi Tampah Agung</span>
                <p className="mt-2 text-bodySm text-white/85">Kudapan pagi tradisional dengan sentuhan modern.</p>
              </div>
            </div>
          </div>

          <ul className="mt-8 space-y-4">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon name={b.icon} className="text-xl" />
                </span>
                <div>
                  <p className="text-bodyMd font-bold">{b.title}</p>
                  <p className="text-bodySm text-white/70">{b.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex gap-0.5 text-secondary-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="star" className="text-base" />
            ))}
          </div>
          <p className="mt-3 max-w-md text-bodyMd italic text-white/85">
            “Katering tetangga kami selalu tepat waktu dan rasanya otentik. Kue tampahnya jauh lebih
            cantik dari toko-toko modern.” — Ibu Ratna Dewi, Pelanggan Katering Rutin Jakarta
          </p>
          <p className="mt-6 text-bodySm text-white/50">Toko Kue Bu Rohayah © 2025 • Bahan Alami Tanpa Pengawet Sintetis</p>
        </div>
      </section>

      {/* Panel kanan — form */}
      <section className="flex flex-col justify-center bg-white px-4 py-12 sm:px-8 lg:px-14">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-1.5 text-bodySm font-semibold text-ink-variant hover:text-primary">
            <Icon name="arrow_back" className="text-base" />
            Kembali ke Katalog Kue
          </Link>

          <p className="mt-10 text-labelSm uppercase tracking-wide text-secondary-bakar">Autentikasi Akun</p>
          <h2 className="mt-2 font-display text-headlineLg font-semibold leading-tight">
            Selamat Datang Kembali di Toko Kue Bu Rohayah
          </h2>

          {/* Role tabs */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-DEFAULT bg-surface-low p-1.5">
            <button
              type="button"
              role="tab"
              aria-selected={role === "customer"}
              onClick={() => setRole("customer")}
              className={`flex items-center justify-center gap-2 rounded-DEFAULT py-2.5 text-bodySm font-semibold transition-colors ${
                role === "customer" ? "bg-primary text-white shadow-warm" : "text-ink-variant hover:text-ink"
              }`}
            >
              <Icon name="person" className="text-lg" />
              Pelanggan / Pemesan
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === "staff"}
              onClick={() => setRole("staff")}
              className={`flex items-center justify-center gap-2 rounded-DEFAULT py-2.5 text-bodySm font-semibold transition-colors ${
                role === "staff" ? "bg-primary text-white shadow-warm" : "text-ink-variant hover:text-ink"
              }`}
            >
              <Icon name="soup_kitchen" className="text-lg" />
              Admin & Staf Dapur
            </button>
          </div>

          {role === "staff" && (
            <div className="mt-4 rounded-DEFAULT border border-status-amber bg-status-amber/60 p-3 text-bodySm text-status-amberText">
              <span className="font-bold">Area khusus staf dapur & logistik.</span> Setelah masuk,
              Anda akan diarahkan ke Portal Pengelola Dapur.
            </div>
          )}

          {/* Google SSO */}
          <button
            type="button"
            onClick={handleGoogle}
            className="editorial-border mt-6 flex w-full items-center justify-center gap-3 rounded-DEFAULT bg-white py-3 text-bodyMd font-semibold text-ink transition-colors hover:bg-surface-low"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Masuk dengan Akun Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-outline-editorial" />
            <span className="text-bodySm text-ink-variant">atau masuk dengan email</span>
            <span className="h-px flex-1 bg-outline-editorial" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="identity" className="mb-1.5 block text-bodySm font-bold text-ink">
                Email <span className="text-error">*</span>
              </label>
              <input
                id="identity"
                type="text"
                required
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder={role === "customer" ? "contoh: pemesan@email.com" : "email staf dapur: staf.pawon@tradisi.id"}
                className="h-11 w-full rounded-DEFAULT border-[1.5px] border-outline-editorial bg-white px-3 text-bodyMd placeholder:text-outline focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-bodySm font-bold text-ink">
                Kata Sandi <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-11 w-full rounded-DEFAULT border-[1.5px] border-outline-editorial bg-white px-3 pr-12 text-bodyMd focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Lihat atau Sembunyikan Sandi"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-ink"
                >
                  <Icon name={showPassword ? "visibility_off" : "visibility"} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-bodySm text-ink-variant">
                <input type="checkbox" className="h-4 w-4 rounded accent-primary" />
                Ingat Saya
              </label>
              <Link href="/masuk" className="text-bodySm font-semibold text-primary hover:underline">
                Lupa Kata Sandi?
              </Link>
            </div>

            {error && (
              <div className="rounded-DEFAULT border border-error/30 bg-error-container/50 p-3 text-bodySm text-error-oncontainer">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-DEFAULT bg-primary py-3.5 text-titleMd font-semibold text-white transition-colors hover:bg-primary-deep disabled:opacity-60"
            >
              <Icon name={loading ? "hourglass_top" : "login"} className="text-lg" />
              {loading ? "Memproses..." : "Masuk ke Akun"}
            </button>
          </form>

          <p className="mt-6 text-center text-bodySm text-ink-variant">
            Baru pertama kali pesan?{" "}
            <Link href="/daftar" className="font-bold text-primary hover:underline">
              Daftar Akun Baru
            </Link>
          </p>

          <div className="mt-8 grid grid-cols-3 gap-2 border-t border-outline-editorial pt-6 text-center">
            {[
              { icon: "health_and_safety", label: "Higienis Standar BPOM" },
              { icon: "schedule", label: "Kirim Tepat Waktu" },
              { icon: "support_agent", label: "CS Katering 24/7" },
            ].map((g) => (
              <div key={g.label} className="flex flex-col items-center gap-1.5">
                <Icon name={g.icon} className="text-xl text-primary" />
                <span className="text-[11px] font-semibold leading-tight text-ink-variant">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
