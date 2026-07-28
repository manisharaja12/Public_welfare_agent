import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiUser, HiMail, HiPhone, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return alert('Passwords do not match')
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/dashboard') }, 1200)
  }

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', icon: HiUser, placeholder: 'John Doe' },
    { key: 'email', label: 'Email Address', type: 'email', icon: HiMail, placeholder: 'you@example.com' },
    { key: 'mobile', label: 'Mobile Number', type: 'tel', icon: HiPhone, placeholder: '+91 98765 43210' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <div className="card p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Register for the AI Public Welfare Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, label, type, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1.5">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type={type} required placeholder={placeholder} className="input-field pl-9"
                  value={form[key]} onChange={set(key)} />
              </div>
            </div>
          ))}

          {['password', 'confirm'].map((k) => (
            <div key={k}>
              <label className="block text-sm font-medium mb-1.5">{k === 'password' ? 'Password' : 'Confirm Password'}</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type={showPass ? 'text' : 'password'} required placeholder="••••••••" className="input-field pl-9 pr-10"
                  value={form[k]} onChange={set(k)} />
                {k === 'password' && (
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
            ) : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </motion.div>
  )
}
