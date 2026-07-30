import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUsers, FiMapPin, FiPhone, FiCheck, FiArrowRight, FiCalendar, FiStar } from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'

const CATEGORIES = [
  { id: 'teaching',    icon: '📚', label: 'Teaching' },
  { id: 'medical',     icon: '🏥', label: 'Medical' },
  { id: 'environment', icon: '🌱', label: 'Environment' },
  { id: 'disaster',    icon: '🆘', label: 'Disaster Relief' },
  { id: 'elderly',     icon: '👴', label: 'Elderly Care' },
  { id: 'animal',      icon: '🐾', label: 'Animal Welfare' },
]

const OPPORTUNITIES = [
  { id: 1, title: 'Teach Underprivileged Kids', org: 'Parikrma Foundation', category: 'teaching', location: 'Coimbatore', date: 'Every Saturday', slots: 5, rating: 4.9 },
  { id: 2, title: 'Free Medical Camp Assistant', org: 'Red Cross Society', category: 'medical', location: 'Chennai', date: '15 Jan 2025', slots: 10, rating: 4.8 },
  { id: 3, title: 'Tree Plantation Drive', org: 'Green Earth NGO', category: 'environment', location: 'Madurai', date: '20 Jan 2025', slots: 20, rating: 4.7 },
  { id: 4, title: 'Flood Relief Distribution', org: 'Govt. Relief Camp', category: 'disaster', location: 'Trichy', date: 'Ongoing', slots: 15, rating: 5.0 },
  { id: 5, title: 'Old Age Home Visitor', org: 'Sneha Old Age Home', category: 'elderly', location: 'Salem', date: 'Every Sunday', slots: 8, rating: 4.6 },
  { id: 6, title: 'Animal Shelter Helper', org: 'PAWS Shelter', category: 'animal', location: 'Coimbatore', date: 'Weekends', slots: 6, rating: 4.8 },
]

export default function VolunteerPage() {
  const [selected, setSelected]   = useState('')
  const [registered, setRegistered] = useState(null)
  const [form, setForm]           = useState({ name: '', phone: '', date: '' })
  const [done, setDone]           = useState(false)

  const filtered = selected ? OPPORTUNITIES.filter(o => o.category === selected) : OPPORTUNITIES

  const handleRegister = (opp) => {
    setRegistered(opp)
    setDone(false)
    setForm({ name: '', phone: '', date: '' })
  }

  const handleSubmit = () => {
    if (!form.name || !form.phone) return
    setDone(true)
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Community Volunteer Agent' }]} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FiUsers className="text-blue-500" /> Community Volunteer Agent
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Find volunteer opportunities near you and make a difference in your community
        </p>
      </div>

      {/* Category filter */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 mb-6">
        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">Filter by Category</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelected('')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${!selected ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'}`}>
            All
          </button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setSelected(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all flex items-center gap-1.5 ${selected === c.id ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'}`}>
              <span>{c.icon}</span>{c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filtered.map((opp, i) => (
          <motion.div key={opp.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{CATEGORIES.find(c => c.id === opp.category)?.icon}</span>
              <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                <FiStar size={11} className="fill-current" /> {opp.rating}
              </div>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{opp.title}</h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-3">{opp.org}</p>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <FiMapPin size={11} /> {opp.location}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <FiCalendar size={11} /> {opp.date}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <FiUsers size={11} /> {opp.slots} slots available
              </div>
            </div>
            <button onClick={() => handleRegister(opp)}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 rounded-xl transition-all">
              Register <FiArrowRight size={12} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Registration modal */}
      <AnimatePresence>
        {registered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setRegistered(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-700 shadow-2xl">
              {!done ? (
                <>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-1">{registered.title}</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-4">{registered.org}</p>
                  <div className="space-y-3 mb-4">
                    {[{ key: 'name', label: 'Your Name', placeholder: 'e.g. Priya' }, { key: 'phone', label: 'Phone Number', placeholder: 'e.g. 9876543210' }].map(f => (
                      <div key={f.key}>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{f.label}</label>
                        <input value={form[f.key]} onChange={e => setForm(d => ({ ...d, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
                      </div>
                    ))}
                  </div>
                  <button onClick={handleSubmit} disabled={!form.name || !form.phone}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl transition-all text-sm">
                    Confirm Registration
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                    className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                    <FiCheck size={28} className="text-green-500" />
                  </motion.div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-1">Registered Successfully! 🎉</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{registered.title}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-4">{registered.org} · {registered.location}</p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-xs text-blue-800 dark:text-blue-300 mb-4">
                    🤖 AI: Thank you {form.name}! You'll receive a confirmation call on {form.phone} before the event. See you there! ❤️
                  </div>
                  <button onClick={() => setRegistered(null)}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white font-semibold">
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
