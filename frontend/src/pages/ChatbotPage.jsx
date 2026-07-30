import { useState, useRef, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageSquare, FiSend, FiTrash2, FiUser, FiCpu, FiExternalLink, FiDownload, FiGlobe } from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'

const LANGUAGES = [
  { label: 'English',            code: 'en-IN', name: 'English' },
  { label: 'தமிழ் (Tamil)',      code: 'ta-IN', name: 'Tamil' },
  { label: 'हिन्दी (Hindi)',     code: 'hi-IN', name: 'Hindi' },
  { label: 'తెలుగు (Telugu)',    code: 'te-IN', name: 'Telugu' },
  { label: 'ಕನ್ನಡ (Kannada)',   code: 'kn-IN', name: 'Kannada' },
  { label: 'മലയാളം (Malayalam)', code: 'ml-IN', name: 'Malayalam' },
]

const CATEGORIES = [
  { id: 'govt',     icon: '🏛️', label: 'Government Services', questions: [
    'How do I apply for Aadhaar?', 'How to get a PAN card?',
    'How to apply for Passport?', 'How to get Voter ID?', 'How to get a birth certificate?',
  ]},
  { id: 'legal',    icon: '⚖️', label: 'Legal Help', questions: [
    'What are consumer rights in India?', 'How to file an FIR?',
    'What are women\'s legal rights?', 'How to get free legal aid?',
    'My landlord is not returning my deposit. What can I do?',
  ]},
  { id: 'women',    icon: '👩', label: 'Women', questions: [
    'What are women\'s rights in India?', 'How to report domestic violence?',
    'What is the Mahila Shakti Kendra scheme?', 'How to get free legal aid for women?',
  ]},
  { id: 'senior',   icon: '👴', label: 'Senior Citizens', questions: [
    'What are senior citizen rights in India?', 'How to apply for senior citizen pension?',
    'What is the Indira Gandhi National Old Age Pension Scheme?',
  ]},
  { id: 'consumer', icon: '🛒', label: 'Consumer Rights', questions: [
    'How to file a consumer complaint?', 'What is the Consumer Protection Act?',
    'How to approach consumer court?', 'What are my rights as a consumer?',
  ]},
  { id: 'fir',      icon: '🚔', label: 'FIR', questions: [
    'How to file an FIR online?', 'What to do if police refuse to file FIR?',
    'How to check FIR status?', 'What information is needed to file an FIR?',
  ]},
  { id: 'schemes',  icon: '🏦', label: 'Schemes', questions: [
    'What government schemes are available for farmers?',
    'How to apply for PM Awas Yojana?', 'What is PM Kisan Samman Nidhi?',
    'What schemes are available for students?',
  ]},
]

const WELCOME = {
  id: 1,
  role: 'assistant',
  type: 'text',
  text: '👋 Hello! I am your AI Public Welfare Assistant. Ask me anything about government services — Aadhaar, birth certificate, driving licence, passport, schemes, and more!',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}

// ── PDF Auto-Download via jsPDF ──────────────────────────────────────────────
function downloadPdf(question, data) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W   = doc.internal.pageSize.getWidth()
  const mar = 40
  const wrap = W - mar * 2
  let y = 50

  const line = (text, { size=11, bold=false, color=[30,41,59], gap=6 } = {}) => {
    doc.setFontSize(size)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    doc.splitTextToSize(String(text), wrap).forEach(l => {
      if (y > 800) { doc.addPage(); y = 50 }
      doc.text(l, mar, y)
      y += size + gap
    })
    y += 4
  }

  const section = (label) => {
    y += 6
    doc.setDrawColor(200, 200, 220)
    doc.line(mar, y, W - mar, y)
    y += 10
    line(label, { size: 12, bold: true, color: [79, 70, 229] })
  }

  line('Government Service Response', { size: 18, bold: true, color: [79, 70, 229] })
  line(`Generated: ${new Date().toLocaleString()}`, { size: 9, color: [148, 163, 184], gap: 2 })

  section('Your Question');  line(question)
  if (data.service) { section('Service'); line(data.service) }
  if (data.summary || data.response) { section('AI Response'); line(data.summary || data.response) }
  if (data.steps?.length) { section('Steps to Apply'); data.steps.forEach((s, i) => line(`${i+1}. ${s}`)) }
  if (data.required_documents?.length) { section('Required Documents'); data.required_documents.forEach(d => line(`• ${d}`)) }
  if (data.department || data.fees || data.estimated_processing_time) {
    section('Details')
    if (data.department)                line(`Department: ${data.department}`)
    if (data.fees)                      line(`Fees: ${data.fees}`)
    if (data.estimated_processing_time) line(`Processing Time: ${data.estimated_processing_time}`)
  }
  if (data.official_portal) { section('Official Portal'); line(data.official_portal, { color: [37,99,235] }) }
  if (data.disclaimer)      { section('Disclaimer');      line(data.disclaimer, { size: 9, color: [148,163,184] }) }

  doc.save(`govt-${(data.service||'response').replace(/\s+/g,'-').toLowerCase()}.pdf`)
}

// ── Rich AI Response Card ─────────────────────────────────────────────────────
function AiResponseCard({ data, question, onSpeak }) {
  return (
    <div className="space-y-3 text-sm">
      {/* Service + Category */}
      {(data.service || data.category) && (
        <div className="flex flex-wrap gap-2">
          {data.service && (
            <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold">
              🏛️ {data.service}
            </span>
          )}
          {data.category && (
            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">
              📂 {data.category}
            </span>
          )}
        </div>
      )}

      {/* Summary / Response */}
      {(data.summary || data.response) && (
        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
          {data.summary || data.response}
        </p>
      )}

      {/* Steps */}
      {data.steps?.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
          <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">📋 Steps to Apply</p>
          <ol className="space-y-1.5">
            {data.steps.map((s, i) => (
              <li key={i} className="flex gap-2 text-xs text-green-800 dark:text-green-300">
                <span className="font-bold shrink-0 text-green-500">{i + 1}.</span>{s}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Required Documents */}
      {data.required_documents?.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3">
          <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-2">📄 Required Documents</p>
          <ul className="space-y-1">
            {data.required_documents.map((d, i) => (
              <li key={i} className="flex gap-2 text-xs text-yellow-800 dark:text-yellow-300">
                <span className="shrink-0">•</span>{d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Meta info row */}
      {(data.department || data.fees || data.estimated_processing_time) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {data.department && (
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-2.5">
              <p className="text-xs text-slate-400 mb-0.5">🏢 Department</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{data.department}</p>
            </div>
          )}
          {data.fees && (
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-2.5">
              <p className="text-xs text-slate-400 mb-0.5">💰 Fees</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{data.fees}</p>
            </div>
          )}
          {data.estimated_processing_time && (
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-2.5">
              <p className="text-xs text-slate-400 mb-0.5">⏱️ Processing Time</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{data.estimated_processing_time}</p>
            </div>
          )}
        </div>
      )}

      {/* Official Portal */}
      {data.official_portal && (
        <a href={data.official_portal} target="_blank" rel="noreferrer"
          className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">
          <FiExternalLink size={12} /> {data.official_portal}
        </a>
      )}

      {/* Disclaimer */}
      {data.disclaimer && (
        <p className="text-xs text-slate-400 italic border-t border-slate-100 dark:border-slate-700 pt-2">
          ⚠️ {data.disclaimer}
        </p>
      )}

      {/* Related Government Schemes */}
      {data.related_schemes?.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-3">
          <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-2">🎯 Related Government Schemes</p>
          <ul className="space-y-1 mb-3">
            {data.related_schemes.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-indigo-800 dark:text-indigo-200">
                <span className="text-indigo-400">•</span>{s}
              </li>
            ))}
          </ul>
          <a
            href="https://www.india.gov.in/topics/government-schemes"
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Know More →
          </a>
        </div>
      )}

      {/* Download + Listen Buttons */}
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => downloadPdf(question, data)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors"
        >
          <FiDownload size={13} /> Download PDF
        </button>
        {onSpeak && (
          <button
            onClick={() => onSpeak((data.summary || data.response || '') + ' ' + (data.steps || []).join('. '))}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            🔊 Listen
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ChatbotPage() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput]       = useState('')
  const [typing, setTyping]     = useState(false)
  const [error, setError]       = useState('')
  const [listening, setListening] = useState(false)
  const [voiceErr, setVoiceErr]   = useState('')
  const [lang, setLang]           = useState(LANGUAGES[0])
  const [activeCat, setActiveCat]  = useState(null)
  const bottomRef               = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setVoiceErr('Voice not supported. Use Chrome.'); return }
    const r = new SR()
    r.lang = lang.code
    r.interimResults = false
    r.onstart  = () => { setListening(true); setVoiceErr('') }
    r.onresult = e  => { setInput(e.results[0][0].transcript) }
    r.onerror  = () => { setVoiceErr('Could not hear. Try again.') }
    r.onend    = () => setListening(false)
    r.start()
  }

  const speakText = (text) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = lang.code
    window.speechSynthesis.speak(utt)
  }

  const detectLang = (text) => {
    if (/[\u0B80-\u0BFF]/.test(text)) return LANGUAGES.find(l => l.code === 'ta-IN')
    if (/[\u0900-\u097F]/.test(text)) return LANGUAGES.find(l => l.code === 'hi-IN')
    if (/[\u0C00-\u0C7F]/.test(text)) return LANGUAGES.find(l => l.code === 'te-IN')
    if (/[\u0C80-\u0CFF]/.test(text)) return LANGUAGES.find(l => l.code === 'kn-IN')
    if (/[\u0D00-\u0D7F]/.test(text)) return LANGUAGES.find(l => l.code === 'ml-IN')
    return null
  }

  const sendMessage = async (text) => {
    if (!text.trim() || typing) return
    setError('')
    const detected = detectLang(text)
    if (detected) setLang(detected)

    const userMsg = {
      id:   Date.now(),
      role: 'user',
      type: 'text',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    try {
      const res  = await fetch('/chatbot/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: text.trim(), language: lang.name }),
      })
      const data = await res.json()

      // Routed to another agent
      if (data.status === 'routed') {
        setMessages(prev => [...prev, {
          id:   Date.now() + 1,
          role: 'assistant',
          type: 'text',
          text: `🔀 ${data.message}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }])
        return
      }

      // Rich AI response
      setMessages(prev => [...prev, {
        id:       Date.now() + 1,
        role:     'assistant',
        type:     'rich',
        data,
        question: text.trim(),
        time:     new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } catch {
      setError('Could not connect to AI Assistant. Make sure the backend is running on port 5002.')
      setMessages(prev => [...prev, {
        id:   Date.now() + 1,
        role: 'assistant',
        type: 'text',
        text: '❌ Sorry, I could not connect to the backend. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } finally {
      setTyping(false)
    }
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

      {error && (
        <div className="mb-3 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400">
          ❌ {error}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-5 h-[calc(100vh-220px)] min-h-[500px]">

        {/* Sidebar */}
        <div className="hidden lg:flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Chat History</h3>
            <button onClick={() => setMessages([WELCOME])} className="text-slate-400 hover:text-red-500 transition-colors">
              <FiTrash2 size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 truncate">Current Session</p>
              <p className="text-xs text-slate-400 mt-0.5">{messages.length} messages</p>
            </div>
          </div>

          {/* Quick Topics */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Quick Topics</p>
            <div className="space-y-1">
              {['Aadhaar', 'Birth Certificate', 'Passport', 'Driving Licence'].map(t => (
                <button key={t} onClick={() => sendMessage(`How do I apply for ${t}?`)}
                  className="w-full text-left text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
                  🔹 {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat */}
        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">

          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
              <FiCpu size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 dark:text-white text-sm">Citizen AI Assistant</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online · Powered by Groq AI
              </p>
            </div>
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <FiGlobe size={14} className="text-slate-400" />
              <select
                value={lang.code}
                onChange={e => setLang(LANGUAGES.find(l => l.code === e.target.value))}
                className="text-xs border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Categories Bar */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <button key={cat.id}
                  onClick={() => setActiveCat(activeCat?.id === cat.id ? null : cat)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    activeCat?.id === cat.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                  }`}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
            {/* Suggested Questions for active category */}
            <AnimatePresence>
              {activeCat && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                  className="mt-2 flex flex-wrap gap-2 overflow-hidden">
                  {activeCat.questions.map(q => (
                    <button key={q} onClick={() => { sendMessage(q); setActiveCat(null) }}
                      className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                      • {q}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-indigo-500 to-indigo-600'}`}>
                    {msg.role === 'user' ? <FiUser size={14} className="text-white" /> : <FiCpu size={14} className="text-white" />}
                  </div>

                  <div className={`max-w-[80%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.type === 'rich' ? (
                      <div className="bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-2xl rounded-tl-sm px-4 py-3 w-full">
                        <AiResponseCard data={msg.data} question={msg.question} onSpeak={speakText} />
                      </div>
                    ) : (
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-sm'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    )}
                    <span className="text-xs text-slate-400">{msg.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {typing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                    <FiCpu size={14} className="text-white" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                        className="w-2 h-2 bg-slate-400 rounded-full" />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-700">
            {voiceErr && <p className="text-xs text-orange-500 mb-2">{voiceErr}</p>}
            <form onSubmit={e => { e.preventDefault(); sendMessage(input) }} className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about any government service..."
                disabled={typing}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-60"
              />
              {/* Voice Button */}
              <motion.button type="button" whileTap={{ scale: 0.92 }} onClick={startVoice}
                disabled={listening || typing}
                title="Speak your question"
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  listening
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-500 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600'
                }`}>
                {listening
                  ? <motion.span animate={{ scale:[1,1.3,1] }} transition={{ repeat:Infinity, duration:0.8 }}>🎤</motion.span>
                  : <span className="text-lg">🎤</span>
                }
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} type="submit"
                disabled={!input.trim() || typing}
                className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center justify-center transition-colors shrink-0">
                <FiSend size={16} />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
