"use client"

import { useState } from "react"
import Link from "next/link"
import { Leaf, MapPin, Search, MessageSquare, PlusCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("Purbalingga")

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Leaf className="h-6 w-6 text-emerald-600" />
          <span className="text-lg font-bold text-slate-900">PasarLokal</span>
        </Link>

        <div className="hidden sm:flex flex-1 items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari barang bekas..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
        >
          <MapPin className="h-4 w-4 text-emerald-600" />
          <span className="hidden sm:inline">{location}</span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/chat"
            className={cn(
              "relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            )}
          >
            <MessageSquare className="h-5 w-5" />
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
        </div>
      </div>
    </nav>
  )
}
