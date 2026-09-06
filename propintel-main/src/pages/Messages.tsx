import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, Search, Paperclip, Home as HomeIcon } from 'lucide-react'
import { messageService } from '../services'
import type { Conversation, Message } from '../types'

export default function Messages() {
  const [params] = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const newContact = params.get('new')
  const newProperty = params.get('property')

  useEffect(() => {
    messageService.listConversations().then((list) => {
      let full = list
      if (newContact && !list.some((c) => c.participantName === newContact)) {
        const created: Conversation = {
          id: `new-${Date.now()}`,
          participantName: newContact,
          participantType: newProperty ? 'Seller' : 'Professional',
          propertyTitle: newProperty ?? undefined,
          lastMessage: '',
          updatedAt: new Date().toISOString(),
          unread: 0,
          online: true,
          messages: [],
        }
        full = [created, ...list]
      }
      setConversations(full)
      setActiveId(newContact ? full.find((c) => c.participantName === newContact)?.id ?? full[0]?.id ?? null : full[0]?.id ?? null)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const active = conversations.find((c) => c.id === activeId) ?? null

  const filtered = useMemo(
    () => conversations.filter((c) => c.participantName.toLowerCase().includes(query.toLowerCase())),
    [conversations, query]
  )

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active?.messages.length])

  const send = () => {
    if (!draft.trim() || !active) return
    const msg: Message = { id: `m-${Date.now()}`, senderId: 'me', content: draft, createdAt: new Date().toISOString(), read: true }
    setConversations((cs) =>
      cs.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, msg], lastMessage: draft, updatedAt: msg.createdAt } : c))
    )
    setDraft('')
    setTimeout(() => {
      const reply: Message = {
        id: `m-${Date.now() + 1}`,
        senderId: 'them',
        content: 'Thanks for the message — I will get back to you shortly.',
        createdAt: new Date().toISOString(),
        read: true,
      }
      setConversations((cs) =>
        cs.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, reply], lastMessage: reply.content, updatedAt: reply.createdAt } : c))
      )
    }, 1200)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-73px)] max-w-7xl">
      <aside className={`w-full shrink-0 border-r border-stone-light sm:w-80 ${active ? 'hidden sm:block' : ''}`}>
        <div className="border-b border-stone-light p-4">
          <h1 className="font-display text-xl font-semibold text-ink">Messages</h1>
          <div className="mt-3 flex items-center gap-2 rounded-full border border-stone-light px-3 py-2">
            <Search className="h-4 w-4 text-stone" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>
        <div className="overflow-y-auto">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`flex w-full items-start gap-3 border-b border-stone-light p-4 text-left transition-colors hover:bg-parchment-dim ${
                activeId === c.id ? 'bg-parchment-dim' : ''
              }`}
            >
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-parchment">
                {c.participantName.charAt(0)}
                {c.online && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-parchment bg-verdant" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-ink">{c.participantName}</span>
                  {c.unread > 0 && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rust text-xs text-white">{c.unread}</span>}
                </div>
                {c.propertyTitle && <p className="truncate text-xs text-ochre-dark">{c.propertyTitle}</p>}
                <p className="truncate text-sm text-stone">{c.lastMessage || 'Start the conversation…'}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {active ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-stone-light p-4">
            <button onClick={() => setActiveId(null)} className="text-sm text-ink-light sm:hidden">←</button>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-parchment">
              {active.participantName.charAt(0)}
            </span>
            <div>
              <p className="font-medium text-ink">{active.participantName}</p>
              <p className="text-xs text-stone">{active.online ? 'Online' : 'Offline'} · {active.participantType}</p>
            </div>
          </div>

          {active.propertyTitle && (
            <div className="flex items-center gap-2 border-b border-stone-light bg-parchment-dim px-4 py-2 text-sm text-ink-light">
              <HomeIcon className="h-4 w-4 text-ochre-dark" /> Conversation about: <span className="font-medium text-ink">{active.propertyTitle}</span>
            </div>
          )}

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {active.messages.length === 0 && (
              <p className="mt-10 text-center text-sm text-stone">Send a message to start the conversation.</p>
            )}
            {active.messages.map((m) => (
              <div key={m.id} className={`flex ${m.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.senderId === 'me' ? 'bg-ink text-parchment' : 'bg-parchment-dim text-ink'}`}>
                  {m.content}
                </p>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="flex items-center gap-2 border-t border-stone-light p-4"
          >
            <button type="button" aria-label="Attach" className="text-stone hover:text-ink-light">
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-full border border-stone-light bg-parchment px-4 py-2 text-sm outline-none focus:border-ochre-dark"
            />
            <button type="submit" aria-label="Send" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-parchment hover:bg-ink-light">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="hidden flex-1 items-center justify-center text-stone sm:flex">Select a conversation</div>
      )}
    </div>
  )
}
