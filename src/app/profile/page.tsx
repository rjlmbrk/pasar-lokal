"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  MapPin,
  Calendar,
  Package,
  Heart,
  TrendingUp,
  Edit3,
  PlusCircle,
  LogOut,
  Settings,
  Loader2,
  Trash2,
  CheckCircle,
  X,
} from "lucide-react"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import { formatPrice, formatRelativeTime } from "@/lib/format"
import { toast } from "sonner"
import {
  fetchCurrentUser,
  fetchUserProducts,
  logoutAction,
  deleteProduct,
  updateProductStatus,
  updateProduct,
} from "./actions"
import type { UserProfile, ProductItem } from "@/types"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductItem | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [editCondition, setEditCondition] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"SEMUA" | "LISTING" | "TERJUAL">("SEMUA")

  const filteredProducts = products.filter((p) => {
    if (activeTab === "LISTING") return p.status === "ACTIVE"
    if (activeTab === "TERJUAL") return p.status === "SOLD"
    return true
  })

  const handleLogout = useCallback(async () => {
    await logoutAction()
    window.location.href = "/"
  }, [])

  useEffect(() => {
    async function load() {
      const currentUser = await fetchCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }
      setUser(currentUser)
      const userProducts = await fetchUserProducts(currentUser.id)
      setProducts(userProducts)
      setLoading(false)
    }
    load()
  }, [router])

  if (loading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

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
              onClick={() => setShowLogoutConfirm(true)}
              className="rounded-full border border-slate-200 p-2 text-slate-400 transition-colors hover:border-red-200 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-xl bg-slate-50 p-2 text-center sm:p-3">
            <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-800">
              <Package className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              {user.productsSold}
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400">Terjual</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-2 text-center sm:p-3">
            <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-800">
              <TrendingUp className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              {user.activeListing}
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400">Listing Aktif</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-2 text-center sm:p-3">
            <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-800">
              <Heart className="h-3.5 w-3.5 shrink-0 text-red-400" />
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
            onClick={() => setShowLogoutConfirm(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-red-200 hover:text-red-500"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </div>
      </div>

      {/* Listing Grid */}
      <div className="mt-6">
        <div className="mb-4 flex items-center gap-2">
          {(["SEMUA", "LISTING", "TERJUAL"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {tab === "SEMUA" && "Semua"}
              {tab === "LISTING" && "Listing Aktif"}
              {tab === "TERJUAL" && "Terjual"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
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
                  {product.status === "SOLD" && (
                    <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow">
                      Terjual
                    </div>
                  )}
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
                    onClick={() => {
                      setEditProduct(product)
                      setEditTitle(product.title)
                      setEditPrice(String(product.price))
                      setEditCondition(product.condition)
                      setEditDescription(product.description)
                    }}
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">Keluar Akun?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Anda akan keluar dari akun PasarLokal. Anda dapat masuk kembali
              kapan saja.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Edit Barang</h3>
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Judul</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Harga (Rp)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Kondisi</label>
                <select
                  value={editCondition}
                  onChange={(e) => setEditCondition(e.target.value)}
                  className="h-10 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="Baru">Baru</option>
                  <option value="Baik Sekali">Baik Sekali</option>
                  <option value="Baik">Baik</option>
                  <option value="Cukup">Cukup</option>
                  <option value="Rusak">Rusak</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Deskripsi</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {editProduct.status !== "SOLD" && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={async () => {
                    setSaving(true)
                    const ok = await updateProductStatus(editProduct.id, "SOLD")
                    setSaving(false)
                    if (ok) {
                      toast.success("Barang ditandai sebagai terjual")
                      setProducts((prev) =>
                        prev.map((p) =>
                          p.id === editProduct.id ? { ...p, status: "SOLD" as const } : p
                        )
                      )
                      setEditProduct(null)
                    } else {
                      toast.error("Gagal mengupdate status")
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-200 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  Tandai sebagai Terjual
                </button>
              )}

              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  if (!editTitle.trim()) { toast.error("Judul tidak boleh kosong"); return }
                  setSaving(true)
                  const ok = await updateProduct(editProduct.id, {
                    title: editTitle,
                    price: Number(editPrice),
                    condition: editCondition,
                    description: editDescription,
                  })
                  setSaving(false)
                  if (ok) {
                    toast.success("Barang berhasil diperbarui")
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === editProduct.id
                          ? { ...p, title: editTitle, price: Number(editPrice), condition: editCondition, description: editDescription }
                          : p
                      )
                    )
                    setEditProduct(null)
                  } else {
                    toast.error("Gagal memperbarui barang")
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  if (!window.confirm("Hapus barang ini?")) return
                  setSaving(true)
                  const ok = await deleteProduct(editProduct.id)
                  setSaving(false)
                  if (ok) {
                    toast.success("Barang berhasil dihapus")
                    setProducts((prev) => prev.filter((p) => p.id !== editProduct.id))
                    setEditProduct(null)
                  } else {
                    toast.error("Gagal menghapus barang")
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Barang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
