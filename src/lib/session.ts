import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import type { UserProfile } from "@/types"

const SESSION_COOKIE = "session"
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set")
  }
  return new TextEncoder().encode(secret)
}

interface SessionPayload {
  userId: string
  exp?: number
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret())

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    })
    return (payload as unknown as SessionPayload).userId ?? null
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const userId = await getSessionUserId()
  if (!userId) return null

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      location: true,
      rating: true,
      responseRate: true,
      productsSold: true,
      activeListing: true,
      savedItems: true,
      createdAt: true,
    },
  })

  return user as UserProfile | null
}
