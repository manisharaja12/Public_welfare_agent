import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChat, HiPaperAirplane, HiTrash, HiRefresh } from 'react-icons/hi'
import { MdSecurity } from 'react-icons/md'
import Breadcrumb from '../components/Breadcrumb'

const suggestions = [
  'What government schemes am I eligible for?',
  'How do I file a complaint about road damage?',
  'What are the emergency helpline numbers?',
  'How can I improve my cyber security?',
  'What jobs match my skills?',
  'How to apply for PM Awas Yojana?',
]

const initialMessages = [
  {
    id: 1, role: 'assistant',
    text: 'Hello! I\'m your AI Public Welfare Assistant. I can help you with government schemes, job opportunities, complaints, emergency services, and cyber safety. How can I assist you today?',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
]

export default function Chatbot() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [history] = useState([
    { id: 1, title: 'Scheme eligibility query', date: 'Today' },
    { id: 2, title: 'Job search assistance', date: 'Yesterday' },
    { id: 3, title: 'Complaint filing help', date: '2 days ago' },
  ])
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = { id: Date.now(), role: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, {
        id: Date.now() + 1, role: 'assistant',
        text: 'Thank you for your query. This is a placeholder response. Once connected to the backend AI agent, you will receive intelligent, personalized responses based on your query.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    }, 1800)
  }

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input) }

  return (
    <div>
      <Breadcrumb />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
          <HiChat className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Public Assistant</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">24/7 intelligent welfare assistant</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Chat History Panel */}
        <div className="hidden lg:flex flex-col card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Chat History</h3>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <HiRefresh className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {history.map(({ id, title, date }) => (
              <button key={id} className="w-full text-left p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <p className="text-sm font-medium truncate">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{date}</p>
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 mt-3 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <HiTrash className="w-4 h-4" /> Clear History
          </button>
        </div>

        {/* Main Chat */}
        <div className="lg:col-span-3 flex flex-col card overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
              <MdSecurity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">AI Welfare Assistant</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <MdSecurity className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[75%] ${msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                  : 'bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm'} px-4 py-2.5`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>{msg.time}</p>
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            <AnimatePresence>
              {typing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                    <MdSecurity className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2 h-2 bg-gray-400 rounded-full" />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {suggestions.map((s) => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="flex-shrink-0 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
            <input className="input-field flex-1" placeholder="Type your message..."
              value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="submit" disabled={!input.trim() || typing}
              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 flex-shrink-0">
              <HiPaperAirplane className="w-4 h-4 rotate-90" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
