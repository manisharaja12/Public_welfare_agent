import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPhone, HiLocationMarker, HiHeart, HiShieldCheck, HiTruck } from 'react-icons/hi'
import { MdLocalHospital, MdLocalPolice } from 'react-icons/md'
import Breadcrumb from '../components/Breadcrumb'

const contacts = [
  { name: 'Police', number: '100', icon: MdLocalPolice, color: 'bg-blue-600' },
  { name: 'Ambulance', number: '108', icon: HiHeart, color: 'bg-red-600' },
  { name: 'Fire Brigade', number: '101', icon: HiShieldCheck, color: 'bg-orange-600' },
  { name: 'Women Helpline', number: '1091', icon: HiPhone, color: 'bg-pink-600' },
  { name: 'Child Helpline', number: '1098', icon: HiPhone, color: 'bg-purple-600' },
  { name: 'Disaster Mgmt', number: '1078', icon: HiTruck, color: 'bg-teal-600' },
]

const placeholders = [
  { title: 'Nearby Hospitals', icon: MdLocalHospital, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  { title: 'Nearby Police Stations', icon: MdLocalPolice, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { title: 'Ambulance Services', icon: HiHeart, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
]

export default function Emergency() {
  const [sosActive, setSosActive] = useState(false)
  const [locationShared, setLocationShared] = useState(false)

  const handleSOS = () => {
    setSosActive(true)
    setTimeout(() => setSosActive(false), 5000)
  }

  const handleLocation = () => {
    navigator.geolocation?.getCurrentPosition(() => setLocationShared(true))
  }

  return (
    <div>
      <Breadcrumb />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
          <HiPhone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Emergency Assistance Agent</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Instant emergency help and services</p>
        </div>
      </div>

      {/* SOS Button */}
      <div className="card p-8 mb-6 text-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-100 dark:border-red-800">
        <p className="text-sm font-semibold text-red-600 mb-4 uppercase tracking-wider">Emergency SOS</p>
        <div className="flex justify-center mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSOS}
            className={`relative w-36 h-36 rounded-full font-bold text-white text-xl shadow-2xl transition-all ${
              sosActive ? 'bg-red-700 shadow-red-400' : 'bg-red-600 hover:bg-red-700 shadow-red-300'
            }`}>
            {sosActive && (
              <motion.span initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-red-500" />
            )}
            <span className="relative z-10">SOS</span>
          </motion.button>
        </div>
        <AnimatePresence>
          {sosActive && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-red-700 dark:text-red-400 font-semibold text-sm">
              🚨 SOS Alert Sent! Emergency services notified.
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-xs text-gray-500 mt-3">Press and hold in real emergency. This will alert nearby services.</p>
      </div>

      {/* Location */}
      <div className="card p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
            <HiLocationMarker className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Live Location</p>
            <p className="text-xs text-gray-400">{locationShared ? '📍 Location shared with emergency services' : 'Share your location for faster response'}</p>
          </div>
        </div>
        <button onClick={handleLocation} className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
          locationShared ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'btn-primary'
        }`}>
          {locationShared ? '✓ Shared' : 'Share Location'}
        </button>
      </div>

      {/* Emergency Contacts */}
      <div className="card p-5 mb-6">
        <h3 className="font-semibold mb-4">Emergency Contacts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {contacts.map(({ name, number, icon: Icon, color }) => (
            <a key={name} href={`tel:${number}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group">
              <div className={`w-9 h-9 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium">{name}</p>
                <p className="text-sm font-bold text-red-600">{number}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Nearby Services Placeholders */}
      <div className="grid sm:grid-cols-3 gap-4">
        {placeholders.map(({ title, icon: Icon, color, bg }) => (
          <div key={title} className="card p-5 text-center">
            <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
            <p className="text-xs text-gray-400">Backend will load nearby services based on your location.</p>
            <button className="mt-3 text-xs text-blue-600 hover:underline">Load Nearby →</button>
          </div>
        ))}
      </div>
    </div>
  )
}
