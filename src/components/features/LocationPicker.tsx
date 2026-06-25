"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { MapPin, Map } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MapPickerDialog = dynamic(() => import("./MapPickerDialog"), { ssr: false })

interface LocationPickerProps {
  value: string
  onChange: (value: string) => void
  error?: string
  label?: string
}

export function LocationPicker({ value, onChange, error, label = "Alamat Rumah" }: LocationPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="location">{label}</Label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="location"
          name="location"
          type="text"
          placeholder="Cari alamat atau pilih dari peta"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-8 pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground"
          title="Pilih dari peta"
        >
          <Map className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {open && (
        <MapPickerDialog
          onSelect={(loc) => {
            onChange(loc)
            setOpen(false)
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
