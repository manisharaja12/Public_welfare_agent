import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiHome, FiSearch, FiMapPin, FiPhone, FiMail, FiLoader,
  FiPlus, FiX, FiCheckCircle, FiEye, FiHeart, FiAlertCircle
} from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'
import { getDashboard, getAllHouses, searchHouses, registerHouse } from '../services/housingService'

const HOUSE_TYPES = ['House', 'Apartment', 'Villa', 'PG', 'Hostel']
const FURNISHED_OPTIONS = ['Furnished', 'Semi-Furnished', 'Unfurnished']
const TABS = ['All', ...HOUSE_TYPES]

function PropertyCard({ house, index, onView }) {
  const [saved, setSaved] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="relative h-44 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-slate-700 overflow-hidden">
        {house.images && house.images.length > 0 ? (
          <img src={`http://localhost:8003${house.images[0]}`} alt={house.property_name || house.house_type} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FiHome size={48} className="text-blue-300 dark:text-blue-600/50" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-lg">{house.house_type}</span>
        </div>
        <button
          onClick={() => setSaved(!saved)}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-sm transition-all ${saved ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-600 hover:bg-white'}`}
        >
          <FiHeart size={14} className={saved ? 'fill-current' : ''} />
        </button>
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
            <p className="text-lg font-bold text-blue-600">₹{house.monthly_rent?.toLocaleString()}<span className="text-xs font-normal text-slate-500">/mo</span></p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">
          {house.property_name || `${house.house_type} in ${house.area}`}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-3">
          <FiMapPin size={11} /> {house.area}, {house.city}, {house.district}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-2 py-0.5 rounded-lg">🛏 {house.bedrooms} Beds</span>
          <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-2 py-0.5 rounded-lg">🚿 {house.bathrooms} Baths</span>
          <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 px-2 py-0.5 rounded-lg">{house.furnished}</span>
          {house.parking && <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 px-2 py-0.5 rounded-lg">🅿️ Parking</span>}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">Deposit: ₹{house.advance_deposit?.toLocaleString()}</span>
          <button onClick={() => onView(house)} className="flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl transition-colors">
            View Details <FiEye size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function PropertyModal({ house, onClose }) {
  if (!house) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="relative h-56 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-slate-700">
          {house.images && house.images.length > 0 ? (
            <img src={`http://localhost:8003${house.images[0]}`} alt="" className="w-full h-full object-cover rounded-t-2xl" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center rounded-t-2xl">
              <FiHome size={64} className="text-blue-300" />
            </div>
          )}
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 p-2 rounded-xl hover:bg-white transition-colors">
            <FiX size={18} className="text-slate-700 dark:text-slate-300" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-xl">{house.house_type}</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {house.property_name || `${house.house_type} in ${house.area}`}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                <FiMapPin size={13} /> {house.address}, {house.area}, {house.city}, {house.district}, {house.state} - {house.pincode}
              </p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-2xl font-bold text-blue-600">₹{house.monthly_rent?.toLocaleString()}</p>
              <p className="text-xs text-slate-500">per month</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Bedrooms', value: house.bedrooms },
              { label: 'Bathrooms', value: house.bathrooms },
              { label: 'Deposit', value: `₹${house.advance_deposit?.toLocaleString()}` },
              { label: 'Available', value: house.available_from },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 text-center">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 px-3 py-1 rounded-lg">{house.furnished}</span>
            {house.parking && <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 px-3 py-1 rounded-lg">🅿️ Parking Available</span>}
            {house.google_map_link && (
              <a href={house.google_map_link} target="_blank" rel="noreferrer" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-3 py-1 rounded-lg flex items-center gap-1">
                <FiMapPin size={11} /> View on Map
              </a>
            )}
          </div>
          {house.description && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Description</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{house.description}</p>
            </div>
          )}
          {house.images && house.images.length > 1 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Photos</h3>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {house.images.map((img, i) => (
                  <img key={i} src={`http://localhost:8003${img}`} alt="" className="h-20 w-28 object-cover rounded-xl shrink-0" />
                ))}
              </div>
            </div>
          )}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Contact Owner</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {house.owner_name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{house.owner_name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Property Owner</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <a href={`tel:${house.mobile}`} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                <FiPhone size={14} /> {house.mobile}
              </a>
              <a href={`mailto:${house.email}`} className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
                <FiMail size={14} /> Email Owner
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function RegisterModal({ onClose, onRefresh }) {
  const [form, setForm] = useState({
    owner_name: '', mobile: '', email: '', house_type: 'House',
    property_name: '', address: '', area: '', city: '', district: '',
    state: '', pincode: '', google_map_link: '', monthly_rent: '',
    advance_deposit: '', bedrooms: '', bathrooms: '', furnished: 'Furnished',
    parking: false, available_from: '', description: ''
  })
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      images.forEach(img => fd.append('images', img))
      await registerHouse(fd)
      setSuccess(true)
      setTimeout(() => { onClose(); onRefresh() }, 1800)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 dark:text-white"
  const labelCls = "text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiPlus className="text-blue-600" /> Register Property
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <FiX size={18} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        {success ? (
          <div className="p-12 text-center">
            <FiCheckCircle size={48} className="text-green-500 mx-auto mb-3" />
            <p className="text-lg font-bold text-slate-800 dark:text-white">Property Registered!</p>
            <p className="text-sm text-slate-500 mt-1">Your property is now live.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Owner Name *</label><input required value={form.owner_name} onChange={e => set('owner_name', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Mobile *</label><input required value={form.mobile} onChange={e => set('mobile', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Email *</label><input required type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} /></div>
              <div>
                <label className={labelCls}>House Type *</label>
                <select required value={form.house_type} onChange={e => set('house_type', e.target.value)} className={inputCls}>
                  {HOUSE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Property Name</label><input value={form.property_name} onChange={e => set('property_name', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Monthly Rent (₹) *</label><input required type="number" value={form.monthly_rent} onChange={e => set('monthly_rent', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Advance Deposit (₹) *</label><input required type="number" value={form.advance_deposit} onChange={e => set('advance_deposit', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Bedrooms *</label><input required type="number" min="0" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Bathrooms *</label><input required type="number" min="0" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} className={inputCls} /></div>
              <div>
                <label className={labelCls}>Furnished Status *</label>
                <select required value={form.furnished} onChange={e => set('furnished', e.target.value)} className={inputCls}>
                  {FURNISHED_OPTIONS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Available From *</label><input required type="date" value={form.available_from} onChange={e => set('available_from', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Pincode *</label><input required maxLength={6} value={form.pincode} onChange={e => set('pincode', e.target.value)} className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>Address *</label><input required value={form.address} onChange={e => set('address', e.target.value)} className={inputCls} /></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><label className={labelCls}>Area *</label><input required value={form.area} onChange={e => set('area', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>City *</label><input required value={form.city} onChange={e => set('city', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>District *</label><input required value={form.district} onChange={e => set('district', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>State *</label><input required value={form.state} onChange={e => set('state', e.target.value)} className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>Google Map Link</label><input value={form.google_map_link} onChange={e => set('google_map_link', e.target.value)} placeholder="https://maps.google.com/..." className={inputCls} /></div>
            <div><label className={labelCls}>Description</label><textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={inputCls} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="parking" checked={form.parking} onChange={e => set('parking', e.target.checked)} className="accent-blue-600" />
              <label htmlFor="parking" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">Parking Available</label>
            </div>
            <div>
              <label className={labelCls}>House Images</label>
              <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))} className="w-full text-sm text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" />
              {images.length > 0 && <p className="text-xs text-slate-500 mt-1">{images.length} image(s) selected</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? <><FiLoader className="animate-spin" size={16} /> Registering...</> : 'Register Property'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}

export default function HousingPage() {
  const [dashboard, setDashboard] = useState(null)
  const [houses, setHouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [activeTab, setActiveTab] = useState('All')
  const [filters, setFilters] = useState({ state: '', district: '', city: '', area: '', house_type: '', min_budget: '', max_budget: '' })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [dashRes, housesRes] = await Promise.allSettled([getDashboard(), getAllHouses()])
      if (dashRes.status === 'fulfilled') setDashboard(dashRes.value?.data || null)
      if (housesRes.status === 'fulfilled') setHouses(housesRes.value?.data?.houses || [])
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch() {
    setSearchLoading(true)
    try {
      const payload = {}
      if (filters.state) payload.state = filters.state
      if (filters.district) payload.district = filters.district
      if (filters.city) payload.city = filters.city
      if (filters.area) payload.area = filters.area
      if (filters.house_type) payload.house_type = filters.house_type
      if (filters.min_budget) payload.min_budget = parseFloat(filters.min_budget)
      if (filters.max_budget) payload.max_budget = parseFloat(filters.max_budget)
      const res = await searchHouses(payload)
      setHouses(res.data?.houses || [])
      setActiveTab('All')
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setSearchLoading(false)
    }
  }

  const filteredHouses = activeTab === 'All' ? houses : houses.filter(h => h.house_type === activeTab)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Housing' }]} />

        <div className="flex items-center justify-between mb-6 mt-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiHome className="text-blue-600" /> Housing Portal
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Find houses, apartments, PGs and hostels</p>
          </div>
          <button
            onClick={() => setShowRegister(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
          >
            <FiPlus size={16} /> List Property
          </button>
        </div>

        {dashboard && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Properties', value: dashboard.total_properties },
              { label: 'Houses & Apts', value: dashboard.total_houses },
              { label: 'PGs', value: dashboard.total_pgs },
              { label: 'Hostels', value: dashboard.total_hostels },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{value ?? 0}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {['state', 'district', 'city', 'area'].map(field => (
              <input
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={filters[field]}
                onChange={e => setFilters(f => ({ ...f, [field]: e.target.value }))}
                className="text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 dark:text-white"
              />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <select
              value={filters.house_type}
              onChange={e => setFilters(f => ({ ...f, house_type: e.target.value }))}
              className="text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 dark:text-white"
            >
              <option value="">All Types</option>
              {HOUSE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <input type="number" placeholder="Min Budget (₹)" value={filters.min_budget} onChange={e => setFilters(f => ({ ...f, min_budget: e.target.value }))} className="text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 dark:text-white" />
            <input type="number" placeholder="Max Budget (₹)" value={filters.max_budget} onChange={e => setFilters(f => ({ ...f, max_budget: e.target.value }))} className="text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 dark:text-white" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleSearch} disabled={searchLoading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
              {searchLoading ? <FiLoader className="animate-spin" size={14} /> : <FiSearch size={14} />} Search
            </button>
            <button onClick={() => { setFilters({ state: '', district: '', city: '', area: '', house_type: '', min_budget: '', max_budget: '' }); loadData() }} className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Clear
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py
          <div className="flex items-center justify-center py-20">
            <FiLoader className="animate-spin text-blue-600" size={32} />
          </div>
        ) : filteredHouses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FiAlertCircle size={48} className="text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No properties found</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredHouses.map((house, i) => (
              <PropertyCard key={house.id || i} house={house} index={i} onView={setSelectedHouse} />
            ))}
          </div>
        )}
      </div>

      {selectedHouse && <PropertyModal house={selectedHouse} onClose={() => setSelectedHouse(null)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onRefresh={loadData} />}
    </div>
  )
}
