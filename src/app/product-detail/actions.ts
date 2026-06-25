"use server"

import { db } from "@/lib/db"
import { getSessionUserId } from "@/lib/session"
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

export async function checkIsSaved(productId: string): Promise<boolean> {
  const userId = await getSessionUserId()
  if (!userId) return false

  const saved = await db.savedProduct.findUnique({
    where: { userId_productId: { userId, productId } },
  })
  return saved !== null
}

export async function toggleSaveProduct(productId: string): Promise<{ saved: boolean } | { error: string }> {
  const userId = await getSessionUserId()
  if (!userId) return { error: "Harus login terlebih dahulu" }

  const existing = await db.savedProduct.findUnique({
    where: { userId_productId: { userId, productId } },
  })

  if (existing) {
    await db.$transaction([
      db.savedProduct.delete({ where: { id: existing.id } }),
      db.user.update({
        where: { id: userId },
        data: { savedItems: { decrement: 1 } },
      }),
    ])
    return { saved: false }
  } else {
    await db.$transaction([
      db.savedProduct.create({ data: { userId, productId } }),
      db.user.update({
        where: { id: userId },
        data: { savedItems: { increment: 1 } },
      }),
    ])
    return { saved: true }
  }
}
