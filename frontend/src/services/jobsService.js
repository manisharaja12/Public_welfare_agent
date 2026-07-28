import api from './api'

export const jobsService = {
  searchJobs: (query, filters) => api.get('/jobs/search', { params: { query, ...filters } }),
  getCategories: () => api.get('/jobs/categories'),
  getRecommended: (userId) => api.get(`/jobs/recommended/${userId}`),
  uploadResume: (formData) => api.post('/jobs/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getSkills: () => api.get('/jobs/skills'),
}
