import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const api = axios.create({ baseURL: API_BASE })

export const getSchemes = () => api.get('/api/schemes')
export const searchSchemes = (query) => api.get('/api/schemes/search', { params: { q: query } })
export const getSchemeCategories = () => api.get('/api/schemes/categories')
export const checkEligibility = (data) => api.post('/api/schemes/eligibility', data)
export const applyScheme = (schemeId, data) => api.post(`/api/schemes/${schemeId}/apply`, data)
