"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Leaflet default icons via CDN (fix 404 saat di Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})
import { Search, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MapPickerDialogProps {
  onSelect: (location: string) => void
  onClose: () => void
}

export default function MapPickerDialog({ onSelect, onClose }: MapPickerDialogProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [search, setSearch] = useState("")
  const [searching, setSearching] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [results, setResults] = useState<{ lat: string; lon: string; display_name: string }[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [-6.2088, 106.8456],
      zoom: 11,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map)

    map.on("click", async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      placeMarker(lat, lng, map)
    })

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  async function placeMarker(lat: number, lng: number, map?: L.Map) {
    const m = map ?? mapInstanceRef.current
    if (!m) return

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(m)
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=id`,
        { headers: { "User-Agent": "PasarLokal/1.0" } }
      )
      if (res.ok) {
        const data = await res.json()
        setSelectedLocation(data.display_name ?? "Lokasi tidak dikenal")
      }
    } catch {
      /* ignore */
    }
  }

  async function handleSearch() {
    if (!search.trim()) return
    setSearching(true)
    setResults([])

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=5&accept-language=id`,
        { headers: { "User-Agent": "PasarLokal/1.0" } }
      )
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
    } catch {
      /* ignore */
    }
    setSearching(false)
  }

  function selectResult(item: { lat: string; lon: string; display_name: string }) {
    const lat = Number(item.lat)
    const lng = Number(item.lon)
    mapInstanceRef.current?.setView([lat, lng], 16)

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
    } else if (mapInstanceRef.current) {
      markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current)
    }

    setSelectedLocation(item.display_name)
    setResults([])
    setSearch(item.display_name)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">Pilih Alamat</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari alamat atau tempat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearch() } }}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:bg-white"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
            )}
          </div>

          {results.length > 0 && (
            <ul className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white">
              {results.map((item, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => selectResult(item)}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-emerald-50"
                  >
                    {item.display_name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div ref={mapRef} className="h-72 w-full" />

        {selectedLocation && (
          <div className="border-t px-5 py-3">
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-800">Dipilih:</span>{" "}
              {selectedLocation}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t px-5 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="button"
            onClick={() => onSelect(selectedLocation ?? search)}
            disabled={!selectedLocation && !search}
          >
            Konfirmasi
          </Button>
        </div>
      </div>
    </div>
  )
}
