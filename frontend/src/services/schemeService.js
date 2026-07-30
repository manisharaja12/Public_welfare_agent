import { schemeApi as api } from './api'

export const getSchemes         = (params)      => api.get('/api/schemes', { params })
export const getSchemeById      = (id)          => api.get(`/api/schemes/${id}`)
export const searchSchemes      = (q, page = 1) => api.get('/api/schemes/search', { params: { q, page } })
export const getRecommendations = (force=false) => api.post('/api/recommend', { force_refresh: force })
export const getHistory         = ()            => api.get('/api/history')
export const saveScheme         = (scheme_id)   => api.post('/api/saved', { scheme_id })
export const getSavedSchemes    = ()            => api.get('/api/saved')
export const deleteSavedScheme  = (id)          => api.delete(`/api/saved/${id}`)
export const getNotifications   = ()            => api.get('/api/notifications')
export const getProfile         = ()            => api.get('/api/profile')
export const createProfile      = (data)        => api.post('/api/profile', data)
export const updateProfile      = (data)        => api.put('/api/profile', data)
