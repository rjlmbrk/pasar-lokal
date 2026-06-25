"use client"

import { useState, useEffect } from "react"
import { Leaf, ShieldCheck, MessageSquare, Users } from "lucide-react"

const slides = [
  {
    icon: Leaf,
    title: "Selamat Datang di PasarLokal",
    description: "Tempat terbaik untuk jual beli barang bekas berkualitas di sekitar Purbalingga. Hemat uang, kurangi limbah.",
    bg: "from-emerald-600 to-emerald-800",
  },
  {
    icon: Users,
    title: "Jual Beli Mudah & Cepat",
    description: "Temukan barang second berkualitas atau jual barang tidak terpakaimu. Semua transaksi dilakukan langsung dengan pembeli di sekitar.",
    bg: "from-teal-600 to-teal-800",
  },
  {
    icon: ShieldCheck,
    title: "Bertransaksi dengan Aman",
    description: "Gunakan fitur chat untuk negosiasi, lakukan Meet & Trade (COD) di tempat umum, dan nikmati pengalaman jual beli yang aman dan nyaman.",
    bg: "from-emerald-600 to-teal-800",
  },
  {
    icon: MessageSquare,
    title: "Negosiasi Langsung Lewat Chat",
    description: "Tawar harga, tanyakan kondisi barang, dan atur pertemuan semuanya lewat fitur obrolan langsung tanpa perlu bertukar nomor pribadi.",
    bg: "from-teal-600 to-emerald-800",
  },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 7000)
    return () => clearInterval(id)
  }, [isPaused])

  return (
    <div
      className="relative mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${slide.bg} flex items-center gap-5 min-h-[180px] sm:min-h-[220px] py-8 sm:py-12 px-5 sm:px-8 text-white transition-opacity duration-500 ${
              i === current ? "opacity-100" : "opacity-0 absolute inset-0"
            }`}
            aria-hidden={i !== current}
          >
            <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20">
              <slide.icon className="h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <slide.icon className="h-5 w-5 sm:hidden" />
                <h2 className="font-bold text-base sm:text-lg">{slide.title}</h2>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                {slide.description}
              </p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
