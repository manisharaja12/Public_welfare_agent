import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrendingUp, FiArrowRight, FiCheck, FiStar, FiMapPin, FiDollarSign } from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'

const BUDGETS   = ['₹50,000', '₹1,00,000', '₹2,00,000', '₹3,00,000', '₹5,00,000']
const INTERESTS = ['Food', 'Technology', 'Agriculture', 'Retail', 'Education', 'Fashion', 'Health', 'Automobile', 'Creative']
const LOCATIONS = ['Coimbatore', 'Madurai', 'Chennai', 'Salem', 'Trichy', 'Erode']

const IDEAS = {
  Food:       [{ name: 'Cloud Kitchen', roi: '35%', risk: 'Low',    scheme: 'PM FME Scheme' },   { name: 'Tiffin Service', roi: '28%', risk: 'Low',    scheme: 'MUDRA Loan' }],
  Technology: [{ name: 'IT Freelancing Hub', roi: '50%', risk: 'Medium', scheme: 'Startup India' }, { name: 'Mobile Repair Shop', roi: '40%', risk: 'Low', scheme: 'PMEGP' }],
  Agriculture:[{ name: 'Organic Farming', roi: '30%', risk: 'Low',    scheme: 'PM-KISAN' },       { name: 'Agri Export Unit', roi: '45%', risk: 'Medium', scheme: 'APEDA Grant' }],
  Retail:     [{ name: 'Kirana Superstore', roi: '25%', risk: 'Low',  scheme: 'MUDRA Loan' },     { name: 'Online Reselling', roi: '38%', risk: 'Low',    scheme: 'Startup India' }],
  Education:  [{ name: 'Coaching Centre', roi: '42%', risk: 'Low',    scheme: 'PMEGP' },          { name: 'EdTech Platform', roi: '55%', risk: 'Medium',  scheme: 'Startup India' }],
  Fashion:    [{ name: 'Boutique Studio', roi: '33%', risk: 'Low',    scheme: 'MUDRA Loan' },     { name: 'Online Fashion Store', roi: '44%', risk: 'Medium', scheme: 'PMEGP' }],
  Health:     [{ name: 'Pharmacy Store', roi: '30%', risk: 'Low',     scheme: 'PMEGP' },          { name: 'Fitness Centre', roi: '38%', risk: 'Medium',   scheme: 'Startup India' }],
  Automobile: [{ name: 'EV Service Centre', roi: '48%', risk: 'Medium', scheme: 'FAME Scheme' }, { name: 'Car Wash & Detailing', roi: '35%', risk: 'Low', scheme: 'MUDRA Loan' }],
  Creative:   [{ name: 'Photography Studio', roi: '40%', risk: 'Low', scheme: 'PMEGP' },         { name: 'Content Agency', roi: '52%', risk: 'Medium',   scheme: 'Startup India' }],
}

const STEPS = ['Business Idea', 'Govt Schemes', 'Licences', 'Business Plan', 'Growth Tips', 'Readiness Score']

export default function BusinessPage() {
  const [budget, setBudget]       = useState('')
  const [interest, setInterest]   = useState('')
  const [location, setLocation]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [ideas, setIdeas]         = useState(null)
  const [selected, setSelected]   = useState(null)
  const [planStep, setPlanStep]   = useState(0)

  const handleFind = () => {
    if (!interest) return
    setLoading(true)
    setTimeout(() => {
      setIdeas(IDEAS[interest] || [])
      setLoading(false)
      setSelected(null)
      setPlanStep(0)
    }, 1400)
  }

  const handleSelect = (idea) => {
    setSelected(idea)
    setPlanStep(1)
  }

  const PLAN_CONTENT = selected ? [
    null,
    { title: '🏛 Govt Schemes', body: `Best scheme for your ${selected.name}: ${selected.scheme}. Apply online at msme.gov.in or visit your nearest District Industries Centre.` },
    { title: '📋 Licences Required', body: `For ${selected.name} you need: GST Registration, MSME Udyam Certificate, Local Trade Licence, and FSSAI (if food-related).` },
    { title: '📊 Business Plan', body: `Estimated ROI: ${selected.roi} | Risk Level: ${selected.risk} | Break-even: 8–12 months | Initial investment: ${budget || '₹1,00,000'} recommended.` },
    { title: '🚀 Growth Tips', body: `1. Start with social media marketing. 2. Partner with local delivery apps. 3. Join ${location || 'your city'} business associations. 4. Apply for govt tenders.` },
    { title: '✅ Readiness Score', body: null },
  ] : []

  const score = selected ? (selected.risk === 'Low' ? 82 : 68) : 0

  return (
    <div>
      <Breadcrumb items={[{ label: 'AI Business Growth Agent' }]} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FiTrendingUp className="text-blue-500" /> AI Business Growth Agent
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Get business ideas, govt schemes, licences, plans &amp; growth recommendations
        </p>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl px-5 py-3 mb-6 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-blue-700 dark:text-blue-400 mr-1">📌 How it works</span>
        {STEPS.map((s, i) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${planStep > i ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700'}`}>{s}</span>
            {i < STEPS.length - 1 && <span className="text-blue-400 text-xs">→</span>}
          </span>
        ))}
      </div>

      {/* Finder */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
        <h2 className="font-bold text-slate-800 dark:text-white mb-1">💡 Business Idea Finder</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Enter your budget, interest &amp; location to get AI-recommended business ideas</p>

        <div className="flex gap-2 mb-4">
          <div className="flex items-center flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3">
            <span className="text-slate-400 text-sm mr-2">₹</span>
            <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="Budget e.g. 3,00,000"
              className="flex-1 py-2.5 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none" />
          </div>
          <button onClick={handleFind} disabled={!interest || loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">
            🔍 Find
          </button>
        </div>

        <div className="mb-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Interest / Category</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => (
              <button key={i} onClick={() => setInterest(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${interest === i ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white' : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-500'}`}>
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Location</p>
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map(l => (
              <button key={l} onClick={() => setLocation(l)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${location === l ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white' : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-500'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-6">
          <div className="flex gap-1.5">
            {[0,1,2].map(d => (
              <motion.div key={d} animate={{ y: [0,-8,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: d*0.15 }}
                className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            ))}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">AI is finding the best business ideas for you…</p>
        </div>
      )}

      {/* Ideas */}
      {ideas && !loading && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {ideas.map((idea, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl p-5 border-2 transition-all cursor-pointer ${selected?.name === idea.name ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300'}`}
                  onClick={() => handleSelect(idea)}>
                  {i === 0 && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold mb-2 inline-block">⭐ Best Match</span>}
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2">{idea.name}</h3>
                  <div className="flex gap-3">
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold">ROI {idea.roi}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${idea.risk === 'Low' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>{idea.risk} Risk</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Scheme: <span className="font-semibold text-blue-600 dark:text-blue-400">{idea.scheme}</span></p>
                  <button className="mt-3 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                    View Full Plan <FiArrowRight size={11} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Plan steps */}
            {selected && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  {STEPS.slice(1).map((s, i) => (
                    <span key={s} className="flex items-center gap-1.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${planStep > i + 1 ? 'bg-blue-600 text-white' : planStep === i + 1 ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>{s}</span>
                      {i < STEPS.length - 2 && <span className="text-slate-400 text-xs">→</span>}
                    </span>
                  ))}
                </div>

                {PLAN_CONTENT[planStep] && planStep < 5 && (
                  <motion.div key={planStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-4 border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-white mb-2">{PLAN_CONTENT[planStep].title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{PLAN_CONTENT[planStep].body}</p>
                  </motion.div>
                )}

                {planStep === 5 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4">
                    <p className="font-bold text-slate-800 dark:text-white mb-3">✅ Business Readiness Score</p>
                    <div className="relative w-28 h-28 mx-auto mb-3">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                        <motion.circle cx="18" cy="18" r="15.9" fill="none" stroke="#2563eb" strokeWidth="3"
                          strokeDasharray={`${score} 100`} strokeLinecap="round"
                          initial={{ strokeDasharray: '0 100' }} animate={{ strokeDasharray: `${score} 100` }} transition={{ duration: 1.2 }} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-extrabold text-blue-600">{score}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Your {selected.name} business is <span className="font-bold text-blue-600">{score >= 80 ? 'highly ready' : 'moderately ready'}</span> to launch!</p>
                  </motion.div>
                )}

                {planStep < 5 ? (
                  <button onClick={() => setPlanStep(s => s + 1)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">
                    Next <FiArrowRight size={14} />
                  </button>
                ) : (
                  <button onClick={() => { setIdeas(null); setSelected(null); setPlanStep(0); setBudget(''); setInterest(''); setLocation('') }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                    Start Over
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
