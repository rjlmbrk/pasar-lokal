"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { checkAuth } from "@/lib/auth-actions"
import {
  Heart,
  MapPin,
  Clock,
  Banknote,
  MessageSquare,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import { formatPrice, formatRelativeTime } from "@/lib/format"
import { CATEGORIES } from "@/types"
import type { ProductItem } from "@/types"
import { fetchProductById, checkIsSaved, toggleSaveProduct } from "../actions"

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const [product, setProduct] = useState<ProductItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [liked, setLiked] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const goNext = useCallback(() => {
    setSelectedImage((i) => (i + 1) % product!.images.length)
  }, [product])

  const goPrev = useCallback(() => {
    setSelectedImage((i) => (i - 1 + product!.images.length) % product!.images.length)
  }, [product])

  useEffect(() => {
    if (!lightboxOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false)
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lightboxOpen, goNext, goPrev])

  useEffect(() => {
    Promise.all([
      fetchProductById(params.id),
      checkIsSaved(params.id),
    ]).then(([result, saved]) => {
      setProduct(result)
      setLiked(saved)
      setLoading(false)
    })
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-semibold text-slate-800">Barang tidak ditemukan</p>
        <Link
          href="/"
          className="mt-3 text-sm font-medium text-emerald-600 hover:underline"
        >
          Kembali ke Beranda
        </Link>
      </div>
    )
  }

  const categoryLabel =
    CATEGORIES.find((c) => c.value === product.category)?.label ??
    product.category

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Kembali
      </Link>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="md:col-span-1 lg:col-span-3">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100"
          >
            <ImageWithFallback
              src={product.images[selectedImage]}
              alt={product.title}
              fill
              className="object-cover"
              fallbackText={product.title[0]}
            />
          </button>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                    i === selectedImage
                      ? "border-emerald-500"
                      : "border-transparent"
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 md:col-span-1 lg:col-span-2">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {product.title}
            </h1>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {product.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatRelativeTime(product.createdAt)}
            </span>
            {product.cod && (
              <span className="flex items-center gap-1">
                <Banknote className="h-3.5 w-3.5" />
                COD
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {categoryLabel}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {product.condition}
            </span>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-semibold text-slate-700">
              Deskripsi
            </h4>
            <p className="text-sm leading-relaxed text-slate-500 whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={product.user.image ?? ""}
                alt={product.user.name}
                width={44}
                height={44}
                className="rounded-full object-cover"
                fallbackText={product.user.name[0]}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {product.user.name}
                </p>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{product.user.rating}</span>
                  <span className="mx-1">•</span>
                  <span>{product.user.responseRate}% respons</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={async () => {
                const auth = await checkAuth()
                if (auth.loggedIn) {
                  window.location.href = `/chat?product=${product.id}&seller=${product.user.id}`
                } else {
                  window.location.href = `/login?redirect=${encodeURIComponent(`/chat?product=${product.id}&seller=${product.user.id}`)}`
                }
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <MessageSquare className="h-4 w-4" />
              Chat Now
            </button>
            <button
              type="button"
              onClick={async () => {
                const auth = await checkAuth()
                if (!auth.loggedIn) {
                  window.location.href = `/login?redirect=${encodeURIComponent(`/product-detail/${product.id}`)}`
                  return
                }
                const result = await toggleSaveProduct(product.id)
                if ("error" in result) {
                  return
                }
                setLiked(result.saved)
              }}
              className="flex items-center justify-center rounded-full border border-slate-200 p-3 transition-colors hover:border-emerald-200"
            >
              <Heart
                className={`h-5 w-5 ${
                  liked
                    ? "fill-red-500 text-red-500"
                    : "text-slate-500"
                }`}
              />
            </button>
          </div>

          {product.cod && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>
                Transaksi aman via COD. Bertemu langsung di tempat umum yang sudah
                disepakati.
              </span>
            </div>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          >
            <X className="h-5 w-5" />
          </button>

          {product.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                className="absolute left-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext() }}
                className="absolute right-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageWithFallback
              src={product.images[selectedImage]}
              alt={product.title}
              width={1200}
              height={900}
              className="h-auto max-h-[90vh] w-auto max-w-[90vw] rounded-lg object-contain"
              fallbackText={product.title[0]}
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {selectedImage + 1} / {product.images.length}
          </div>
        </div>
      )}
    </div>
  )
}
