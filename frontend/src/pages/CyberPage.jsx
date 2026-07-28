import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiShield, FiLink, FiUpload, FiAlertTriangle, FiCheckCircle, FiLock, FiEye, FiWifi } from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'

const tips = [
  { icon: FiLock, title: 'Use Strong Passwords', desc: 'Use a mix of letters, numbers, and symbols. Never reuse passwords.', color: 'from-blue-500 to-blue-600' },
  { icon: FiEye, title: 'Beware of Phishing', desc: 'Never click suspicious links in emails or SMS messages.', color: 'from-orange-500 to-orange-600' },
  { icon: FiWifi, title: 'Secure Your Wi-Fi', desc: 'Avoid public Wi-Fi for banking. Use VPN when necessary.', color: 'from-teal-500 to-teal-600' },
  { icon: FiShield, title: 'Enable 2FA', desc: 'Two-factor authentication adds an extra layer of security.', color: 'from-purple-500 to-purple-600' },
]

export default function CyberPage() {
  const [url, setUrl] = useState('')
  const [fileUploaded, setFileUploaded] = useState(false)
  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    if (!url) return
    setScanning(true)
    setTimeout(() => setScanning(false), 2000)
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Cyber Safety' }]} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FiShield className="text-orange-600" /> Cyber Safety Agent
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">AI-powered threat detection for URLs and files</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* URL Scanner */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FiLink className="text-orange-500" size={18} /> URL Scanner
            </h2>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-700 rounded-xl px-4 gap-2 border border-slate-200 dark:border-slate-600">
                <FiLink className="text-slate-400" size={14} />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com — paste URL to scan"
                  className="flex-1 py-3 text-sm text-slate-700 dark:text-slate-300 outline-none bg-transparent"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleScan}
                disabled={scanning}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm flex items-center gap-2"
              >
                {scanning ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Scanning...
                  </>
                ) : (
                  <><FiShield size={14} /> Scan URL</>
                )}
              </motion.button>
            </div>
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Security score will appear here after scanning.</p>
              <p className="text-xs text-slate-400 mt-1">Backend AI will analyze the URL for threats.</p>
            </div>
          </div>

          {/* File Scanner */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FiUpload className="text-orange-500" size={18} /> File Scanner
            </h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 cursor-pointer hover:border-orange-400 transition-colors">
              <FiUpload className="text-slate-400 mb-3" size={28} />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {fileUploaded ? '✅ File ready for scanning' : 'Drop file here or click to upload'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, EXE, ZIP, DOC up to 50MB</p>
              <input type="file" className="hidden" onChange={() => setFileUploaded(true)} />
            </label>
            {fileUploaded && (
              <button className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                <FiShield size={14} /> Scan File
              </button>
            )}
          </div>

          {/* Security Score Placeholder */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Your Security Score</h2>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full border-8 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-400">--</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Complete a scan to see your security score.</p>
                <p className="text-xs text-slate-400 mt-1">Score is calculated based on your activity and scans.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cyber Tips */}
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-white mb-3">Cyber Safety Tips</h2>
          <div className="space-y-3">
            {tips.map(({ icon: Icon, title, desc, color }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                    <Icon size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertTriangle className="text-orange-500" size={16} />
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Report Cyber Crime</p>
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mb-3">
              Report online fraud, phishing, or cyber harassment to authorities.
            </p>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
            >
              Report at cybercrime.gov.in
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
