import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiBriefcase, FiUpload, FiCode, FiTrendingUp, FiBook, FiMonitor, FiDatabase } from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'

const categories = [
  { icon: FiCode, label: 'Technology', count: 1240 },
  { icon: FiTrendingUp, label: 'Finance', count: 430 },
  { icon: FiBook, label: 'Education', count: 320 },
  { icon: FiMonitor, label: 'Healthcare', count: 560 },
  { icon: FiDatabase, label: 'Government', count: 890 },
  { icon: FiBriefcase, label: 'Manufacturing', count: 670 },
]

const skills = [
  { name: 'Python Programming', level: 'Beginner → Advanced', duration: '3 months', color: 'from-blue-500 to-blue-600' },
  { name: 'Digital Marketing', level: 'Beginner → Intermediate', duration: '6 weeks', color: 'from-teal-500 to-teal-600' },
  { name: 'Data Analysis', level: 'Intermediate', duration: '2 months', color: 'from-purple-500 to-purple-600' },
  { name: 'Web Development', level: 'Beginner → Advanced', duration: '4 months', color: 'from-orange-500 to-orange-600' },
]

export default function JobsPage() {
  const [query, setQuery] = useState('')
  const [uploaded, setUploaded] = useState(false)

  return (
    <div>
      <Breadcrumb items={[{ label: 'Jobs & Skill Development' }]} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FiBriefcase className="text-blue-600" /> Skill Development & Job Seeking
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">AI-powered job matching and skill enhancement programs</p>
      </div>

      {/* Search */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-3">Find Your Dream Job</h2>
        <div className="flex gap-3">
          <div className="flex-1 flex items-center bg-white rounded-xl px-4 gap-2">
            <FiSearch className="text-slate-400" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, skills, companies..."
              className="flex-1 py-3 text-sm text-slate-700 outline-none bg-transparent"
            />
          </div>
          <button className="bg-white text-blue-600 font-semibold px-5 py-3 rounded-xl hover:shadow-md transition-all text-sm">
            Search
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-3">Job Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map(({ icon: Icon, label, count }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-blue-400 hover:shadow-md transition-all"
            >
              <Icon className="text-blue-600 mx-auto mb-2" size={22} />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{count} jobs</p>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill Cards */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-3">Recommended Skill Courses</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map(({ name, level, duration, color }) => (
              <div key={name} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                  <FiBook size={16} className="text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{level}</p>
                <p className="text-xs text-slate-400 mt-1">⏱ {duration}</p>
                <button className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  Enroll Now →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Resume Upload */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-3">Upload Resume</h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 cursor-pointer hover:border-blue-400 transition-colors">
              <FiUpload className="text-slate-400 mb-2" size={24} />
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                {uploaded ? '✅ Resume uploaded!' : 'Drop your resume here or click to browse'}
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOC up to 5MB</p>
              <input type="file" className="hidden" onChange={() => setUploaded(true)} accept=".pdf,.doc,.docx" />
            </label>
          </div>

          {/* Recommended Jobs Placeholder */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-3">Recommended Jobs</h2>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                <FiBriefcase className="text-blue-400" size={24} />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Backend will provide job recommendations.</p>
              <p className="text-xs text-slate-400 mt-1">Upload your resume to get started</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
