import api from './api'

export const schemeService = {
  searchSchemes: (query, category) => api.get('/schemes/search', { params: { query, category } }),
  getCategories: () => api.get('/schemes/categories'),
  checkEligibility: (data) => api.post('/schemes/eligibility', data),
  applyScheme: (schemeId, data) => api.post(`/schemes/${schemeId}/apply`, data),
  getSchemeDetails: (schemeId) => api.get(`/schemes/${schemeId}`),
}
