"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2, X, ToggleLeft, ToggleRight } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LocationPicker } from "@/components/features/LocationPicker"
import { CATEGORIES } from "@/types"

const CONDITIONS = [
  { value: "Baru", label: "Baru" },
  { value: "Baik Sekali", label: "Baik Sekali" },
  { value: "Baik", label: "Baik" },
  { value: "Cukup", label: "Cukup" },
  { value: "Rusak", label: "Rusak" },
] as const
import { createProduct } from "./actions"
import { checkAuth } from "@/lib/auth-actions"

export default function SellPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [checking, setChecking] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [cod, setCod] = useState(true)

  useEffect(() => {
    checkAuth().then((res) => {
      if (!res.loggedIn) {
        router.push("/login")
      } else {
        setChecking(false)
      }
    })
  }, [router])

  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [form, setForm] = useState({
    title: "",
    category: "",
    condition: "",
    price: "",
    location: "",
    description: "",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const remaining = 6 - images.length
    const toAdd = files.slice(0, remaining)

    const newPreviews = toAdd.map((f) => URL.createObjectURL(f))
    setImages((prev) => [...prev, ...toAdd])
    setPreviews((prev) => [...prev, ...newPreviews])
    e.target.value = ""
  }

  function handleImageRemove(index: number) {
    URL.revokeObjectURL(previews[index])
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (images.length === 0) {
      toast.error("Tambahkan minimal 1 foto")
      return
    }
    setIsLoading(true)

    const formData = new FormData()
    formData.append("title", form.title)
    formData.append("category", form.category)
    formData.append("condition", form.condition)
    formData.append("price", String(form.price))
    formData.append("location", form.location)
    formData.append("description", form.description)
    formData.append("cod", String(cod))
    images.forEach((file) => formData.append("images", file))

    try {
      const result = await createProduct(formData)

      if (result.success) {
        toast.success(result.message)
        setIsLoading(false)
        router.push("/")
      } else {
        toast.error(result.message)
        setIsLoading(false)
      }
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.")
      setIsLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-xl font-bold text-slate-800">Jual Barang</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <Label className="mb-2 block text-sm font-semibold text-slate-700">
            Foto Barang
          </Label>
          <div className="flex flex-wrap gap-3">
            {previews.map((url, i) => (
              <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={url}
                  alt={`Foto ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(i)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800/60 text-white transition-colors hover:bg-slate-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {images.length < 6 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-colors hover:border-emerald-400 hover:text-emerald-500"
              >
                <Camera className="h-6 w-6" />
                <span className="text-[10px] font-medium">Tambah Foto</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Maksimal 6 foto. Semua format gambar didukung.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
            Judul Barang
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="Contoh: Kursi Kayu Jati Antik"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category" className="text-sm font-semibold text-slate-700">
            Kategori
          </Label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
          >
            <option value="" disabled>
              Pilih kategori
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="price" className="text-sm font-semibold text-slate-700">
              Harga (Rp)
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              placeholder="250000"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <LocationPicker
            value={form.location}
            onChange={(loc) => setForm((prev) => ({ ...prev, location: loc }))}
            label="Lokasi"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="condition" className="text-sm font-semibold text-slate-700">
            Kondisi Barang
          </Label>
          <select
            id="condition"
            name="condition"
            value={form.condition}
            onChange={handleChange}
            required
            className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
          >
            <option value="" disabled>
              Pilih kondisi
            </option>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
            Deskripsi Barang
          </Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Jelaskan kondisi barang, alasan dijual, kelengkapan, dll."
            value={form.description}
            onChange={handleChange}
            required
            className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground md:text-sm"
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Cash on Delivery (COD)
            </p>
            <p className="text-xs text-slate-400">
              Ketemu langsung & bayar tunai di tempat umum
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCod(!cod)}
            className="text-emerald-600 transition-colors hover:text-emerald-700"
          >
            {cod ? (
              <ToggleRight className="h-8 w-8" />
            ) : (
              <ToggleLeft className="h-8 w-8 text-slate-400" />
            )}
          </button>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full rounded-full"
        >
          {isLoading ? "Mengunggah..." : "Pasang Iklan"}
        </Button>
      </form>
    </div>
  )
}
