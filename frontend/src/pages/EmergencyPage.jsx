import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiAlertCircle, FiPhone, FiMapPin, FiHeart, FiShield,
  FiTruck, FiNavigation, FiShare2, FiChevronLeft, FiClock, FiRefreshCw
} from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'

const CONTACTS = [
  { label: 'Police',        number: '100',  color: 'from-blue-500 to-blue-600',   icon: '👮' },
  { label: 'Ambulance',     number: '108',  color: 'from-red-500 to-red-600',     icon: '🚑' },
  { label: 'Fire Brigade',  number: '101',  color: 'from-orange-500 to-orange-600',icon: '🔥' },
  { label: 'Women Helpline',number: '1091', color: 'from-pink-500 to-pink-600',   icon: '👩' },
  { label: 'Child Helpline',number: '1098', color: 'from-purple-500 to-purple-600',icon: '👶' },
  { label: 'Disaster Mgmt', number: '1078', color: 'from-teal-500 to-teal-600',   icon: '🌊' },
]

const SERVICES = [
  { icon: '🚑', name: 'Emergency Ward' },
  { icon: '❤️',  name: 'Cardiology' },
  { icon: '🩺', name: 'General Medicine' },
  { icon: '🦴', name: 'Orthopedics' },
  { icon: '👶', name: 'Pediatrics' },
  { icon: '🩸', name: 'Blood Bank' },
  { icon: '🏥', name: 'ICU' },
]

const NEARBY = [
  { icon: '💊', name: 'Pharmacy' },
  { icon: '⛽', name: 'Petrol Station' },
  { icon: '☕', name: 'Food' },
  { icon: '🏧', name: 'ATM' },
]

const TIPS = [
  'If the patient is unconscious, call an ambulance immediately instead of travelling by yourself.',
  'Keep the patient calm and still until help arrives.',
  'Do not give food or water to an unconscious person.',
  'Send someone outside to guide the ambulance to your location.',
]

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2
  return +(R * 2 * Math.asin(Math.sqrt(a))).toFixed(2)
}

function travelTime(km) {
  return {
    car:     Math.max(1, Math.round(km / 0.5)) + ' mins',
    walking: Math.max(1, Math.round(km / 0.08)) + ' mins',
  }
}

// ── Hospital Details Modal ────────────────────────────────────────────────────
function HospitalModal({ hospital, userLoc, onClose }) {
  const [saved, setSaved]         = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [phone, setPhone]         = useState('')
  const [name, setName]           = useState('')

  const handleShare = () => {
    if (!userLoc) return alert('Location not available')
    const link = `https://www.google.com/maps?q=${userLoc.lat},${userLoc.lng}`
    const msg  = `🚨 EMERGENCY ALERT%0APatient: ${name || 'User'}%0ALocation: ${link}%0APlease send help immediately!`
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full md:max-w-lg rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-10">
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <FiChevronLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <h2 className="font-bold text-slate-900 dark:text-white">Hospital Details</h2>
          <button onClick={() => setSaved(!saved)} className={saved ? 'text-red-500' : 'text-slate-400'}>
            <FiHeart size={20} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">🏥 {hospital.name}</h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
              <span>📍 {hospital.distance_km} km away</span>
              <span>🚗 {hospital.travel.car}</span>
              <span>🚶 {hospital.travel.walking}</span>
            </div>
          </div>

          {/* Open Status */}
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            🟢 Open 24 Hours
          </span>

          {/* Address */}
          {hospital.address && (
            <p className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
              <FiMapPin size={14} className="text-red-400 mt-0.5 shrink-0" />
              {hospital.address}
            </p>
          )}

          {/* Phone */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              📞 {hospital.phone || 'Not available'}
            </span>
            {hospital.phone && hospital.phone !== 'Not available' && (
              <a href={`tel:${hospital.phone}`}
                className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-xl hover:bg-green-600">
                Call Hospital
              </a>
            )}
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Emergency Services</h4>
            <div className="grid grid-cols-2 gap-2">
              {SERVICES.map((s, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300">
                  {s.icon} {s.name}
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Facilities */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Nearby Facilities</h4>
            <div className="flex gap-2 flex-wrap">
              {NEARBY.map((f, i) => (
                <span key={i} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-3 py-1.5 rounded-xl">
                  {f.icon} {f.name}
                </span>
              ))}
            </div>
          </div>

          {/* Emergency Tips */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4">
            <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Emergency Tips</h4>
            <ul className="space-y-1">
              {TIPS.map((t, i) => (
                <li key={i} className="text-xs text-yellow-700 dark:text-yellow-400 flex gap-2">
                  <span>•</span>{t}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
              target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-2xl text-sm font-semibold hover:bg-blue-700">
              <FiNavigation size={16} /> Start Navigation
            </a>
            <button onClick={() => setShareOpen(!shareOpen)}
              className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3 rounded-2xl text-sm font-semibold">
              <FiShare2 size={16} /> Share Location
            </button>
          </div>

          {/* Share Form */}
          <AnimatePresence>
            {shareOpen && (
              <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white">📤 Share via WhatsApp</h4>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Patient name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white" />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Contact number (e.g. 919876543210)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white" />
                <button onClick={handleShare}
                  className="w-full bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600">
                  Send via WhatsApp
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <a href={`https://www.openstreetmap.org/?mlat=${hospital.lat}&mlon=${hospital.lng}&zoom=17`}
            target="_blank" rel="noreferrer"
            className="block text-center text-xs text-blue-500 hover:underline">
            View on OpenStreetMap →
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EmergencyPage() {
  const [sosActive, setSosActive]     = useState(false)
  const [countdown, setCountdown]     = useState(null)
  const [userLoc, setUserLoc]         = useState(null)
  const [hospitals, setHospitals]     = useState([])
  const [loading, setLoading]         = useState(false)
  const [locError, setLocError]       = useState('')
  const [selected, setSelected]       = useState(null)
  const [fetchError, setFetchError]   = useState('')
  // AI Analysis state
  const [aiMsg, setAiMsg]             = useState('')
  const [aiLoading, setAiLoading]     = useState(false)
  const [aiResult, setAiResult]       = useState(null)
  const [aiError, setAiError]         = useState('')
  // Voice state
  const [listening, setListening]     = useState(false)
  const [voiceError, setVoiceError]   = useState('')
  // First Aid Assistant state
  const [faMsg, setFaMsg]             = useState('')
  const [faLoading, setFaLoading]     = useState(false)
  const [faResult, setFaResult]       = useState(null)
  const [faError, setFaError]         = useState('')
  const [faListening, setFaListening] = useState(false)
  // Ambulance & Police state
  const [ambulances, setAmbulances]   = useState([])
  const [police, setPolice]           = useState([])
  const [loadingAmb, setLoadingAmb]   = useState(false)
  const [loadingPol, setLoadingPol]   = useState(false)
  const [locationName, setLocationName] = useState(null)
  const [locLoading, setLocLoading]     = useState(true)

  const fetchAmbulances = async (lat, lng) => {
    setLoadingAmb(true)
    try {
      const query = `[out:json][timeout:25];(node["emergency"="ambulance_station"](around:10000,${lat},${lng});node["amenity"="ambulance_station"](around:10000,${lat},${lng}););out center 5;`
      const res   = await fetch('https://overpass-api.de/api/interpreter', { method:'POST', body:'data='+encodeURIComponent(query) })
      const data  = await res.json()
      const list  = (data.elements||[]).map(el => ({
        id:    String(el.id),
        name:  el.tags?.name || 'Ambulance Service',
        phone: el.tags?.phone || el.tags?.['contact:phone'] || '108',
        dist:  haversine(lat, lng, el.lat||el.center?.lat||lat, el.lon||el.center?.lon||lng),
        lat:   el.lat||el.center?.lat||lat,
        lng:   el.lon||el.center?.lon||lng,
      })).sort((a,b)=>a.dist-b.dist)
      setAmbulances(list.length > 0 ? list : getDefaultAmbulances(lat, lng))
    } catch { setAmbulances(getDefaultAmbulances(lat, lng)) }
    finally  { setLoadingAmb(false) }
  }

  const getDefaultAmbulances = (lat, lng) => [
    { id:'a1', name:'Government Ambulance (108)', phone:'108', dist:0,   lat, lng },
    { id:'a2', name:'Private Ambulance Service',  phone:'108', dist:2.1, lat:lat+0.01, lng:lng+0.01 },
  ]

  const fetchPolice = async (lat, lng) => {
    setLoadingPol(true)
    try {
      const query = `[out:json][timeout:25];(node["amenity"="police"](around:10000,${lat},${lng});way["amenity"="police"](around:10000,${lat},${lng}););out center 5;`
      const res   = await fetch('https://overpass-api.de/api/interpreter', { method:'POST', body:'data='+encodeURIComponent(query) })
      const data  = await res.json()
      const list  = (data.elements||[]).map(el => ({
        id:    String(el.id),
        name:  el.tags?.name || 'Police Station',
        phone: el.tags?.phone || el.tags?.['contact:phone'] || '100',
        dist:  haversine(lat, lng, el.lat||el.center?.lat||lat, el.lon||el.center?.lon||lng),
        lat:   el.lat||el.center?.lat||lat,
        lng:   el.lon||el.center?.lon||lng,
      })).sort((a,b)=>a.dist-b.dist)
      setPolice(list.length > 0 ? list : getDefaultPolice())
    } catch { setPolice(getDefaultPolice()) }
    finally  { setLoadingPol(false) }
  }

  const getDefaultPolice = () => [
    { id:'p1', name:'Kinathukadavu Police Station', phone:'100', dist:1.8, lat:10.9254, lng:76.9023 },
    { id:'p2', name:'Pollachi Police Station',      phone:'100', dist:8.4, lat:10.9254, lng:77.0023 },
  ]

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { setVoiceError('Voice input not supported. Use Chrome.'); return }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart  = () => { setListening(true); setVoiceError('') }
    recognition.onresult = (e) => { setAiMsg(e.results[0][0].transcript) }
    recognition.onerror  = () => { setVoiceError('Could not hear. Please try again.') }
    recognition.onend    = () => setListening(false)
    recognition.start()
  }

  const startFaVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    r.lang = 'en-IN'
    r.interimResults = false
    r.onstart  = () => setFaListening(true)
    r.onresult = (e) => setFaMsg(e.results[0][0].transcript)
    r.onerror  = () => setFaListening(false)
    r.onend    = () => setFaListening(false)
    r.start()
  }

  const getFirstAid = async () => {
    if (!faMsg.trim()) return
    setFaLoading(true); setFaResult(null); setFaError('')
    try {
      const res  = await fetch('/emergency/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: faMsg }),
      })
      const data = await res.json()
      if (data.status === 'success') setFaResult(data)
      else setFaError(data.message || 'Could not get first aid instructions.')
    } catch { setFaError('Could not connect to Emergency Agent.') }
    finally   { setFaLoading(false) }
  }

  const analyseEmergency = async () => {
    if (!aiMsg.trim()) return
    setAiLoading(true)
    setAiResult(null)
    setAiError('')
    try {
      const res  = await fetch('/emergency/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: aiMsg }),
      })
      const data = await res.json()
      if (data.status === 'success') setAiResult(data)
      else setAiError(data.message || 'Analysis failed.')
    } catch {
      setAiError('Could not connect to Emergency Agent. Make sure the backend is running.')
    } finally {
      setAiLoading(false)
    }
  }

  const fetchHospitals = async (lat, lng) => {
    setLoading(true)
    setFetchError('')
    try {
      // Call Overpass API directly from frontend — no backend needed
      const query = `
        [out:json][timeout:30];
        (
          node["amenity"="hospital"](around:8000,${lat},${lng});
          way["amenity"="hospital"](around:8000,${lat},${lng});
          node["amenity"="clinic"](around:5000,${lat},${lng});
        );
        out center 15;
      `
      const res  = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body:   'data=' + encodeURIComponent(query),
      })
      const data = await res.json()
      const elements = data.elements || []

      const list = elements.map(el => {
        const tags  = el.tags || {}
        const elLat = el.type === 'node' ? el.lat : (el.center?.lat || lat)
        const elLng = el.type === 'node' ? el.lon : (el.center?.lon || lng)
        const dist  = haversine(lat, lng, elLat, elLng)
        return {
          place_id:    String(el.id),
          name:        tags.name || 'Hospital',
          address:     tags['addr:full'] || [tags['addr:street'], tags['addr:city']].filter(Boolean).join(', ') || 'Address not available',
          phone:       tags.phone || tags['contact:phone'] || 'Not available',
          distance_km: dist,
          travel:      travelTime(dist),
          open_now:    tags.opening_hours === '24/7',
          lat:         elLat,
          lng:         elLng,
        }
      })
      .filter(h => h.name !== 'Hospital' || h.address !== 'Address not available')
      .sort((a, b) => a.distance_km - b.distance_km)
      .slice(0, 10)

      if (list.length === 0) {
        // Fallback: show hospitals near Kinathukadavu if none found
        setFetchError('No hospitals found nearby. Showing hospitals near Kinathukadavu area.')
        fetchFallbackHospitals()
      } else {
        setHospitals(list)
      }
    } catch (e) {
      setFetchError('Could not reach map service. Showing sample hospitals.')
      fetchFallbackHospitals()
    } finally {
      setLoading(false)
    }
  }

  const fetchFallbackHospitals = async () => {
    // Kinathukadavu, Coimbatore coordinates
    const lat = 10.9254, lng = 76.9023
    try {
      const query = `[out:json][timeout:30];(node["amenity"="hospital"](around:15000,${lat},${lng});way["amenity"="hospital"](around:15000,${lat},${lng}););out center 10;`
      const res   = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body:   'data=' + encodeURIComponent(query),
      })
      const data  = await res.json()
      const list  = (data.elements || []).map(el => {
        const tags  = el.tags || {}
        const elLat = el.type === 'node' ? el.lat : (el.center?.lat || lat)
        const elLng = el.type === 'node' ? el.lon : (el.center?.lon || lng)
        const dist  = haversine(lat, lng, elLat, elLng)
        return {
          place_id:    String(el.id),
          name:        tags.name || 'Hospital',
          address:     tags['addr:full'] || [tags['addr:street'], tags['addr:city']].filter(Boolean).join(', ') || 'Kinathukadavu, Coimbatore',
          phone:       tags.phone || tags['contact:phone'] || 'Not available',
          distance_km: dist,
          travel:      travelTime(dist),
          open_now:    true,
          lat:         elLat,
          lng:         elLng,
        }
      }).sort((a, b) => a.distance_km - b.distance_km).slice(0, 10)
      setHospitals(list)
    } catch {
      // Static fallback hospitals near Kinathukadavu
      setHospitals([
        { place_id:'1', name:'Coimbatore Medical College Hospital', address:'Avinashi Road, Coimbatore', phone:'0422-2301393', distance_km:12.3, travel:{car:'25 mins',walking:'2.5 hrs'}, open_now:true, lat:11.0168, lng:76.9558 },
        { place_id:'2', name:'PSG Hospitals',                       address:'Peelamedu, Coimbatore',    phone:'0422-4345000', distance_km:14.1, travel:{car:'28 mins',walking:'2.9 hrs'}, open_now:true, lat:11.0236, lng:77.0028 },
        { place_id:'3', name:'Kovai Medical Center',                address:'Avinashi Road, Coimbatore',phone:'0422-4323800', distance_km:15.2, travel:{car:'30 mins',walking:'3.2 hrs'}, open_now:true, lat:11.0274, lng:77.0174 },
        { place_id:'4', name:'Kinathukadavu PHC',                   address:'Kinathukadavu, Coimbatore',phone:'Not available', distance_km:1.2,  travel:{car:'3 mins', walking:'15 mins'}, open_now:true, lat:10.9254, lng:76.9023 },
        { place_id:'5', name:'Sri Ramakrishna Hospital',            address:'Sidhapudur, Coimbatore',   phone:'0422-4500000', distance_km:16.8, travel:{car:'33 mins',walking:'3.5 hrs'}, open_now:true, lat:11.0102, lng:76.9558 },
      ])
    }
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported.')
      setLocationName({ area: 'Kinathukadavu', city: 'Coimbatore' })
      setLocLoading(false)
      fetchFallbackHospitals()
      return
    }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLoc(loc)
        fetchHospitals(loc.lat, loc.lng)
        fetchAmbulances(loc.lat, loc.lng)
        fetchPolice(loc.lat, loc.lng)
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lng}&format=json`)
          const d = await r.json()
          const a = d.address || {}
          setLocationName({
            area: a.suburb || a.village || a.town || a.county || 'Your Area',
            city: a.city || a.state_district || a.state || 'India',
          })
        } catch {
          setLocationName({ area: 'Location Detected', city: 'India' })
        } finally { setLocLoading(false) }
      },
      () => {
        setLocError('Location access denied. Showing hospitals near Kinathukadavu.')
        setLocationName({ area: 'Kinathukadavu', city: 'Coimbatore' })
        setLocLoading(false)
        fetchFallbackHospitals()
        fetchAmbulances(10.9254, 76.9023)
        fetchPolice(10.9254, 76.9023)
      },
      { timeout: 10000 }
    )
  }, [])

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
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Immediate help at your fingertips</p>
      </div>

      {/* Live Location Card */}
      <div className="mb-5">
        <div className="bg-white dark:bg-slate-800 rounded-2xl px-5 py-4 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
            <FiMapPin size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 mb-0.5">📍 Your Location</p>
            {locLoading ? (
              <div className="h-4 w-40 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
            ) : locationName ? (
              <>
                <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">{locationName.area},</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{locationName.city}</p>
              </>
            ) : (
              <p className="text-sm text-slate-400">Detecting location...</p>
            )}
          </div>
          {userLoc && (
            <a
              href={`https://www.google.com/maps?q=${userLoc.lat},${userLoc.lng}`}
              target="_blank" rel="noreferrer"
              className="shrink-0 flex items-center gap-1 text-xs text-blue-500 hover:underline font-semibold"
            >
              <FiNavigation size={12} /> Map
            </a>
          )}
        </div>
      </div>

      {/* SOS Button */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-3xl p-8 mb-6 flex flex-col items-center border border-red-200 dark:border-red-800">
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 font-medium">Press for emergency SOS</p>
        <motion.button whileTap={{ scale: 0.92 }} onClick={handleSOS}
          className="relative w-36 h-36 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-300 dark:shadow-red-900 flex flex-col items-center justify-center text-white">
          {sosActive && (
            <motion.div animate={{ scale:[1,1.5,1], opacity:[0.6,0,0.6] }} transition={{ repeat:Infinity, duration:1.5 }}
              className="absolute inset-0 rounded-full bg-red-400" />
          )}
          <FiAlertCircle size={36} className="relative z-10" />
          <span className="text-lg font-bold relative z-10 mt-1">{countdown ?? 'SOS'}</span>
        </motion.button>
        <AnimatePresence>
          {sosActive && (
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              className="mt-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
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
          {CONTACTS.map(({ label, number, color, icon }) => (
            <motion.a key={label} href={`tel:${number}`} whileHover={{ scale:1.04 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2 text-xl`}>
                {icon}
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{number}</p>
            </motion.a>
          ))}
        </div>
      </div>

      {/* AI First Aid Assistant */}
      <div className="mb-6">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          🩹 AI First Aid Assistant
        </h2>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Describe the emergency to get instant first-aid instructions</p>
          <textarea
            value={faMsg}
            onChange={e => setFaMsg(e.target.value)}
            placeholder="e.g. My father has severe chest pain and is sweating..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={startFaVoice} disabled={faListening}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                faListening ? 'bg-red-100 text-red-600 dark:bg-red-900/30 animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
              {faListening
                ? <><motion.span animate={{ scale:[1,1.3,1] }} transition={{ repeat:Infinity, duration:0.8 }}>🎤</motion.span> Listening...</>
                : <>🎤 Speak</>}
            </button>
            {faMsg && (
              <button onClick={() => { setFaMsg(''); setFaResult(null); setFaError('') }}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-red-500 bg-slate-100 dark:bg-slate-700">Clear</button>
            )}
          </div>
          <button onClick={getFirstAid} disabled={faLoading || !faMsg.trim()}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {faLoading
              ? <><motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1, ease:'linear' }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Getting First Aid...</>
              : <>🩹 Get First Aid Instructions</>}
          </button>

          {faError && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">❌ {faError}</div>
          )}

          <AnimatePresence>
            {faResult && (
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="mt-5 rounded-2xl border border-green-200 dark:border-green-800 overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-lg">🩹</span>
                    <h3 className="text-white font-bold text-sm">First Aid Instructions</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {faResult.emergency_type && (
                      <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {faResult.emergency_type}
                      </span>
                    )}
                    {faResult.severity && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        faResult.severity === 'CRITICAL' ? 'bg-red-200 text-red-800' :
                        faResult.severity === 'HIGH'     ? 'bg-orange-200 text-orange-800' :
                        faResult.severity === 'MEDIUM'   ? 'bg-yellow-200 text-yellow-800' :
                                                           'bg-green-200 text-green-800'
                      }`}>{faResult.severity}</span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* First Aid Steps */}
                  {faResult.first_aid?.length > 0 && (
                    <div>
                      <ol className="space-y-2">
                        {faResult.first_aid.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-200">
                            <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                            <span>✔ {step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Do NOT */}
                  {faResult.do_not?.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-2">🚫 Do NOT</p>
                      <ul className="space-y-1">
                        {faResult.do_not.map((d, i) => (
                          <li key={i} className="flex gap-2 text-xs text-red-700 dark:text-red-300">
                            <span className="shrink-0">❌</span>{d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Call Ambulance */}
                  {faResult.call_ambulance && (
                    <motion.a href="tel:108"
                      animate={{ scale:[1,1.02,1] }} transition={{ repeat:Infinity, duration:1.5 }}
                      className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700">
                      🚑 Call Ambulance — 108 NOW
                    </motion.a>
                  )}

                  {/* Disclaimer */}
                  <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3">
                    <span className="shrink-0">⚠️</span>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">Do not give food or drinks unless advised by a medical professional. These are first-aid guidelines only — call 108 for emergencies.</p>
                  </div>

                  {/* ── AI Decision ───────────────────────────────────────── */}
                  <div className="rounded-xl border border-red-200 dark:border-red-800 overflow-hidden">
                    <div className="bg-red-600 px-4 py-2.5 flex items-center gap-2">
                      <span className="text-white text-base">🚨</span>
                      <h4 className="text-white font-bold text-sm">AI Decision</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      {/* Emergency Type + Risk Level */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                          <p className="text-xs text-slate-400 mb-1">Emergency Type</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{faResult.emergency_type || '—'}</p>
                        </div>
                        <div className={`rounded-xl p-3 ${
                          faResult.severity === 'CRITICAL' ? 'bg-red-50 dark:bg-red-900/20' :
                          faResult.severity === 'HIGH'     ? 'bg-orange-50 dark:bg-orange-900/20' :
                          faResult.severity === 'MEDIUM'   ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                                                             'bg-green-50 dark:bg-green-900/20'
                        }`}>
                          <p className="text-xs text-slate-400 mb-1">Risk Level</p>
                          <p className={`text-sm font-bold ${
                            faResult.severity === 'CRITICAL' ? 'text-red-600' :
                            faResult.severity === 'HIGH'     ? 'text-orange-500' :
                            faResult.severity === 'MEDIUM'   ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {faResult.severity === 'CRITICAL' ? '🔴' : faResult.severity === 'HIGH' ? '🟠' : faResult.severity === 'MEDIUM' ? '🟡' : '🟢'} {faResult.severity || '—'}
                          </p>
                        </div>
                      </div>

                      {/* AI Decision text */}
                      {faResult.recommended_action && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 flex items-start gap-2">
                          <span className="shrink-0 text-base">🤖</span>
                          <div>
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5">AI Decision</p>
                            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">{faResult.recommended_action}</p>
                          </div>
                        </div>
                      )}

                      {/* Next Actions */}
                      {faResult.actions?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">⏱️ Recommended Next Actions</p>
                          <ol className="space-y-1.5">
                            {faResult.actions.map((a, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                                <span>✅ {a}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Estimated Urgency */}
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 flex items-center gap-3">
                        <span className="text-xl">⏳</span>
                        <div>
                          <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">Estimated Urgency</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">
                            {faResult.severity === 'CRITICAL' ? 'Immediate (0–5 minutes)' :
                             faResult.severity === 'HIGH'     ? 'Urgent (5–15 minutes)' :
                             faResult.severity === 'MEDIUM'   ? 'Soon (15–30 minutes)' :
                                                                'Non-urgent (30+ minutes)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── AI Recommended Hospital ───────────────────────────── */}
                  {hospitals.length > 0 && (
                    <div className="rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden">
                      <div className="bg-blue-600 px-4 py-2.5 flex items-center gap-2">
                        <span className="text-white text-base">🏥</span>
                        <h4 className="text-white font-bold text-sm">AI Recommended Hospital</h4>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">🏥 {hospitals[0].name}</p>
                        {hospitals[0].address && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">📍 {hospitals[0].address}</p>
                        )}
                        <div className="space-y-1 mt-1">
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium">✔ Emergency Department</p>
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium">✔ Closest available ({hospitals[0].distance_km} km away)</p>
                          {faResult.emergency_type && (
                            <p className="text-xs text-green-600 dark:text-green-400 font-medium">✔ Suitable for {faResult.emergency_type}</p>
                          )}
                        </div>
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${hospitals[0].lat},${hospitals[0].lng}`}
                          target="_blank" rel="noreferrer"
                          className="mt-2 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl text-xs font-semibold hover:bg-blue-700">
                          <FiNavigation size={12} /> Navigate Now
                        </a>
                      </div>
                    </div>
                  )}

                  {/* ── Emergency Summary ─────────────────────────────────── */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="bg-slate-700 dark:bg-slate-600 px-4 py-2.5 flex items-center gap-2">
                      <span className="text-white text-base">📋</span>
                      <h4 className="text-white font-bold text-sm">Emergency Summary</h4>
                    </div>
                    <div className="p-4 space-y-2 text-xs">
                      {faResult.symptoms_identified?.length > 0 && (
                        <div className="flex gap-2">
                          <span className="text-slate-400 shrink-0 w-32">Patient Symptoms:</span>
                          <span className="text-slate-700 dark:text-slate-200 font-medium">{faResult.symptoms_identified.join(', ')}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <span className="text-slate-400 shrink-0 w-32">Emergency Type:</span>
                        <span className="text-slate-700 dark:text-slate-200 font-medium">{faResult.emergency_type || '—'}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-400 shrink-0 w-32">Severity:</span>
                        <span className="font-bold text-red-500">{faResult.severity || '—'}</span>
                      </div>
                      {faResult.recommended_action && (
                        <div className="flex gap-2">
                          <span className="text-slate-400 shrink-0 w-32">AI Recommendation:</span>
                          <span className="text-slate-700 dark:text-slate-200 font-medium">{faResult.recommended_action}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nearby Hospitals */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-800 dark:text-white">🏥 Nearby Hospitals</h2>
          <button onClick={() => userLoc ? fetchHospitals(userLoc.lat, userLoc.lng) : fetchFallbackHospitals()}
            className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
            <FiRefreshCw size={12} /> Refresh
          </button>
        </div>

        {locError && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-3 text-xs text-yellow-700 dark:text-yellow-400 mb-3">
            📍 {locError}
          </div>
        )}
        {fetchError && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-3 text-xs text-blue-700 dark:text-blue-400 mb-3">
            ℹ️ {fetchError}
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-36 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {hospitals.map(h => (
              <motion.div key={h.place_id} whileHover={{ scale:1.02 }} onClick={() => setSelected(h)}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md hover:border-red-300 dark:hover:border-red-700 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight flex-1 pr-2">
                    🏥 {h.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full shrink-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    🟢 Open
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span>📍 {h.distance_km} km</span>
                  <span>🚗 {h.travel.car}</span>
                  <span>🚶 {h.travel.walking}</span>
                </div>
                {h.address && (
                  <p className="text-xs text-slate-400 truncate mb-3">📌 {h.address}</p>
                )}
                <div className="flex gap-2">
                  <button onClick={e => { e.stopPropagation(); setSelected(h) }}
                    className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs py-1.5 rounded-xl font-semibold hover:bg-red-100">
                    View Details
                  </button>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
                    target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs px-3 py-1.5 rounded-xl font-semibold hover:bg-blue-100">
                    <FiNavigation size={11} /> Go
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Nearby Ambulances & Police */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">

        {/* Ambulances */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">🚑 Nearby Ambulances</h2>
            <a href="tel:108" className="text-xs bg-red-500 text-white px-3 py-1 rounded-xl font-semibold hover:bg-red-600">Call 108</a>
          </div>
          {loadingAmb ? (
            <div className="space-y-2">{[1,2].map(i=><div key={i} className="h-12 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse"/>)}</div>
          ) : (
            <div className="space-y-2">
              {ambulances.map(a => (
                <div key={a.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">🚑 {a.name}</p>
                    {a.dist > 0 && <p className="text-xs text-slate-400">📍 {a.dist} km away</p>}
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${a.phone}`}
                      className="px-2.5 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600">
                      Call
                    </a>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${a.lat},${a.lng}`}
                      target="_blank" rel="noreferrer"
                      className="px-2.5 py-1 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600">
                      Navigate
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Police Stations */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">👮 Nearby Police Stations</h2>
            <a href="tel:100" className="text-xs bg-blue-600 text-white px-3 py-1 rounded-xl font-semibold hover:bg-blue-700">Call 100</a>
          </div>
          {loadingPol ? (
            <div className="space-y-2">{[1,2].map(i=><div key={i} className="h-12 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse"/>)}</div>
          ) : (
            <div className="space-y-2">
              {police.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">👮 {p.name}</p>
                    {p.dist > 0 && <p className="text-xs text-slate-400">📍 {p.dist} km away</p>}
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${p.phone}`}
                      className="px-2.5 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600">
                      Call
                    </a>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                      target="_blank" rel="noreferrer"
                      className="px-2.5 py-1 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600">
                      Navigate
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Hospital Details Modal */}
      <AnimatePresence>
        {selected && (
          <HospitalModal hospital={selected} userLoc={userLoc} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
