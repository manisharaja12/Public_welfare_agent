import api from './api'

export const complaintService = {
  submitComplaint: (data) => api.post('/complaints', data),
  getComplaints: (userId) => api.get(`/complaints/user/${userId}`),
  getComplaintStatus: (id) => api.get(`/complaints/${id}/status`),
  uploadImage: (formData) => api.post('/complaints/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getCategories: () => api.get('/complaints/categories'),
}
