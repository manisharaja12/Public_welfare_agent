import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi'

const icons = {
  success: <FiCheckCircle className="text-green-500" size={18} />,
  error: <FiAlertCircle className="text-red-500" size={18} />,
  info: <FiInfo className="text-blue-500" size={18} />,
}

const colors = {
  success: 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800',
  error: 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800',
  info: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800',
}

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-64 max-w-sm ${colors[t.type] || colors.info}`}
          >
            {icons[t.type] || icons.info}
            <p className="text-sm text-slate-700 dark:text-slate-300 flex-1">{t.message}</p>
            <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-600">
              <FiX size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
