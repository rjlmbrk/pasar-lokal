"use server"

import { db } from "@/lib/db"
import { getSessionUserId } from "@/lib/session"
import type { ChatItem, MessageItem, UserProfile } from "@/types"
import { parseImages } from "@/lib/format"

export async function getCurrentUserId(): Promise<string | null> {
  return getSessionUserId()
}

export async function fetchChats(): Promise<ChatItem[]> {
  const userId = await getSessionUserId()
  if (!userId) return []

  const chats = await db.chat.findMany({
    where: {
      OR: [
        { buyerId: userId, deletedByBuyer: false },
        { sellerId: userId, deletedBySeller: false },
      ],
    },
    include: {
      product: { include: { user: true } },
      buyer: true,
      seller: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  return chats.map((c) => {
    const unreadCount = 0 // todo: implement unread logic

    return {
      id: c.id,
      product: {
        id: c.product.id,
        title: c.product.title,
        description: c.product.description,
        price: c.product.price,
        category: c.product.category as ChatItem["product"]["category"],
        condition: c.product.condition,
        location: c.product.location,
        lat: c.product.lat,
        lng: c.product.lng,
        images: parseImages(c.product.images),
        cod: c.product.cod,
        status: c.product.status as any,
        user: {
          id: c.product.user.id,
          name: c.product.user.name,
          email: c.product.user.email,
          image: c.product.user.image,
          location: c.product.user.location,
          rating: c.product.user.rating,
          responseRate: c.product.user.responseRate,
          productsSold: c.product.user.productsSold,
          activeListing: c.product.user.activeListing,
          savedItems: c.product.user.savedItems,
          createdAt: c.product.user.createdAt,
        },
        createdAt: c.product.createdAt,
        updatedAt: c.product.updatedAt,
      },
      buyer: {
        id: c.buyer.id,
        name: c.buyer.name,
        email: c.buyer.email,
        image: c.buyer.image,
        location: c.buyer.location,
        rating: c.buyer.rating,
        responseRate: c.buyer.responseRate,
        productsSold: c.buyer.productsSold,
        activeListing: c.buyer.activeListing,
        savedItems: c.buyer.savedItems,
        createdAt: c.buyer.createdAt,
      },
      seller: {
        id: c.seller.id,
        name: c.seller.name,
        email: c.seller.email,
        image: c.seller.image,
        location: c.seller.location,
        rating: c.seller.rating,
        responseRate: c.seller.responseRate,
        productsSold: c.seller.productsSold,
        activeListing: c.seller.activeListing,
        savedItems: c.seller.savedItems,
        createdAt: c.seller.createdAt,
      },
      lastMessage: c.messages[0]?.text ?? null,
      lastMessageAt: c.messages[0]?.createdAt ?? null,
      unreadCount,
      createdAt: c.createdAt,
    }
  })
}

export async function fetchMessages(
  chatId: string
): Promise<MessageItem[]> {
  const messages = await db.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
  })

  return messages.map((m) => ({
    id: m.id,
    chatId: m.chatId,
    senderId: m.senderId,
    text: m.text,
    unread: m.unread,
    createdAt: m.createdAt,
  }))
}

export async function getCurrentUserForChat(): Promise<UserProfile | null> {
  const userId = await getSessionUserId()
  if (!userId) return null

  const user = await db.user.findUnique({
    where: { id: userId },
  })

  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    location: user.location,
    rating: user.rating,
    responseRate: user.responseRate,
    productsSold: user.productsSold,
    activeListing: user.activeListing,
    savedItems: user.savedItems,
    createdAt: user.createdAt,
  }
}

export async function findOrCreateChat(
  productId: string,
  sellerId: string
): Promise<ChatItem | null> {
  const userId = await getSessionUserId()
  if (!userId) return null

  if (userId === sellerId) return null

  let chat = await db.chat.findFirst({
    where: { productId, buyerId: userId, sellerId },
    include: {
      product: { include: { user: true } },
      buyer: true,
      seller: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  if (chat && chat.deletedByBuyer) {
    await db.chat.update({
      where: { id: chat.id },
      data: { deletedByBuyer: false },
    })
  }

  if (!chat) {
    chat = await db.chat.create({
      data: { productId, buyerId: userId, sellerId },
      include: {
        product: { include: { user: true } },
        buyer: true,
        seller: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })
  }

  return {
    id: chat.id,
    product: {
      id: chat.product.id,
      title: chat.product.title,
      description: chat.product.description,
      price: chat.product.price,
      category: chat.product.category as ChatItem["product"]["category"],
      condition: chat.product.condition,
      location: chat.product.location,
      lat: chat.product.lat,
      lng: chat.product.lng,
      images: parseImages(chat.product.images),
      cod: chat.product.cod,
      status: chat.product.status as any,
      user: {
        id: chat.product.user.id,
        name: chat.product.user.name,
        email: chat.product.user.email,
        image: chat.product.user.image,
        location: chat.product.user.location,
        rating: chat.product.user.rating,
        responseRate: chat.product.user.responseRate,
        productsSold: chat.product.user.productsSold,
        activeListing: chat.product.user.activeListing,
        savedItems: chat.product.user.savedItems,
        createdAt: chat.product.user.createdAt,
      },
      createdAt: chat.product.createdAt,
      updatedAt: chat.product.updatedAt,
    },
    buyer: {
      id: chat.buyer.id,
      name: chat.buyer.name,
      email: chat.buyer.email,
      image: chat.buyer.image,
      location: chat.buyer.location,
      rating: chat.buyer.rating,
      responseRate: chat.buyer.responseRate,
      productsSold: chat.buyer.productsSold,
      activeListing: chat.buyer.activeListing,
      savedItems: chat.buyer.savedItems,
      createdAt: chat.buyer.createdAt,
    },
    seller: {
      id: chat.seller.id,
      name: chat.seller.name,
      email: chat.seller.email,
      image: chat.seller.image,
      location: chat.seller.location,
      rating: chat.seller.rating,
      responseRate: chat.seller.responseRate,
      productsSold: chat.seller.productsSold,
      activeListing: chat.seller.activeListing,
      savedItems: chat.seller.savedItems,
      createdAt: chat.seller.createdAt,
    },
    lastMessage: chat.messages[0]?.text ?? null,
    lastMessageAt: chat.messages[0]?.createdAt ?? null,
    unreadCount: 0,
    createdAt: chat.createdAt,
  }
}

export async function sendMessage(
  chatId: string,
  text: string
): Promise<boolean> {
  const userId = await getSessionUserId()
  if (!userId) return false

  try {
    await db.message.create({
      data: { chatId, senderId: userId, text },
    })

    await db.chat.update({
      where: { id: chatId },
      data: { lastMessage: text, lastMessageAt: new Date() },
    })

    return true
  } catch {
    return false
  }
}

export async function fetchUnreadCount(): Promise<number> {
  const userId = await getSessionUserId()
  if (!userId) return 0

  const count = await db.message.count({
    where: {
      unread: true,
      senderId: { not: userId },
      chat: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
    },
  })

  return count
}

export async function markMessagesAsRead(chatId: string): Promise<void> {
  const userId = await getSessionUserId()
  if (!userId) return

  await db.message.updateMany({
    where: { chatId, senderId: { not: userId }, unread: true },
    data: { unread: false },
  })
}

export async function deleteChat(chatId: string): Promise<boolean> {
  const userId = await getSessionUserId()
  if (!userId) return false

  try {
    const chat = await db.chat.findUnique({
      where: { id: chatId },
      select: { buyerId: true, sellerId: true },
    })

    if (!chat || (chat.buyerId !== userId && chat.sellerId !== userId)) {
      return false
    }

    if (userId === chat.buyerId) {
      await db.chat.update({
        where: { id: chatId },
        data: { deletedByBuyer: true },
      })
    } else {
      await db.chat.update({
        where: { id: chatId },
        data: { deletedBySeller: true },
      })
    }

    return true
  } catch {
    return false
  }
}
