import api from './api'

export const chatbotService = {
  sendMessage: (message, sessionId) => api.post('/chatbot/message', { message, sessionId }),
  getChatHistory: (sessionId) => api.get(`/chatbot/history/${sessionId}`),
  getSuggestedQuestions: () => api.get('/chatbot/suggestions'),
  clearHistory: (sessionId) => api.delete(`/chatbot/history/${sessionId}`),
}
