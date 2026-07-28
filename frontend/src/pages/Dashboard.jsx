import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiBriefcase, HiDocumentText, HiExclamationCircle,
  HiPhone, HiShieldCheck, HiChat, HiArrowRight, HiTrendingUp,
  HiUsers, HiCheckCircle, HiClock,
} from 'react-icons/hi'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Breadcrumb from '../components/Breadcrumb'

const agents = [
  { to: '/jobs', icon: HiBriefcase, title: 'Skill Development & Job Seeking', desc: 'AI-powered job matching, skill gap analysis, and resume builder.', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { to: '/schemes', icon: HiDocumentText, title: 'Government Scheme Agent', desc: 'Discover eligible government schemes and apply with guided assistance.', color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20' },
  { to: '/complaints', icon: HiExclamationCircle, title: 'Citizen Complaint Agent', desc: 'File, track, and resolve civic complaints with real-time updates.', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { to: '/emergency', icon: HiPhone, title: 'Emergency Assistance Agent', desc: 'Instant SOS, nearby emergency services, and live location sharing.', color: 'from-red-500 to-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
  { to: '/cyber', icon: HiShieldCheck, title: 'Cyber Safety Agent', desc: 'Scan URLs, files, and get personalized cyber security guidance.', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { to: '/chatbot', icon: HiChat, title: 'AI Public Assistant (Chatbot)', desc: '24/7 intelligent assistant for all public welfare queries and guidance.', color: 'from-green-500 to-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
]

const stats = [
  { icon: HiUsers, label: 'Active Users', value: '1,24,532', change: '+12%', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { icon: HiCheckCircle, label: 'Resolved Complaints', value: '8,421', change: '+5%', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { icon: HiDocumentText, label: 'Schemes Applied', value: '32,100', change: '+18%', color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20' },
  { icon: HiTrendingUp, label: 'Jobs Matched', value: '5,670', change: '+9%', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
]

const areaData = [
  { month: 'Jan', users: 4000, complaints: 2400 },
  { month: 'Feb', users: 5200, complaints: 1800 },
  { month: 'Mar', users: 6100, complaints: 2200 },
  { month: 'Apr', users: 7800, complaints: 1600 },
  { month: 'May', users: 9200, complaints: 2800 },
  { month: 'Jun', users: 11000, complaints: 2100 },
]

const pieData = [
  { name: 'Jobs', value: 30, color: '#3b82f6' },
  { name: 'Schemes', value: 25, color: '#0d9488' },
  { name: 'Complaints', value: 20, color: '#f97316' },
  { name: 'Emergency', value: 10, color: '#ef4444' },
  { name: 'Cyber', value: 8, color: '#8b5cf6' },
  { name: 'Chatbot', value: 7, color: '#22c55e' },
]

export default function Dashboard() {
  return (
    <div>
      <Breadcrumb />
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome back, John 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here's what's happening across your welfare services today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, change, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">{change}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Platform Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="users" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="complaints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="url(#users)" strokeWidth={2} name="Users" />
              <Area type="monotone" dataKey="complaints" stroke="#0d9488" fill="url(#complaints)" strokeWidth={2} name="Complaints" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-4">Agent Usage</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {pieData.map(({ name, color, value }) => (
              <div key={name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-gray-600 dark:text-gray-400">{name} ({value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">AI Agents</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Select an agent to get started</p>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {agents.map(({ to, icon: Icon, title, desc, color, bg }, i) => (
          <motion.div key={to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-5 hover:-translate-y-1 group flex flex-col">
            <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold mb-2 leading-snug">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm flex-1 mb-4">{desc}</p>
            <Link to={to} className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${color} bg-clip-text text-transparent hover:gap-3 transition-all`}>
              Open Agent <HiArrowRight className="w-4 h-4" style={{ color: 'currentColor' }} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
