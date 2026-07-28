import api from './api'

export const emergencyService = {
  triggerSOS: (location) => api.post('/emergency/sos', { location }),
  getNearbyHospitals: (lat, lng) => api.get('/emergency/hospitals', { params: { lat, lng } }),
  getNearbyPolice: (lat, lng) => api.get('/emergency/police', { params: { lat, lng } }),
  getNearbyAmbulance: (lat, lng) => api.get('/emergency/ambulance', { params: { lat, lng } }),
  getEmergencyContacts: () => api.get('/emergency/contacts'),
}
