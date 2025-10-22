import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Configure axios
    axios.defaults.baseURL = 'http://localhost:5000/api'
    
    // Add request interceptor for debugging
    axios.interceptors.request.use(request => {
      console.log('Starting Request', request)
      return request
    })
    
    // Add response interceptor for debugging
    axios.interceptors.response.use(
      response => {
        console.log('Response:', response)
        return response
      },
      error => {
        console.error('Response Error:', error)
        return Promise.reject(error)
      }
    )

    // Check if user is already logged in
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
        const response = await axios.get('/auth/me')
        setUser(response.data.user)
        console.log('User restored from token:', response.data.user.email)
      }
    } catch (error) {
      console.error('Failed to restore user:', error)
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email)
      const response = await axios.post('/auth/login', { email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      setUser(user)
      console.log('Login successful:', user.email)
      
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message)
      return { 
        success: false, 
        message: error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Login failed' 
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      console.log('Attempting registration for:', email)
      const response = await axios.post('/auth/register', { name, email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      setUser(user)
      console.log('Registration successful:', user.email)
      
      return { success: true }
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg || 
                          'Registration failed'
      return { 
        success: false, 
        message: errorMessage
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    console.log('User logged out')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
