"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Leaf, MapPin, Search, MessageSquare, PlusCircle, User, LogIn } from "lucide-react"
import { detectLocation } from "@/lib/location"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { checkAuth } from "@/lib/auth-actions"
import { fetchUnreadCount } from "@/app/chat/actions"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("Lokasi")
  const [loggedIn, setLoggedIn] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      router.push(`/cari?q=${encodeURIComponent(q)}`)
    }
  }

  async function handleDetectLocation() {
    try {
      const { city, lat, lng } = await detectLocation()
      setLocation(city)
      sessionStorage.setItem("locLat", String(lat))
      sessionStorage.setItem("locLng", String(lng))
    } catch {
      toast.error("Gagal mendeteksi lokasi")
    }
  }

  async function refreshAuth() {
    const res = await checkAuth()
    setLoggedIn(res.loggedIn)
    if (res.loggedIn) {
      fetchUnreadCount().then(setUnreadCount)
    }
  }

  useEffect(() => {
    refreshAuth()
    window.addEventListener("focus", refreshAuth)

    detectLocation()
      .then(({ city, lat, lng }) => {
        setLocation(city)
        sessionStorage.setItem("locLat", String(lat))
        sessionStorage.setItem("locLng", String(lng))
      })
      .catch(() => {})

    return () => window.removeEventListener("focus", refreshAuth)
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Leaf className="h-6 w-6 text-emerald-600" />
          <span className="text-lg font-bold text-slate-900">PasarLokal</span>
        </Link>

        {!isLoginPage && (
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex flex-1 items-center gap-2 rounded-full bg-slate-100 px-4 py-2"
          >
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari barang bekas..."
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </form>
        )}

        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          {!isLoginPage && (
            <button
              type="button"
              onClick={handleDetectLocation}
              className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span className="hidden sm:inline">{location}</span>
            </button>
          )}

          <div className="flex items-center gap-1 sm:gap-2">
          {loggedIn ? (
            <>
              <Link
                href="/chat"
                className={cn(
                  "relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                )}
              >
                <MessageSquare className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link
                href="/sell"
                className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Jual</span>
              </Link>

              <Link
                href="/profile"
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
            </>
          ) : !isLoginPage ? (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Masuk</span>
            </Link>
          ) : null}
        </div>
      </div>
      </div>
    </nav>
  )
}
