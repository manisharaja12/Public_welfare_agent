import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const api = axios.create({ baseURL: API_BASE })

export const scanUrl = (url) => api.post('/api/cyber/scan-url', { url })
export const scanFile = (formData) => api.post('/api/cyber/scan-file', formData)
export const getSecurityScore = (userId) => api.get(`/api/cyber/score/${userId}`)
export const getCyberTips = () => api.get('/api/cyber/tips')
export const reportCyberCrime = (data) => api.post('/api/cyber/report', data)
