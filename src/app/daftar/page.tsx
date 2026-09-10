"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { Icon } from "@/components/Navbar";

export default function DaftarPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!supabaseConfigured) {
      setError("Mode Demo: autentikasi belum aktif. Konfigurasikan Supabase terlebih dahulu.");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    setLoading(true);
    try {
      const client = createClient();
      const { error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, phone, role: "customer" },
        },
      });
      if (error) throw error;
      setNotice("Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi (jika verifikasi diaktifkan di Supabase), lalu masuk.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendaftar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="batik-bg-pattern hidden flex-col justify-center p-14 text-white lg:flex">
        <h1 className="max-w-md font-display text-[38px] font-semibold leading-tight">
          Satu Akun, Semua <em className="text-primary-fixed-dim">Kelezatan Tradisi.</em>
        </h1>
        <p className="mt-4 max-w-md text-bodyLg text-white/80">
          Daftar sekarang untuk akses harga katering khusus, poin reward manis, dan pantauan
          pengiriman subuh real-time.
        </p>
      </section>

      <section className="flex flex-col justify-center bg-white px-4 py-12 sm:px-8 lg:px-14">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-1.5 text-bodySm font-semibold text-ink-variant hover:text-primary">
            <Icon name="arrow_back" className="text-base" />
            Kembali ke Beranda
          </Link>
          <p className="mt-10 text-labelSm uppercase tracking-wide text-secondary-bakar">Registrasi Akun</p>
          <h2 className="mt-2 font-display text-headlineLg font-semibold">Buat Akun Pelanggan Baru</h2>

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-bodySm font-bold">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama sesuai identitas pengiriman"
                className="h-11 w-full rounded-DEFAULT border-[1.5px] border-outline-editorial bg-white px-3 text-bodyMd placeholder:text-outline focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-bodySm font-bold">Nomor WhatsApp *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="h-11 w-full rounded-DEFAULT border-[1.5px] border-outline-editorial bg-white px-3 text-bodyMd placeholder:text-outline focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-bodySm font-bold">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="h-11 w-full rounded-DEFAULT border-[1.5px] border-outline-editorial bg-white px-3 text-bodyMd placeholder:text-outline focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-bodySm font-bold">Kata Sandi * <span className="font-normal text-ink-variant">(min. 6 karakter)</span></label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-DEFAULT border-[1.5px] border-outline-editorial bg-white px-3 text-bodyMd focus:border-primary focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-DEFAULT border border-error/30 bg-error-container/50 p-3 text-bodySm text-error-oncontainer">
                {error}
              </div>
            )}
            {notice && (
              <div className="rounded-DEFAULT border border-status-fresh bg-status-fresh/60 p-3 text-bodySm text-status-freshText">
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-DEFAULT bg-primary py-3.5 text-titleMd font-semibold text-white transition-colors hover:bg-primary-deep disabled:opacity-60"
            >
              <Icon name={loading ? "hourglass_top" : "person_add"} className="text-lg" />
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>

          <p className="mt-6 text-center text-bodySm text-ink-variant">
            Sudah punya akun?{" "}
            <Link href="/masuk" className="font-bold text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
