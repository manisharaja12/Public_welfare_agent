import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const submitComplaint = (data) => api.post('/complaints/complaints', data)
export const getComplaints = (params = {}) => api.get('/complaints/complaints', { params })
export const getComplaint = (id) => api.get(`/complaints/complaints/${id}`)
export const updateComplaint = (id, data) => api.put(`/complaints/complaints/${id}`, data)
export const deleteComplaint = (id) => api.delete(`/complaints/complaints/${id}`)
export const updateComplaintStatus = (data) => api.patch('/complaints/complaints/status', data)
export const searchComplaints = (q, params = {}) => api.get('/complaints/complaints/search', { params: { q, ...params } })
export const getResolutionEstimate = (id) => api.get(`/complaints/complaints/${id}/estimate`)
export const getComplaintTimeline = (id) => api.get(`/complaints/complaints/${id}/timeline`)
export const getComplaintDashboard = () => api.get('/complaints/complaints/dashboard')
export const getComplaintAnalytics = () => api.get('/complaints/complaints/analytics')
export const aiSuggestComplaint = (text) => api.post('/complaints/complaints/ai-suggest', { text })
