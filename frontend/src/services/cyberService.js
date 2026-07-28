import api from './api'

export const cyberService = {
  scanUrl: (url) => api.post('/cyber/scan-url', { url }),
  scanFile: (formData) => api.post('/cyber/scan-file', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getSecurityScore: (userId) => api.get(`/cyber/score/${userId}`),
  getCyberTips: () => api.get('/cyber/tips'),
  reportThreat: (data) => api.post('/cyber/report', data),
}
