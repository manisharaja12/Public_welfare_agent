import { complaintApi as api } from './api'

export const submitComplaint        = (data)     => api.post('/api/complaints', data)
export const getComplaintHistory    = (userId)   => api.get(`/api/complaints/user/${userId}`)
export const getComplaintStatus     = (id)       => api.get(`/api/complaints/${id}/status`)
export const uploadComplaintImage   = (formData) => api.post('/api/complaints/upload', formData)
export const getComplaintCategories = ()         => api.get('/api/complaints/categories')
