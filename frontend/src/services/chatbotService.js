import { chatbotApi as api } from './api'

export const sendMessage          = (message, sessionId) => api.post('/api/chatbot/message', { message, sessionId })
export const getChatHistory       = (sessionId)          => api.get(`/api/chatbot/history/${sessionId}`)
export const clearChatHistory     = (sessionId)          => api.delete(`/api/chatbot/history/${sessionId}`)
export const getSuggestedQuestions = ()                  => api.get('/api/chatbot/suggestions')
