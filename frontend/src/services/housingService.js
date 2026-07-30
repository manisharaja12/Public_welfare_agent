import { housingApi as API } from './api'

export const getDashboard = () => API.get('/api/housing/dashboard')
export const getAllHouses = () => API.get('/api/houses')
export const getHouse = (id) => API.get(`/api/houses/${id}`)
export const searchHouses = (filters) => API.post('/api/houses/search', filters)
export const registerHouse = (formData) =>
  API.post('/api/houses/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
