import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertCircle, FiPhone, FiMapPin, FiHeart, FiShield, FiTruck } from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'

const contacts = [
  { label: 'Police', number: '100', icon: FiShield, color: 'from-blue-500 to-blue-600' },
  { label: 'Ambulance', number: '108', icon: FiHeart, color: 'from-red-500 to-red-600' },
  { label: 'Fire Brigade', number: '101', icon: FiAlertCircle, color: 'from-orange-500 to-orange-600' },
  { label: 'Women Helpline', number: '1091', icon: FiPhone, color: 'from-pink-500 to-pink-600' },
  { label: 'Child Helpline', number: '1098', icon: FiPhone, color: 'from-purple-500 to-purple-600' },
  { label: 'Disaster Mgmt', number: '1078', icon: FiTruck, color: 'from-teal-500 to-teal-600' },
]

const nearbyPlaceholder = [
  { type: 'Hospital', items: ['City General Hospital — 0.8 km', 'Apollo Clinic — 1.2 km', 'Primary Health Centre — 2.1 km'] },
  { type: 'Police Station', items: ['MG Road Police Station — 0.5 km', 'Sector 4 Police Post — 1.8 km'] },
  { type: 'Ambulance', items: ['Ambulance Unit #12 — 0.3 km', 'Ambulance Unit #7 — 1.1 km'] },
]

export default function EmergencyPage() {
  const [sosActive, setSosActive] = useState(false)
  const [countdown, setCountdown] = useState(null)

  const handleSOS = () => {
    setSosActive(true)
    let c = 3
    setCountdown(c)
    const t = setInterval(() => {
      c -= 1
      setCountdown(c)
      if (c <= 0) { clearInterval(t); setCountdown(null) }
    }, 1000)
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Emergency Assistance' }]} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FiAlertCircle className="text-red-600" /> Emergency Assistance Agent
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Immediate help at your fingertips — one tap away</p>
      </div>

      {/* SOS Button */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-3xl p-8 mb-6 flex flex-col items-center border border-red-200 dark:border-red-800">
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 font-medium">Press and hold for emergency SOS</p>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleSOS}
          className="relative w-36 h-36 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-300 dark:shadow-red-900 flex flex-col items-center justify-center text-white hover:from-red-600 hover:to-red-700 transition-all"
        >
          {sosActive && (
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 rounded-full bg-red-400"
            />
          )}
          <FiAlertCircle size={36} className="relative z-10" />
          <span className="text-lg font-bold relative z-10 mt-1">
            {countdown !== null ? countdown : 'SOS'}
          </span>
        </motion.button>
        <AnimatePresence>
          {sosActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
            >
              <FiMapPin size={14} /> Sharing live location with emergency services...
            </motion.div>
          )}
        </AnimatePresence>
        {sosActive && (
          <button onClick={() => setSosActive(false)} className="mt-3 text-xs text-slate-500 hover:text-red-600 underline">
            Cancel SOS
          </button>
        )}
      </div>

      {/* Emergency Contacts */}
      <div className="mb-6">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-3">Emergency Contacts</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {contacts.map(({ label, number, icon: Icon, color }) => (
            <motion.a
              key={label}
              href={`tel:${number}`}
              whileHover={{ scale: 1.04 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{number}</p>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Nearby Services */}
      <div className="grid md:grid-cols-3 gap-4">
        {nearbyPlaceholder.map(({ type, items }) => (
          <div key={type} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <FiMapPin className="text-red-500" size={16} />
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Nearby {type}</h3>
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-600 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">📍 Live location required for real data</p>
          </div>
        ))}
      </div>
    </div>
  )
}
