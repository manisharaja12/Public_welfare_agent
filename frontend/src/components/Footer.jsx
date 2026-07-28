import { Link } from 'react-router-dom'
import { FiGithub, FiMail, FiPhone } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-white font-semibold text-sm">AI Public Welfare System</span>
          </div>
          <p className="text-xs leading-relaxed">
            Empowering citizens through AI-driven government services, job assistance, and emergency support.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            {[['Dashboard', '/dashboard'], ['Jobs & Skills', '/jobs'], ['Gov. Schemes', '/schemes'], ['Complaints', '/complaints']].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Contact</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2"><FiMail size={12} /> support@welfare.gov.in</li>
            <li className="flex items-center gap-2"><FiPhone size={12} /> 1800-XXX-XXXX (Toll Free)</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs mt-8 border-t border-slate-800 pt-6">
        © {new Date().getFullYear()} AI Public Welfare Multi-Agent System. Government of India.
      </div>
    </footer>
  )
}
