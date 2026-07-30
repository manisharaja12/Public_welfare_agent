import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, getMe } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => { localStorage.removeItem('access_token'); localStorage.removeItem('user') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password })
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('user', JSON.stringify({ id: data.user_id, name: data.name, email: data.email, role: data.role }))
    setUser({ id: data.user_id, name: data.name, email: data.email, role: data.role })
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await registerUser({ name, email, password })
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('user', JSON.stringify({ id: data.user_id, name: data.name, email: data.email, role: data.role }))
    setUser({ id: data.user_id, name: data.name, email: data.email, role: data.role })
    return data
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
