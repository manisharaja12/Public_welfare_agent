import axios from 'axios'

function createClient(envVar, fallback) {
  const base = import.meta.env[envVar] || fallback
  const client = axios.create({ baseURL: base })

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  client.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
      return Promise.reject(err)
    }
  )

  return client
}

export const authApi      = createClient('VITE_AUTH_API_URL',      'http://localhost:8001')
export const schemeApi    = createClient('VITE_SCHEME_API_URL',    'http://localhost:8001')
export const housingApi   = createClient('VITE_HOUSING_API_URL',   'http://localhost:8003')
export const chatbotApi   = createClient('VITE_CHATBOT_API_URL',   'http://localhost:8000')
export const complaintApi = createClient('VITE_COMPLAINT_API_URL', 'http://localhost:8000')
export const emergencyApi = createClient('VITE_EMERGENCY_API_URL', 'http://localhost:8000')
export const cyberApi     = createClient('VITE_CYBER_API_URL',     'http://localhost:8000')

export default authApi
