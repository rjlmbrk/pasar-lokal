"use server"

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export interface ActionResult {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export async function registerUser(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const location = formData.get("location") as string

  const errors: Record<string, string> = {}

  if (!name || name.trim().length < 2) {
    errors.name = "Nama minimal 2 karakter"
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Format email tidak valid"
  }
  if (!password || password.length < 8) {
    errors.password = "Kata sandi minimal 8 karakter"
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = "Kata sandi tidak cocok"
  }
  if (!location || location.trim().length < 2) {
    errors.location = "Lokasi wajib diisi"
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Validasi gagal", errors }
  }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return {
      success: false,
      message: "Email sudah terdaftar",
      errors: { email: "Email sudah digunakan" },
    }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await db.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      location: location.trim(),
    },
  })

  return { success: true, message: "Akun berhasil dibuat! Silakan masuk." }
}

export async function loginUser(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const errors: Record<string, string> = {}

  if (!email) errors.email = "Email wajib diisi"
  if (!password) errors.password = "Kata sandi wajib diisi"

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Validasi gagal", errors }
  }

  const user = await db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  })

  if (!user) {
    return {
      success: false,
      message: "Email atau kata sandi salah",
      errors: { email: "Email atau kata sandi salah" },
    }
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return {
      success: false,
      message: "Email atau kata sandi salah",
      errors: { password: "Email atau kata sandi salah" },
    }
  }

  return { success: true, message: "Berhasil masuk ke PasarLokal!" }
}
