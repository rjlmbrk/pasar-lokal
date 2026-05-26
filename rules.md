# Aturan Pengembangan Perangkat Lunak (Development Rules & Guidelines) — PasarLokal (v2)

Dokumen ini memuat standarisasi, aturan penulisan kode (coding standards), serta arsitektur teknis yang wajib dipatuhi oleh seluruh pengembang dalam membangun platform **PasarLokal**. Pedoman ini disesuaikan dengan transisi basis data ke MySQL.

---

## 1. Teknologi Utama (Tech Stack)

Seluruh komponen aplikasi wajib dibangun menggunakan ekosistem teknologi berikut:
* **Framework Utama**: Next.js versi terbaru (menggunakan **App Router**).
* **Bahasa Pemrograman**: TypeScript dengan konfigurasi **Strict Mode** aktif.
* **Gaya & Desain Antarmuka**: TailwindCSS.
* **Komponen UI**: shadcn/ui (berbasis Radix UI & Tailwind).
* **Basis Data (Database)**: MySQL (diakses menggunakan ORM seperti Prisma atau Drizzle untuk keamanan tipe data).
* **Infrastruktur Deployment**: Vercel (Production & Preview Branches).

---

## 2. Struktur Direktori & Konvensi File

Proyek ini menggunakan struktur standar Next.js App Router dengan pemisahan tugas yang jelas pada direktori root dan `src`:

```
├── prisma/               # Konfigurasi skema dan migrasi database (jika menggunakan Prisma)
│   └── schema.prisma
├── src/
│   ├── app/              # Route handlers, pages, dan layouts (Next.js App Router)
│   │   ├── (auth)/       # Route group untuk proses login, register, dll
│   │   ├── api/          # API Routes untuk interaksi basis data dari sisi klien
│   │   ├── chat/         # Halaman fitur obrolan antar pengguna
│   │   ├── profile/      # Dasbor profil pengguna
│   │   ├── sell/         # Formulir unggah barang baru
│   │   ├── layout.tsx    # Layout utama aplikasi
│   │   └── page.tsx      # Halaman beranda utama (katalog produk)
│   ├── components/       # Komponen UI modular
│   │   ├── ui/           # Komponen dari shadcn/ui (button, input, dialog, dll)
│   │   ├── shared/       # Komponen global (navbar, footer, dll)
│   │   └── features/     # Komponen spesifik fitur (product-card, chat-box)
│   ├── hooks/            # Custom React hooks (useChat, useDebounce)
│   ├── lib/              # Konfigurasi utilitas (db.ts untuk koneksi MySQL, utils.ts)
│   ├── types/            # Definisi tipe data global TypeScript (.ts)
│   └── utils/            # Fungsi pembantu murni (pure helper functions)
```

### Aturan Penamaan (Naming Conventions):
* **Komponen & File React**: Menggunakan PascalCase (Contoh: `ProductCard.tsx`, `Navbar.tsx`).
* **Folder Route & API**: Menggunakan lowercase, dipisahkan tanda hubung (Contoh: `product-detail`, `api/send-message`).
* **File Utilitas / Hooks**: Menggunakan camelCase (Contoh: `useLocalStorage.ts`, `db.ts`).

---

## 3. Aturan TypeScript (Strict Mode)

Konfigurasi `strict: true` pada `tsconfig.json` wajib diaktifkan untuk mencegah kesalahan tipe data saat aplikasi dijalankan.

* **Dilarang Menggunakan `any`**: Seluruh tipe data harus didefinisikan secara jelas. Jika tipe data bersifat dinamis, gunakan tipe `unknown` disertai pemeriksaan tipe (*type guarding*).
* **Eksplisit Tipe Data Fungsi**: Semua parameter input dan nilai kembalian (*return value*) fungsi wajib ditulis tipenya secara eksplisit.
* **Sinkronisasi Tipe Database**: Tipe data objek di sisi frontend wajib sinkron dengan struktur skema tabel MySQL untuk menghindari kegagalan pemrosesan data.

---

## 4. Ketentuan Komponen UI (shadcn/ui & TailwindCSS)

* **Instalasi Komponen**: Komponen baru dari `shadcn/ui` wajib ditambahkan melalui perintah CLI (`npx shadcn@latest add [nama-komponen]`).
* **Modifikasi Gaya**: Perubahan visual komponen dilakukan langsung melalui properti kelas Tailwind (`className`) menggunakan fungsi utilitas `cn()` pada `src/lib/utils.ts`.
* **Desain Responsif**: Gunakan pendekatan *Mobile-First Design*. Gunakan breakpoint Tailwind (`sm:`, `md:`, `lg:`) untuk memastikan tampilan optimal dari layar HP hingga komputer.
* **Optimasi Gambar**: Semua aset visual wajib menggunakan komponen `<Image />` bawaan Next.js untuk menjaga performa kecepatan muat halaman.

---

## 5. Integrasi & Manajemen Data MySQL

* **Manajemen Koneksi (Connection Pooling)**: Klien basis data pada `src/lib/db.ts` harus dikonfigurasi menggunakan pola *singleton* atau *connection pool* untuk mencegah kehabisan slot koneksi ke server MySQL saat proses *live reload* di lingkungan pengembangan.
* **Keamanan Kueri (SQL Injection Prevention)**: Dilarang keras menulis kueri SQL secara mentah (*raw string concatenation*). Gunakan *parameterized queries* atau fitur bawaan dari ORM untuk mencegah celah keamanan SQL Injection.
* **Server-Side Execution**: Operasi kueri basis data (tambah, baca, ubah, hapus) harus dieksekusi di dalam Server Components atau Next.js Server Actions / API Routes. Klien (browser) tidak boleh terhubung langsung ke server MySQL.
* **Manajemen Rahasia (Environment Variables)**: Kredensial URL basis data (`DATABASE_URL`) wajib disimpan dalam berkas `.env.local` dan dilarang keras diunggah ke repositori Git publik.

---

## 6. Alur Kerja Git & Deployment (Vercel)

* **Cabang Utama (Main Branch)**: Cabang `main` dilindungi dan hanya berisi kode yang sudah siap rilis ke server produksi.
* **Fitur Baru**: Pengembangan fitur wajib dikerjakan di cabang terpisah dengan format `feature/nama-fitur`.
* **Proses Pull Request (PR)**: Penggabungan kode ke cabang `main` dilakukan melalui Pull Request setelah lolos pengecekan otomatis *build* pada sistem Vercel Preview.