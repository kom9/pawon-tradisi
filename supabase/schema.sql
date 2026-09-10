-- ============================================================
-- PAWON TRADISI — Toko Kue Bu Rohayah
-- Supabase Schema + Seed + RLS
-- Jalankan seluruh file ini di Supabase Dashboard → SQL Editor
-- ============================================================

-- ---------- 1. ENUM & TIPE ----------
do $$ begin
  create type user_role as enum ('customer', 'staff', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status_type as enum (
    'diterima', 'sedang_dikukus', 'sedang_ditata',
    'siap_kirim', 'menunggu_pembayaran', 'selesai'
  );
exception when duplicate_object then null; end $$;

-- ---------- 2. PROFILES (data user, role) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  role user_role not null default 'customer',
  created_at timestamptz not null default now()
);

-- Trigger: otomatis buat profile saat user signup (data dari metadata)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- 3. PRODUK ----------
create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  category text not null,
  price integer not null check (price >= 0),
  unit text not null default '',
  badges text[] not null default '{}',
  description text not null default '',
  image_url text not null default '',
  is_bundle boolean not null default false,
  is_active boolean not null default true,
  stock_capacity integer,
  stock_sold integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- 4. ARTIKEL ----------
create table if not exists public.articles (
  id text primary key,
  slug text unique not null,
  title text not null,
  category text not null,
  excerpt text not null default '',
  content text not null default '',
  author text not null default '',
  read_time integer not null default 4,
  views integer not null default 0,
  is_featured boolean not null default false,
  published_at date not null default current_date,
  image_url text not null default ''
);

-- ---------- 5. PESANAN ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null,
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null default 'Pesanan Online',
  customer_name text not null,
  phone text not null default '',
  location text not null default '',
  items jsonb not null default '[]',
  delivery_slot text not null default 'Slot Fajar Utama',
  delivery_date date,
  delivery_time text not null default '06:00',
  courier_info text not null default 'Akan dijadwalkan',
  address text not null default '',
  notes text not null default '',
  total_amount integer not null check (total_amount >= 0),
  payment_method text not null default 'QRIS Instan',
  payment_status text not null default 'Belum Dibayar',
  status order_status_type not null default 'menunggu_pembayaran',
  created_at timestamptz not null default now()
);

create index if not exists orders_created_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

-- Kode pesanan otomatis: #PWN-XXXX (sequence tahunan sederhana)
create sequence if not exists public.order_seq start 8800;
create or replace function public.generate_order_code()
returns trigger language plpgsql as $$
begin
  if new.order_code is null or new.order_code = '' then
    new.order_code := '#PWN-' || (nextval('public.order_seq'))::text;
  end if;
  return new;
end; $$;

drop trigger if exists set_order_code on public.orders;
create trigger set_order_code
  before insert on public.orders
  for each row execute function public.generate_order_code();

-- Helper: apakah user saat ini staf/admin?
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'admin')
  );
$$;

-- ---------- 6. RLS ----------
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.articles enable row level security;
alter table public.orders enable row level security;

-- Profiles: user lihat/edit profile sendiri; staf boleh lihat semua
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid() or public.is_staff());

-- Products: publik bisa baca; hanya staf bisa tulis
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (true);

drop policy if exists "products_staff_write" on public.products;
create policy "products_staff_write" on public.products
  for all using (public.is_staff()) with check (public.is_staff());

-- Articles: publik bisa baca; hanya staf bisa tulis
drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read" on public.articles
  for select using (true);

drop policy if exists "articles_staff_write" on public.articles;
create policy "articles_staff_write" on public.articles
  for all using (public.is_staff()) with check (public.is_staff());

-- Orders: pelanggan bisa membuat pesanan & lihat pesanannya sendiri;
-- staf bisa melihat dan meng-update semua pesanan.
drop policy if exists "orders_insert_authenticated" on public.orders;
create policy "orders_insert_authenticated" on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

drop policy if exists "orders_select_own_or_staff" on public.orders;
create policy "orders_select_own_or_staff" on public.orders
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists "orders_update_staff" on public.orders;
create policy "orders_update_staff" on public.orders
  for update using (public.is_staff()) with check (public.is_staff());

-- ============================================================
-- SEED DATA
-- ============================================================

insert into public.products (id, slug, name, category, price, unit, badges, description, image_url, is_bundle, is_active, stock_capacity, stock_sold, sort_order) values
('p1','klepon-gula-aren-meluber','Klepon Gula Aren Meluber','Kue Basah Manis',18000,'Porsi isi 6 pcs','{"Fresh Pagi Ini","BEST SELLER"}','Klepon pandan dengan lumeran gula aren asli Temanggung yang meluber saat digigit. Dibuat subuh, dikukus alami tanpa pengawet.','/images/kue/klepon.svg',false,true,200,188,1),
('p2','lemper-ayam-bakar-spesial','Lemper Ayam Bakar Spesial','Gurih & Asin',5500,'Per pcs','{"Fresh Pagi Ini","FAVORIT HAJATAN"}','Lemper pulen berisi suwiran ayam bakar dibungkus daun pisang pilihan. Aroma bakar daun pisang yang tak tergantikan.','/images/kue/lemper.svg',false,true,250,242,2),
('p3','kue-lumpur-surga-pandan','Kue Lumpur Surga Pandan','Kue Basah Manis',22000,'Per box (4 cup)','{"Fresh Pagi Ini"}','Kue lumpur klasik tekstur lembut meleleh dengan aroma pandan wangi sejati dan taburan kismis.','/images/kue/kue-lumpur.svg',false,true,60,41,3),
('p4','lapis-legit-prunes-tradisional','Lapis Legit Prunes Tradisional','Kue Basah Manis',45000,'Per potong tebal','{"PREMIUM BUTTER","PRE-ORDER H-1"}','Lapis legit 30+ lapis premium butter, dipanggang per lapis selama 3 jam. Topping prunes import.','/images/kue/lapis-legit.svg',false,true,50,25,4),
('p5','onde-onde-crispy-wijen','Onde-onde Crispy Wijen','Kue Basah Manis',4000,'Per pcs','{"Fresh Pagi Ini"}','Onde-onde wijen renyah dengan isian kacang hijau halus dan gula aren.','/images/kue/onde-onde.svg',false,true,300,220,5),
('p6','bika-ambon-sarang-semut','Bika Ambon Sarang Semut','Kue Basah Manis',35000,'Kotak mini (6 potong)','{"Resep Kuno Medan"}','Bika ambon sarang semut tekstur berongga sempurna. Fermentasi alami 12 jam.','/images/kue/bika-ambon.svg',false,true,50,25,6),
('p7','kue-mangkok-mekar-gula-aren','Kue Mangkok Mekar Gula Aren','Kue Basah Manis',4500,'Per pcs','{"Fresh Pagi Ini"}','Kue mangkok mekar cantik dari tepung beras dan gula aren. Bunga mekar sempurna.','/images/kue/kue-mangkok.svg',false,true,200,150,7),
('p8','pastel-goreng-ragout-spesial','Pastel Goreng Ragout Spesial','Gurih & Asin',6000,'Per pcs + sambal kacang','{"Fresh Pagi Ini","FAVORIT SNACK BOX"}','Pastel goreng isi ragout ayam dan wortel creamy, disajikan dengan sambal kacang rumahan.','/images/kue/pastel.svg',false,true,300,210,8),
('p9','tampah-tamu-agung-80','Tampah Tamu Agung (Isi 80 Pcs)','Kue Tampah Sultan',385000,'8 macam kue × 10 pcs','{"PALING DIMINATI RESEPSI"}','Tampah bambu 60cm berisi 8 macam kue pilihan. Gratis pita & kartu kaligrafi.','/images/kue/tampah-agung.svg',true,true,15,3,9),
('p10','tampah-sedang-keluarga-40','Tampah Sedang Keluarga (Isi 40 Pcs)','Kue Tampah Sultan',215000,'Kue campur 40 pcs','{"COCOK ARISAN"}','Tampah kue campur untuk arisan dan rapat 10–15 orang.','/images/kue/tampah-sedang.svg',true,true,20,5,10),
('p11','snack-box-besek-satuan','Snack Box Besek Satuan','Paket Snack Box',16500,'Per box • Min. 20 box','{"MIN. PEMESANAN 20 BOX"}','Besek eksklusif isi 3 kue + 1 air mineral + sendok kayu.','/images/kue/snack-box.svg',true,true,500,120,11)
on conflict (id) do nothing;

insert into public.articles (id, slug, title, category, excerpt, content, author, read_time, views, is_featured, published_at, image_url) values
('a1','filosofi-manis-klepon','Filosofi Manis di Balik Kue Klepon: Lambang Kerendahan Hati dan Kejutan Rasa Nusantara','Filosofi Tradisi','Di balik bentuknya yang sederhana, klepon menyimpan makna kerendahan hati.','Klepon adalah kue yang mengajarkan tentang kerendahan hati. Dari luar ia tampak sederhana: bola-bola hijau pandan berbalur kelapa parut. Namun saat digigit, gula aren cair meluber memberikan kejutan rasa yang tak terduga.

Bagi masyarakat Jawa, klepon kerap menjadi bagian sajian tumpeng dan hajatan. Warna hijaunya melambangkan kesuburan dan hidup, sementara isian gula aren yang meluber mengingatkan bahwa kebahagiaan sesungguhnya justru datang dari hal-hal yang tidak kita pamerkan.

Di Toko Kue Bu Rohayah, setiap klepon dibuat dengan gula aren asli Temanggung yang dicairkan secara tradisional — bukan sirup pabrik.','Chef Dapur Tradisi',5,5200,true,'2025-10-14','/images/artikel/klepon-filosofi.svg'),
('a2','tips-snack-box-rapat-kantor','5 Tips Memilih & Menyusun Snack Box Rapat Kantor agar Elegan dan Mengenyangkan','Panduan Acara','Susunan snack box yang tepat membuat rapat 2 jam terasa ringkas.','Menyusun snack box untuk rapat kantor bukan sekadar mengisi kotak. Ada ilmu komposisi di dalamnya.

1. Patuhi rasio 60:40 antara gurih dan manis.
2. Sertakan satu item signature yang berkesan.
3. Air mineral adalah wajib.
4. Perhatikan durasi rapat: 2 jam cukup 3 item, seminar sehari butuh 5–6 item.
5. Gunakan kemasan rapi dan seragam.','Tim Katering Pawon',4,3100,false,'2025-10-12','/images/artikel/snack-box.svg'),
('a3','rahasia-daun-pisang-dibakar-lemper','Mengapa Lemper Dibungkus Daun Pisang yang Dibakar? Rahasia Aroma yang Tak Tergantikan','Eksplorasi Kuliner','Ada alasan kuno di balik daun pisang yang dilewatkan di atas api.','Pemanasan singkat melembutkan serat daun sehingga lebih mudah dilipat, sekaligus membangkitkan senyawa aromatik yang membuat aroma lemper harum khas. Panas juga mengurangi kelembapan permukaan daun sehingga nasi tidak cepat lembek.

Di dapur kami, teknik ini masih dipertahankan di setiap batch produksi subuh.','Bude Harum Dapur',6,2800,false,'2025-10-10','/images/artikel/daun-pisang.svg'),
('a4','cara-menyimpan-kue-basah-santan','Cara Menyimpan Kue Basah Santan Agar Tetap Segar dan Tidak Cepat Basi Seharian','Tips Dapur','Kue basah berbahan santan paling rawan basi.','Kue berbahan santan seperti klepon dan kue lumpur paling rawan tercemar bakteri. Simpan di suhu ruang maksimal 6–8 jam, atau kulkas lalu hangatkan dengan dikukus 5 menit. Jangan simpan kue dalam kondisi tertutup rapat saat masih hangat.','Peneliti Rasa Pawon',5,2400,false,'2025-10-08','/images/artikel/kue-basah.svg'),
('a5','beda-lapis-legit-dan-lapis-surabaya','Beda Lapis Legit dan Lapis Surabaya: Karakter Rempah Spekuk vs Tekstur Sponge Lembut','Kamus Kue','Sering tertukar karena namanya mirip.','Lapis legit dipanggang lapis demi lapis dengan mentega premium dan rempah spekuk — butuh 3 jam untuk 30 lapisan. Lapis Surabaya adalah sponge cake tiga warna yang lembut tanpa rempah. Untuk hantaran resmi pilih lapis legit; untuk teman teh keluarga, lapis Surabaya.','Chef Dapur Tradisi',7,1900,false,'2025-10-05','/images/artikel/lapis.svg'),
('a6','kue-tampah-hantaran-lamaran-adat','Menyiapkan Kue Tampah Cantik untuk Hantaran Lamaran Adat Tradisional','Inspirasi Hajatan','Jumlah ganjil, susunan bertingkat, dan kue wajib.','Hantaran lamaran adat memiliki aturan jumlah ganjil: 5, 7, atau 9 tampah. Susunan bertingkat: kue kering di bawah, kue basah premium di atas. Kue wajib antara lain kue sepit, lapis legit, kue mangkok, dan dodol. Dapur kami menyediakan paket lengkap dengan pita dan kartu kaligrafi.','Tim Katering Pawon',6,1700,false,'2025-10-02','/images/artikel/tampah-lamaran.svg'),
('a7','manfaat-daun-suji-pandan-wangi','Manfaat Daun Suji dan Pandan Wangi Asli Dibanding Pewarna Makanan Buatan','Kesehatan & Alami','Warna hijau alami bukan hanya soal estetika.','Daun suji menghasilkan hijau tua pekat, pandan memberi hijau muda wangi. Selain aman, keduanya mengandung antioksidan. Semua kue hijau dari dapur kami 100% memakai ekstrak daun asli.','Bude Harum Dapur',4,1500,false,'2025-09-28','/images/artikel/daun-suji.svg'),
('a8','resep-onde-onde-renyah-anti-kempes','Resep Onde-Onde Wijen Renyah Anti Kempes Walau Sudah Dingin','Resep Warisan','Kunci ada di suhu minyak dan waktu istirahat adonan.','Istirahatkan adonan minimal 30 menit, goreng suhu sedang 160–170°C, dan tiriskan di kawat — bukan tisu — agar uap tidak terperangkap. Onde-onde kami tetap renyah sampai 8 jam.','Bude Harum Dapur',4,4200,false,'2025-09-25','/images/artikel/onde-resep.svg'),
('a9','simbolisme-jenang-dodol-pernikahan-jawa','Simbolisme Jenang dan Dodol dalam Tradisi Pernikahan Jawa','Filosofi Tradisi','Dodol yang lengket adalah doa agar hubungan juga lengket dan sabar.','Tekstur dodol yang lengket melambangkan harapan agar pasangan selalu lengket. Proses memasaknya yang berjam-jam mengajarkan kesabaran. Jenang abang dan putih melambangkan doa yang berani dan murni.','Chef Dapur Tradisi',6,3800,false,'2025-09-20','/images/artikel/dodol.svg'),
('a10','hitungan-porsi-kue-tampah-arisan','Hitungan Porsi Kue Tampah untuk Acara Arisan 30-50 Orang','Panduan Hajatan','Jangan sampai kurang atau boros.','Arisan 30 orang: 2 tampah sedang. Arisan 50 orang: 3 tampah sedang + 1 mini. Rapat 2 jam: 1 snack box per orang + 20% cadangan. Resepsi 300 tamu: 4 tampah Tamu Agung per 100 tamu. Selalu siapkan 10–15% cadangan.','Tim Katering Pawon',5,3100,false,'2025-09-15','/images/artikel/arisan.svg'),
('a11','kue-putu-ayu-berbusa-hijau','Kue Putu Ayu Berbusa Hijau: Sentuhan Parutan Kelapa Setengah Tua','Tips Dapur','Kunci putu ayu lembut ada di pemilihan kelapa.','Gunakan kelapa setengah tua agar parutan menempel rapi, dan kocok telur hingga berbusa putih pekat sebelum masukkan tepung — ini yang menciptakan tekstur berbusa.','Bude Harum Dapur',4,2700,false,'2025-09-10','/images/artikel/putu-ayu.svg')
on conflict (id) do nothing;

insert into public.orders (order_code, event_name, customer_name, phone, location, items, delivery_slot, delivery_date, delivery_time, courier_info, address, notes, total_amount, payment_method, payment_status, status, created_at) values
('#PWN-8833','Hantaran Syukuran & Tampah Agung','Ibu Ratih Anggraini','081234567890','Kebayoran Baru','[{"name":"Tampah Tamu Agung (80 Pcs)","qty":1,"price":385000},{"name":"Kudapan Tambahan","qty":1,"price":63500}]','Slot Fajar Utama','2025-10-22','06:30','Kurir Blindvan 02','Jl. Warisan Rasa No. 18, Kebayoran Baru','Hiasan daun pisang kepang mawar.',448500,'QRIS Instan','Lunas via QRIS','diterima','2025-10-22T03:40:00+07:00'),
('#PWN-8821','Hajatan Kantor BUMN','Bpk. Rendra','081234567891','Gedung Telkom','[{"name":"Box Hajatan Mewah","qty":60,"price":35000}]','Slot Fajar Utama','2025-10-22','06:30','Kurir Subuh','Gedung Telkom, Jakarta Pusat','',2100000,'Transfer BCA','Lunas','siap_kirim','2025-10-21T20:10:00+07:00'),
('#PWN-8824','Arisan Ibu Ratna','Ibu Ratna Kumalasari','081234567892','Pondok Indah','[{"name":"Tampah Sultan 100 Pcs","qty":2,"price":725000}]','Slot Fajar Utama','2025-10-22','07:30','Kurir Dapur Khusus','Pondok Indah, Jakarta Selatan','Tampah bertingkat 2 tingkat.',1450000,'QRIS Instan','Lunas','sedang_ditata','2025-10-21T18:45:00+07:00'),
('#PWN-8827','Langganan Sarapan Pagi','dr. Hendra Setiawan','081234567893','Menteng','[{"name":"Klepon Gula Aren Meluber","qty":15,"price":18000},{"name":"Kue Lumpur Surga Pandan","qty":10,"price":22000}]','Slot Fajar Utama','2025-10-22','06:00','Diambil Driver Ojol','Menteng, Jakarta Pusat','',162500,'QRIS Instan','Lunas','siap_kirim','2025-10-21T16:20:00+07:00'),
('#PWN-8830','Syukuran Rumah Baru','Bpk. Fajar Ramadhan','081234567894','Tebet','[{"name":"Snack Box Klasik","qty":35,"price":25000}]','Slot Siang','2025-10-22','09:00','Katering Rumah','Tebet, Jakarta Selatan','',875000,'DP 50% Katering','DP 50%','sedang_dikukus','2025-10-21T14:05:00+07:00'),
('#PWN-8832','Acara Pengajian Masjid','Ustadz Mansyur','081234567895','Kuningan','[{"name":"Nagasari","qty":80,"price":4000},{"name":"Dadar Gulung","qty":80,"price":4000}]','Slot Siang','2025-10-22','11:30','Shift Siang','Masjid Kuningan, Jakarta Selatan','',640000,'Transfer Mandiri','Belum Dibayar','menunggu_pembayaran','2025-10-21T11:30:00+07:00')
on conflict do nothing;

-- ============================================================
-- SELESAI
-- Untuk menjadikan user sebagai staf/admin, jalankan:
--   update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'email@anda.com');
-- ============================================================
