import { Link, useLocation } from 'react-router-dom'
import { HiChevronRight, HiHome } from 'react-icons/hi'

const labels = {
  dashboard: 'Dashboard', jobs: 'Jobs & Skills', schemes: 'Gov. Schemes',
  complaints: 'Complaints', emergency: 'Emergency', cyber: 'Cyber Safety', chatbot: 'AI Assistant',
}

export default function Breadcrumb() {
  const { pathname } = useLocation()
  const parts = pathname.split('/').filter(Boolean)

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
      <Link to="/dashboard" className="hover:text-blue-600 flex items-center gap-1">
        <HiHome className="w-4 h-4" /> Home
      </Link>
      {parts.map((part, i) => (
        <span key={part} className="flex items-center gap-1">
          <HiChevronRight className="w-4 h-4" />
          {i === parts.length - 1
            ? <span className="text-gray-900 dark:text-gray-100 font-medium">{labels[part] || part}</span>
            : <Link to={`/${parts.slice(0, i + 1).join('/')}`} className="hover:text-blue-600">{labels[part] || part}</Link>
          }
        </span>
      ))}
    </nav>
  )
}
