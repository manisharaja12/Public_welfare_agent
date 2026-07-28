import { Link } from 'react-router-dom'
import { MdSecurity } from 'react-icons/md'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <MdSecurity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-blue-700 dark:text-blue-400">AI Public Welfare Multi-Agent System</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Empowering citizens through AI-driven public welfare services. Accessible, transparent, and efficient.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">Quick Links</p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {[['Jobs & Skills', '/jobs'], ['Gov. Schemes', '/schemes'], ['Complaints', '/complaints']].map(([l, t]) => (
                <li key={t}><Link to={t} className="hover:text-blue-600 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">Support</p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {[['Emergency', '/emergency'], ['Cyber Safety', '/cyber'], ['AI Assistant', '/chatbot']].map(([l, t]) => (
                <li key={t}><Link to={t} className="hover:text-blue-600 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-700 mt-6 pt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} AI Public Welfare Multi-Agent System. Government of India Initiative.
        </div>
      </div>
    </footer>
  )
}
