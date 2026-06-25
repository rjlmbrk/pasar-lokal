"use server"

import { db } from "@/lib/db"
import { getSessionUserId } from "@/lib/session"
import { geocodeLocation } from "@/lib/location"
import { processAndSaveImage } from "@/lib/image"

export async function createProduct(formData: FormData) {
  try {
    const userId = await getSessionUserId()
    if (!userId) {
      return { success: false, message: "Harus login terlebih dahulu" }
    }

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return { success: false, message: "Akun tidak ditemukan" }
    }

    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const condition = formData.get("condition") as string
    const price = Number(formData.get("price"))
    const location = formData.get("location") as string
    const description = formData.get("description") as string
    const cod = formData.get("cod") === "true"
    const latRaw = formData.get("lat")
    const lngRaw = formData.get("lng")

    let lat = latRaw ? Number(latRaw) : null
    let lng = lngRaw ? Number(lngRaw) : null
    if (lat == null || lng == null) {
      const coords = await geocodeLocation(location)
      lat = coords?.lat ?? null
      lng = coords?.lng ?? null
    }

    const imageFiles = formData.getAll("images") as File[]
    if (imageFiles.length === 0) {
      return { success: false, message: "Tambahkan minimal 1 foto" }
    }

    const imagePaths = await Promise.all(
      imageFiles.map((file) => processAndSaveImage(file))
    )

    await db.$transaction([
      db.product.create({
        data: {
          title,
          description,
          price,
          category: category as any,
          condition,
          location,
          cod,
          lat,
          lng,
          images: JSON.stringify(imagePaths),
          userId,
        },
      }),
      db.user.update({
        where: { id: userId },
        data: { activeListing: { increment: 1 } },
      }),
    ])

    return { success: true, message: "Barang berhasil diunggah!" }
  } catch (error) {
    console.error("createProduct error:", error)
    return { success: false, message: "Terjadi kesalahan server. Coba lagi." }
  }
}
