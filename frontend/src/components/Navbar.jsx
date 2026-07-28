import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiMenuAlt3, HiX, HiBell, HiSearch, HiSun, HiMoon,
  HiUser, HiLogout, HiCog, HiChevronDown,
} from 'react-icons/hi'
import { MdSecurity } from 'react-icons/md'
import { useTheme } from '../hooks/useTheme'

export default function Navbar({ onMenuClick }) {
  const { dark, toggle } = useTheme()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const navigate = useNavigate()

  const notifications = [
    { id: 1, text: 'Your complaint #1042 has been resolved.', time: '2m ago', unread: true },
    { id: 2, text: 'New government scheme available for you.', time: '1h ago', unread: true },
    { id: 3, text: 'Resume upload successful.', time: '3h ago', unread: false },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden">
            <HiMenuAlt3 className="w-5 h-5" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <MdSecurity className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block font-bold text-blue-700 dark:text-blue-400 text-sm leading-tight">
              AI Welfare<br /><span className="text-xs font-normal text-gray-500">Multi-Agent System</span>
            </span>
          </Link>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input className="input-field pl-9 py-2 text-sm" placeholder="Search agents, schemes, jobs..." />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            {dark ? <HiSun className="w-5 h-5 text-yellow-400" /> : <HiMoon className="w-5 h-5 text-gray-600" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative">
              <HiBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-80 card p-0 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 font-semibold text-sm">Notifications</div>
                  {notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-50 dark:border-gray-700 ${n.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                      <p className="text-sm">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                  <div className="px-4 py-2 text-center text-xs text-blue-600 hover:underline cursor-pointer">View all</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white text-sm font-bold">
                JD
              </div>
              <span className="hidden sm:block text-sm font-medium">John Doe</span>
              <HiChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-48 card p-1 z-50">
                  {[
                    { icon: HiUser, label: 'Profile', to: '/profile' },
                    { icon: HiCog, label: 'Settings', to: '/settings' },
                  ].map(({ icon: Icon, label, to }) => (
                    <Link key={label} to={to} onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                      <Icon className="w-4 h-4 text-gray-500" /> {label}
                    </Link>
                  ))}
                  <hr className="my-1 border-gray-100 dark:border-gray-700" />
                  <button onClick={() => navigate('/login')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 w-full">
                    <HiLogout className="w-4 h-4" /> Logout
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
