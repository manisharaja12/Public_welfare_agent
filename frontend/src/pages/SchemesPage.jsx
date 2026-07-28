import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiBook, FiFilter, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'

const categories = ['All', 'Agriculture', 'Education', 'Health', 'Housing', 'Women & Child', 'Senior Citizens', 'Disability']

const eligibilityItems = [
  { label: 'Annual Income', value: '< ₹2.5 Lakh', met: true },
  { label: 'Age Group', value: '18 - 60 years', met: true },
  { label: 'Residence', value: 'Indian Citizen', met: true },
  { label: 'Category', value: 'General / OBC / SC / ST', met: false },
]

export default function SchemesPage() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('All')

  return (
    <div>
      <Breadcrumb items={[{ label: 'Government Schemes' }]} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FiBook className="text-teal-600" /> Government Scheme Agent
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Discover and apply for welfare schemes you are eligible for</p>
      </div>

      {/* Search */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-3">Search Government Schemes</h2>
        <div className="flex gap-3">
          <div className="flex-1 flex items-center bg-white rounded-xl px-4 gap-2">
            <FiSearch className="text-slate-400" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by scheme name, category..."
              className="flex-1 py-3 text-sm text-slate-700 outline-none bg-transparent"
            />
          </div>
          <button className="bg-white text-teal-600 font-semibold px-5 py-3 rounded-xl hover:shadow-md transition-all text-sm flex items-center gap-2">
            <FiFilter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              active === cat
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-teal-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Scheme List Placeholder */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-3">Available Schemes</h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-5 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
            <div className="p-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Scheme data will be loaded from backend.</p>
            </div>
          </div>
        </div>

        {/* Eligibility Card */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Your Eligibility Profile</h2>
            <div className="space-y-3">
              {eligibilityItems.map(({ label, value, met }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{label}</p>
                    <p className="text-xs text-slate-400">{value}</p>
                  </div>
                  <FiCheckCircle className={met ? 'text-green-500' : 'text-slate-300'} size={18} />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              Check Full Eligibility <FiArrowRight size={14} />
            </button>
          </div>

          {/* Apply Placeholder */}
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800">
            <h3 className="font-semibold text-teal-800 dark:text-teal-300 text-sm mb-2">Quick Apply</h3>
            <p className="text-xs text-teal-600 dark:text-teal-400 mb-3">Select a scheme from the list to apply instantly.</p>
            <button disabled className="w-full bg-teal-600/50 text-white text-sm font-semibold py-2.5 rounded-xl cursor-not-allowed">
              Apply Now (Select Scheme)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
