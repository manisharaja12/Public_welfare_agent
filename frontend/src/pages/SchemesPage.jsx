import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiBook, FiCheckCircle, FiArrowRight, FiBookmark,
  FiExternalLink, FiStar, FiRefreshCw, FiAlertCircle, FiX,
  FiChevronDown, FiChevronUp, FiLoader
} from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'
import {
  getSchemes, searchSchemes, getRecommendations,
  saveScheme, getSavedSchemes, deleteSavedScheme, getProfile
} from '../services/schemeService'

const CATEGORIES = ['All', 'Agriculture', 'Education', 'Health', 'Housing', 'Finance', 'Skill Development', 'Women & Child', 'Social Welfare', 'Disability Welfare', 'Entrepreneurship']

// ── Score badge colour ─────────────────────────────────────────
function ScoreBadge({ score }) {
  const pct = Math.round(score * 100)
  const color = pct >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : pct >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{pct}% match</span>
}

// ── Single scheme card ─────────────────────────────────────────
function SchemeCard({ scheme, savedIds, onSave, onUnsave, isRecommended }) {
  const [expanded, setExpanded] = useState(false)
  const isSaved = savedIds.has(scheme.scheme_id || scheme.id)
  const savedEntryId = [...savedIds.entries?.() || []].find(([, sid]) => sid === (scheme.scheme_id || scheme.id))?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm leading-tight">
                {scheme.scheme_name || scheme.name}
              </h3>
              {isRecommended && scheme.eligibility_score !== undefined && (
                <ScoreBadge score={scheme.eligibility_score} />
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                {scheme.category}
              </span>
              <span className="text-xs text-slate-400">{scheme.ministry}</span>
            </div>
          </div>
          <button
            onClick={() => isSaved ? onUnsave(scheme.scheme_id || scheme.id) : onSave(scheme.scheme_id || scheme.id)}
            className={`p-2 rounded-xl transition-colors shrink-0 ${isSaved ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-teal-600'}`}
            title={isSaved ? 'Remove from saved' : 'Save scheme'}
          >
            <FiBookmark size={15} className={isSaved ? 'fill-current' : ''} />
          </button>
        </div>

        {/* AI Explanation */}
        {isRecommended && scheme.eligibility_explanation && (
          <p className="text-xs text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl px-3 py-2 mb-3 leading-relaxed">
            💡 {scheme.eligibility_explanation}
          </p>
        )}

        {/* Benefits preview */}
        {scheme.benefits?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Key Benefits</p>
            <ul className="space-y-1">
              {scheme.benefits.slice(0, expanded ? undefined : 2).map((b, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <FiCheckCircle className="text-green-500 mt-0.5 shrink-0" size={11} /> {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {scheme.required_documents?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Required Documents</p>
                  <div className="flex flex-wrap gap-1">
                    {scheme.required_documents.map((d, i) => (
                      <span key={i} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg">{d}</span>
                    ))}
                  </div>
                </div>
              )}
              {scheme.application_process?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">How to Apply</p>
                  <ol className="space-y-1">
                    {scheme.application_process.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <span className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0 font-bold text-[10px]">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {scheme.last_date && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  📅 Last Date: <span className="font-semibold text-slate-700 dark:text-slate-300">{scheme.last_date}</span>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 transition-colors"
          >
            {expanded ? <><FiChevronUp size={13} /> Less</> : <><FiChevronDown size={13} /> More details</>}
          </button>
          {scheme.apply_link && (
            <a
              href={scheme.apply_link} target="_blank" rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-xl transition-colors"
            >
              Apply Now <FiExternalLink size={11} />
            </a>
          )}
          {scheme.official_website && (
            <a
              href={scheme.official_website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline"
            >
              Official Site <FiExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
export default function SchemesPage() {
  const [tab, setTab]                   = useState('all')       // 'all' | 'recommended' | 'saved'
  const [query, setQuery]               = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [schemes, setSchemes]           = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [savedSchemes, setSavedSchemes] = useState([])
  const [savedMap, setSavedMap]         = useState(new Map())   // scheme_id → saved doc id
  const [profile, setProfile]           = useState(null)
  const [loading, setLoading]           = useState(false)
  const [recLoading, setRecLoading]     = useState(false)
  const [error, setError]               = useState('')
  const [toast, setToast]               = useState('')
  const [total, setTotal]               = useState(0)
  const [page, setPage]                 = useState(1)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  // Load saved schemes map
  const loadSaved = useCallback(async () => {
    try {
      const { data } = await getSavedSchemes()
      const map = new Map(data.map((s) => [s.scheme_id, s.id]))
      setSavedMap(map)
      setSavedSchemes(data)
    } catch (_) {}
  }, [])

  // Load citizen profile
  const loadProfile = useCallback(async () => {
    try {
      const { data } = await getProfile()
      setProfile(data)
    } catch (_) {}
  }, [])

  // Load all schemes
  const loadSchemes = useCallback(async (cat = 'All', pg = 1) => {
    setLoading(true)
    setError('')
    try {
      const params = { page: pg, page_size: 10 }
      if (cat !== 'All') params.category = cat
      const { data } = await getSchemes(params)
      setSchemes(data.schemes)
      setTotal(data.total)
      setPage(pg)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load schemes')
    } finally {
      setLoading(false)
    }
  }, [])

  // Search schemes
  const handleSearch = useCallback(async () => {
    if (!query.trim()) { loadSchemes(activeCategory); return }
    setLoading(true)
    setError('')
    try {
      const { data } = await searchSchemes(query.trim())
      setSchemes(data.schemes)
      setTotal(data.total)
    } catch (err) {
      setError(err.response?.data?.detail || 'Search failed')
    } finally {
      setLoading(false)
    }
  }, [query, activeCategory, loadSchemes])

  // Get AI recommendations
  const handleRecommend = async (force = false) => {
    if (!profile) { setError('Please complete your citizen profile first to get recommendations.'); setTab('all'); return }
    setRecLoading(true)
    setError('')
    try {
      const { data } = await getRecommendations(force)
      setRecommendations(data.recommendations)
      setTab('recommended')
      showToast(`✅ Found ${data.total_schemes} schemes matching your profile!`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get recommendations')
    } finally {
      setRecLoading(false)
    }
  }

  // Save a scheme
  const handleSave = async (schemeId) => {
    try {
      const { data } = await saveScheme(schemeId)
      setSavedMap((prev) => new Map(prev).set(schemeId, data.id))
      showToast('✅ Scheme saved to favourites!')
      loadSaved()
    } catch (err) {
      showToast(err.response?.data?.detail || 'Could not save scheme')
    }
  }

  // Unsave a scheme
  const handleUnsave = async (schemeId) => {
    const savedId = savedMap.get(schemeId)
    if (!savedId) return
    try {
      await deleteSavedScheme(savedId)
      setSavedMap((prev) => { const m = new Map(prev); m.delete(schemeId); return m })
      setSavedSchemes((prev) => prev.filter((s) => s.scheme_id !== schemeId))
      showToast('Removed from saved schemes')
    } catch (_) {}
  }

  useEffect(() => {
    loadSchemes()
    loadSaved()
    loadProfile()
  }, [loadSchemes, loadSaved, loadProfile])

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setQuery('')
    loadSchemes(cat, 1)
  }

  // Displayed list based on active tab
  const displayList = tab === 'recommended' ? recommendations : tab === 'saved' ? savedSchemes : schemes

  return (
    <div>
      <Breadcrumb items={[{ label: 'Government Schemes' }]} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-20 right-4 z-50 bg-slate-800 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2"
          >
            {toast}
            <button onClick={() => setToast('')}><FiX size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiBook className="text-teal-600" /> Government Scheme Agent
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Discover and apply for welfare schemes you are eligible for</p>
        </div>
        <button
          onClick={() => handleRecommend(false)}
          disabled={recLoading}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          {recLoading
            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <FiStar size={15} />}
          Get AI Recommendations
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-5 mb-5">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center bg-white rounded-xl px-4 gap-2">
            <FiSearch className="text-slate-400" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search schemes by name, category, ministry..."
              className="flex-1 py-3 text-sm text-slate-700 outline-none bg-transparent"
            />
            {query && <button onClick={() => { setQuery(''); loadSchemes(activeCategory) }}><FiX className="text-slate-400" size={14} /></button>}
          </div>
          <button onClick={handleSearch} className="bg-white text-teal-600 font-semibold px-5 py-3 rounded-xl hover:shadow-md transition-all text-sm">
            Search
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[['all', 'All Schemes', total], ['recommended', 'AI Recommended', recommendations.length], ['saved', 'Saved', savedSchemes.length]].map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => { setTab(key); if (key === 'all') loadSchemes(activeCategory) }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              tab === key ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-teal-400'
            }`}
          >
            {label}
            {count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>{count}</span>}
          </button>
        ))}
        {tab === 'recommended' && recommendations.length > 0 && (
          <button onClick={() => handleRecommend(true)} className="ml-auto flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 hover:underline">
            <FiRefreshCw size={12} /> Refresh
          </button>
        )}
      </div>

      {/* Category filter — only on All tab */}
      {tab === 'all' && (
        <div className="flex flex-wrap gap-2 mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-teal-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
          <FiAlertCircle size={16} /> {error}
          <button onClick={() => setError('')} className="ml-auto"><FiX size={14} /></button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Scheme list */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                  <div className="flex gap-3 mb-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 ml-auto" />
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : displayList.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
              <FiBook className="text-slate-300 mx-auto mb-3" size={40} />
              <p className="font-semibold text-slate-600 dark:text-slate-400">
                {tab === 'recommended' ? 'Click "Get AI Recommendations" to find schemes for you'
                  : tab === 'saved' ? 'No saved schemes yet'
                  : 'No schemes found'}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {tab === 'recommended' && !profile && 'Complete your profile first'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayList.map((scheme, i) => (
                <SchemeCard
                  key={scheme.scheme_id || scheme.id || i}
                  scheme={scheme}
                  savedIds={savedMap}
                  onSave={handleSave}
                  onUnsave={handleUnsave}
                  isRecommended={tab === 'recommended'}
                />
              ))}
              {/* Pagination — only on All tab */}
              {tab === 'all' && total > 10 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button disabled={page === 1} onClick={() => loadSchemes(activeCategory, page - 1)}
                    className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:border-teal-400 transition-colors">
                    ← Prev
                  </button>
                  <span className="text-sm text-slate-500">Page {page} of {Math.ceil(total / 10)}</span>
                  <button disabled={page >= Math.ceil(total / 10)} onClick={() => loadSchemes(activeCategory, page + 1)}
                    className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:border-teal-400 transition-colors">
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar — Profile eligibility */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Your Eligibility Profile</h2>
            {profile ? (
              <div className="space-y-3">
                {[
                  ['Name', profile.name],
                  ['Age', `${profile.age} years`],
                  ['Category', profile.category],
                  ['Annual Income', `₹${Number(profile.annual_income).toLocaleString('en-IN')}`],
                  ['State', profile.state],
                  ['Citizen Type', profile.citizen_types?.join(', ') || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{label}</p>
                      <p className="text-xs text-slate-400">{value}</p>
                    </div>
                    <FiCheckCircle className="text-green-500" size={16} />
                  </div>
                ))}
                <button
                  onClick={() => handleRecommend(true)}
                  disabled={recLoading}
                  className="w-full mt-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {recLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiStar size={14} />}
                  Refresh Recommendations
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <FiAlertCircle className="text-yellow-500 mx-auto mb-2" size={28} />
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Complete your profile to get personalised recommendations</p>
                <a href="/profile" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:underline">
                  Set up profile <FiArrowRight size={13} />
                </a>
              </div>
            )}
          </div>

          {/* Saved count card */}
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800">
            <div className="flex items-center gap-3 mb-2">
              <FiBookmark className="text-teal-600" size={18} />
              <h3 className="font-semibold text-teal-800 dark:text-teal-300 text-sm">Saved Schemes</h3>
            </div>
            <p className="text-3xl font-bold text-teal-700 dark:text-teal-400">{savedSchemes.length}</p>
            <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">schemes bookmarked</p>
            {savedSchemes.length > 0 && (
              <button onClick={() => setTab('saved')} className="mt-3 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1">
                View all <FiArrowRight size={11} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
