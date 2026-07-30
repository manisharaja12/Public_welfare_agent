import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiFileText, FiUpload, FiClock, FiCheckCircle, FiAlertCircle, FiXCircle,
  FiRefreshCw, FiDownload, FiSearch, FiX, FiFilter, FiArrowUp, FiArrowDown,
  FiTrash2, FiPlus, FiBarChart2, FiTrendingUp, FiTarget, FiClock as FiClockIcon,
  FiCalendar, FiMapPin, FiUser, FiChevronLeft, FiChevronRight, FiZap,
  FiInfo, FiAlertTriangle, FiStar, FiActivity, FiPieChart
} from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'
import { CardSkeleton } from '../components/LoadingSkeleton'
import {
  submitComplaint, getComplaints, getResolutionEstimate, getComplaintTimeline,
  deleteComplaint, searchComplaints, getComplaintDashboard, getComplaintAnalytics,
  aiSuggestComplaint
} from '../services/complaintService'
import { useToast } from '../hooks/useToast'

// ─── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Road & Infrastructure', 'Water Supply', 'Electricity', 'Sanitation',
  'Public Safety', 'Healthcare', 'Education', 'Other'
]

const STATUS_LIST = ['Submitted', 'Assigned', 'Under Review', 'In Progress', 'Resolved', 'Closed', 'Rejected']

const PRIORITY_LIST = ['Low', 'Medium', 'High', 'Critical']

const CATEGORY_MAP = {
  'Road & Infrastructure': 'Road Damage', 'Water Supply': 'Water Leakage',
  'Electricity': 'Electricity', 'Sanitation': 'Garbage',
  'Public Safety': 'Public Property', 'Healthcare': 'Other',
  'Education': 'Other', 'Other': 'Other'
}

const STATUS_ICONS = {
  Resolved: FiCheckCircle, Submitted: FiClock, Assigned: FiAlertCircle,
  'Under Review': FiAlertCircle, 'In Progress': FiAlertCircle,
  Closed: FiXCircle, Rejected: FiXCircle
}

const STATUS_COLORS = {
  Resolved: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  Submitted: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  Assigned: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  'Under Review': 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
  'In Progress': 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
  Closed: 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
  Rejected: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
}

const PRIORITY_BADGE = {
  Low: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  Medium: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  High: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  Critical: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
}

const STAT_CARDS_META = [
  { key: 'total', label: 'Total Complaints', icon: FiFileText, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { key: 'resolved', label: 'Resolved', icon: FiCheckCircle, color: 'from-green-500 to-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { key: 'pending', label: 'Pending', icon: FiClock, color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { key: 'in_progress', label: 'In Progress', icon: FiActivity, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' }
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function shortId(id) {
  return `#${id.slice(0, 6).toUpperCase()}`
}

function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

function downloadCSV(filename, data) {
  const BOM = '\uFEFF'
  const csv = BOM + data
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
          {loading ? (
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          ) : (
            <motion.p
              key={value}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-slate-900 dark:text-white"
            >
              {value}
            </motion.p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Filter Pills ───────────────────────────────────────────────────────────

function FilterPills({ label, options, selected, onChange, color = 'purple' }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}:</span>
      <button
        onClick={() => onChange(null)}
        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all
          ${!selected
            ? `bg-${color}-50 border-${color}-300 text-${color}-600 dark:bg-${color}-900/30 dark:border-${color}-700 dark:text-${color}-400`
            : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
      >
        All
      </button>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt === selected ? null : opt)}
          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all
            ${opt === selected
              ? `bg-${color}-50 border-${color}-300 text-${color}-600 dark:bg-${color}-900/30 dark:border-${color}-700 dark:text-${color}-400 ring-2 ring-${color}-200 dark:ring-${color}-800`
              : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

// ─── Bar Chart (simple div-based) ───────────────────────────────────────────

function BarChart({ data, color = 'purple', height = 160 }) {
  const maxVal = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / maxVal) * 100}%` }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className={`w-full rounded-t-lg bg-gradient-to-t from-${color}-500 to-${color}-400 dark:from-${color}-600 dark:to-${color}-500 relative group-hover:opacity-80 transition-opacity`}
            style={{ minHeight: d.value > 0 ? 4 : 0 }}
          />
          <span className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap truncate max-w-[60px] text-center">
            {d.name}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Donut Chart (simple SVG) ───────────────────────────────────────────────

function DonutChart({ data, size = 120 }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const colors = ['#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#14b8a6', '#ec4899', '#f97316']
  let cumulativePercent = 0
  const segments = data.map((d, i) => {
    const percent = d.value / total
    const startPercent = cumulativePercent
    cumulativePercent += percent
    const startX = Math.cos(2 * Math.PI * startPercent - Math.PI / 2) * (size / 2 - 10)
    const startY = Math.sin(2 * Math.PI * startPercent - Math.PI / 2) * (size / 2 - 10)
    const endX = Math.cos(2 * Math.PI * cumulativePercent - Math.PI / 2) * (size / 2 - 10)
    const endY = Math.sin(2 * Math.PI * cumulativePercent - Math.PI / 2) * (size / 2 - 10)
    const largeArc = percent > 0.5 ? 1 : 0
    return {
      path: `M ${size / 2} ${size / 2} L ${startX + size / 2} ${startY + size / 2} A ${size / 2 - 10} ${size / 2 - 10} 0 ${largeArc} 1 ${endX + size / 2} ${endY + size / 2} Z`,
      color: colors[i % colors.length],
      label: d.name,
      value: d.value,
      percent: Math.round(percent * 100)
    }
  })
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        {segments.map((s, i) => (
          <motion.path
            key={i}
            d={s.path}
            fill={s.color}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <title>{s.label}: {s.value} ({s.percent}%)</title>
          </motion.path>
        ))}
        <circle cx={size / 2} cy={size / 2} r={size / 4} fill="white" className="dark:fill-slate-800" />
      </svg>
      <div className="space-y-1.5">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-slate-600 dark:text-slate-400">{s.label}</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 ml-auto">{s.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Timeline Modal ─────────────────────────────────────────────────────────

function TimelineModal({ complaintId, onClose }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!complaintId) return
    setLoading(true)
    setError('')
    getComplaintTimeline(complaintId)
      .then(({ data }) => setEvents(data.events || []))
      .catch(() => setError('Failed to load timeline.'))
      .finally(() => setLoading(false))
  }, [complaintId])

  const eventColors = {
    Submitted: 'border-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
    Assigned: 'border-blue-400 bg-blue-100 dark:bg-blue-900/30',
    'Under Review': 'border-indigo-400 bg-indigo-100 dark:bg-indigo-900/30',
    'In Progress': 'border-purple-400 bg-purple-100 dark:bg-purple-900/30',
    Resolved: 'border-green-400 bg-green-100 dark:bg-green-900/30',
    Closed: 'border-slate-400 bg-slate-100 dark:bg-slate-800',
    Rejected: 'border-red-400 bg-red-100 dark:bg-red-900/30'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg max-h-[80vh] overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <FiClockIcon className="text-purple-500" size={18} />
            <h3 className="font-semibold text-slate-800 dark:text-white">Complaint Timeline</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Close timeline"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-4rem)]">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse mt-1" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <FiAlertTriangle className="mx-auto text-red-400 mb-2" size={32} />
              <p className="text-sm text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-xs text-purple-600 dark:text-purple-400 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <FiInfo className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={32} />
              <p className="text-sm text-slate-500 dark:text-slate-400">No timeline events available.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-6">
                {events.map((evt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${eventColors[evt.status] || 'border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-700'}`}>
                      <div className="w-2 h-2 rounded-full bg-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{evt.status}</p>
                      {evt.note && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{evt.note}</p>
                      )}
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {formatDateTime(evt.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Delete Confirmation Modal ──────────────────────────────────────────────

function DeleteModal({ complaint, onClose, onConfirm, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <FiTrash2 className="text-red-500" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">Delete Complaint</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
          Are you sure you want to delete this complaint?
        </p>
        {complaint && (
          <p className="text-sm font-medium text-slate-800 dark:text-white mb-4">
            {complaint.title} ({shortId(complaint.id)})
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 rounded-xl transition-colors flex items-center gap-2"
          >
            {loading ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Deleting...</>
            ) : (
              <><FiTrash2 size={14} /> Delete</>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Analytics Panel ─────────────────────────────────────────────────────────

function AnalyticsPanel({ analytics, statsLoading }) {
  const [expanded, setExpanded] = useState(false)

  if (statsLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
        <CardSkeleton count={2} />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        aria-expanded={expanded}
        aria-controls="analytics-panel"
      >
        <div className="flex items-center gap-2">
          <FiBarChart2 className="text-purple-500" size={18} />
          <h2 className="font-semibold text-slate-800 dark:text-white">Analytics & Insights</h2>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiArrowUp size={18} className="text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && analytics && (
          <motion.div
            id="analytics-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6">
              {/* KPI Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-center">
                  <FiTrendingUp className="mx-auto text-green-500 mb-1" size={18} />
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{analytics.resolution_rate}%</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Resolution Rate</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-center">
                  <FiTarget className="mx-auto text-blue-500 mb-1" size={18} />
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{analytics.avg_resolution_days}d</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Avg. Resolution</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-center">
                  <FiStar className="mx-auto text-purple-500 mb-1" size={18} />
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{analytics.total}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Total</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-center">
                  <FiActivity className="mx-auto text-orange-500 mb-1" size={18} />
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{analytics.by_status?.find(s => s.name === 'In Progress')?.value || 0}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Active</p>
                </div>
              </div>

              {/* Trend Chart */}
              {analytics.trend && analytics.trend.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                    <FiCalendar size={14} /> 7-Day Trend
                  </h3>
                  <BarChart data={analytics.trend} color="purple" height={120} />
                </div>
              )}

              {/* Distribution Charts */}
              <div className="grid md:grid-cols-3 gap-6">
                {analytics.by_category && analytics.by_category.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">By Category</h3>
                    <DonutChart data={analytics.by_category} size={100} />
                  </div>
                )}
                {analytics.by_priority && analytics.by_priority.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">By Priority</h3>
                    <DonutChart data={analytics.by_priority} size={100} />
                  </div>
                )}
                {analytics.by_status && analytics.by_status.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">By Status</h3>
                    <DonutChart data={analytics.by_status} size={100} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ComplaintsPage() {
  const { toasts, addToast, removeToast } = useToast()

  // Stats & Analytics
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, in_progress: 0 })
  const [analytics, setAnalytics] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  // Complaint list
  const [complaints, setComplaints] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [pagination, setPagination] = useState({ total: 0, page: 1, page_size: 10 })

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState(null)
  const [filterCategory, setFilterCategory] = useState(null)
  const [filterPriority, setFilterPriority] = useState(null)
  const [sortOrder, setSortOrder] = useState('newest')

  // Form
  const [form, setForm] = useState({ title: '', category: '', description: '', location: '' })
  const [imageUploaded, setImageUploaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [estimate, setEstimate] = useState(null)
  const [aiSuggesting, setAiSuggesting] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState(null)

  // Modals
  const [timelineComplaintId, setTimelineComplaintId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Refresh
  const [refreshing, setRefreshing] = useState(false)

  // Refs
  const searchRef = useRef(null)

  // ─── Derived ────────────────────────────────────────────────────────────────

  const appliedFilters = useMemo(() => {
    const f = {}
    if (filterStatus) f.status = filterStatus
    if (filterCategory) {
      const mapped = CATEGORY_MAP[filterCategory]
      if (mapped) f.category = mapped
    }
    if (filterPriority) f.priority = filterPriority
    return f
  }, [filterStatus, filterCategory, filterPriority])

  // ─── Data Loading ───────────────────────────────────────────────────────────

  const loadDashboard = useCallback(async () => {
    try {
      const { data } = await getComplaintDashboard()
      setStats({
        total: data.total || 0,
        resolved: data.resolved || 0,
        pending: data.pending || 0,
        in_progress: data.in_progress || 0
      })
    } catch {
      setStats({ total: 0, resolved: 0, pending: 0, in_progress: 0 })
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const loadAnalytics = useCallback(async () => {
    try {
      const { data } = await getComplaintAnalytics()
      setAnalytics(data)
    } catch {
      setAnalytics(null)
    } finally {
      setAnalyticsLoading(false)
    }
  }, [])

  const loadComplaints = useCallback(async (page = 1, filters = {}) => {
    setListLoading(true)
    setListError('')
    try {
      const params = { page, page_size: 10, ...filters }
      const { data } = await getComplaints(params)
      setComplaints(data.data || [])
      setPagination({ total: data.total || 0, page: data.page || 1, page_size: data.page_size || 10 })
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to load complaints.'
      setListError(typeof msg === 'string' ? msg : JSON.stringify(msg))
      setComplaints([])
    } finally {
      setListLoading(false)
    }
  }, [])

  const handleSearch = useCallback(
    debounce(async (q) => {
      if (!q || q.length < 2) {
        loadComplaints(1, appliedFilters)
        return
      }
      setListLoading(true)
      setListError('')
      try {
        const { data } = await searchComplaints(q, { page: 1, page_size: 10 })
        setComplaints(data.data || [])
        setPagination({ total: data.total || 0, page: data.page || 1, page_size: data.page_size || 10 })
      } catch (err) {
        const msg = err?.response?.data?.detail || 'Search failed.'
        setListError(typeof msg === 'string' ? msg : JSON.stringify(msg))
      } finally {
        setListLoading(false)
      }
    }, 400),
    [loadComplaints, appliedFilters]
  )

  // ─── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    loadDashboard()
    loadAnalytics()
  }, [loadDashboard, loadAnalytics])

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) return
    loadComplaints(1, appliedFilters)
  }, [filterStatus, filterCategory, filterPriority, loadComplaints, searchQuery])

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleRefresh = async () => {
    setRefreshing(true)
    setStatsLoading(true)
    setAnalyticsLoading(true)
    await Promise.all([loadDashboard(), loadAnalytics(), loadComplaints(1, appliedFilters)])
    setRefreshing(false)
    addToast('Dashboard refreshed successfully', 'success')
  }

  const handleFormChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setAiSuggestion(null)
    setEstimate(null)
  }

  const handleAISuggest = async () => {
    if (!form.title.trim() && !form.description.trim()) {
      addToast('Enter a title or description first', 'error')
      return
    }
    const text = `${form.title} ${form.description}`.trim()
    setAiSuggesting(true)
    setAiSuggestion(null)
    try {
      const { data } = await aiSuggestComplaint(text)
      setAiSuggestion(data)
      // Find matching category in our UI list
      const match = Object.entries(CATEGORY_MAP).find(([, v]) => v === data.category)
      if (match) {
        setForm((prev) => ({ ...prev, category: match[0] }))
      }
      addToast(`Suggested: ${data.category} (${data.priority})`, 'info')
    } catch {
      addToast('AI suggestion failed. Try again.', 'error')
    } finally {
      setAiSuggesting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.category || !form.description.trim()) {
      addToast('Please fill in Title, Category, and Description.', 'error')
      return
    }
    setSubmitting(true)
    setEstimate(null)
    try {
      const { data: created } = await submitComplaint({
        title: form.title,
        description: form.description,
        category: CATEGORY_MAP[form.category] || 'Other',
        priority: aiSuggestion?.priority || 'Medium',
        location: form.location || undefined
      })
      addToast('Complaint submitted successfully!', 'success')
      setForm({ title: '', category: '', description: '', location: '' })
      setImageUploaded(false)
      setAiSuggestion(null)

      // Fetch estimate
      getResolutionEstimate(created.id)
        .then(({ data: est }) => setEstimate(est))
        .catch(() => {})

      await Promise.all([loadDashboard(), loadComplaints(1, appliedFilters)])
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to submit complaint.'
      addToast(typeof msg === 'string' ? msg : JSON.stringify(msg), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePageChange = (page) => {
    if (searchQuery && searchQuery.length >= 2) {
      handleSearch(searchQuery)
      return
    }
    loadComplaints(page, appliedFilters)
  }

  const handleSortToggle = () => {
    const newOrder = sortOrder === 'newest' ? 'oldest' : 'newest'
    setSortOrder(newOrder)
    const sorted = [...complaints].sort((a, b) => {
      const da = new Date(a.created_at).getTime()
      const db = new Date(b.created_at).getTime()
      return newOrder === 'newest' ? db - da : da - db
    })
    setComplaints(sorted)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteComplaint(deleteTarget.id)
      addToast('Complaint deleted successfully', 'success')
      setDeleteTarget(null)
      await Promise.all([loadDashboard(), loadComplaints(1, appliedFilters)])
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to delete complaint.'
      addToast(typeof msg === 'string' ? msg : JSON.stringify(msg), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleExportCSV = () => {
    if (complaints.length === 0) {
      addToast('No complaints to export', 'error')
      return
    }
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Location', 'Created At', 'Updated At']
    const rows = complaints.map((c) => [
      c.id, `"${c.title.replace(/"/g, '""')}"`, c.category, c.priority,
      c.status, c.location || '', formatDateTime(c.created_at), formatDateTime(c.updated_at)
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    downloadCSV(`complaints_${new Date().toISOString().slice(0, 10)}.csv`, csv)
    addToast('CSV exported successfully', 'success')
  }

  const totalPages = Math.ceil(pagination.total / pagination.page_size)

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Breadcrumb items={[{ label: 'Citizen Complaints' }]} />

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiFileText className="text-purple-600" /> Citizen Complaint Agent
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            File grievances and track resolution status in real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            aria-label="Export CSV"
          >
            <FiDownload size={14} /> Export
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 disabled:opacity-60"
            aria-label="Refresh data"
          >
            <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ repeat: refreshing ? Infinity : 0, duration: 1 }}>
              <FiRefreshCw size={14} />
            </motion.div>
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STAT_CARDS_META.map((meta) => (
          <StatCard
            key={meta.key}
            label={meta.label}
            value={stats[meta.key]}
            icon={meta.icon}
            color={meta.color}
            loading={statsLoading}
          />
        ))}
      </div>

      {/* Analytics Panel */}
      <div className="mb-6">
        <AnalyticsPanel analytics={analytics} statsLoading={analyticsLoading} />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Complaint Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submit Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <FiPlus className="text-purple-500" size={18} /> File New Complaint
              </h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Title */}
              <div>
                <label htmlFor="complaint-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Complaint Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="complaint-title"
                  value={form.title}
                  onChange={handleFormChange('title')}
                  placeholder="Brief title of your complaint"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                  aria-required="true"
                />
              </div>

              {/* Category + AI Suggest */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="complaint-category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAISuggest}
                    disabled={aiSuggesting}
                    className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 disabled:opacity-50 transition-colors"
                    aria-label="AI suggest category"
                  >
                    {aiSuggesting ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full" /> Suggesting...</>
                    ) : (
                      <><FiZap size={12} /> AI Suggest</>
                    )}
                  </button>
                </div>
                <select
                  id="complaint-category"
                  value={form.category}
                  onChange={handleFormChange('category')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                  aria-required="true"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {aiSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                  >
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      <FiZap className="inline mr-1" size={12} />
                      AI suggests <strong>{aiSuggestion.category}</strong> ({aiSuggestion.priority} priority) — {aiSuggestion.reason}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="complaint-desc" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="complaint-desc"
                  value={form.description}
                  onChange={handleFormChange('description')}
                  rows={4}
                  placeholder="Describe your complaint in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-shadow"
                  aria-required="true"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="complaint-location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Location <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    id="complaint-location"
                    value={form.location}
                    onChange={handleFormChange('location')}
                    placeholder="Area, Street, City"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Attach Image <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <label className="flex items-center gap-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors group">
                  <FiUpload className="text-slate-400 group-hover:text-purple-500 transition-colors" size={20} />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {imageUploaded ? '✅ Image attached' : 'Click to upload image evidence'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={() => setImageUploaded(true)}
                    accept="image/*"
                    aria-label="Upload image"
                  />
                </label>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-200 dark:shadow-purple-900/30"
              >
                {submitting ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Submitting...</>
                ) : (
                  <><FiFileText size={16} /> Submit Complaint</>
                )}
              </motion.button>
            </form>

            {/* Resolution Estimate */}
            <AnimatePresence>
              {estimate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-5 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                >
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-1 flex items-center gap-1.5">
                    <FiClockIcon size={14} /> Estimated Resolution
                  </p>
                  <p className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                    {estimate.estimate}
                  </p>
                  <ul className="space-y-1 mb-2">
                    {estimate.reasons.map((r, i) => (
                      <li key={i} className="text-xs text-purple-600 dark:text-purple-400 flex items-start gap-1">
                        <span className="mt-0.5">•</span> {r}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-purple-500 italic">{estimate.disclaimer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Complaint List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                  <FiFileText size={16} className="text-purple-500" /> Complaint History
                  <span className="text-xs font-normal text-slate-400">({pagination.total})</span>
                </h2>
                <button
                  onClick={handleSortToggle}
                  className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
                  aria-label={`Sort by ${sortOrder === 'newest' ? 'oldest' : 'newest'} first`}
                >
                  {sortOrder === 'newest' ? <FiArrowDown size={12} /> : <FiArrowUp size={12} />}
                  {sortOrder === 'newest' ? 'Newest' : 'Oldest'} first
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  placeholder="Search complaints by title or description..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                  aria-label="Search complaints"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      loadComplaints(1, appliedFilters)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    aria-label="Clear search"
                  >
                    <FiX size={15} />
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div className="space-y-2">
                <FilterPills
                  label="Status"
                  options={STATUS_LIST}
                  selected={filterStatus}
                  onChange={setFilterStatus}
                  color="purple"
                />
                <FilterPills
                  label="Category"
                  options={CATEGORIES}
                  selected={filterCategory}
                  onChange={setFilterCategory}
                  color="blue"
                />
                <FilterPills
                  label="Priority"
                  options={PRIORITY_LIST}
                  selected={filterPriority}
                  onChange={setFilterPriority}
                  color="orange"
                />
              </div>

              {(filterStatus || filterCategory || filterPriority) && (
                <button
                  onClick={() => {
                    setFilterStatus(null)
                    setFilterCategory(null)
                    setFilterPriority(null)
                  }}
                  className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 transition-colors"
                >
                  <FiX size={12} /> Clear all filters
                </button>
              )}
            </div>

            {/* List Content */}
            <div className="p-5">
              {listLoading ? (
                <CardSkeleton count={3} />
              ) : listError ? (
                <div className="text-center py-10">
                  <FiAlertTriangle className="mx-auto text-red-400 mb-3" size={36} />
                  <p className="text-sm text-red-500 dark:text-red-400 mb-2">{listError}</p>
                  <button
                    onClick={() => loadComplaints(1, appliedFilters)}
                    className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 mx-auto transition-colors"
                  >
                    <FiRefreshCw size={12} /> Retry
                  </button>
                </div>
              ) : complaints.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
                    <FiFileText className="text-slate-300 dark:text-slate-500" size={28} />
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {searchQuery ? 'No complaints match your search.' : 'No complaints submitted yet.'}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {searchQuery ? 'Try different keywords or clear filters.' : 'Use the form above to file your first complaint.'}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {complaints.map((complaint, idx) => {
                    const Icon = STATUS_ICONS[complaint.status] || FiClock
                    const statusCls = STATUS_COLORS[complaint.status] || STATUS_COLORS.Submitted
                    const priorityCls = PRIORITY_BADGE[complaint.priority] || PRIORITY_BADGE.Medium

                    return (
                      <motion.div
                        key={complaint.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                                {complaint.title}
                              </p>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priorityCls}`}>
                                {complaint.priority}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {complaint.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 dark:text-slate-500">
                              <span className="flex items-center gap-1">
                                <FiFileText size={10} /> {complaint.category}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiCalendar size={10} /> {formatDate(complaint.created_at)}
                              </span>
                              {complaint.location && (
                                <span className="flex items-center gap-1">
                                  <FiMapPin size={10} /> {complaint.location}
                                </span>
                              )}
                              {complaint.assigned_to && (
                                <span className="flex items-center gap-1">
                                  <FiUser size={10} /> {complaint.assigned_to}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${statusCls}`}>
                              <Icon size={10} /> {complaint.status}
                            </span>
                            <span className="text-[10px] text-slate-400">{shortId(complaint.id)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-600/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setTimelineComplaintId(complaint.id)}
                            className="text-[10px] font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 px-2 py-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center gap-1"
                            aria-label="View timeline"
                          >
                            <FiClockIcon size={11} /> Timeline
                          </button>
                          <button
                            onClick={() => setDeleteTarget(complaint)}
                            className="text-[10px] font-medium text-red-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1"
                            aria-label="Delete complaint"
                          >
                            <FiTrash2 size={11} /> Delete
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Showing {(pagination.page - 1) * pagination.page_size + 1}–{Math.min(pagination.page * pagination.page_size, pagination.total)} of {pagination.total}
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page <= 1}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                          aria-label="Previous page"
                        >
                          <FiChevronLeft size={16} />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1
                          } else if (pagination.page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = pagination.page - 2 + i
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                                pageNum === pagination.page
                                  ? 'bg-purple-500 text-white'
                                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page >= totalPages}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                          aria-label="Next page"
                        >
                          <FiChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-3 text-sm">Quick Overview</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Total', value: stats.total, color: 'text-blue-600 dark:text-blue-400' },
                { label: 'Resolved', value: stats.resolved, color: 'text-green-600 dark:text-green-400' },
                { label: 'Pending', value: stats.pending, color: 'text-yellow-600 dark:text-yellow-400' },
                { label: 'Active', value: stats.in_progress, color: 'text-purple-600 dark:text-purple-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-center">
                  <p className={`text-lg font-bold ${color}`}>{statsLoading ? '...' : value}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 text-white">
            <FiInfo className="mb-2" size={20} />
            <h3 className="font-semibold text-sm mb-1">How to File a Complaint</h3>
            <ul className="text-xs space-y-1.5 opacity-90">
              <li>1. Provide a clear title and description</li>
              <li>2. Select the correct category</li>
              <li>3. Add location for faster response</li>
              <li>4. Track status in the history section</li>
            </ul>
          </div>

          {/* Report Card */}
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-5 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertTriangle className="text-orange-500" size={16} />
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Need Urgent Help?</p>
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mb-3">
              For emergencies, use the Emergency Agent or call 112.
            </p>
            <a
              href="/emergency"
              className="block text-center bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
            >
              Go to Emergency
            </a>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-64 max-w-sm ${
                t.type === 'success'
                  ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                  : t.type === 'error'
                  ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                  : 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
              }`}
            >
              {t.type === 'success' ? (
                <FiCheckCircle className="text-green-500 shrink-0" size={18} />
              ) : t.type === 'error' ? (
                <FiAlertCircle className="text-red-500 shrink-0" size={18} />
              ) : (
                <FiInfo className="text-blue-500 shrink-0" size={18} />
              )}
              <p className="text-sm text-slate-700 dark:text-slate-300 flex-1">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label="Dismiss notification"
              >
                <FiX size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Timeline Modal */}
      <AnimatePresence>
        {timelineComplaintId && (
          <TimelineModal
            complaintId={timelineComplaintId}
            onClose={() => setTimelineComplaintId(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            complaint={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirm}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

