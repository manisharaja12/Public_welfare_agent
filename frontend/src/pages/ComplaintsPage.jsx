import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiFileText, FiUpload, FiClock, FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'

const categories = ['Road & Infrastructure', 'Water Supply', 'Electricity', 'Sanitation', 'Public Safety', 'Healthcare', 'Education', 'Other']

const history = [
  { id: '#1042', title: 'Broken streetlight on MG Road', category: 'Road & Infrastructure', status: 'Resolved', date: '12 Jun 2025', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { id: '#1038', title: 'Water supply disruption in Sector 4', category: 'Water Supply', status: 'Pending', date: '08 Jun 2025', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
  { id: '#1031', title: 'Garbage not collected for 5 days', category: 'Sanitation', status: 'In Progress', date: '01 Jun 2025', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
]

const statusIcon = { Resolved: FiCheckCircle, Pending: FiClock, 'In Progress': FiAlertCircle }

export default function ComplaintsPage() {
  const [form, setForm] = useState({ title: '', category: '', description: '', location: '' })
  const [imageUploaded, setImageUploaded] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div>
      <Breadcrumb items={[{ label: 'Citizen Complaints' }]} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FiFileText className="text-purple-600" /> Citizen Complaint Agent
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">File grievances and track resolution status in real-time</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Complaint Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-5">File New Complaint</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Complaint Title</label>
                <input
                  value={form.title}
                  onChange={set('title')}
                  placeholder="Brief title of your complaint"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={set('category')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={4}
                  placeholder="Describe your complaint in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                <input
                  value={form.location}
                  onChange={set('location')}
                  placeholder="Area, Street, City"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Attach Image (Optional)</label>
                <label className="flex items-center gap-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 cursor-pointer hover:border-purple-400 transition-colors">
                  <FiUpload className="text-slate-400" size={20} />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {imageUploaded ? '✅ Image attached' : 'Click to upload image evidence'}
                  </span>
                  <input type="file" className="hidden" onChange={() => setImageUploaded(true)} accept="image/*" />
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FiFileText size={16} /> Submit Complaint
              </button>
            </form>
          </div>
        </div>

        {/* Status Cards + History */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[['Resolved', '12', 'text-green-600 bg-green-50 dark:bg-green-900/20'], ['Pending', '3', 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'], ['In Progress', '2', 'text-blue-600 bg-blue-50 dark:bg-blue-900/20']].map(([label, count, cls]) => (
              <div key={label} className={`${cls} rounded-2xl p-3 text-center`}>
                <p className="text-xl font-bold">{count}</p>
                <p className="text-xs font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Complaint History</h2>
            <div className="space-y-3">
              {history.map(({ id, title, category, status, date, color }) => {
                const Icon = statusIcon[status]
                return (
                  <div key={id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{category} · {date}</p>
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${color}`}>
                        <Icon size={10} /> {status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{id}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
