# Alur Pengerjaan Proyek PasarLokal (tasks.md)

Dokumen ini berisi panduan langkah demi langkah (roadmap) pengerjaan platform **PasarLokal**. Seluruh tugas disusun secara berurutan untuk memastikan standardisasi kode, keamanan data, dan kesesuaian desain antarmuka terpenuhi dengan baik.

---

## 📊 Ringkasan Progress Pengerjaan

| Fase | Fokus Utama | Target Output | Status |
| :--- | :--- | :--- | :--- |
| **Fase 1** | Inisialisasi & Konfigurasi Proyek | Struktur folder siap, Next.js, Tailwind, & TypeScript Strict aktif. | ✅ Selesai |
| **Fase 2** | Basis Data & Klien Singleton | Skema MySQL (Prisma) dan *connection pooling* siap. | ✅ Selesai |
| **Fase 3** | Komponen Global & Tata Letak (`Layout`) | `Navbar` global, komponen utilitas gambar, dan tipe data global. | ✅ Selesai |
| **Fase 4** | Fitur Autentikasi (`(auth)`) | Halaman Login/Register dinamis dengan umpan balik Sonner. | ⬜ Belum Mulai |
| **Fase 5** | Eksplorasi & Unggah Produk (`/`, `sell`) | Halaman beranda, detail produk, dan formulir pasang iklan. | ⬜ Belum Mulai |
| **Fase 6** | Sistem Komunikasi & Dasbor (`chat`, `profile`) | Jendela obrolan real-time (COD) dan manajemen barang terjual. | ⬜ Belum Mulai |
| **Fase 7** | Optimasi, Validasi, & Deployment | Lolos kueri tipe data, responsif mobile, dan rilis ke Vercel. | ⬜ Belum Mulai |

---

## 🛠️ Detail Rincian Tugas (Task Breakdown)

### Fase 1: Inisialisasi & Konfigurasi Proyek
* [x] **1.1. Setup Next.js & TypeScript**
    * Buat proyek Next.js baru versi terbaru menggunakan **App Router**.
    * Pastikan konfigurasi `"strict": true` aktif pada berkas `tsconfig.json`.
* [x] **1.2. Integrasi TailwindCSS & Desain Sistem**
    * Konfigurasikan TailwindCSS sesuai dengan palet warna identitas brand: warna utama menggunakan `emerald-600` & `emerald-700`, latar belakang menggunakan `slate-50`/`slate-100`, dan teks menggunakan `slate-800`/`slate-900`.
* [x] **1.3. Instalasi Dasar shadcn/ui**
    * Inisialisasi `shadcn/ui` melalui CLI (`npx shadcn@latest init`).
    * Pastikan fungsi gabungan kelas `cn()` terpasang di `src/lib/utils.ts`.
* [x] **1.4. Manajemen Repositori Git**
    * Lindungi cabang `main` hanya untuk kode produksi yang stabil.
    * Buat cabang baru `feature/setup-project` untuk memulai pengerjaan awal.

### Fase 2: Konfigurasi Basis Data & Skema MySQL
* [x] **2.1. Inisialisasi ORM & Environment Variables**
    * Setup Prisma/Drizzle di dalam proyek. Buat folder `prisma/` di tingkat root.
    * Simpan kredensial database `DATABASE_URL` di dalam berkas `.env.local` (jangan diunggah ke repositori publik).
* [x] **2.2. Perancangan Skema Tabel MySQL**
    * Definisikan model tabel pada berkas `schema.prisma` yang meliputi:
        * `User`: Data profil, nama, email, password, lokasi regional, dan statistik performa.
        * `Product`: Detail barang, kategori, harga, lokasi detail, status, deskripsi kondisi, dan timestamp.
        * `Chat` & `Message`: Relasi obrolan antar pengguna, pesan terakhir, teks, dan status `unread`.
* [x] **2.3. Implementasi DB Client Singleton**
    * Buat berkas `src/lib/db.ts`.
    * Konfigurasikan koneksi database MySQL menggunakan pola *singleton* atau *connection pool* untuk mencegah kehabisan slot koneksi saat *live reload* di tahap pengembangan.

### Fase 3: Komponen Global & Tata Letak (`Layout`)
* [x] **3.1. Pembuatan Tipe Data Global**
    * Definisikan semua interface tipe data di dalam folder `src/types/`.
    * **Aturan Ketat**: Dilarang menggunakan tipe `any`. Gunakan tipe data eksplisit pada parameter fungsi dan nilai kembalian (*return value*).
* [x] **3.2. Komponen Proteksi Gambar Fallback**
    * Buat komponen `ImageWithFallback.tsx` menggunakan komponen bawaan Next.js `<Image />` untuk mencegah kerusakan tampilan visual jika tautan eksternal gagal dimuat.
* [x] **3.3. Komponen `Navbar.tsx` Global**
    * Letakkan di `src/components/shared/Navbar.tsx` dengan sifat *sticky* dan efek *blur backdrop*.
    * Integrasikan logo daun (`Leaf`), input teks pencarian (`searchQuery`), tombol filter wilayah (Default: "Purbalingga") dengan ikon `MapPin`, serta tautan navigasi cepat (`/chat`, `/sell`, `/profile`).

### Fase 4: Fitur Autentikasi (`(auth)`)
* [ ] **4.1. Pembuatan Halaman Terpadu**
    * Buat rute grup `src/app/(auth)/` untuk mengelola proses pendaftaran dan masuk log.
    * Gunakan satu kontainer dinamis berbasis state `isRegister` untuk beralih mode antara Sign In dan Sign Up tanpa pindah halaman.
* [ ] **4.2. UI Form & Penanganan Input**
    * Gunakan komponen input dari shadcn (`Mail` dan `Lock`).
    * Terapkan umpan balik instan menggunakan tombol submit adaptif dengan indikator pemuatan statis (`isLoading`).
* [ ] **4.3. Integrasi Notifikasi & Pihak Ketiga**
    * Hubungkan aksi submit dengan pustaka notifikasi **Sonner** (`toast.success`).
    * Sediakan opsi masuk pihak ketiga menggunakan tombol Google Auth.

### Fase 5: Eksplorasi & Unggah Produk (`/`, `sell`)
* [ ] **5.1. Halaman Beranda Utama (`src/app/page.tsx`)**
    * **Kategori Produk**: Buat grid horizontal berisi ikon emotikon (Perabotan `🪑`, Elektronik `💻`, dsb).
    * **Daftar Produk**: Tampilkan grid kartu produk (`ProductCard.tsx`) responsif menggunakan format harga Rp, lokasi detail, timestamp, dan tombol `Heart`.
    * **Trust Banner**: Buat kotak edukasi berwarna emerald tentang keamanan COD dan transaksi lokal.
* [ ] **5.2. Halaman Detail Produk (`src/app/product-detail/`)**
    * Tampilkan galeri foto produk, metadata barang (kondisi, kategori), info reputasi penjual (rating bintang `amber-500`), serta aksi utama: tombol `Chat Now` dan tombol favorit.
* [ ] **5.3. Formulir Unggah Barang (`src/app/sell/`)**
    * Buat area unggah foto interaktif berbasis garis putus-putus (`border-dashed`) dengan ikon `Camera`.
    * Sediakan input data lengkap dan aktifkan sakelar otomatis untuk opsi pembayaran Cash on Delivery (COD).

### Fase 6: Sistem Komunikasi & Dasbor (`chat`, `profile`)
* [ ] **6.1. Halaman Sistem Obrolan (`src/app/chat/`)**
    * **Sidebar Percakapan**: Tampilkan list obrolan aktif beserta miniatur gambar barang dan indikator titik merah (`red-500`) jika ada pesan belum terbaca.
    * **Jendela Utama**: Tampilkan riwayat pesan masuk-keluar, header info produk yang dinegosiasikan, serta kolom ketik pesan melengkung penuh (`rounded-full`) dengan tombol `Send`.
* [ ] **6.2. Dasbor Profil Pengguna (`src/app/profile/`)**
    * Buat kartu identitas berisi foto profil, nama, lokasi, tanggal bergabung, dan statistik penjualan.
    * Tampilkan grid barang yang sedang dijual dengan tombol aksi edit, bersandingan dengan kartu khusus "Tambah Barang" yang mengarah ke halaman `/sell`.

### Fase 7: Optimasi, Validasi, & Deployment
* [ ] **7.1. Validasi Keamanan & Server-Side Execution**
    * **Aturan Ketat**: Pastikan seluruh kueri database (CRUD) dijalankan di dalam Server Components, Server Actions, atau API Routes (`src/app/api/`). Sisi klien tidak boleh terhubung langsung ke server MySQL.
    * Gunakan *parameterized queries* bawaan ORM untuk mencegah celah keamanan SQL Injection.
* [ ] **7.2. Pengujian Desain Responsif (Mobile-First)**
    * Periksa seluruh komponen visual dari ukuran layar HP hingga monitor komputer menggunakan utilitas breakpoint Tailwind (`sm:`, `md:`, `lg:`).
* [ ] **7.3. Build Check & Deployment**
    * Jalankan perintah pengujian build lokal (`npm run build`) untuk memastikan tidak ada kesalahan kompilasi tipe data TypeScript.
    * Buat Pull Request (PR) ke cabang `main` untuk memicu pengecekan otomatis pada sistem Vercel Preview sebelum dilakukan perilisan penuh ke server produksi Vercel.