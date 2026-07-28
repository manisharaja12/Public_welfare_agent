import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiShieldCheck, HiUpload, HiSearch, HiLightBulb, HiExclamationCircle } from 'react-icons/hi'
import Breadcrumb from '../components/Breadcrumb'

const tips = [
  { icon: '🔐', title: 'Use Strong Passwords', desc: 'Use at least 12 characters with a mix of letters, numbers, and symbols.' },
  { icon: '📧', title: 'Beware of Phishing', desc: 'Never click suspicious links in emails or messages from unknown senders.' },
  { icon: '🔄', title: 'Keep Software Updated', desc: 'Regular updates patch security vulnerabilities in your devices.' },
  { icon: '📶', title: 'Avoid Public Wi-Fi', desc: 'Use a VPN when connecting to public networks to protect your data.' },
  { icon: '🛡️', title: 'Enable 2FA', desc: 'Two-factor authentication adds an extra layer of security to your accounts.' },
  { icon: '💾', title: 'Backup Your Data', desc: 'Regularly backup important files to prevent data loss from ransomware.' },
]

export default function Cyber() {
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)

  const handleScan = (e) => {
    e.preventDefault()
    setScanning(true)
    setTimeout(() => { setScanning(false); setScanned(true) }, 2000)
  }

  return (
    <div>
      <Breadcrumb />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          <HiShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Cyber Safety Agent</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Scan URLs and files for cyber threats</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* URL Scanner */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <HiSearch className="w-5 h-5 text-purple-500" /> URL Scanner
            </h3>
            <form onSubmit={handleScan} className="space-y-3">
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input className="input-field pl-9" placeholder="Enter URL to scan (e.g. https://example.com)"
                  value={url} onChange={(e) => setUrl(e.target.value)} />
              </div>
              <button type="submit" disabled={!url || scanning} className="btn-primary flex items-center gap-2">
                {scanning ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Scanning...</>
                ) : 'Scan URL'}
              </button>
            </form>

            {scanned && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold">
                  <HiShieldCheck className="w-5 h-5" /> URL appears safe
                </div>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">No threats detected. Backend will provide detailed analysis.</p>
              </motion.div>
            )}
          </div>

          {/* File Upload */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <HiUpload className="w-5 h-5 text-purple-500" /> File Scanner
            </h3>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 cursor-pointer hover:border-purple-400 transition-colors">
              <HiUpload className="w-10 h-10 text-gray-300 mb-3" />
              <p className="font-medium text-gray-600 dark:text-gray-300">{file ? file.name : 'Upload file to scan'}</p>
              <p className="text-xs text-gray-400 mt-1">Supports PDF, EXE, ZIP, DOC up to 50MB</p>
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
            </label>
            {file && (
              <button className="btn-primary w-full mt-3 flex items-center justify-center gap-2">
                <HiShieldCheck className="w-4 h-4" /> Scan File
              </button>
            )}
          </div>

          {/* Security Score Placeholder */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Security Score</h3>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-28 h-28 rounded-full border-8 border-gray-100 dark:border-gray-700 flex items-center justify-center mx-auto mb-3 relative">
                  <div className="absolute inset-0 rounded-full border-8 border-purple-500 border-r-transparent border-b-transparent rotate-45" />
                  <span className="text-3xl font-bold text-purple-600">--</span>
                </div>
                <p className="text-sm text-gray-500">Connect backend to calculate your security score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cyber Tips */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <HiLightBulb className="w-5 h-5 text-yellow-500" /> Cyber Safety Tips
          </h3>
          <div className="space-y-3">
            {tips.map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
