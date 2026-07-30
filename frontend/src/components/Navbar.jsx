import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FiBell, FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiSun, FiMoon } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ dark, setDark, sidebarOpen, setSidebarOpen }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const notifications = [
    { id: 1, text: 'Your complaint #1042 has been resolved.', time: '2m ago' },
    { id: 2, text: 'New government scheme available for you.', time: '1h ago' },
    { id: 3, text: 'Job recommendation updated.', time: '3h ago' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="hidden md:block font-semibold text-slate-800 dark:text-white text-sm leading-tight">
              AI Public Welfare<br />
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Multi-Agent System</span>
            </span>
          </Link>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 gap-2 w-72">
          <FiSearch className="text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search agents, schemes, jobs..."
            className="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none w-full placeholder-slate-400"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Dark mode */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <FiBell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-700 dark:text-white text-sm">
                    Notifications
                  </div>
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-50 dark:border-slate-700">
                      <p className="text-sm text-slate-700 dark:text-slate-300">{n.text}</p>
                      <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center">
                <FiUser size={14} className="text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300">{user?.name?.split(' ')[0] || 'Citizen'}</span>
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{user?.name || 'Citizen'}</p>
                    <p className="text-xs text-slate-400">{user?.email || ''}</p>
                  </div>
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <FiSettings size={14} /> Settings
                  </button>
                  <button
                    onClick={() => { logout(); navigate('/') }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-slate-700"
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
