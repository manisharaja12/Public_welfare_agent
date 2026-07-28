import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiExclamationCircle, HiUpload, HiClock, HiCheckCircle, HiXCircle, HiRefresh } from 'react-icons/hi'
import Breadcrumb from '../components/Breadcrumb'

const categories = ['Road & Infrastructure', 'Water Supply', 'Electricity', 'Sanitation', 'Public Safety', 'Corruption', 'Other']

const statusHistory = [
  { id: '#1042', title: 'Broken streetlight on MG Road', status: 'Resolved', date: '2 days ago', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', icon: HiCheckCircle },
  { id: '#1038', title: 'Water supply disruption', status: 'In Progress', date: '5 days ago', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: HiRefresh },
  { id: '#1031', title: 'Garbage not collected', status: 'Pending', date: '1 week ago', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', icon: HiClock },
]

export default function Complaints() {
  const [form, setForm] = useState({ title: '', category: '', description: '', location: '' })
  const [image, setImage] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div>
      <Breadcrumb />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
          <HiExclamationCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Citizen Complaint Agent</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">File and track civic complaints</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Complaint Form */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="font-semibold mb-5">File a New Complaint</h3>
            {submitted && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-xl mb-4 text-sm">
                <HiCheckCircle className="w-5 h-5" /> Complaint submitted successfully! Tracking ID: #1043
              </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Complaint Title</label>
                <input className="input-field" placeholder="Brief title of your complaint" required
                  value={form.title} onChange={set('title')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select className="input-field" required value={form.category} onChange={set('category')}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Location</label>
                <input className="input-field" placeholder="Area, street, landmark..." required
                  value={form.location} onChange={set('location')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea className="input-field resize-none" rows={4} placeholder="Describe the issue in detail..."
                  required value={form.description} onChange={set('description')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Upload Image (Optional)</label>
                <label className="flex items-center gap-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 cursor-pointer hover:border-orange-400 transition-colors">
                  <HiUpload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">{image ? image.name : 'Click to upload photo evidence'}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </label>
              </div>
              <button type="submit" className="btn-primary w-full">Submit Complaint</button>
            </form>
          </div>
        </div>

        {/* Complaint History */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold mb-4">Complaint History</h3>
            <div className="space-y-3">
              {statusHistory.map(({ id, title, status, date, color, bg, icon: Icon }) => (
                <div key={id} className={`${bg} rounded-xl p-3`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-500">{id}</p>
                      <p className="text-sm font-medium truncate">{title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                    </div>
                    <div className={`flex items-center gap-1 ${color} text-xs font-semibold flex-shrink-0`}>
                      <Icon className="w-4 h-4" /> {status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Summary */}
          <div className="card p-5">
            <h3 className="font-semibold mb-3">Status Summary</h3>
            {[
              { label: 'Resolved', count: 8, color: 'bg-green-500' },
              { label: 'In Progress', count: 3, color: 'bg-yellow-500' },
              { label: 'Pending', count: 2, color: 'bg-red-500' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-sm">{label}</span>
                </div>
                <span className="font-bold text-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
