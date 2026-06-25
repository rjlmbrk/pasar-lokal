import { put } from "@vercel/blob"
import sharp from "sharp"
import { randomUUID } from "crypto"

export async function processAndSaveImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${randomUUID()}.avif`

  const processed = await sharp(buffer)
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .avif({ quality: 50 })
    .toBuffer()

  const blob = await put(`uploads/products/${filename}`, processed, {
    access: "public",
  })

  return blob.url
}
