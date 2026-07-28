import { Link } from 'react-router-dom'
import { FiChevronRight, FiHome } from 'react-icons/fi'

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-4">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        <FiHome size={14} />
        <span>Home</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <FiChevronRight size={14} />
          {item.to ? (
            <Link to={item.to} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
