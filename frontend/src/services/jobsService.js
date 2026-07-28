import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: API_BASE })

export const searchJobs = (query) => api.get('/api/jobs/search', { params: { q: query } })
export const getJobCategories = () => api.get('/api/jobs/categories')
export const uploadResume = (formData) => api.post('/api/jobs/resume', formData)
export const getRecommendedJobs = (userId) => api.get(`/api/jobs/recommendations/${userId}`)
export const getSkillCourses = () => api.get('/api/jobs/skills')
