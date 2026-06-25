"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  Send,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageSquare,
  Loader2,
  Trash2,
} from "lucide-react"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import { formatRelativeTime, formatPrice } from "@/lib/format"
import { toast } from "sonner"
import {
  fetchChats,
  fetchMessages,
  getCurrentUserForChat,
  findOrCreateChat,
  sendMessage,
  markMessagesAsRead,
  deleteChat,
} from "./actions"
import type { ChatItem, MessageItem, UserProfile } from "@/types"

function ChatContent() {
  const searchParams = useSearchParams()
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [chats, setChats] = useState<ChatItem[]>([])
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [inputText, setInputText] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const initializedRef = useRef(false)

  const activeChat = activeChatId
    ? chats.find((c) => c.id === activeChatId) ?? null
    : null

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const productParam = searchParams.get("product")
    const sellerParam = searchParams.get("seller")

    Promise.all([getCurrentUserForChat(), fetchChats()]).then(
      async ([user, chatList]) => {
        setCurrentUser(user)
        setChats(chatList)

        let targetChatId: string | null = null

        if (productParam && sellerParam && user) {
          const existing = chatList.find(
            (c) =>
              c.product.id === productParam &&
              (c.seller.id === sellerParam || c.buyer.id === sellerParam)
          )
          if (existing) {
            targetChatId = existing.id
          } else {
            const created = await findOrCreateChat(productParam, sellerParam)
            if (created) {
              setChats((prev) => [created, ...prev])
              targetChatId = created.id
            }
          }
        } else if (chatList.length > 0) {
          targetChatId = chatList[0].id
        }

        if (targetChatId) {
          setActiveChatId(targetChatId)
          setShowSidebar(false)
        }
        setLoading(false)
      }
    )
  }, [searchParams])

  useEffect(() => {
    if (activeChatId) {
      Promise.all([
        fetchMessages(activeChatId).then(setMessages),
        markMessagesAsRead(activeChatId),
      ])
    }
  }, [activeChatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function getOtherUser(chat: ChatItem): UserProfile {
    return chat.seller.id === currentUser?.id ? chat.buyer : chat.seller
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!inputText.trim() || !activeChatId || sending) return
    setSending(true)
    const text = inputText
    setInputText("")
    const ok = await sendMessage(activeChatId, text)
    setSending(false)
    if (ok) {
      fetchMessages(activeChatId).then(setMessages)
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, lastMessage: text, lastMessageAt: new Date() }
            : c
        )
      )
    }
  }

  if (loading || !currentUser) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-4xl">
      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "flex" : "hidden"
        } w-full flex-col border-r border-slate-200 bg-white sm:flex sm:w-80`}
      >
        <div className="border-b border-slate-200 p-4">
          <h2 className="text-base font-bold text-slate-800">Percakapan</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const other = getOtherUser(chat)
            const isActive = chat.id === activeChatId

            async function handleDelete(e: React.MouseEvent) {
              e.stopPropagation()
              if (!window.confirm(`Hapus percakapan dengan ${other.name}?`)) return
              const ok = await deleteChat(chat.id)
              if (ok) {
                toast.success("Percakapan berhasil dihapus")
                setChats((prev) => prev.filter((c) => c.id !== chat.id))
                if (activeChatId === chat.id) {
                  setActiveChatId(null)
                }
              } else {
                toast.error("Gagal menghapus percakapan")
              }
            }

            return (
              <div
                key={chat.id}
                className="group relative"
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveChatId(chat.id)
                    setShowSidebar(false)
                  }}
                  className={`flex w-full items-start gap-3 border-b border-slate-100 p-4 text-left transition-colors hover:bg-slate-50 ${
                    isActive ? "bg-emerald-50" : ""
                  }`}
                >
                  <div className="relative shrink-0">
                    <ImageWithFallback
                      src={other.image ?? ""}
                      alt={other.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                      fallbackText={other.name[0]}
                    />
                    {chat.unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">
                        {other.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {chat.lastMessageAt
                          ? formatRelativeTime(chat.lastMessageAt)
                          : ""}
                      </span>
                    </div>
                    <p className="truncate text-xs text-slate-400">
                      {chat.lastMessage}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <ImageWithFallback
                        src={chat.product.images[0]}
                        alt={chat.product.title}
                        width={20}
                        height={20}
                        className="rounded object-cover"
                      />
                      <span className="truncate text-[10px] text-slate-400">
                        {chat.product.title}
                      </span>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full text-slate-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  title="Hapus percakapan"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Window */}
      <div
        className={`flex flex-1 flex-col bg-white ${
          !showSidebar || !activeChat ? "flex" : "hidden sm:flex"
        }`}
      >
        {activeChat ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 p-4">
              <button
                type="button"
                onClick={() => setShowSidebar(true)}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 sm:hidden"
              >
                <ChevronLeft className="h-4 w-4" />
                Kembali
              </button>

              <ImageWithFallback
                src={activeChat.product.images[0]}
                alt={activeChat.product.title}
                width={40}
                height={40}
                className="rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {activeChat.product.title}
                </p>
                <p className="text-xs font-medium text-emerald-600">
                  {formatPrice(activeChat.product.price)}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <Phone className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isOwn = msg.senderId === currentUser.id
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        isOwn
                          ? "bg-emerald-600 text-white rounded-br-md"
                          : "bg-slate-100 text-slate-800 rounded-bl-md"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`mt-0.5 text-[10px] ${
                          isOwn ? "text-emerald-200" : "text-slate-400"
                        }`}
                      >
                        {formatRelativeTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 p-4">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <MessageSquare className="h-7 w-7 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                Pilih percakapan untuk memulai obrolan
              </p>
              <button
                type="button"
                onClick={() => setShowSidebar(true)}
                className="mt-3 flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 sm:hidden"
              >
                <ChevronRight className="h-4 w-4" />
                Lihat percakapan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  )
}
