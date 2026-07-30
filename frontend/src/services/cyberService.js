import { cyberApi as api } from './api'

export const scanUrl          = (url)      => api.post('/api/cyber/scan-url', { url })
export const scanFile         = (formData) => api.post('/api/cyber/scan-file', formData)
export const getSecurityScore = (userId)   => api.get(`/api/cyber/score/${userId}`)
export const getCyberTips     = ()         => api.get('/api/cyber/tips')
export const reportCyberCrime = (data)     => api.post('/api/cyber/report', data)
