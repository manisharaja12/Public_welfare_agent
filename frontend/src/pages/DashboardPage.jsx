import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiBriefcase, FiBook, FiFileText, FiAlertCircle, FiShield, FiMessageSquare, FiArrowRight, FiTrendingUp, FiUsers, FiCheckCircle } from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const agents = [
  { to: '/jobs', icon: FiBriefcase, title: 'Skill Development & Job Seeking', desc: 'AI-powered job matching, skill courses, and resume builder for career growth.', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', badge: 'Jobs' },
  { to: '/schemes', icon: FiBook, title: 'Government Scheme Agent', desc: 'Discover welfare schemes you qualify for and apply with one click.', color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20', badge: 'Schemes' },
  { to: '/complaints', icon: FiFileText, title: 'Citizen Complaint Agent', desc: 'File grievances, track status, and get resolution updates in real-time.', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', badge: 'Complaints' },
  { to: '/emergency', icon: FiAlertCircle, title: 'Emergency Assistance Agent', desc: 'One-tap SOS with nearby hospitals, police stations, and ambulance services.', color: 'from-red-500 to-red-600', bg: 'bg-red-50 dark:bg-red-900/20', badge: 'Emergency' },
  { to: '/cyber', icon: FiShield, title: 'Cyber Safety Agent', desc: 'Scan URLs and files for threats. Get AI-powered cyber security guidance.', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', badge: 'Cyber' },
  { to: '/chatbot', icon: FiMessageSquare, title: 'AI Public Assistant (Chatbot)', desc: '24/7 intelligent assistant for all government service queries and guidance.', color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20', badge: 'AI Chat' },
]

const barData = [
  { name: 'Jan', complaints: 40, schemes: 24 },
  { name: 'Feb', complaints: 30, schemes: 35 },
  { name: 'Mar', complaints: 55, schemes: 40 },
  { name: 'Apr', complaints: 27, schemes: 50 },
  { name: 'May', complaints: 60, schemes: 45 },
  { name: 'Jun', complaints: 48, schemes: 60 },
]

const pieData = [
  { name: 'Resolved', value: 68, color: '#22c55e' },
  { name: 'Pending', value: 22, color: '#f59e0b' },
  { name: 'Rejected', value: 10, color: '#ef4444' },
]

const stats = [
  { icon: FiUsers, label: 'Active Citizens', value: '2,41,890', change: '+12%', color: 'text-blue-600' },
  { icon: FiCheckCircle, label: 'Complaints Resolved', value: '18,432', change: '+8%', color: 'text-green-600' },
  { icon: FiBook, label: 'Schemes Applied', value: '9,210', change: '+23%', color: 'text-teal-600' },
  { icon: FiTrendingUp, label: 'Jobs Matched', value: '4,560', change: '+15%', color: 'text-purple-600' },
]

export default function DashboardPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, Citizen 👋</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here's what's happening with your welfare services today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, change, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon className={color} size={20} />
              <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">{change}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4 text-sm">Activity Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="complaints" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Complaints" />
              <Bar dataKey="schemes" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Schemes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4 text-sm">Complaint Status</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {pieData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-slate-600 dark:text-slate-400">{name}</span>
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Agent Services</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Select an agent to get started</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {agents.map(({ to, icon: Icon, title, desc, color, bg, badge }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`${bg} rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:-translate-y-1 group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <Icon size={22} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-600">
                {badge}
              </span>
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2 leading-tight">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{desc}</p>
            <Link
              to={to}
              className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${color} text-white px-4 py-2 rounded-xl hover:shadow-md transition-all`}
            >
              Open Agent <FiArrowRight size={14} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
