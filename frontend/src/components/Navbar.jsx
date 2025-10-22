import { useAuth } from '../contexts/AuthContext'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="logo">
          <span className="logo-icon">🛡️</span>
          SafeCity
        </div>
        
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                📊 Dashboard
              </Link>
              <Link to="/map" className="nav-link">
                🗺️ Live Map
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link">
                  👑 Admin
                </Link>
              )}
              <span style={{ color: 'var(--primary-blue)' }}>
                👋 Hello, {user.name}
              </span>
              <button 
                onClick={logout}
                style={{
                  background: 'var(--alert-red)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link to="/login" className="nav-link">
                  🔑 Login
                </Link>
              )}
              {location.pathname !== '/register' && (
                <Link to="/register" className="nav-link">
                  📝 Register
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
