"use server"

import { getCurrentUser, deleteSession } from "@/lib/session"
import { db } from "@/lib/db"
import type { ProductItem, UserProfile } from "@/types"
import { parseImages } from "@/lib/format"
import { processAndSaveImage } from "@/lib/image"

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
      const savedBy = await tx.savedProduct.findMany({
        where: { productId },
        select: { userId: true },
      })
      if (savedBy.length > 0) {
        await tx.savedProduct.deleteMany({ where: { productId } })
        const userIds = [...new Set(savedBy.map((s) => s.userId))]
        await tx.user.updateMany({
          where: { id: { in: userIds } },
          data: { savedItems: { decrement: 1 } },
        })
      }

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

export async function fetchSavedProducts(): Promise<ProductItem[]> {
  const user = await getCurrentUser()
  if (!user) return []

  const saved = await db.savedProduct.findMany({
    where: { userId: user.id },
    include: { product: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  })

  return saved.map((s) => {
    const images = parseImages(s.product.images)
    return {
      id: s.product.id,
      title: s.product.title,
      description: s.product.description,
      price: s.product.price,
      category: s.product.category as ProductItem["category"],
      condition: s.product.condition,
      location: s.product.location,
      lat: s.product.lat,
      lng: s.product.lng,
      images,
      cod: s.product.cod,
      status: s.product.status as ProductItem["status"],
      user: s.product.user as unknown as UserProfile,
      createdAt: s.product.createdAt,
      updatedAt: s.product.updatedAt,
    }
  })
}

export async function updateProfile(formData: FormData): Promise<{ success: boolean; message: string }> {
  const user = await getCurrentUser()
  if (!user) return { success: false, message: "Harus login" }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const location = formData.get("location") as string
  const imageFile = formData.get("image") as File

  if (!name?.trim()) return { success: false, message: "Nama tidak boleh kosong" }
  if (!email?.trim()) return { success: false, message: "Email tidak boleh kosong" }
  if (!location?.trim()) return { success: false, message: "Lokasi tidak boleh kosong" }

  try {
    let imageUrl: string | undefined | null = undefined
    if (imageFile && imageFile.size > 0) {
      imageUrl = await processAndSaveImage(imageFile)
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        email: email.trim(),
        location: location.trim(),
        ...(imageUrl !== undefined ? { image: imageUrl } : {}),
      },
    })

    return { success: true, message: "Profil berhasil diperbarui" }
  } catch (e) {
    console.error("updateProfile error:", e)
    return { success: false, message: "Gagal memperbarui profil" }
  }
}
