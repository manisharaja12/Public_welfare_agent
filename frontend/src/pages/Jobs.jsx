import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiSearch, HiBriefcase, HiUpload, HiCode, HiAcademicCap, HiChip, HiColorSwatch, HiCurrencyRupee } from 'react-icons/hi'
import Breadcrumb from '../components/Breadcrumb'
import { TableSkeleton } from '../components/Skeleton'

const categories = [
  { icon: HiCode, label: 'Software Dev', count: 1240 },
  { icon: HiChip, label: 'Data Science', count: 860 },
  { icon: HiColorSwatch, label: 'Design', count: 430 },
  { icon: HiAcademicCap, label: 'Education', count: 620 },
  { icon: HiCurrencyRupee, label: 'Finance', count: 380 },
  { icon: HiBriefcase, label: 'Management', count: 510 },
]

const skills = [
  { name: 'Python', level: 75, color: 'bg-blue-500' },
  { name: 'React.js', level: 60, color: 'bg-teal-500' },
  { name: 'Data Analysis', level: 45, color: 'bg-purple-500' },
  { name: 'Communication', level: 85, color: 'bg-green-500' },
]

export default function Jobs() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)

  return (
    <div>
      <Breadcrumb />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <HiBriefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Skill Development & Job Seeking</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">AI-powered job matching and skill development</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4 mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input className="input-field pl-9" placeholder="Search jobs, skills, companies..."
              value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button className="btn-primary px-6">Search</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Categories */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4">Job Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map(({ icon: Icon, label, count }) => (
                <button key={label} onClick={() => setActiveCategory(activeCategory === label ? null : label)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                    activeCategory === label
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-gray-400">{count} jobs</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Jobs Placeholder */}
          <div className="card p-5">
            <h3 className="font-semibold mb-2">Recommended Jobs</h3>
            <p className="text-xs text-gray-400 mb-4">Backend will provide job recommendations.</p>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4">
                <HiBriefcase className="w-8 h-8 text-blue-400" />
              </div>
              <p className="font-semibold text-gray-600 dark:text-gray-300">No recommendations yet</p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">Backend will provide job recommendations based on your profile and skills.</p>
            </div>
            <div className="mt-4 space-y-2 opacity-40 pointer-events-none">
              <TableSkeleton rows={3} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Resume Upload */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4">Upload Resume</h3>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 cursor-pointer hover:border-blue-400 transition-colors">
              <HiUpload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {resumeFile ? resumeFile.name : 'Click to upload resume'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC up to 5MB</p>
              <input type="file" className="hidden" accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])} />
            </label>
            {resumeFile && (
              <button className="btn-primary w-full mt-3 text-sm">Analyze Resume</button>
            )}
          </div>

          {/* Skill Cards */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4">Your Skills</h3>
            <div className="space-y-3">
              {skills.map(({ name, level, color }) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{name}</span>
                    <span className="text-gray-400">{level}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${level}%` }} transition={{ duration: 1, delay: 0.3 }}
                      className={`h-full ${color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-outline w-full mt-4 text-sm">Add Skills</button>
          </div>
        </div>
      </div>
    </div>
  )
}
