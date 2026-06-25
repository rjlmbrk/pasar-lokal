"use server"

import { getCurrentUser, deleteSession } from "@/lib/session"
import { db } from "@/lib/db"
import type { ProductItem, UserProfile } from "@/types"
import { parseImages } from "@/lib/format"

export async function fetchCurrentUser(): Promise<UserProfile | null> {
  return getCurrentUser()
}

export async function fetchUserProducts(userId: string): Promise<ProductItem[]> {
  const products = await db.product.findMany({
    where: { userId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  })

  return products.map((p) => {
    const images = parseImages(p.images)

    return {
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      condition: p.condition,
      location: p.location,
      lat: p.lat,
      lng: p.lng,
      images,
      cod: p.cod,
      status: p.status,
      user: p.user as unknown as UserProfile,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }
  })
}

export async function logoutAction() {
  await deleteSession()
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  try {
    await db.$transaction(async (tx) => {
      const chats = await tx.chat.findMany({
        where: { productId },
        select: { id: true },
      })
      const chatIds = chats.map((c) => c.id)
      if (chatIds.length > 0) {
        await tx.message.deleteMany({ where: { chatId: { in: chatIds } } })
        await tx.chat.deleteMany({ where: { productId } })
      }
      await tx.product.deleteMany({
        where: { id: productId, userId: user.id },
      })
    })
    return true
  } catch {
    return false
  }
}

export async function updateProductStatus(
  productId: string,
  status: "ACTIVE" | "SOLD" | "HIDDEN"
): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  try {
    if (status === "SOLD") {
      await db.$transaction([
        db.product.update({
          where: { id: productId, userId: user.id },
          data: { status },
        }),
        db.user.update({
          where: { id: user.id },
          data: {
            productsSold: { increment: 1 },
            activeListing: user.activeListing > 0 ? { decrement: 1 } : 0,
          },
        }),
      ])
    } else {
      await db.product.update({
        where: { id: productId, userId: user.id },
        data: { status },
      })
    }
    return true
  } catch {
    return false
  }
}

export async function updateProduct(
  productId: string,
  data: { title: string; price: number; condition: string; description: string }
): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  try {
    await db.product.update({
      where: { id: productId, userId: user.id },
      data: {
        title: data.title,
        price: data.price,
        condition: data.condition,
        description: data.description,
      },
    })
    return true
  } catch {
    return false
  }
}
