"use client";

import { AdminSidebar, AdminHeader } from "@/components/AdminShell";
import { Icon } from "@/components/Navbar";

export default function AdminPengaturanPage() {
  return (
    <div className="min-h-screen bg-surface-canvas">
      <AdminSidebar />
      <div className="lg:ml-72">
        <AdminHeader greeting="Pengaturan Dapur" />
        <main className="max-w-3xl p-6 lg:p-10">
          <h1 className="font-display text-headlineSm font-semibold">Pengaturan Toko</h1>
          <p className="mt-1 text-bodyMd text-ink-variant">
            Konfigurasi identitas dapur, slot pengiriman, dan integrasi pembayaran.
          </p>

          <div className="mt-8 space-y-6">
            <section className="editorial-border rounded-card bg-white p-6">
              <h2 className="font-display text-titleLg font-semibold">Identitas Dapur</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-bodySm font-bold">Nama Toko</label>
                  <input defaultValue="Toko Kue Bu Rohayah" className="h-11 w-full rounded-DEFAULT border-[1.5px] border-outline-editorial px-3 text-bodyMd focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-bodySm font-bold">Nomor WhatsApp</label>
                  <input defaultValue="6281234567890" className="h-11 w-full rounded-DEFAULT border-[1.5px] border-outline-editorial px-3 text-bodyMd focus:border-primary focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-bodySm font-bold">Alamat Dapur Pusat</label>
                  <input defaultValue="Jl. Warisan Rasa No. 18, Kebayoran Baru, Jakarta Selatan" className="h-11 w-full rounded-DEFAULT border-[1.5px] border-outline-editorial px-3 text-bodyMd focus:border-primary focus:outline-none" />
                </div>
              </div>
              <button className="mt-4 rounded-DEFAULT bg-primary px-5 py-2.5 text-bodyMd font-semibold text-white hover:bg-primary-deep">
                Simpan Perubahan
              </button>
            </section>

            <section className="editorial-border rounded-card bg-white p-6">
              <h2 className="font-display text-titleLg font-semibold">Slot Pengiriman</h2>
              <div className="mt-4 space-y-3">
                {["Slot Fajar Utama (06:00–08:00)", "Slot Siang (10:00–12:00)"].map((s, i) => (
                  <div key={s} className="flex items-center justify-between rounded-DEFAULT border border-outline-editorial p-4">
                    <span className="text-bodyMd font-semibold">{s}</span>
                    <span className={`rounded-full px-3 py-1 text-bodySm font-bold ${i === 0 ? "bg-status-fresh text-status-freshText" : "bg-status-amber text-status-amberText"}`}>
                      Aktif
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="editorial-border rounded-card bg-white p-6">
              <h2 className="font-display text-titleLg font-semibold">Integrasi</h2>
              <div className="mt-4 space-y-3">
                {[
                  { name: "Supabase Database", desc: "Data produk, pesanan, artikel", env: "NEXT_PUBLIC_SUPABASE_URL" },
                  { name: "WhatsApp Business API", desc: "Notifikasi pesanan & konfirmasi", env: "—" },
                ].map((i) => (
                  <div key={i.name} className="flex items-center justify-between rounded-DEFAULT border border-outline-editorial p-4">
                    <div className="flex items-center gap-3">
                      <Icon name="link" className="text-xl text-primary" />
                      <div>
                        <p className="text-bodyMd font-bold">{i.name}</p>
                        <p className="text-bodySm text-ink-variant">{i.desc}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-bodySm font-bold ${
                      process.env.NEXT_PUBLIC_SUPABASE_URL ? "bg-status-fresh text-status-freshText" : "bg-status-amber text-status-amberText"
                    }`}>
                      {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Terhubung" : "Belum Diatur"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
