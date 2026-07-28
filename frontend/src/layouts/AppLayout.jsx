import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ToastContainer from '../components/Toast'
import { useToast } from '../hooks/useToast'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toasts, remove } = useToast()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer toasts={toasts} remove={remove} />
    </div>
  )
}
