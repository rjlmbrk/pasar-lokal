"use client"

import Link from "next/link"
import {
  UserIcon,
  MapPin,
  Calendar,
  Package,
  Heart,
  TrendingUp,
  Edit3,
  PlusCircle,
  LogOut,
  Settings,
} from "lucide-react"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import {
  CURRENT_USER,
  getUserProducts,
  formatPrice,
  formatRelativeTime,
} from "@/lib/mock-data"

export default function ProfilePage() {
  const user = CURRENT_USER
  const userProducts = getUserProducts(user.id)

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Identity Card */}
      <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 sm:p-6">
        <div className="flex items-start gap-4 sm:items-center">
          <ImageWithFallback
            src={user.image ?? ""}
            alt={user.name}
            width={64}
            height={64}
            className="rounded-full object-cover"
            fallbackText={user.name[0]}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-800">{user.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {user.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Bergabung{" "}
                {formatRelativeTime(user.createdAt)}
              </span>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              className="rounded-full border border-slate-200 p-2 text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-600"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 p-2 text-slate-400 transition-colors hover:border-red-200 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-800">
              <Package className="h-3.5 w-3.5 text-emerald-500" />
              {user.productsSold}
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400">Terjual</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-800">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              {user.activeListing}
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400">Listing Aktif</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-800">
              <Heart className="h-3.5 w-3.5 text-red-400" />
              {user.savedItems}
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400">Disimpan</p>
          </div>
        </div>

        {/* Settings/Logout for mobile */}
        <div className="mt-3 flex items-center gap-2 sm:hidden">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-slate-300"
          >
            <Settings className="h-3.5 w-3.5" />
            Pengaturan
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-red-200 hover:text-red-500"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </div>
      </div>

      {/* Listing Grid */}
      <div className="mt-6">
        <h2 className="mb-4 text-base font-bold text-slate-800">
          Barang Saya
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {userProducts.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 transition-all hover:shadow-md"
            >
              <Link href={`/product-detail/${product.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <ImageWithFallback
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    fallbackText={product.title[0]}
                  />
                </div>
              </Link>

              <div className="flex flex-col gap-1 p-3">
                <h3 className="line-clamp-1 text-sm font-semibold text-slate-800">
                  {product.title}
                </h3>
                <p className="text-base font-bold text-emerald-600">
                  {formatPrice(product.price)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {formatRelativeTime(product.createdAt)}
                  </span>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-[10px] font-medium text-slate-400 transition-colors hover:text-emerald-600"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Item Card */}
          <Link
            href="/sell"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition-colors hover:border-emerald-400 hover:bg-emerald-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <PlusCircle className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">Tambah Barang</p>
            <p className="text-center text-[10px] text-slate-400">
              Pasang iklan barang bekas Anda
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
