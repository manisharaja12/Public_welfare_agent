import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiBriefcase, HiDocumentText, HiExclamationCircle,
  HiPhone, HiShieldCheck, HiChat, HiArrowRight, HiCheckCircle,
} from 'react-icons/hi'
import { MdSecurity } from 'react-icons/md'
import { useTheme } from '../hooks/useTheme'
import { HiSun, HiMoon } from 'react-icons/hi'

const features = [
  { icon: HiBriefcase, title: 'Skill Development & Jobs', desc: 'AI-powered job matching and skill development recommendations tailored for you.', color: 'from-blue-500 to-blue-600' },
  { icon: HiDocumentText, title: 'Government Schemes', desc: 'Discover and apply for government welfare schemes you are eligible for.', color: 'from-teal-500 to-teal-600' },
  { icon: HiExclamationCircle, title: 'Citizen Complaints', desc: 'File and track complaints with real-time status updates.', color: 'from-orange-500 to-orange-600' },
  { icon: HiPhone, title: 'Emergency Assistance', desc: 'One-tap SOS with nearby hospitals, police, and ambulance services.', color: 'from-red-500 to-red-600' },
  { icon: HiShieldCheck, title: 'Cyber Safety', desc: 'Scan URLs and files for threats. Stay protected online.', color: 'from-purple-500 to-purple-600' },
  { icon: HiChat, title: 'AI Public Assistant', desc: '24/7 intelligent chatbot for all your public welfare queries.', color: 'from-green-500 to-green-600' },
]

const stats = [
  { value: '10M+', label: 'Citizens Served' },
  { value: '500+', label: 'Schemes Listed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'AI Support' },
]

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

export default function Landing() {
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <MdSecurity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-blue-700 dark:text-blue-400 hidden sm:block">AI Public Welfare</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {dark ? <HiSun className="w-5 h-5 text-yellow-400" /> : <HiMoon className="w-5 h-5 text-gray-600" />}
            </button>
            <Link to="/login" className="btn-outline text-sm py-2 px-4">Login</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-teal-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.6 }}>
            <span className="badge bg-white/20 text-white mb-4 text-xs px-3 py-1">🇮🇳 Government of India Initiative</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              AI Public Welfare<br />
              <span className="text-teal-300">Multi-Agent System</span>
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-md">
              One unified platform powered by AI agents to access government services, jobs, emergency help, and more — anytime, anywhere.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2">
                Get Started <HiArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all">
                Sign In
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              {[' Secure & Encrypted', ' AI-Powered', ' Free for Citizens'].map((t) => (
                <span key={t} className="flex items-center gap-1 text-sm text-blue-100">
                  <HiCheckCircle className="w-4 h-4 text-teal-300" />{t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Illustration */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden md:flex justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 shadow-2xl" />
              <div className="absolute inset-4 grid grid-cols-2 gap-3 p-2">
                {features.map(({ icon: Icon, color }, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                    className={`bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <p className="text-3xl font-extrabold text-teal-300">{value}</p>
              <p className="text-blue-200 text-sm mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Powerful AI Agents at Your Service</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Six specialized AI agents working together to provide comprehensive public welfare services.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} className="card p-6 hover:-translate-y-1 group">
                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-teal-600 text-white text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <h2 className="text-3xl font-bold mb-4">Ready to Access Public Welfare Services?</h2>
          <p className="text-blue-100 mb-8">Join millions of citizens already using the platform.</p>
          <Link to="/register" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg inline-flex items-center gap-2">
            Create Free Account <HiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} AI Public Welfare Multi-Agent System — Government of India</p>
        <p className="mt-1 text-xs">Secure · Accessible · Transparent</p>
      </footer>
    </div>
  )
}
