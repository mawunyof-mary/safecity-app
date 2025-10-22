import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await register(name, email, password)
    
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
          <p>Join thousands of community members making their neighborhoods safer.</p>
          <div className="hero-features">
            <div className="feature">🚨 Quick Reporting</div>
            <div className="feature">📊 Live Statistics</div>
            <div className="feature">👥 Community Network</div>
          </div>
        </div>
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <h2>Join SafeCity</h2>
          <p>Create your account in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="Minimum 6 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="password-hint">Must be at least 6 characters long</div>
          </div>
          
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
