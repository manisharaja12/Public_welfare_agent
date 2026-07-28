import { Outlet, Link } from 'react-router-dom'
import { MdSecurity } from 'react-icons/md'
import { useTheme } from '../hooks/useTheme'
import { HiSun, HiMoon } from 'react-icons/hi'

export default function AuthLayout() {
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <MdSecurity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-blue-700 dark:text-blue-400">AI Public Welfare</span>
        </Link>
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          {dark ? <HiSun className="w-5 h-5 text-yellow-400" /> : <HiMoon className="w-5 h-5 text-gray-600" />}
        </button>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Outlet />
      </div>
      <footer className="text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} AI Public Welfare Multi-Agent System
      </footer>
    </div>
  )
}
