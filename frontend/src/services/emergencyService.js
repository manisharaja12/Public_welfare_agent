import { emergencyApi as api } from './api'

<<<<<<< Updated upstream
export const triggerSOS          = (location) => api.post('/api/emergency/sos', location)
export const getNearbyHospitals  = (coords)   => api.get('/api/emergency/hospitals', { params: coords })
export const getNearbyPolice     = (coords)   => api.get('/api/emergency/police', { params: coords })
export const getNearbyAmbulance  = (coords)   => api.get('/api/emergency/ambulance', { params: coords })
export const getEmergencyContacts = ()        => api.get('/api/emergency/contacts')
=======
const api = axios.create({ baseURL: '' })

export const getSosContacts  = ()       => api.get('/emergency/sos')
export const getNearbyHospitals = (lat, lng, radius = 5000) =>
  api.post('/emergency/hospitals', { latitude: lat, longitude: lng, radius })
export const getHospitalDetails = (placeId) => api.get(`/emergency/hospital/${placeId}`)
export const shareLocation = (data)     => api.post('/emergency/share-location', data)
export const analyseEmergency = (message) => api.post('/emergency/chat', { message })
>>>>>>> Stashed changes
