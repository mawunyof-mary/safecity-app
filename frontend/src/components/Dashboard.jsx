import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Stay informed about safety in your community and help make your neighborhood safer for everyone.</p>
          <div className="hero-actions">
            <Link to="/map" className="action-btn primary">
              🗺️ View Live Map
            </Link>
            <Link to="/map" className="action-btn secondary">
              📝 Report Incident
            </Link>
          </div>
        </div>
        <div className="hero-graphic">
          <div className="graphic-item">🛡️</div>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">🚨</div>
          <div className="stat-info">
            <div className="stat-value">24</div>
            <div className="stat-label">Incidents Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">89%</div>
            <div className="stat-label">Response Rate</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <div className="stat-value">15min</div>
            <div className="stat-label">Avg. Response Time</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">1.2k</div>
            <div className="stat-label">Community Members</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="features-section">
        <h2>How SafeCity Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Live Incident Map</h3>
            <p>View real-time incident reports and safety alerts in your area with our interactive mapping system.</p>
            <Link to="/map" className="feature-link">Explore Map →</Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚨</div>
            <h3>Quick Reporting</h3>
            <p>Report safety concerns, incidents, or emergencies quickly with our streamlined reporting system.</p>
            <Link to="/map" className="feature-link">Report Incident →</Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Real-time Alerts</h3>
            <p>Receive instant notifications about safety concerns and incidents in your immediate vicinity.</p>
            <div className="feature-link">Stay Informed →</div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community Watch</h3>
            <p>Connect with neighbors and local authorities to create a safer community together.</p>
            <div className="feature-link">Join Community →</div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="activity-section">
        <h2>Recent Community Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">🚗</div>
            <div className="activity-content">
              <strong>Suspicious vehicle</strong> reported near Main Street
              <span className="activity-time">15 minutes ago • 2.3km away</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🚶</div>
            <div className="activity-content">
              <strong>Street light outage</strong> reported on Oak Avenue
              <span className="activity-time">2 hours ago • 1.1km away</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🏘️</div>
            <div className="activity-content">
              <strong>Community meeting</strong> scheduled for safety awareness
              <span className="activity-time">Tomorrow, 6:00 PM • Community Center</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
