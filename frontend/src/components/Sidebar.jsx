import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiHome, HiBriefcase, HiDocumentText, HiExclamationCircle,
  HiPhone, HiShieldCheck, HiChat, HiX,
} from 'react-icons/hi'
import { MdSecurity } from 'react-icons/md'

const links = [
  { to: '/dashboard', icon: HiHome, label: 'Dashboard' },
  { to: '/jobs', icon: HiBriefcase, label: 'Jobs & Skills' },
  { to: '/schemes', icon: HiDocumentText, label: 'Gov. Schemes' },
  { to: '/complaints', icon: HiExclamationCircle, label: 'Complaints' },
  { to: '/emergency', icon: HiPhone, label: 'Emergency' },
  { to: '/cyber', icon: HiShieldCheck, label: 'Cyber Safety' },
  { to: '/chatbot', icon: HiChat, label: 'AI Assistant' },
]

export default function Sidebar({ open, onClose }) {
  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
            <MdSecurity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-blue-700 dark:text-blue-400 text-sm">AI Welfare</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <HiX className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">Navigation</p>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-200 dark:shadow-blue-900'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }>
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl p-3 text-white text-xs">
          <p className="font-semibold mb-1">Need Help?</p>
          <p className="opacity-80">Contact support or use the AI Assistant for guidance.</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 z-50 lg:hidden shadow-2xl">
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
