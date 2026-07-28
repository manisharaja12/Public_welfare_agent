import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageSquare, FiSend, FiTrash2, FiUser, FiCpu } from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'

const suggestions = [
  'How do I apply for PM Awas Yojana?',
  'What documents are needed for Aadhaar update?',
  'How to file a complaint online?',
  'What is the income limit for BPL card?',
  'How to check my complaint status?',
]

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hello! I am your AI Public Welfare Assistant. I can help you with government schemes, complaints, job opportunities, emergency services, and more. How can I assist you today?',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: 'Thank you for your query. This response will be powered by the FastAPI backend AI agent. Please connect the backend to get real-time intelligent responses.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, 1800)
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'AI Public Assistant' }]} />
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FiMessageSquare className="text-indigo-600" /> AI Public Assistant
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">24/7 intelligent assistant for all government service queries</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-5 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Chat History Panel */}
        <div className="hidden lg:flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Chat History</h3>
            <button
              onClick={() => setMessages(initialMessages)}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 cursor-pointer">
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 truncate">Current Session</p>
              <p className="text-xs text-slate-400 mt-0.5">{messages.length} messages</p>
            </div>
            {['PM Awas Yojana query', 'Complaint status check', 'Job search help'].map((h) => (
              <div key={h} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{h}</p>
                <p className="text-xs text-slate-400 mt-0.5">Yesterday</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat */}
        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
              <FiCpu size={16} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white text-sm">AI Welfare Assistant</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-indigo-500 to-indigo-600'}`}>
                    {msg.role === 'user' ? <FiUser size={14} className="text-white" /> : <FiCpu size={14} className="text-white" />}
                  </div>
                  <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-xs text-slate-400">{msg.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                    <FiCpu size={14} className="text-white" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 flex gap-2 overflow-x-auto scrollbar-thin">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="shrink-0 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-700">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
              className="flex gap-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <motion.button
                whileTap={{ scale: 0.92 }}
                type="submit"
                disabled={!input.trim() || typing}
                className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center justify-center transition-colors shrink-0"
              >
                <FiSend size={16} />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
