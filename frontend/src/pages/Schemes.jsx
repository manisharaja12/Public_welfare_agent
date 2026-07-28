import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiSearch, HiDocumentText, HiCheckCircle, HiFilter } from 'react-icons/hi'
import Breadcrumb from '../components/Breadcrumb'
import { TableSkeleton } from '../components/Skeleton'

const categories = ['All', 'Agriculture', 'Education', 'Health', 'Housing', 'Women & Child', 'Employment', 'Senior Citizens']

const eligibilityItems = [
  { label: 'Age', value: '18-60 years', met: true },
  { label: 'Income', value: 'Below ₹2.5 LPA', met: true },
  { label: 'Residence', value: 'Indian Citizen', met: true },
  { label: 'Category', value: 'General / OBC / SC / ST', met: false },
]

export default function Schemes() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  return (
    <div>
      <Breadcrumb />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
          <HiDocumentText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Government Scheme Agent</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Discover and apply for welfare schemes</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4 mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input className="input-field pl-9" placeholder="Search government schemes..."
              value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button className="btn-outline flex items-center gap-2 px-4">
            <HiFilter className="w-4 h-4" /> Filter
          </button>
          <button className="btn-primary px-6">Search</button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-teal-400'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Scheme List Placeholder */}
          <div className="card p-5">
            <h3 className="font-semibold mb-2">Available Schemes</h3>
            <p className="text-xs text-gray-400 mb-6">Backend will provide scheme listings based on your profile.</p>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 rounded-2xl flex items-center justify-center mb-4">
                <HiDocumentText className="w-8 h-8 text-teal-400" />
              </div>
              <p className="font-semibold text-gray-600 dark:text-gray-300">No schemes loaded</p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">Connect to the backend to fetch personalized government scheme recommendations.</p>
            </div>
            <div className="mt-4 space-y-2 opacity-40 pointer-events-none">
              <TableSkeleton rows={4} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Eligibility Card */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4">Eligibility Check</h3>
            <div className="space-y-3">
              {eligibilityItems.map(({ label, value, met }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-gray-400">{value}</p>
                  </div>
                  <HiCheckCircle className={`w-5 h-5 ${met ? 'text-green-500' : 'text-gray-300'}`} />
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
              <p className="text-sm font-semibold text-teal-700 dark:text-teal-400">3 of 4 criteria met</p>
              <p className="text-xs text-teal-600 dark:text-teal-500 mt-0.5">You may be eligible for 12+ schemes</p>
            </div>
          </div>

          {/* Apply Placeholder */}
          <div className="card p-5">
            <h3 className="font-semibold mb-3">Quick Apply</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select a scheme from the list to apply.</p>
            <button disabled className="btn-primary w-full opacity-50 cursor-not-allowed">Apply for Scheme</button>
            <p className="text-xs text-gray-400 text-center mt-2">Select a scheme first</p>
          </div>
        </div>
      </div>
    </div>
  )
}
