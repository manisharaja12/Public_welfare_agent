import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiBriefcase, FiBook, FiAlertCircle, FiShield, FiMessageSquare, FiFileText, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import Footer from '../components/Footer'

const features = [
  { icon: FiBriefcase, title: 'Job & Skill Development', desc: 'AI-powered job matching and skill enhancement programs tailored for you.', color: 'from-blue-500 to-blue-600' },
  { icon: FiBook, title: 'Government Schemes', desc: 'Discover and apply for welfare schemes you are eligible for instantly.', color: 'from-teal-500 to-teal-600' },
  { icon: FiFileText, title: 'Citizen Complaints', desc: 'Register and track your grievances with real-time status updates.', color: 'from-purple-500 to-purple-600' },
  { icon: FiAlertCircle, title: 'Emergency Assistance', desc: 'One-tap SOS with nearby hospitals, police, and ambulance services.', color: 'from-red-500 to-red-600' },
  { icon: FiShield, title: 'Cyber Safety', desc: 'Scan URLs and files for threats. Stay safe online with AI protection.', color: 'from-orange-500 to-orange-600' },
  { icon: FiMessageSquare, title: 'AI Public Assistant', desc: '24/7 intelligent chatbot for all your government service queries.', color: 'from-indigo-500 to-indigo-600' },
]

const stats = [
  { value: '2M+', label: 'Citizens Served' },
  { value: '500+', label: 'Schemes Listed' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'AI Support' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-slate-800 dark:text-white text-sm">AI Public Welfare System</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Government of India Initiative
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
              AI Public Welfare<br />
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Multi-Agent System
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
              One unified platform powered by AI agents to access government schemes, find jobs, file complaints, get emergency help, and stay cyber-safe.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900"
              >
                Get Started <FiArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              {['Free for all citizens', 'AI-powered assistance', 'Secure & private'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                  <FiCheckCircle className="text-teal-500" size={14} /> {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                {features.slice(0, 4).map(({ icon: Icon, title, color }) => (
                  <div key={title} className="bg-white/20 backdrop-blur rounded-2xl p-4 flex flex-col gap-2">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <p className="text-white text-xs font-semibold leading-tight">{title}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-white/20 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/30 flex items-center justify-center">
                  <FiMessageSquare size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">AI Assistant Online</p>
                  <p className="text-white/70 text-xs">How can I help you today?</p>
                </div>
                <div className="ml-auto flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-4 py-2 flex items-center gap-2"
            >
              <span className="text-2xl">🏛️</span>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">500+ Schemes</p>
                <p className="text-xs text-slate-400">Available now</p>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-4 py-2 flex items-center gap-2"
            >
              <span className="text-2xl">🛡️</span>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">Cyber Protected</p>
                <p className="text-xs text-slate-400">AI-powered scan</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-blue-200 text-sm mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Six Powerful AI Agents</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Each agent is specialized to handle a specific domain of public welfare services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-blue-100 mb-8">Join millions of citizens already using AI-powered welfare services.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Create Free Account <FiArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
