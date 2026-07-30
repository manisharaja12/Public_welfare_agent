import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiShield, FiLink, FiLock, FiEye, FiWifi, FiMail, FiAlertTriangle, FiCheckCircle,
  FiX, FiSend, FiMessageSquare, FiRefreshCw, FiChevronDown, FiChevronUp, FiSearch,
  FiFilter, FiClock, FiStar, FiBookOpen, FiThumbsUp, FiTrendingUp, FiActivity,
  FiInfo, FiKey, FiSmartphone, FiGlobe, FiUserCheck, FiDroplet, FiZap, FiSun,
  FiMoon, FiCopy, FiEyeOff, FiCheck, FiArrowRight, FiBarChart2, FiCpu, FiDatabase,
} from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'
import { CardSkeleton } from '../components/LoadingSkeleton'
import {
  scanUrl, getCyberTips, getCyberHistory, getCyberCategories, getCyberThreats,
  getDailyTip, sendCyberChat, getSecurityScore, checkPassword,
} from '../services/cyberService'

// ─── Constants ──────────────────────────────────────────────────────────────

const THREAT_COLORS = {
  Safe: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  Low: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  Medium: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
  High: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  Critical: 'text-rose-700 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
}

const THREAT_BG = {
  Safe: 'from-green-400 to-green-600',
  Low: 'from-yellow-400 to-yellow-600',
  Medium: 'from-orange-400 to-orange-600',
  High: 'from-red-400 to-red-600',
  Critical: 'from-rose-500 to-red-700',
}

const PASSWORD_COLORS = {
  'Very Weak': 'bg-red-500',
  Weak: 'bg-orange-500',
  Fair: 'bg-yellow-500',
  Strong: 'bg-teal-500',
  'Very Strong': 'bg-emerald-500',
}

const PASSWORD_BG = {
  'Very Weak': 'from-red-400 to-red-600',
  Weak: 'from-orange-400 to-orange-600',
  Fair: 'from-yellow-400 to-yellow-600',
  Strong: 'from-teal-400 to-teal-600',
  'Very Strong': 'from-emerald-400 to-emerald-600',
}

const SEVERITY_COLORS = {
  Critical: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
  High: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  Medium: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
  Low: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
}

const SECURITY_QUESTIONS = [
  { id: 'strongPassword', label: 'I use 12+ character unique passwords', icon: FiLock },
  { id: 'mfa', label: 'I use Multi-Factor Authentication', icon: FiSmartphone },
  { id: 'updates', label: 'I keep my software & OS updated', icon: FiZap },
  { id: 'antivirus', label: 'I have antivirus / anti-malware installed', icon: FiShield },
  { id: 'backup', label: 'I regularly back up important data', icon: FiDatabase },
]

const CHAT_SUGGESTIONS = [
  'What is phishing?',
  'How to create strong passwords?',
  'How to spot a scam?',
  'What is 2FA?',
  'How to secure Wi-Fi?',
  'What is ransomware?',
]

const TIP_CATEGORY_ICONS = {
  Password: FiLock, Phishing: FiEye, Privacy: FiWifi, Device: FiShield,
  Scam: FiAlertTriangle, Email: FiMail, Malware: FiDroplet, General: FiInfo,
}

const TIP_COLORS = [
  'from-blue-500 to-blue-600', 'from-orange-500 to-orange-600',
  'from-teal-500 to-teal-600', 'from-purple-500 to-purple-600',
  'from-rose-500 to-rose-600', 'from-emerald-500 to-emerald-600',
]

const CATEGORY_ICONS = {
  password: FiLock, phishing: FiEye, email: FiMail, qr: FiSmartphone,
  otp: FiKey, banking: FiDroplet, malware: FiAlertTriangle,
  social: FiGlobe, wifi: FiWifi, privacy: FiShield,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
}

// ─── Reusable Sub-Components ─────────────────────────────────────────────────

const CyberCard = memo(({ children, className = '', ...props }) => (
  <motion.div
    variants={itemVariants}
    className={`bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/70 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
))
CyberCard.displayName = 'CyberCard'

const SectionHeader = memo(({ icon: Icon, title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
        <Icon size={16} className="text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
))
SectionHeader.displayName = 'SectionHeader'

const StatusBadge = memo(({ label, colorClass }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${colorClass}`}>
    {label}
  </span>
))
StatusBadge.displayName = 'StatusBadge'

const AnimatedScore = memo(({ score, size = 'md', color = 'from-orange-400 to-rose-500' }) => {
  const [displayScore, setDisplayScore] = useState(0)
  const circumference = 2 * Math.PI * (size === 'lg' ? 60 : 42)
  const strokeDashoffset = circumference - (displayScore / 100) * circumference

  useEffect(() => {
    let start = 0
    const duration = 1000
    const stepTime = 16
    const totalSteps = duration / stepTime
    const increment = score / totalSteps
    const timer = setInterval(() => {
      start += increment
      if (start >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.round(start))
      }
    }, stepTime)
    return () => clearInterval(timer)
  }, [score])

  const r = size === 'lg' ? 60 : 42
  const svgSize = size === 'lg' ? 140 : 100

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={svgSize} height={svgSize} className="transform -rotate-90">
        <defs>
          <linearGradient id={`scoreGrad-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>
        <circle cx={svgSize / 2} cy={svgSize / 2} r={r} fill="none"
          stroke="currentColor" strokeWidth="8"
          className="text-slate-200 dark:text-slate-700" />
        <circle cx={svgSize / 2} cy={svgSize / 2} r={r} fill="none"
          stroke={`url(#scoreGrad-${score})`} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold ${size === 'lg' ? 'text-2xl' : 'text-lg'} text-slate-800 dark:text-white`}>
          {displayScore}
        </span>
      </div>
    </div>
  )
})
AnimatedScore.displayName = 'AnimatedScore'

// ─── Main Component ─────────────────────────────────────────────────────────

export default function CyberPage() {
  // URL Scanner
  const [url, setUrl] = useState('')
  const [scanResult, setScanResult] = useState(null)
  const [scanLoading, setScanLoading] = useState(false)
  const [scanError, setScanError] = useState('')

  // Password Checker
  const [password, setPassword] = useState('')
  const [passwordResult, setPasswordResult] = useState(null)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Tips
  const [tips, setTips] = useState([])
  const [tipsLoading, setTipsLoading] = useState(true)
  const [tipsError, setTipsError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // History
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState('')

  // Threats
  const [threats, setThreats] = useState([])
  const [threatsLoading, setThreatsLoading] = useState(true)

  // Categories
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  // Daily Tip
  const [dailyTip, setDailyTip] = useState(null)
  const [dailyTipLoading, setDailyTipLoading] = useState(true)

  // AI Chat
  const [chatMessages, setChatMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hello! I am your Cyber Safety AI Assistant. Ask me anything about online security, phishing, passwords, or cyber threats.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  // Security Quiz
  const [securityAnswers, setSecurityAnswers] = useState({})
  const [securityScore, setSecurityScore] = useState(null)
  const [scoreLoading, setScoreLoading] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // Copy feedback
  const [copiedIndex, setCopiedIndex] = useState(null)

  // ─── Data Loading ───────────────────────────────────────────────────────────

  const loadTips = useCallback(async (category = '') => {
    setTipsLoading(true)
    setTipsError('')
    try {
      const { data } = await getCyberTips(category || undefined)
      setTips(Array.isArray(data) ? data : data?.tips || [])
    } catch (err) {
      setTipsError(err?.response?.data?.detail || 'Failed to load tips')
      setTips([])
    } finally {
      setTipsLoading(false)
    }
  }, [])

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true)
    setHistoryError('')
    try {
      const { data } = await getCyberHistory()
      setHistory(Array.isArray(data) ? data : data?.data || data?.results || [])
    } catch (err) {
      setHistoryError(err?.response?.data?.detail || 'Failed to load history')
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  const loadThreats = useCallback(async () => {
    try {
      const { data } = await getCyberThreats()
      setThreats(Array.isArray(data) ? data : data?.threats || [])
    } catch {
      setThreats([])
    } finally {
      setThreatsLoading(false)
    }
  }, [])

  const loadCategories = useCallback(async () => {
    try {
      const { data } = await getCyberCategories()
      setCategories(Array.isArray(data) ? data : data?.categories || [])
    } catch {
      setCategories([])
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  const loadDailyTip = useCallback(async () => {
    try {
      const { data } = await getDailyTip()
      setDailyTip(data?.tip || data || null)
    } catch {
      setDailyTip(null)
    } finally {
      setDailyTipLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTips(selectedCategory)
    loadHistory()
    loadThreats()
    loadCategories()
    loadDailyTip()
  }, [])

  useEffect(() => {
    if (selectedCategory !== undefined) {
      loadTips(selectedCategory)
    }
  }, [selectedCategory, loadTips])

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleUrlScan = async (e) => {
    e?.preventDefault()
    if (!url.trim()) return
    setScanLoading(true)
    setScanResult(null)
    setScanError('')
    try {
      const { data } = await scanUrl(url.trim())
      setScanResult(data)
      loadHistory()
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Scan failed. Please try again.'
      setScanError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setScanLoading(false)
    }
  }

  const handlePasswordCheck = async (e) => {
    e?.preventDefault()
    if (!password.trim()) return
    setPasswordLoading(true)
    setPasswordResult(null)
    try {
      const { data } = await checkPassword(password)
      setPasswordResult(data)
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Password check failed.'
      setPasswordResult({ strength: 'Unknown', score: 0, feedback: typeof msg === 'string' ? msg : JSON.stringify(msg) })
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleChat = async (text) => {
    const message = text || chatInput
    if (!message.trim() || chatLoading) return

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')
    setChatLoading(true)

    try {
      const { data } = await sendCyberChat(message.trim())
      const reply = data?.response || data?.reply || data?.answer || data?.message || 'I received your query. Please connect the backend AI for detailed responses.'
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } catch {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'Sorry, I encountered an error. Please try again later.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } finally {
      setChatLoading(false)
    }
  }

  const handleSecurityQuiz = async () => {
    if (Object.keys(securityAnswers).length < SECURITY_QUESTIONS.length) return
    setScoreLoading(true)
    try {
      const { data } = await getSecurityScore(securityAnswers)
      setSecurityScore(data)
      setQuizSubmitted(true)
    } catch (err) {
      const fallbackScore = Object.values(securityAnswers).filter(Boolean).length / SECURITY_QUESTIONS.length * 100
      setSecurityScore({ score: Math.round(fallbackScore), rating: fallbackScore >= 80 ? 'Good' : fallbackScore >= 50 ? 'Average' : 'Needs Improvement', feedback: 'Quiz submitted. Connect backend for detailed scoring.' })
      setQuizSubmitted(true)
    } finally {
      setScoreLoading(false)
    }
  }

  const handleRefresh = async () => {
    setTipsLoading(true)
    setHistoryLoading(true)
    setThreatsLoading(true)
    setDailyTipLoading(true)
    await Promise.all([loadTips(selectedCategory), loadHistory(), loadThreats(), loadDailyTip()])
  }

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    }).catch(() => {})
  }

  const handleChatSuggestion = (suggestion) => {
    handleChat(suggestion)
  }

  const toggleSecurityQuestion = (id) => {
    setSecurityAnswers(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // ─── Derived ────────────────────────────────────────────────────────────────

  const tipCategories = useMemo(() => {
    const cats = [...new Set(tips.map(t => t.category).filter(Boolean))]
    return cats
  }, [tips])

  const passwordStrengthScore = passwordResult?.score ?? 0
  const passwordStrengthLabel = passwordResult?.strength || 'Unknown'

  const securityQuizScore = securityScore?.score ?? 0

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Breadcrumb items={[{ label: 'Cyber Safety' }]} />

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiShield className="text-orange-600" /> Cyber Safety Agent
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Scan URLs, check password strength, learn about threats, and get AI-powered cyber safety guidance
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
        >
          <FiRefreshCw size={14} /> Refresh
        </motion.button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-3 gap-6"
      >
        {/* ───── Left Column ───── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Daily Tip Banner */}
          {dailyTipLoading ? (
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-white/30 rounded w-1/3 mb-2" />
              <div className="h-3 bg-white/20 rounded w-2/3" />
            </div>
          ) : dailyTip ? (
            <CyberCard className="bg-gradient-to-r from-orange-500 to-rose-500 !border-0 p-5">
              <div className="flex items-start gap-3">
                <FiStar className="text-white/80 mt-0.5" size={20} />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">🌐 Daily Cyber Tip</p>
                  <p className="text-white/90 text-sm leading-relaxed">{typeof dailyTip === 'string' ? dailyTip : dailyTip.text || dailyTip.tip || dailyTip.message}</p>
                </div>
              </div>
            </CyberCard>
          ) : null}

          {/* URL Scanner */}
          <CyberCard className="p-5">
            <SectionHeader
              icon={FiLink}
              title="URL Scanner"
              subtitle="Check if a link is safe"
            />
            <form onSubmit={handleUrlScan} className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setScanResult(null); setScanError('') }}
                  placeholder="Enter URL to scan (e.g. https://example.com)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>
              <motion.button
                type="submit"
                disabled={!url.trim() || scanLoading}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {scanLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <><FiShield size={14} /> Scan</>
                )}
              </motion.button>
            </form>

            {/* Scan Result */}
            <AnimatePresence>
              {scanError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <FiAlertTriangle size={14} /> {scanError}
                  </p>
                </motion.div>
              )}
              {scanResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {scanResult.is_malicious ? (
                        <FiAlertTriangle className="text-red-500" size={18} />
                      ) : (
                        <FiCheckCircle className="text-green-500" size={18} />
                      )}
                      <span className="font-semibold text-slate-800 dark:text-white text-sm">
                        {scanResult.is_malicious ? 'Threat Detected!' : 'Safe URL'}
                      </span>
                    </div>
                    {scanResult.threat_level && (
                      <StatusBadge label={scanResult.threat_level} colorClass={THREAT_COLORS[scanResult.threat_level] || THREAT_COLORS.Safe} />
                    )}
                  </div>
                  {scanResult.message && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">{scanResult.message}</p>
                  )}
                  {scanResult.details && (
                    <pre className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg overflow-x-auto">
                      {typeof scanResult.details === 'string' ? scanResult.details : JSON.stringify(scanResult.details, null, 2)}
                    </pre>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CyberCard>

          {/* Password Checker */}
          <CyberCard className="p-5">
            <SectionHeader
              icon={FiLock}
              title="Password Strength Checker"
              subtitle="Test how strong your password is"
            />
            <form onSubmit={handlePasswordCheck} className="mb-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordResult(null) }}
                    placeholder="Enter a password to check"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
                <motion.button
                  type="submit"
                  disabled={!password.trim() || passwordLoading}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {passwordLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : 'Check'}
                </motion.button>
              </div>
            </form>

            {/* Password Result */}
            <AnimatePresence>
              {passwordResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* Strength Meter */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrengthScore}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${PASSWORD_COLORS[passwordStrengthLabel] || 'bg-slate-400'}`}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Strength: {passwordStrengthLabel}
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{passwordStrengthScore}/100</span>
                  </div>
                  {passwordResult.feedback && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {passwordResult.feedback}
                    </p>
                  )}
                  {passwordResult.suggestions && passwordResult.suggestions.length > 0 && (
                    <ul className="space-y-1">
                      {passwordResult.suggestions.map((s, i) => (
                        <li key={i} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                          <span className="text-orange-500 mt-0.5">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CyberCard>

          {/* Threat Dashboard */}
          <CyberCard className="p-5">
            <SectionHeader
              icon={FiActivity}
              title="Live Threat Dashboard"
              subtitle="Current cyber threats & statistics"
            />
            {threatsLoading ? (
              <CardSkeleton count={2} />
            ) : threats.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {threats.map((threat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-center"
                  >
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{threat.count || threat.value || 0}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{threat.name || threat.label || `Threat ${i + 1}`}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FiActivity className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={32} />
                <p className="text-sm text-slate-500 dark:text-slate-400">No threat data available. Connect backend for live updates.</p>
              </div>
            )}
          </CyberCard>

          {/* Cyber Safety Tips */}
          <CyberCard className="p-5">
            <SectionHeader
              icon={FiBookOpen}
              title="Cyber Safety Tips"
              subtitle={tipsLoading ? 'Loading...' : `${tips.length} tips available`}
              action={
                tipCategories.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`text-xs px-2 py-1 rounded-lg transition-colors ${!selectedCategory ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                      All
                    </button>
                    {tipCategories.slice(0, 4).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                        className={`text-xs px-2 py-1 rounded-lg transition-colors ${cat === selectedCategory ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )
              }
            />

            {tipsLoading ? (
              <CardSkeleton count={3} />
            ) : tipsError ? (
              <div className="text-center py-6">
                <FiAlertTriangle className="mx-auto text-red-400 mb-2" size={28} />
                <p className="text-sm text-red-500">{tipsError}</p>
              </div>
            ) : tips.length === 0 ? (
              <div className="text-center py-6">
                <FiBookOpen className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={32} />
                <p className="text-sm text-slate-500 dark:text-slate-400">No tips available for this category.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tips.slice(0, 5).map((tip, i) => {
                  const Icon = TIP_CATEGORY_ICONS[tip.category] || FiInfo
                  const color = TIP_COLORS[i % TIP_COLORS.length]
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 group hover:shadow-sm transition-all"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon size={14} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {tip.text || tip.tip || tip.message || tip.title}
                        </p>
                        {tip.category && (
                          <span className="text-[10px] font-medium text-slate-400 mt-1 inline-block">{tip.category}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleCopy(tip.text || tip.tip || tip.message || tip.title, i)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                        title="Copy tip"
                      >
                        {copiedIndex === i ? <FiCheck size={14} className="text-green-500" /> : <FiCopy size={14} />}
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </CyberCard>

          {/* Scan History */}
          <CyberCard className="p-5">
            <SectionHeader
              icon={FiClock}
              title="Scan History"
              subtitle={historyLoading ? 'Loading...' : `${history.length} scans`}
            />
            {historyLoading ? (
              <CardSkeleton count={3} />
            ) : historyError ? (
              <div className="text-center py-6">
                <FiAlertTriangle className="mx-auto text-red-400 mb-2" size={28} />
                <p className="text-sm text-red-500">{historyError}</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-6">
                <FiClock className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={32} />
                <p className="text-sm text-slate-500 dark:text-slate-400">No scan history yet. Scan a URL to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-2 px-2 text-xs font-medium text-slate-500 dark:text-slate-400">URL</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-slate-500 dark:text-slate-400">Status</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-slate-500 dark:text-slate-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 10).map((item, i) => (
                      <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="py-2.5 px-2 text-xs text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                          {item.url || item.target || item.scanned_url}
                        </td>
                        <td className="py-2.5 px-2">
                          <StatusBadge
                            label={item.is_malicious ? 'Malicious' : item.status || 'Safe'}
                            colorClass={item.is_malicious ? THREAT_COLORS.High : THREAT_COLORS.Safe}
                          />
                        </td>
                        <td className="py-2.5 px-2 text-xs text-slate-500 dark:text-slate-400">
                          {item.created_at || item.scanned_at || item.timestamp ? new Date(item.created_at || item.scanned_at || item.timestamp).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CyberCard>
        </div>

        {/* ───── Right Column ───── */}
        <div className="space-y-6">

          {/* Security Quiz */}
          <CyberCard className="p-5">
            <SectionHeader
              icon={FiShield}
              title="Security Self-Assessment"
              subtitle="Evaluate your cyber hygiene"
            />
            {quizSubmitted && securityScore ? (
              <div className="text-center py-4">
                <AnimatedScore score={securityQuizScore} size="lg" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-3">
                  {securityScore.rating || (securityQuizScore >= 80 ? 'Great job!' : securityQuizScore >= 50 ? 'Room for improvement' : 'Needs attention')}
                </p>
                {securityScore.feedback && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{securityScore.feedback}</p>
                )}
                <button
                  onClick={() => { setQuizSubmitted(false); setSecurityScore(null); setSecurityAnswers({}) }}
                  className="mt-4 text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Retake Quiz
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {SECURITY_QUESTIONS.map(q => (
                    <button
                      key={q.id}
                      onClick={() => toggleSecurityQuestion(q.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        securityAnswers[q.id]
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        securityAnswers[q.id]
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                      }`}>
                        {securityAnswers[q.id] ? <FiCheck size={14} /> : <q.icon size={14} />}
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex-1">{q.label}</span>
                    </button>
                  ))}
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSecurityQuiz}
                  disabled={Object.keys(securityAnswers).length < SECURITY_QUESTIONS.length || scoreLoading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {scoreLoading ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Scoring...</>
                  ) : (
                    <><FiTrendingUp size={14} /> Check My Score</>
                  )}
                </motion.button>
              </>
            )}
          </CyberCard>

          {/* AI Chat Assistant */}
          <CyberCard className="p-5">
            <SectionHeader
              icon={FiMessageSquare}
              title="AI Cyber Assistant"
              subtitle="Ask anything about cyber safety"
            />
            <div className="h-[300px] flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-3 scrollbar-thin pr-1">
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-orange-500 to-rose-500'
                    }`}>
                      {msg.role === 'user' ? <FiUserCheck size={12} className="text-white" /> : <FiCpu size={12} className="text-white" />}
                    </div>
                    <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {chatLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
                      <FiCpu size={12} className="text-white" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Suggestions */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                {CHAT_SUGGESTIONS.slice(0, 3).map(s => (
                  <button
                    key={s}
                    onClick={() => handleChatSuggestion(s)}
                    className="shrink-0 text-[10px] bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 px-2.5 py-1 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => { e.preventDefault(); handleChat() }}
                className="flex gap-2"
              >
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about cyber safety..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-xs outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
                <motion.button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  whileTap={{ scale: 0.92 }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white flex items-center justify-center disabled:opacity-50 shrink-0"
                >
                  <FiSend size={13} />
                </motion.button>
              </form>
            </div>
          </CyberCard>

          {/* Quick Info */}
          <CyberCard className="p-5 bg-gradient-to-br from-orange-500 to-rose-500 !border-0">
            <FiInfo className="text-white/80 mb-2" size={20} />
            <h3 className="text-white font-semibold text-sm mb-1">Stay Safe Online</h3>
            <ul className="text-xs text-white/80 space-y-1.5">
              <li>• Use unique passwords for each account</li>
              <li>• Enable 2FA wherever possible</li>
              <li>• Don't click suspicious links</li>
              <li>• Keep software updated</li>
              <li>• Use a password manager</li>
            </ul>
          </CyberCard>
        </div>
      </motion.div>
    </motion.div>
  )
}

