import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-hero">
          <h1>🛡️ SafeCity</h1>
          <p>Your community safety platform. Report incidents, stay informed, and help create safer neighborhoods.</p>
          <div className="hero-features">
            <div className="feature">🗺️ Live Incident Maps</div>
            <div className="feature">🔔 Real-time Alerts</div>
            <div className="feature">📱 Community Reports</div>
          </div>
        </div>
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your SafeCity account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
