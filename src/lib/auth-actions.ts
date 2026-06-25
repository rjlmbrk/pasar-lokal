"use server"

import { getSessionUserId } from "@/lib/session"
import { db } from "@/lib/db"

export async function checkAuth(): Promise<{ loggedIn: boolean; name?: string }> {
  const userId = await getSessionUserId()
  if (!userId) return { loggedIn: false }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true },
  })

  return user ? { loggedIn: true, name: user.name } : { loggedIn: false }
}
