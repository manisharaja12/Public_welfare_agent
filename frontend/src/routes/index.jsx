import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Jobs from '../pages/Jobs'
import Schemes from '../pages/Schemes'
import Complaints from '../pages/Complaints'
import Emergency from '../pages/Emergency'
import Cyber from '../pages/Cyber'
import Chatbot from '../pages/Chatbot'

export const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/jobs', element: <Jobs /> },
      { path: '/schemes', element: <Schemes /> },
      { path: '/complaints', element: <Complaints /> },
      { path: '/emergency', element: <Emergency /> },
      { path: '/cyber', element: <Cyber /> },
      { path: '/chatbot', element: <Chatbot /> },
    ],
  },
])
