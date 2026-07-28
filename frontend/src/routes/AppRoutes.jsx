import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import JobsPage from '../pages/JobsPage'
import SchemesPage from '../pages/SchemesPage'
import ComplaintsPage from '../pages/ComplaintsPage'
import EmergencyPage from '../pages/EmergencyPage'
import CyberPage from '../pages/CyberPage'
import ChatbotPage from '../pages/ChatbotPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/cyber" element={<CyberPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
