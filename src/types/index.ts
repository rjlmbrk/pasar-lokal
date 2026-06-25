export interface UserProfile {
  id: string
  name: string
  email: string
  image: string | null
  location: string
  rating: number
  responseRate: number
  productsSold: number
  activeListing: number
  savedItems: number
  createdAt: Date
}

export interface ProductItem {
  id: string
  title: string
  description: string
  price: number
  category: ProductCategory
  condition: string
  location: string
  lat: number | null
  lng: number | null
  images: string[]
  cod: boolean
  status: ProductStatus
  user: UserProfile
  createdAt: Date
  updatedAt: Date
}

export interface ChatItem {
  id: string
  product: ProductItem
  buyer: UserProfile
  seller: UserProfile
  lastMessage: string | null
  lastMessageAt: Date | null
  unreadCount: number
  createdAt: Date
}

export interface MessageItem {
  id: string
  chatId: string
  senderId: string
  text: string
  unread: boolean
  createdAt: Date
}

export type ProductCategory =
  | "FURNITURE"
  | "ELECTRONICS"
  | "HOME_GARDEN"
  | "CLOTHING"
  | "BOOKS"
  | "SPORTS"
  | "TOYS"
  | "VEHICLES"

export type ProductStatus = "ACTIVE" | "SOLD" | "HIDDEN"

export interface CategoryInfo {
  value: ProductCategory
  label: string
  icon: string
}

export const CATEGORIES: CategoryInfo[] = [
  { value: "FURNITURE", label: "Perabotan", icon: "🪑" },
  { value: "ELECTRONICS", label: "Elektronik", icon: "💻" },
  { value: "HOME_GARDEN", label: "Rumah & Taman", icon: "🌿" },
  { value: "CLOTHING", label: "Pakaian", icon: "👕" },
  { value: "BOOKS", label: "Buku", icon: "📚" },
  { value: "SPORTS", label: "Olahraga", icon: "⚽" },
  { value: "TOYS", label: "Mainan", icon: "🧸" },
  { value: "VEHICLES", label: "Kendaraan", icon: "🚗" },
]
