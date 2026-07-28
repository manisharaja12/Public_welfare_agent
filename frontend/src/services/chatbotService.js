import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const api = axios.create({ baseURL: API_BASE })

export const sendMessage = (message, sessionId) => api.post('/api/chatbot/message', { message, sessionId })
export const getChatHistory = (sessionId) => api.get(`/api/chatbot/history/${sessionId}`)
export const clearChatHistory = (sessionId) => api.delete(`/api/chatbot/history/${sessionId}`)
export const getSuggestedQuestions = () => api.get('/api/chatbot/suggestions')
