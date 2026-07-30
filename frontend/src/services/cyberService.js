import { cyberApi as api } from './api'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// POST /cyber/url-scan — phishing URL detection
export const scanUrl = (url) => api.post('/cyber/url-scan', { url })

// GET /cyber/tips — cyber safety tips (optional ?category=)
export const getCyberTips = (category) =>
  api.get('/cyber/tips', category ? { params: { category } } : {})

// GET /cyber/history — paginated scan history
export const getCyberHistory = (params = {}) => api.get('/cyber/history', { params })

// GET /cyber-safety/categories
export const getCyberCategories = () => api.get('/cyber-safety/categories')

// GET /cyber-safety/threats
export const getCyberThreats = () => api.get('/cyber-safety/threats')

// GET /cyber-safety/daily-tip
export const getDailyTip = () => api.get('/cyber-safety/daily-tip')

// POST /cyber-safety/chat
export const sendCyberChat = (question) => api.post('/cyber-safety/chat', { question })

// POST /cyber-safety/security-score
export const getSecurityScore = (answers) => api.post('/cyber-safety/security-score', { answers })

// POST /cyber/password — password strength check
export const checkPassword = (password) => api.post('/cyber/password', { password })
