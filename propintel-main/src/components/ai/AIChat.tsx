import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send } from 'lucide-react'
import type { Property } from '../../types'
import { aiService } from '../../services/aiService'

interface ChatTurn {
  role: 'user' | 'ai'
  content: string
}

const starterQuestions = [
  'What can I use this property for?',
  'Which use has the highest rental demand?',
  'Are the documents fully verified?',
  'What is the electricity situation here?',
]

export default function AIChat({ property }: { property: Property }) {
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      role: 'ai',
      content: `Ask me anything about this ${property.subcategory.toLowerCase()} in ${property.neighbourhood} — suitability, documents, area intelligence or risks.`,
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [turns, thinking])

  const ask = async (question: string) => {
    if (!question.trim() || thinking) return
    setTurns((t) => [...t, { role: 'user', content: question }])
    setInput('')
    setThinking(true)
    const answer = await aiService.answerPropertyQuestion(property, question)
    setThinking(false)
    setTurns((t) => [...t, { role: 'ai', content: answer }])
  }

  return (
    <div className="rounded-md border border-stone-light bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2 text-ink-light">
        <Sparkles className="h-4 w-4 text-ochre-dark" strokeWidth={1.75} />
        <span className="text-sm font-medium">Ask AI about this property</span>
      </div>

      <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
        {turns.map((t, i) => (
          <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <p
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                t.role === 'user' ? 'bg-ink text-parchment' : 'bg-parchment-dim text-ink'
              }`}
            >
              {t.content}
            </p>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <p className="rounded-2xl bg-parchment-dim px-4 py-2.5 text-sm text-stone">Thinking…</p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {turns.length <= 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {starterQuestions.map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
              className="rounded-full border border-stone-light px-3 py-1.5 text-xs text-ink-light transition-colors hover:border-ochre-dark hover:text-ink"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          ask(input)
        }}
        className="mt-4 flex items-center gap-2 border-t border-stone-light pt-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this property…"
          className="flex-1 rounded-full border border-stone-light bg-parchment px-4 py-2 text-sm text-ink outline-none focus:border-ochre-dark"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={thinking}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-parchment transition-colors hover:bg-ink-light disabled:opacity-50"
        >
          <Send className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </form>
      <p className="mt-3 text-xs text-stone">AI responses are generated for guidance only and are not professional advice.</p>
    </div>
  )
}
