# Dokumen Desain Sistem (Design Specification) — PasarLokal (GreenSwap)

Dokumen ini menjelaskan spesifikasi desain antarmuka, arsitektur komponen, serta alur data dari aplikasi **PasarLokal** (juga dirujuk sebagai *GreenSwap* dalam komponen internal). Aplikasi ini dirancang sebagai platform perdagangan barang bekas (second-hand) berbasis komunitas di tingkat kabupaten, dengan fokus pada interaksi lokal yang aman (Cash on Delivery/COD) dan ramah lingkungan.

---

## 1. Ikhtisar Sistem (System Overview)

PasarLokal adalah platform web responsif yang mempertemukan penjual dan pembeli lokal. Berbeda dengan e-commerce konvensional yang mengandalkan logistik ekspedisi terpusat, platform ini mengutamakan transaksi langsung di area geografis yang sama (misalnya: Purbalingga, Banjarnegara, dan sekitarnya).

### Karakteristik Utama:
* **Fokus Komunitas**: Filter wilayah yang ketat untuk memastikan barang yang dicari berada dalam jangkauan fisik pengguna.
* **Keamanan Transaksi**: Mendorong metode *Meet & Trade* (COD) di tempat umum guna menghindari penipuan daring.
* **Pendekatan Hijau (*Eco-Friendly*)**: Menggunakan aksen visual hijau (Emerald) untuk merepresentasikan sirkulasi barang bekas yang mendukung keberlanjutan lingkungan.

---

## 2. Palet Warna & Tipografi (Visual Identity)

Sistem desain menggunakan pendekatan modern, bersih, dengan kontras yang ramah di mata menggunakan pustaka CSS **Tailwind v4**.

### Palet Warna (Color Palette)
* **Warna Utama (Primary)**: `emerald-600` (`#059669`) & `emerald-700` (`#047857`) sebagai warna aksen keberlanjutan, tombol utama, dan identitas brand.
* **Warna Latar Belakang (Background)**: `white` (`#ffffff`) dengan variasi area sekunder menggunakan `slate-50` (`#f8fafc`) hingga `slate-100` (`#f1f5f9`).
* **Warna Teks (Typography Colors)**:
    * Teks Utama / Judul: `slate-800` (`#1e293b`) atau `slate-900` (`#0f172a`) untuk keterbacaan tinggi.
    * Teks Sekunder / Keterangan: `slate-400` (`#94a3b8`) & `slate-500` (`#64748b`).
* **Warna Status (Status Colors)**: `red-500` (`#ef4444`) untuk indikator pesan belum terbaca (unread notification) dan `amber-500` (`#f59e0b`) untuk rating bintang.

### Tipografi & Elemen Visual
* **Font Heading**: Bold / Black dengan ukuran proposional (`text-xl` hingga `text-3xl`).
* **Ikonografi**: Menggunakan **Lucide React** (`Leaf`, `MapPin`, `Search`, `MessageSquare`, `PlusCircle`, `User`, `Clock`, `Heart`, `Camera`, `X`, `Banknote`, `LogOut`, `Settings`, `Package`, `CheckCircle`, `Send`, `Phone`).
* **Bentuk Geometris**: Radius sudut melengkung besar (`rounded-2xl`, `rounded-3xl`, `rounded-full`) untuk memberikan kesan bersahabat, modern, dan tidak kaku.

---

## 3. Arsitektur Komponen & Halaman (Component Architecture)

Aplikasi dibangun menggunakan **React** dan **React Router** untuk manajemen navigasi. Berikut adalah rincian halaman-halaman utama berdasarkan berkas sumber daya:

### 3.1. Navbar (`Navbar.tsx`)
Komponen navigasi global yang bersifat *sticky* di bagian atas layar dengan efek *blur backdrop*.
* **Fungsi Utama**:
    * Identitas Brand: Logo daun (`Leaf`) dan teks "PasarLokal".
    * Pencarian: Formulir input teks pencarian (`searchQuery`).
    * Lokasi Aktif: Tombol filter wilayah (Default: "Purbalingga") dengan ikon `MapPin`.
    * Menu Akses Cepat: Tautan langsung ke halaman Obrolan (`/chat`) dengan indikator notifikasi merah, halaman Tambah Barang (`/sell`), dan Profil Pengguna (`/profile`).

### 3.2. Beranda (`Home.tsx`)
Halaman pendaratan utama yang menyajikan ringkasan kategori produk dan daftar barang terbaru.
* **Komponen Internal**:
    * **Kategori Produk**: Grid horizontal yang menampilkan ikon emotikon dan nama kategori (Perabotan `🪑`, Elektronik `💻`, Rumah & Taman `🌿`, Pakaian `👕`, Buku `📚`, Olahraga `⚽`, Mainan `🧸`, Kendaraan `🚗`).
    * **Daftar Produk (Product Grid)**: Menampilkan kartu produk (`MOCK_PRODUCTS`) yang mencakup gambar, judul, harga (Format Rp), lokasi detail, penanda waktu (*timestamp*), dan tombol favorit (`Heart`).
    * **Banner Kepercayaan (Trust Banner)**: Kotak informasi berwarna emerald yang mengedukasi pengguna tentang keamanan COD, obrolan aman, dan verifikasi penjual lokal.

### 3.3. Detail Produk (`ProductDetail.tsx`)
Menampilkan informasi menyeluruh mengenai item tertentu yang dipilih pengguna.
* **Komponen Internal**:
    * **Galeri Gambar**: Menggunakan komponen penangan fallback gambar (`ImageWithFallback`).
    * **Metadata Barang**: Menampilkan judul, harga, lokasi detail, kategori, deskripsi kondisi barang, dan waktu unggah.
    * **Informasi Penjual**: Nama penjual, peringkat (*rating* bintang), *response rate*, dan lama bergabung.
    * **Aksi Utama**: Tombol interaktif langsung menuju ruang obrolan (`Chat Now`) dan tombol simpan ke daftar keinginan (`Heart`).

### 3.4. Sistem Obrolan (`Chat.tsx`)
Ruang komunikasi real-time antara calon pembeli dengan pemilik barang.
* **Komponen Internal**:
    * **Daftar Percakapan (Sidebar)**: List percakapan aktif (`MOCK_CHATS`) yang menampilkan avatar pengguna, nama, pesan terakhir, penanda waktu, nama barang, miniatur gambar barang, serta status pesan belum terbaca (`unread`).
    * **Jendela Pesan Utama**: Area percakapan aktif yang melacak pesan masuk dan keluar lengkap dengan detail produk yang sedang dinegosiasikan di bagian atas (Header Chat). Includes input teks berbentuk melengkung penuh (`rounded-full`) dan tombol kirim pesan.

### 3.5. Unggah Barang (`Sell.tsx`)
Formulir bagi pengguna untuk memasarkan barang bekas mereka ke platform.
* **Komponen Internal**:
    * **Unggah Foto**: Kontainer interaktif berbasis putus-putus (`border-dashed`) dengan ikon kamera untuk menambahkan gambar produk.
    * **Form Isian Data**: Input teks untuk Judul Barang, Kategori (Dropdown), Harga (Angka), Lokasi, dan Deskripsi Kondisi.
    * **Opsi Pembayaran**: Pengaturan bawaan sakelar COD (Ketemu langsung & bayar tunai) untuk menjaga transaksi tetap berada dalam koridor keamanan lokal.

### 3.6. Profil Pengguna (`Profile.tsx`)
Halaman dasbor personal yang merangkum aktivitas akun.
* **Komponen Internal**:
    * **Kartu Identitas**: Menampilkan foto profil, nama pengguna, tanggal bergabung, lokasi regional, serta statistik performa penjualan (Jumlah barang terjual, listing aktif, dan barang yang disimpan).
    * **Manajemen Listing**: Menampilkan grid produk yang sedang dijual oleh pengguna dengan opsi tombol edit, serta kartu khusus "Tambah Barang" yang terhubung langsung ke formulir penjualan.

### 3.7. Autentikasi (`Login.tsx`)
Pintu masuk terpadu yang melayani fungsi Masuk (Sign In) dan Daftar Akun Baru (Sign Up) dalam satu kontainer dinamis berbasis state `isRegister`.
* **Komponen Internal**:
    * Formulir input surel (`Mail`) dan kata sandi (`Lock`).
    * Tombol submit adaptif dengan indikator pemuatan statis (`isLoading`) yang terintegrasi dengan pustaka notifikasi **Sonner** (`toast.success`).
    * Opsi masuk pihak ketiga menggunakan integrasi Google Auth.

---

## 4. Alur Kerja & Interaksi Data (Data & Interaction Flows)

Aplikasi beroperasi sebagai *Single Page Application* (SPA) dengan alur interaksi pengguna sebagai berikut:

```
[ Beranda ] ──► Klik Produk ──► [ Detail Produk ] ──► Klik Chat Now ──► [ Ruang Obrolan ]
     │                                                                          ▲
     ├──► Klik Jual Barang ───────────────────────► [ Formulir Jual ] ──────────┤
     │                                                     │                    │
     └──► Klik Profil Pengguna ──► [ Dasbor Profil ] ──────┴────────────────────┘
```

1.  **Siklus Penemuan Barang**: Pengguna memfilter lokasi via `Navbar`, melihat katalog di `Home`, dan masuk ke `ProductDetail` untuk membaca spesifikasi item.
2.  **Siklus Negosiasi**: Dari `ProductDetail`, pengguna menekan tombol `Chat Now` untuk membuka komponen `Chat` yang langsung memuat referensi produk terkait untuk menegosiasikan titik temu (COD).
3.  **Siklus Pemasaran**: Pengguna yang ingin menjual barang menekan tombol `Jual Barang`, melengkapi formulir di halaman `Sell`, dan barang tersebut otomatis masuk ke dalam daftar listing aktif yang dapat dimonitor pada halaman `Profile`.

---

## 5. Pertimbangan Teknis & Optimasi UI

* **Pencegahan Kegagalan Gambar**: Semua aset visual eksternal dilewatkan melalui komponen pembungkus khusus (`ImageWithFallback`) untuk mencegah tampilan rusak jika tautan eksternal (Unsplash/Pravatar) tidak dapat dimuat.
* **Desain Responsif**: Menggunakan utilitas adaptif Tailwind (seperti kelas `hidden sm:block`, `flex-col md:flex-row`, dan tata letak `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) untuk memastikan aplikasi beroperasi secara mulus pada perangkat ponsel pintar (mobile) maupun komputer desktop.
* **Umpan Balik Instan**: Penggunaan penunda waktu buatan (*simulated API timeout*) pada fungsi submit formulir (`Login` dan `Sell`) dikombinasikan dengan pemanggilan fungsi `toast` dari `sonner` untuk memberikan kepastian status aksi kepada pengguna secara interaktif.