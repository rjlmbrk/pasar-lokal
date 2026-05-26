import type { ProductItem } from "@/types"

const NOW = new Date("2026-05-26T10:00:00Z")

function hoursAgo(h: number): Date {
  return new Date(NOW.getTime() - h * 3_600_000)
}

function daysAgo(d: number): Date {
  return new Date(NOW.getTime() - d * 86_400_000)
}

export const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: "p1",
    title: "Kursi Kayu Jati Antik",
    description:
      "Kursi kayu jati asli kondisi masih sangat bagus. Sudah di-finishing ulang. Cocok untuk ruang tamu atau teras.",
    price: 250000,
    category: "FURNITURE",
    condition: "Baik",
    location: "Purbalingga Kota",
    images: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=600&h=400&fit=crop",
    ],
    status: "ACTIVE",
    user: {
      id: "u1",
      name: "Budi Santoso",
      email: "budi@example.com",
      image: "https://i.pravatar.cc/150?u=budi",
      location: "Purbalingga",
      rating: 4.8,
      responseRate: 95,
      productsSold: 12,
      activeListing: 5,
      savedItems: 3,
      createdAt: daysAgo(180),
    },
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
  },
  {
    id: "p2",
    title: "MacBook Air M1 2020",
    description:
      "MacBook Air M1 8GB/256GB. Masih terawat, baterai 92%. Sudah tidak dipakai karena upgrade. Bonus charger original.",
    price: 7500000,
    category: "ELECTRONICS",
    condition: "Baik Sekali",
    location: "Bobotsari",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop",
    ],
    status: "ACTIVE",
    user: {
      id: "u2",
      name: "Siti Rahayu",
      email: "siti@example.com",
      image: "https://i.pravatar.cc/150?u=siti",
      location: "Bobotsari",
      rating: 4.9,
      responseRate: 98,
      productsSold: 8,
      activeListing: 3,
      savedItems: 5,
      createdAt: daysAgo(365),
    },
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(5),
  },
  {
    id: "p3",
    title: "Pot Bunga Besar Keramik",
    description:
      "Pot bunga keramik diameter 40cm. Cocok untuk tanaman hias outdoor. Kondisi mulus, tidak retak.",
    price: 85000,
    category: "HOME_GARDEN",
    condition: "Sangat Baik",
    location: "Karangmoncol",
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=400&fit=crop",
    ],
    status: "ACTIVE",
    user: {
      id: "u3",
      name: "Ahmad Fauzi",
      email: "ahmad@example.com",
      image: "https://i.pravatar.cc/150?u=ahmad",
      location: "Karangmoncol",
      rating: 4.7,
      responseRate: 90,
      productsSold: 6,
      activeListing: 4,
      savedItems: 2,
      createdAt: daysAgo(120),
    },
    createdAt: hoursAgo(8),
    updatedAt: hoursAgo(8),
  },
  {
    id: "p4",
    title: "Jaket Denim Vintage Levi's",
    description:
      "Jaket denim original Levi's ukuran L. Kondisi 8/10, warna masih bagus, tidak luntur. Cocok untuk gaya kasual.",
    price: 175000,
    category: "CLOTHING",
    condition: "Baik",
    location: "Kutasari",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=400&fit=crop",
    ],
    status: "ACTIVE",
    user: {
      id: "u4",
      name: "Dewi Lestari",
      email: "dewi@example.com",
      image: "https://i.pravatar.cc/150?u=dewi",
      location: "Kutasari",
      rating: 4.6,
      responseRate: 88,
      productsSold: 15,
      activeListing: 7,
      savedItems: 4,
      createdAt: daysAgo(200),
    },
    createdAt: hoursAgo(12),
    updatedAt: hoursAgo(12),
  },
  {
    id: "p5",
    title: "Buku Kumpulan Cerpen Pramoedya",
    description:
      "Buku kumpulan cerpen Pramoedya Ananta Toer. Edisi lama, koleksi pribadi. Masih layak baca, tidak robek.",
    price: 45000,
    category: "BOOKS",
    condition: "Cukup",
    location: "Bukateja",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop",
    ],
    status: "ACTIVE",
    user: {
      id: "u5",
      name: "Rudi Hermawan",
      email: "rudi@example.com",
      image: "https://i.pravatar.cc/150?u=rudi",
      location: "Bukateja",
      rating: 4.5,
      responseRate: 85,
      productsSold: 20,
      activeListing: 10,
      savedItems: 6,
      createdAt: daysAgo(300),
    },
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "p6",
    title: "Sepeda Gunung Polygon Xtrada",
    description:
      "Polygon Xtrada 4 ukuran 29er. Frame aluminium, disk brake. Baru ganti ban belakang. Siap pakai untuk trail.",
    price: 3200000,
    category: "SPORTS",
    condition: "Baik",
    location: "Pengadegan",
    images: [
      "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&h=400&fit=crop",
    ],
    status: "ACTIVE",
    user: {
      id: "u1",
      name: "Budi Santoso",
      email: "budi@example.com",
      image: "https://i.pravatar.cc/150?u=budi",
      location: "Purbalingga",
      rating: 4.8,
      responseRate: 95,
      productsSold: 12,
      activeListing: 5,
      savedItems: 3,
      createdAt: daysAgo(180),
    },
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: "p7",
    title: "Boneka Beruang Besar 1 Meter",
    description:
      "Boneka beruang tinggi 1 meter. Masih bersih, tidak ada sobekan. Cocok untuk hadiah atau koleksi.",
    price: 120000,
    category: "TOYS",
    condition: "Sangat Baik",
    location: "Kemangkon",
    images: [
      "https://images.unsplash.com/photo-1559454403-b76e3f0ef104?w=600&h=400&fit=crop",
    ],
    status: "ACTIVE",
    user: {
      id: "u4",
      name: "Dewi Lestari",
      email: "dewi@example.com",
      image: "https://i.pravatar.cc/150?u=dewi",
      location: "Kutasari",
      rating: 4.6,
      responseRate: 88,
      productsSold: 15,
      activeListing: 7,
      savedItems: 4,
      createdAt: daysAgo(200),
    },
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: "p8",
    title: "Honda Beat 2018",
    description:
      "Honda Beat tahun 2018, pajak hidup. Kondisi mesin sehat, oli rutin diganti. Cocok untuk harian.",
    price: 8500000,
    category: "VEHICLES",
    condition: "Baik",
    location: "Karanganyar",
    images: [
      "https://images.unsplash.com/photo-1558980664-10a60c5f82a9?w=600&h=400&fit=crop",
    ],
    status: "ACTIVE",
    user: {
      id: "u5",
      name: "Rudi Hermawan",
      email: "rudi@example.com",
      image: "https://i.pravatar.cc/150?u=rudi",
      location: "Bukateja",
      rating: 4.5,
      responseRate: 85,
      productsSold: 20,
      activeListing: 10,
      savedItems: 6,
      createdAt: daysAgo(300),
    },
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
]

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatRelativeTime(date: Date): string {
  const diff = NOW.getTime() - date.getTime()
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (hours < 1) return "Baru saja"
  if (hours < 24) return `${hours} jam lalu`
  if (days < 7) return `${days} hari lalu`
  if (weeks < 4) return `${weeks} minggu lalu`
  return `${months} bulan lalu`
}

export function getProductById(id: string): ProductItem | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id)
}
