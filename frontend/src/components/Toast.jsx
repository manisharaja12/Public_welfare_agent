import { AnimatePresence, motion } from 'framer-motion'
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiX } from 'react-icons/hi'

const icons = {
  success: <HiCheckCircle className="w-5 h-5 text-green-500" />,
  error: <HiExclamationCircle className="w-5 h-5 text-red-500" />,
  info: <HiInformationCircle className="w-5 h-5 text-blue-500" />,
}

const colors = {
  success: 'border-l-4 border-green-500',
  error: 'border-l-4 border-red-500',
  info: 'border-l-4 border-blue-500',
}

export default function ToastContainer({ toasts, remove }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
            className={`flex items-center gap-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg px-4 py-3 min-w-[280px] ${colors[t.type]}`}>
            {icons[t.type]}
            <p className="text-sm flex-1">{t.message}</p>
            <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-gray-600">
              <HiX className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
