import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiBriefcase, FiFileText, FiAlertCircle,
  FiShield, FiMessageSquare, FiBook, FiX, FiUsers, FiTrendingUp, FiHeart, FiGrid
} from 'react-icons/fi'

const navItems = [
  { to: '/dashboard',  icon: FiHome,         label: 'Dashboard' },
  { to: '/housing',    icon: FiGrid,         label: 'Housing' },
  { to: '/schemes',    icon: FiBook,         label: 'Gov. Schemes' },
  { to: '/complaints', icon: FiFileText,     label: 'Complaints' },
  { to: '/emergency',  icon: FiAlertCircle,  label: 'Emergency' },
  { to: '/cyber',      icon: FiShield,       label: 'Cyber Safety' },
  { to: '/chatbot',    icon: FiMessageSquare,label: 'AI Assistant' },
  { to: '/volunteer',  icon: FiUsers,        label: 'Volunteer' },
  { to: '/business',   icon: FiTrendingUp,   label: 'Business Growth' },
  { to: '/donation',   icon: FiHeart,        label: 'Donation Agent' },
]

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 flex flex-col ${
          open ? 'w-60' : 'w-0 lg:w-16'
        } overflow-hidden`}
      >
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => window.innerWidth < 1024 && setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span
                className={`text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${
                  open ? 'opacity-100' : 'opacity-0 lg:opacity-0'
                }`}
              >
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
          <div
            className={`flex items-center gap-3 px-2 py-2 ${
              !open && 'justify-center'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 shrink-0" />
            {open && (
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-700 dark:text-white truncate">
                  Citizen User
                </p>
                <p className="text-xs text-slate-400 truncate">
                  citizen@gov.in
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}