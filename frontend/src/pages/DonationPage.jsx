import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiMapPin, FiPhone, FiClock, FiCheck, FiX, FiTruck, FiStar } from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'
import {
  DONATION_TYPES, VOLUNTEERS, BENEFICIARIES,
  ORGANISATIONS, DETAIL_FIELDS
} from '../services/donationService'

// ── Step indicator ─────────────────────────────────────────────
function Steps({ current }) {
  const steps = ['Choose Type', 'Select Org', 'Your Details', 'Confirm']
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2 flex-1">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
            i < current ? 'bg-green-500 text-white' : i === current ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
          }`}>
            {i < current ? <FiCheck size={13} /> : i + 1}
          </div>
          <span className={`text-xs font-medium hidden sm:block ${i === current ? 'text-rose-500' : 'text-slate-400'}`}>{s}</span>
          {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < current ? 'bg-green-400' : 'bg-slate-200 dark:bg-slate-700'}`} />}
        </div>
      ))}
    </div>
  )
}

export default function DonationPage() {
  const [step, setStep]           = useState(0)
  const [type, setType]           = useState(null)
  const [org, setOrg]             = useState(null)
  const [details, setDetails]     = useState({})
  const [volunteer, setVolunteer] = useState(null)
  const [done, setDone]           = useState(false)

  const orgs    = type ? ORGANISATIONS[type.id] : []
  const fields  = type ? DETAIL_FIELDS[type.id] : []
  const benefit = type ? BENEFICIARIES[type.id] : null

  const handleSelectType = (t) => { setType(t); setOrg(null); setDetails({}); setStep(1) }
  const handleSelectOrg  = (o) => { setOrg(o); setStep(2) }

  const handleSubmit = () => {
    const v = VOLUNTEERS[Math.floor(Math.random() * VOLUNTEERS.length)]
    setVolunteer(v)
    setDone(true)
    setStep(3)
  }

  const reset = () => {
    setStep(0); setType(null); setOrg(null)
    setDetails({}); setVolunteer(null); setDone(false)
  }

  const allFilled = fields.every(f => details[f.key]?.trim())

  return (
    <div>
      <Breadcrumb items={[{ label: 'Donation Agent' }]} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FiHeart className="text-rose-500" /> Donation Agent
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Donate items to those who need them most — we'll arrange pickup & delivery
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main flow */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <Steps current={step} />

            {/* Step 0 — Choose donation type */}
            {step === 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">What would you like to donate?</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DONATION_TYPES.map(t => (
                    <motion.button key={t.id}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectType(t)}
                      className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all">
                      <span className="text-3xl">{t.icon}</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1 — Select organisation */}
            {step === 1 && type && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setStep(0)} className="text-xs text-slate-400 hover:text-rose-500 transition-colors">← Back</button>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {type.icon} Select an organisation for your {type.label} donation
                  </p>
                </div>
                <div className="space-y-3">
                  {orgs.map((o, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 hover:border-rose-400 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => handleSelectOrg(o)}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{o.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.open ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                              {o.open ? '● Open' : '● Closed'}
                            </span>
                          </div>
                          <p className="text-xs text-rose-500 font-medium mt-0.5">{o.type}</p>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">{o.distance}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{o.reason}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {o.needs.map((n, j) => (
                          <span key={j} className="text-xs bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-lg border border-rose-100 dark:border-rose-800">{n}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><FiMapPin size={10} /> {o.address}</span>
                        <span className="flex items-center gap-1"><FiPhone size={10} /> {o.phone}</span>
                        <span className="flex items-center gap-1"><FiClock size={10} /> {o.hours}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Donation details */}
            {step === 2 && org && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-rose-500 transition-colors">← Back</button>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Donating to: <span className="text-rose-500">{org.name}</span>
                  </p>
                </div>
                <div className="space-y-3 mb-5">
                  {fields.map(f => (
                    <div key={f.key}>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{f.label}</label>
                      <input
                        value={details[f.key] || ''}
                        onChange={e => setDetails(d => ({ ...d, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!allFilled}
                  className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                  <FiTruck size={15} /> Schedule Pickup
                </button>
              </div>
            )}

            {/* Step 3 — Confirmation */}
            {step === 3 && done && volunteer && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <FiCheck size={32} className="text-green-500" />
                </motion.div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Donation Scheduled! 🎉</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Your {type?.label} donation to <span className="font-semibold text-rose-500">{org?.name}</span> is confirmed.
                </p>

                {/* Volunteer card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-4 mb-4 text-left">
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <FiTruck size={12} /> Assigned Volunteer
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{volunteer.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <FiPhone size={10} /> {volunteer.phone}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">🚗 {volunteer.vehicle}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                      <FiStar size={14} className="fill-current" /> {volunteer.rating}
                    </div>
                  </div>
                </div>

                {/* Impact */}
                {benefit && (
                  <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 mb-5 text-sm text-rose-700 dark:text-rose-300">
                    ❤️ Your donation will help <strong>{benefit.count}</strong> who {benefit.verb} <strong>{benefit.unit}</strong>.
                  </div>
                )}

                <button onClick={reset}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm">
                  Donate Again
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-4 text-sm">Donation Impact</h2>
            <div className="space-y-3">
              {[
                { icon: '🩸', label: 'Blood Donations', value: '1,240' },
                { icon: '👕', label: 'Clothes Donated', value: '8,500+' },
                { icon: '📚', label: 'Books Shared', value: '12,300' },
                { icon: '🍱', label: 'Meals Provided', value: '45,000' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{s.label}</span>
                  </div>
                  <span className="text-sm font-bold text-rose-500">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-5 border border-rose-200 dark:border-rose-800">
            <h3 className="font-semibold text-rose-800 dark:text-rose-300 text-sm mb-3">How It Works</h3>
            <ol className="space-y-2">
              {['Choose what to donate', 'Pick an organisation', 'Fill in details', 'Volunteer picks up & delivers'].map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-rose-700 dark:text-rose-400">
                  <span className="w-4 h-4 rounded-full bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0 font-bold text-[10px]">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          {/* Current selection summary */}
          <AnimatePresence>
            {type && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-3">Your Selection</h3>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Type</span>
                    <span className="font-semibold text-slate-800 dark:text-white">{type.icon} {type.label}</span>
                  </div>
                  {org && (
                    <div className="flex justify-between">
                      <span>Organisation</span>
                      <span className="font-semibold text-slate-800 dark:text-white text-right max-w-[60%]">{org.name}</span>
                    </div>
                  )}
                  {org && (
                    <div className="flex justify-between">
                      <span>Distance</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{org.distance}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
