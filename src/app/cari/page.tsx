"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, ArrowLeft, Loader2 } from "lucide-react"
import { ProductCard } from "@/components/features/ProductCard"
import type { ProductItem } from "@/types"
import { searchProducts } from "../actions"

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query.trim()) {
      setLoading(false)
      setProducts([])
      return
    }
    setLoading(true)
    searchProducts(query.trim())
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-slate-800">Pencarian</h1>
          {query && (
            <p className="text-sm text-slate-500">
              Hasil untuk &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : !query ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Search className="mb-3 h-12 w-12 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            Cari barang yang kamu butuhkan
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Search className="mb-3 h-12 w-12 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            Tidak ada hasil untuk &ldquo;{query}&rdquo;
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Coba gunakan kata kunci lain
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs text-slate-400">
            Menemukan {products.length} barang
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
