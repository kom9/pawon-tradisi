# Toko Kue Bu Rohayah — Pawon Tradisi

Website jualan kue tradisional (jajanan pasar) dengan panel admin, dibangun dari desain Stitch **"Toko Kue Tradisional Online"** (design system: *Rasa Tradisi Nusantara*).

- **Framework:** Next.js 14 (App Router) + Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL + Auth + RLS)
- **Deploy:** Vercel
- **Mode Demo:** Tanpa konfigurasi Supabase pun website tetap jalan 100% dengan data contoh

## Halaman

| Route | Fungsi |
|---|---|
| `/` | Beranda: hero, katalog + filter kategori + pencarian, paket tampah, keunggulan, ulasan, CTA |
| `/artikel` | Cerita Rasa: featured, grid artikel, kategori filter, pencarian, terpopuler, newsletter |
| `/artikel/[slug]` | Detail artikel |
| `/masuk` | Login (Email/Password + Google OAuth, role Pelanggan/Staf) |
| `/daftar` | Registrasi pelanggan |
| `/admin` | Dashboard admin (KPI, tabel pesanan, stok, armada) — **dilindungi middleware** |
| `/admin/pesanan` | Manajemen semua pesanan + ubah status produksi |
| `/admin/katalog` | Kelola stok harian (toggle buka/tutup order) |
| `/admin/tampah` | Kelola paket tampah/bundel |
| `/admin/cerita` | Kelola artikel |
| `/admin/pengaturan` | Pengaturan toko |

Keranjang & checkout tersedia di semua halaman publik (slide-over drawer) dan tersimpan ke tabel `orders`.

## Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** → paste seluruh isi `supabase/schema.sql` → **Run**.
   Ini membuat tabel (`profiles`, `products`, `articles`, `orders`), seed 11 produk + 11 artikel + 6 pesanan contoh, trigger kode pesanan otomatis (`#PWN-XXXX`), dan RLS policies.
3. Buka **Authentication → Providers**: aktifkan **Email** dan (opsional) **Google**.
   - Untuk Google: isi Client ID & Secret dari Google Cloud Console, lalu di Supabase **Auth → URL Configuration** set **Site URL** dan **Redirect URLs** sesuai domain Vercel Anda, serta `http://localhost:3000/auth/callback` untuk dev.
4. Salin `.env.example` → `.env.local`, isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API).
5. Jalankan `npm run dev` — banner kuning "Mode Demo" akan hilang, artinya data live sudah aktif.

### Menjadikan user sebagai Admin/Staf

Setelah user mendaftar via `/daftar`, jadikan dia staf lewat SQL Editor:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'email@anda.com');
```

User tersebut bisa login di `/masuk` tab **Admin & Staf Dapur** dan mengakses `/admin`.

## Deploy ke Vercel

1. Push folder ini ke repository GitHub.
2. Di Vercel: **Add New Project** → pilih repo → framework Next.js (auto-detect).
3. Tambahkan Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Selesai.

Catatan: `/admin` dilindungi middleware yang memeriksa session + role `staff`/`admin` di tabel `profiles`.

## Struktur

```
src/
├── app/
│   ├── page.tsx                 # Beranda & Katalog
│   ├── artikel/                 # list + [slug] detail
│   ├── masuk/ daftar/           # auth
│   ├── auth/callback/route.ts   # OAuth exchange
│   └── admin/                   # dashboard + sub halaman (guarded)
├── components/                  # Navbar, Footer, CartDrawer, ProductCard, AdminShell
├── lib/
│   ├── supabase/                # browser/server client + middleware helper
│   ├── data.ts                  # data-access layer (fallback Demo Mode otomatis)
│   ├── demo-data.ts             # seed/fallback data
│   └── types.ts
└── middleware.ts                # guard /admin + refresh session
supabase/schema.sql              # schema + RLS + seed
design-source/                   # referensi desain Stitch asli
```

## RLS Security Model

- `products`, `articles`: publik bisa `SELECT`; hanya staf bisa menulis.
- `orders`: user login bisa insert (hanya untuk dirinya) & melihat pesanannya; staf bisa melihat & meng-update semua.
- `profiles`: user hanya bisa melihat/mengubah profilnya sendiri; staf bisa melihat semua.
