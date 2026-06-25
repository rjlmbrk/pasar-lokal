import type { ProductItem, ChatItem, MessageItem, UserProfile } from "@/types"

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
    lat: null,
    lng: null,
    images: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=600&h=400&fit=crop",
    ],
    cod: true,
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
    lat: null,
    lng: null,
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop",
    ],
    cod: true,
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
    lat: null,
    lng: null,
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=400&fit=crop",
    ],
    cod: true,
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
    lat: null,
    lng: null,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=400&fit=crop",
    ],
    cod: true,
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
    lat: null,
    lng: null,
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop",
    ],
    cod: true,
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
    lat: null,
    lng: null,
    images: [
      "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&h=400&fit=crop",
    ],
    cod: true,
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
    lat: null,
    lng: null,
    images: [
      "https://images.unsplash.com/photo-1559454403-b76e3f0ef104?w=600&h=400&fit=crop",
    ],
    cod: true,
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
    lat: null,
    lng: null,
    images: [
      "https://images.unsplash.com/photo-1558980664-10a60c5f82a9?w=600&h=400&fit=crop",
    ],
    cod: true,
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

export const CURRENT_USER: UserProfile = {
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
}

export const MOCK_CHATS: ChatItem[] = [
  {
    id: "c1",
    product: MOCK_PRODUCTS[1],
    buyer: MOCK_PRODUCTS[1].user,
    seller: CURRENT_USER,
    lastMessage: "Baik, kalau gitu saya ambil besok ya",
    lastMessageAt: hoursAgo(1),
    unreadCount: 2,
    createdAt: hoursAgo(24),
  },
  {
    id: "c2",
    product: MOCK_PRODUCTS[2],
    buyer: CURRENT_USER,
    seller: MOCK_PRODUCTS[2].user,
    lastMessage: "Masih ada minat?",
    lastMessageAt: hoursAgo(3),
    unreadCount: 0,
    createdAt: hoursAgo(48),
  },
  {
    id: "c3",
    product: MOCK_PRODUCTS[4],
    buyer: CURRENT_USER,
    seller: MOCK_PRODUCTS[4].user,
    lastMessage: "Oke deal, ketemu jam 3",
    lastMessageAt: hoursAgo(6),
    unreadCount: 0,
    createdAt: daysAgo(3),
  },
  {
    id: "c4",
    product: MOCK_PRODUCTS[0],
    buyer: MOCK_PRODUCTS[0].user,
    seller: CURRENT_USER,
    lastMessage: "Harga bisa kurang?",
    lastMessageAt: daysAgo(2),
    unreadCount: 0,
    createdAt: daysAgo(7),
  },
]

export const MOCK_MESSAGES: Record<string, MessageItem[]> = {
  c1: [
    {
      id: "m1",
      chatId: "c1",
      senderId: "u2",
      text: "Halo, apakah MacBook ini masih tersedia?",
      unread: false,
      createdAt: hoursAgo(6),
    },
    {
      id: "m2",
      chatId: "c1",
      senderId: "u1",
      text: "Masih ada kak. Masih mulus dan berfungsi normal.",
      unread: false,
      createdAt: hoursAgo(5),
    },
    {
      id: "m3",
      chatId: "c1",
      senderId: "u2",
      text: "Apakah harganya bisa nego? Saya minat kalau 7jt",
      unread: false,
      createdAt: hoursAgo(3),
    },
    {
      id: "m4",
      chatId: "c1",
      senderId: "u1",
      text: "7.2jt ya, soalnya masih boneng charger original.",
      unread: false,
      createdAt: hoursAgo(2),
    },
    {
      id: "m5",
      chatId: "c1",
      senderId: "u2",
      text: "Baik, kalau gitu saya ambil besok ya",
      unread: true,
      createdAt: hoursAgo(1),
    },
    {
      id: "m6",
      chatId: "c1",
      senderId: "u2",
      text: "Ketemu di alun-alun Purbalingga jam 10 ya",
      unread: true,
      createdAt: hoursAgo(1),
    },
  ],
  c2: [
    {
      id: "m7",
      chatId: "c2",
      senderId: "u1",
      text: "Halo, pot bunganya masih ada?",
      unread: false,
      createdAt: hoursAgo(24),
    },
    {
      id: "m8",
      chatId: "c2",
      senderId: "u3",
      text: "Masih ada kak. Masih banyak stok",
      unread: false,
      createdAt: hoursAgo(20),
    },
    {
      id: "m9",
      chatId: "c2",
      senderId: "u3",
      text: "Masih ada minat?",
      unread: false,
      createdAt: hoursAgo(3),
    },
  ],
  c3: [
    {
      id: "m10",
      chatId: "c3",
      senderId: "u1",
      text: "Halo, buku Pram nya masih dijual?",
      unread: false,
      createdAt: daysAgo(3),
    },
    {
      id: "m11",
      chatId: "c3",
      senderId: "u5",
      text: "Masih. Saya jual 45rb",
      unread: false,
      createdAt: daysAgo(3),
    },
    {
      id: "m12",
      chatId: "c3",
      senderId: "u1",
      text: "40rb gimana?",
      unread: false,
      createdAt: daysAgo(3),
    },
    {
      id: "m13",
      chatId: "c3",
      senderId: "u5",
      text: "Oke deal, ketemu jam 3",
      unread: false,
      createdAt: hoursAgo(6),
    },
  ],
  c4: [
    {
      id: "m14",
      chatId: "c4",
      senderId: "u4",
      text: "Halo, kursinya masih ada?",
      unread: false,
      createdAt: daysAgo(7),
    },
    {
      id: "m15",
      chatId: "c4",
      senderId: "u1",
      text: "Masih kak",
      unread: false,
      createdAt: daysAgo(6),
    },
    {
      id: "m16",
      chatId: "c4",
      senderId: "u4",
      text: "Harga bisa kurang?",
      unread: false,
      createdAt: daysAgo(2),
    },
  ],
}

export function getChatById(id: string): ChatItem | undefined {
  return MOCK_CHATS.find((c) => c.id === id)
}

export function getMessagesByChatId(chatId: string): MessageItem[] {
  return MOCK_MESSAGES[chatId] ?? []
}

export function getUserProducts(userId: string): ProductItem[] {
  return MOCK_PRODUCTS.filter((p) => p.user.id === userId)
}
