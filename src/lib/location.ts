export async function detectLocation(): Promise<{ city: string; lat: number; lng: number }> {
  if (!navigator.geolocation) {
    throw new Error("Geolocation tidak didukung browser ini")
  }

  const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      maximumAge: 300000,
    })
  })

  const { latitude, longitude } = pos.coords
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=id`,
    { headers: { "User-Agent": "PasarLokal/1.0" } }
  )

  if (!res.ok) throw new Error("Gagal mengambil data lokasi")

  const data = await res.json()
  const addr = data.address

  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.county ||
    addr.state ||
    "Lokasi tidak dikenal"

  return { city, lat: latitude, lng: longitude }
}

export async function geocodeLocation(city: string): Promise<{ lat: number; lng: number } | null> {
  try {
    await new Promise((r) => setTimeout(r, Math.random() * 500 + 100))

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&accept-language=id`,
      { headers: { "User-Agent": "PasarLokal/1.0" } }
    )
    if (!res.ok) return null
    const data = await res.json()
    if (data.length === 0) return null
    return { lat: Number(data[0].lat), lng: Number(data[0].lon) }
  } catch {
    return null
  }
}

export function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
