"use client"

import Link from "next/link"
import { Heart, MapPin } from "lucide-react"
import { useState } from "react"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import { formatPrice, formatRelativeTime } from "@/lib/format"
import type { ProductItem } from "@/types"

interface ProductCardProps {
  product: ProductItem
}

export function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(false)

  return (
    <Link
      href={`/product-detail/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 transition-all hover:shadow-md hover:ring-emerald-200"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fallbackText={product.title[0]}
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setLiked(!liked)
          }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              liked ? "fill-red-500 text-red-500" : "text-slate-500"
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-slate-800">
          {product.title}
        </h3>

        <p className="text-base font-bold text-emerald-600">
          {formatPrice(product.price)}
        </p>

        <div className="flex items-center gap-1 text-xs text-slate-400">
          <MapPin className="h-3 w-3" />
          <span>{product.location}</span>
        </div>

        <span className="text-xs text-slate-400">
          {formatRelativeTime(product.createdAt)}
        </span>
      </div>
    </Link>
  )
}
