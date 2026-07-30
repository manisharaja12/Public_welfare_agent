import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi'

const QUICK_QUESTIONS = [
  'Can I donate old clothes?',
  'Can I donate used laptops?',
  'Where can I donate books?',
  'How does pickup work?',
  'What items are accepted?',
]

const AI_RESPONSES = {
  'can i donate old clothes':     'Yes! 👕 Old clothes in good condition are always welcome. Orphanages, old age homes, and flood relief camps accept them. Use the Donate button above to find the nearest organisation.',
  'can i donate used laptops':    'Used laptops are accepted by NGO schools and digital literacy centres. While our agent covers clothes, books, food, toys & blankets, you can contact organisations like Parikrma Learning Centre directly for electronics.',
  'where can i donate books':     '📚 You can donate books to Government Primary Schools, NGO learning centres, and public libraries. Select "Books" in the donation flow — AI will match you with the best nearby organisation!',
  'how does pickup work':         '🚐 After confirming your donation, our AI Scheduler lets you pick a day & time. A volunteer is then assigned with their name, vehicle number, and estimated arrival time. They come to your doorstep!',
  'what items are accepted':      'We currently accept: 🩸 Blood, 👕 Clothes, 📚 Books, 🍱 Food, 🧸 Toys, and 🛏 Blankets. Each type is matched to the most suitable nearby organisation by our AI.',
}

function getAIReply(input) {
  const lower = input.toLowerCase().trim()
  for (const [key, reply] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key.split(' ').slice(0, 3).join(' ')) || lower === key) return reply
  }
  if (lower.includes('blood'))                    return '🩸 Blood donations are matched to blood banks and hospitals with urgent needs. Select "Blood" in the donation flow and our AI will find the best match near you.'
  if (lower.includes('food'))                     return '🍱 We accept cooked meals, packed food, and dry ration kits. Organisations like Akshaya Patra and Robin Hood Army are always in need. Start a donation above!'
  if (lower.includes('toy'))                      return '🧸 Toys are donated to orphanages and child care centres. Board games, soft toys, puzzles — all are welcome!'
  if (lower.includes('blanket'))                  return '🛏 Blankets are urgently needed by night shelters and flood relief camps, especially in winter. You can schedule a pickup from your home!'
  if (lower.includes('pickup') || lower.includes('collect')) return "🚐 Our volunteers collect donations from your doorstep. After scheduling, you'll get the volunteer's name, vehicle number, and arrival time."
  if (lower.includes('thank'))                    return "You're welcome! 😊 Your generosity makes a real difference. Feel free to ask anything else about donating."
  return '🤖 I can help with questions about donating clothes, books, food, blood, toys, or blankets. Try asking "Where can I donate books?" or "How does pickup work?"'
}

export default function DonationChatbot() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hi! 👋 I'm your AI Donation Assistant. Ask me anything about donating — clothes, books, food, blood, toys or blankets!" }
  ])
  const [input, setInput]       = useState('')
  const [typing, setTyping]     = useState(false)
  const bottomRef               = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const sendMessage = (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMessages(m => [...m, { from: 'user', text: msg }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { from: 'ai', text: getAIReply(msg) }])
    }, 900)
  }

  return (
    <>
      <button onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden"
            style={{ maxHeight: '520px' }}>

            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">🤖</div>
              <div>
                <p className="text-white font-bold text-sm">AI Donation Assistant</p>
                <p className="text-rose-100 text-xs">Always here to help</p>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto text-white/80 hover:text-white"><FiX size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.from === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-sm shrink-0 mr-2 mt-0.5">🤖</div>
                  )}
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    m.from === 'user'
                      ? 'bg-rose-500 text-white rounded-br-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                  }`}>{m.text}</div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-sm shrink-0 mr-2">🤖</div>
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                    {[0,1,2].map(d => (
                      <motion.div key={d} animate={{ y: [0,-5,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: d*0.15 }}
                        className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map(q => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="text-xs px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about donations…"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400" />
              <button onClick={() => sendMessage()}
                className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shrink-0">
                <FiSend size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
