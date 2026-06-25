export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (hours < 1) return "Baru saja"
  if (hours < 24) return `${hours} jam lalu`
  if (days < 7) return `${days} hari lalu`
  if (weeks < 4) return `${weeks} minggu lalu`
  return `${months} bulan lalu`
}

export function parseImages(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
