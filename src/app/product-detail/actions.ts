"use server"

import { db } from "@/lib/db"
import type { ProductItem } from "@/types"
import { parseImages } from "@/lib/format"

export async function fetchProductById(id: string): Promise<ProductItem | null> {
  const p = await db.product.findUnique({
    where: { id },
    include: { user: true },
  })
  if (!p) return null

  const images = parseImages(p.images)

  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    category: p.category as ProductItem["category"],
    condition: p.condition,
    location: p.location,
    lat: p.lat,
    lng: p.lng,
    images,
    cod: p.cod,
    status: p.status as any,
    user: {
      id: p.user.id,
      name: p.user.name,
      email: p.user.email,
      image: p.user.image,
      location: p.user.location,
      rating: p.user.rating,
      responseRate: p.user.responseRate,
      productsSold: p.user.productsSold,
      activeListing: p.user.activeListing,
      savedItems: p.user.savedItems,
      createdAt: p.user.createdAt,
    },
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}
