import { emergencyApi as api } from './api'

export const triggerSOS          = (location) => api.post('/api/emergency/sos', location)
export const getNearbyHospitals  = (coords)   => api.get('/api/emergency/hospitals', { params: coords })
export const getNearbyPolice     = (coords)   => api.get('/api/emergency/police', { params: coords })
export const getNearbyAmbulance  = (coords)   => api.get('/api/emergency/ambulance', { params: coords })
export const getEmergencyContacts = ()        => api.get('/api/emergency/contacts')
