"use client"

import { useEffect, useState } from "react"
import {
  Leaf,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Loader2,
} from "lucide-react"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import { HeroCarousel } from "@/components/features/HeroCarousel"
import { ProductCard } from "@/components/features/ProductCard"
import { CATEGORIES } from "@/types"
import type { ProductCategory, ProductItem } from "@/types"
import { fetchProducts } from "./actions"
import { getDistance, geocodeLocation } from "@/lib/location"

const DISTANCE_OPTIONS = [
  { label: "Semua jarak", value: 0 },
  { label: "Dalam 5 km", value: 5 },
  { label: "Dalam 10 km", value: 10 },
  { label: "Dalam 20 km", value: 20 },
  { label: "Dalam 30 km", value: 30 },
] as const

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null)
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)
  const [maxDistance, setMaxDistance] = useState(0)
  const [geoCache, setGeoCache] = useState<Record<string, { lat: number; lng: number }>>({})

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false))

    const storedLat = sessionStorage.getItem("locLat")
    const storedLng = sessionStorage.getItem("locLng")
    if (storedLat && storedLng) {
      setUserLat(Number(storedLat))
      setUserLng(Number(storedLng))
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude)
          setUserLng(pos.coords.longitude)
          sessionStorage.setItem("locLat", String(pos.coords.latitude))
          sessionStorage.setItem("locLng", String(pos.coords.longitude))
        },
        () => {},
        { timeout: 10000 }
      )
    }
  }, [])

  async function resolveCoords(p: ProductItem): Promise<{ lat: number; lng: number } | null> {
    if (p.lat != null && p.lng != null) return { lat: p.lat, lng: p.lng }
    if (geoCache[p.location]) return geoCache[p.location]
    const coords = await geocodeLocation(p.location)
    if (coords) {
      setGeoCache((prev) => ({ ...prev, [p.location]: coords }))
      return coords
    }
    return null
  }

  async function isWithinDistance(p: ProductItem): Promise<boolean> {
    if (!maxDistance || userLat == null || userLng == null) return true
    const coords = await resolveCoords(p)
    if (!coords) return false
    const d = getDistance(userLat, userLng, coords.lat, coords.lng)
    return d <= maxDistance
  }

  const [filtered, setFiltered] = useState<ProductItem[]>([])

  useEffect(() => {
    async function filterProducts() {
      const results: ProductItem[] = []
      for (const p of products) {
        const matchCategory = selectedCategory
          ? p.category === selectedCategory
          : true
        if (!matchCategory) continue
        const matchDistance = await isWithinDistance(p)
        if (matchDistance) results.push(p)
      }
      setFiltered(results)
    }
    filterProducts()
  }, [products, selectedCategory, maxDistance, userLat, userLng, geoCache])

  return (
    <>
      <HeroCarousel />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Kategori</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none lg:grid lg:grid-cols-9 lg:gap-3 lg:overflow-visible">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-colors ${
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
                className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-colors ${
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
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {DISTANCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMaxDistance(opt.value)}
                disabled={userLat == null}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  maxDistance === opt.value
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opt.label}
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
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-4xl mb-3">📭</span>
              <p className="text-base font-semibold text-slate-700">Barang tidak tersedia</p>
              <p className="text-sm text-slate-400 mt-1">
                Belum ada barang di kategori ini. Coba kategori lain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
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
    </>
  )
}
