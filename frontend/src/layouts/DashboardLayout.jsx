import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ToastContainer from '../components/ToastContainer'
import { useDarkMode } from '../hooks/useDarkMode'
import { useToast } from '../hooks/useToast'

export default function DashboardLayout() {
  const [dark, setDark] = useDarkMode()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { toasts, removeToast } = useToast()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar dark={dark} setDark={setDark} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:pl-60' : 'lg:pl-16'}`}
      >
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
