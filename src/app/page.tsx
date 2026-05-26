"use client"

import { useState } from "react"
import {
  Leaf,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Heart,
  ChevronRight,
} from "lucide-react"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import { ProductCard } from "@/components/features/ProductCard"
import {
  MOCK_PRODUCTS,
  formatPrice,
  formatRelativeTime,
} from "@/lib/mock-data"
import { CATEGORIES } from "@/types"
import type { ProductCategory } from "@/types"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null)

  const filtered = selectedCategory
    ? MOCK_PRODUCTS.filter((p) => p.category === selectedCategory)
    : MOCK_PRODUCTS

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Kategori</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`flex shrink-0 flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-colors ${
              selectedCategory === null
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-emerald-200"
            }`}
          >
            <span className="text-xl">✨</span>
            <span className="whitespace-nowrap text-xs font-medium">Semua</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex shrink-0 flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-colors ${
                selectedCategory === cat.value
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-emerald-200"
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="whitespace-nowrap text-xs font-medium">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            {selectedCategory
              ? CATEGORIES.find((c) => c.value === selectedCategory)?.label
              : "Barang Terbaru"}
          </h2>
          <span className="text-xs text-slate-400">
            {filtered.length} barang
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-5 text-white sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-5 w-5" />
          <h3 className="font-bold">Aman Bertransaksi di PasarLokal</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Meet & Trade (COD)</p>
              <p className="text-xs text-emerald-100">
                Bertemu langsung di tempat umum yang aman
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
              <MessageSquare className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Obrolan Langsung</p>
              <p className="text-xs text-emerald-100">
                Negosiasi harga via chat tanpa data pribadi
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Leaf className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Hijau & Ramah Lingkungan</p>
              <p className="text-xs text-emerald-100">
                Setiap barang bekas terjaga mengurangi limbah
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
