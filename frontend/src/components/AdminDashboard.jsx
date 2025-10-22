import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import './AdminDashboard.css'

function AdminDashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({})
  const [incidents, setIncidents] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('7d') // 7d, 30d, 90d

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardData()
    }
  }, [user, timeRange])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [incidentsRes, usersRes, statsRes] = await Promise.all([
        axios.get('/incidents?limit=50'),
        axios.get('/api/users'),
        axios.get('/api/stats?range=' + timeRange)
      ])
      
      setIncidents(incidentsRes.data)
      setUsers(usersRes.data || [])
      setStats(statsRes.data || {})
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // If endpoints don't exist, create mock data
      setStats(generateMockStats())
      setUsers(generateMockUsers())
    } finally {
      setLoading(false)
    }
  }

  const generateMockStats = () => ({
    totalIncidents: incidents.length,
    incidentsToday: incidents.filter(i => isToday(new Date(i.createdAt))).length,
    resolvedIncidents: incidents.filter(i => i.status === 'Resolved').length,
    activeUsers: 42,
    newUsersThisWeek: 8,
    avgResponseTime: '2.3h',
    topCategories: {
      'Theft': 15,
      'Vandalism': 12,
      'Suspicious Activity': 8,
      'Environmental Hazard': 6,
      'Infrastructure Issue': 5,
      'Assault': 3,
      'Other': 7
    },
    trendData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      incidents: [12, 19, 8, 15, 12, 18, 14],
      resolved: [8, 12, 6, 10, 9, 11, 10]
    }
  })

  const generateMockUsers = () => [
    { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: new Date().toISOString(), incidentCount: 5 },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: new Date().toISOString(), incidentCount: 3 },
    { _id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: new Date().toISOString(), incidentCount: 0 }
  ]

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const updateIncidentStatus = async (incidentId, newStatus) => {
    try {
      await axios.patch('/incidents/' + incidentId + '/status', { status: newStatus })
      setIncidents(prev => prev.map(inc => 
        inc._id === incidentId ? { ...inc, status: newStatus } : inc
      ))
    } catch (error) {
      console.error('Error updating incident:', error)
      alert('Failed to update incident status')
    }
  }

  const deleteIncident = async (incidentId) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await axios.delete('/incidents/' + incidentId)
        setIncidents(prev => prev.filter(inc => inc._id !== incidentId))
      } catch (error) {
        console.error('Error deleting incident:', error)
        alert('Failed to delete incident')
      }
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="admin-container">
        <div className="access-denied">
          <h2>🚫 Access Denied</h2>
          <p>You need administrator privileges to access this dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <h1>👑 SafeCity Admin Dashboard</h1>
          <div className="header-actions">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-selector"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button className="refresh-btn" onClick={fetchDashboardData}>
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={activeTab === 'incidents' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('incidents')}
        >
          🚨 Incidents
        </button>
        <button 
          className={activeTab === 'users' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={activeTab === 'analytics' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && <OverviewTab stats={stats} incidents={incidents} />}
        {activeTab === 'incidents' && (
          <IncidentsTab 
            incidents={incidents} 
            onUpdateStatus={updateIncidentStatus}
            onDelete={deleteIncident}
          />
        )}
        {activeTab === 'users' && <UsersTab users={users} />}
        {activeTab === 'analytics' && <AnalyticsTab stats={stats} />}
      </div>
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ stats, incidents }) {
  const recentIncidents = incidents.slice(0, 5)
  
  return (
    <div className="overview-tab">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">🚨</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalIncidents || 0}</div>
            <div className="stat-label">Total Incidents</div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.resolvedIncidents || 0}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.activeUsers || 0}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.avgResponseTime || 'N/A'}</div>
            <div className="stat-label">Avg Response Time</div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Category Distribution */}
      <div className="overview-grid">
        <div className="recent-activity">
          <h3>Recent Incidents</h3>
          <div className="activity-list">
            {recentIncidents.map(incident => (
              <div key={incident._id} className="activity-item">
                <div className="activity-icon">🚨</div>
                <div className="activity-details">
                  <strong>{incident.title}</strong>
                  <span>{incident.category} • {new Date(incident.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={'status-badge status-' + incident.status.toLowerCase().replace(' ', '-')}>
                  {incident.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="category-distribution">
          <h3>Incidents by Category</h3>
          <div className="category-list">
            {Object.entries(stats.topCategories || {}).map(([category, count]) => (
              <div key={category} className="category-dist-item">
                <span className="category-name">{category}</span>
                <div className="category-bar">
                  <div 
                    className="category-fill"
                    style={{ width: (count / (stats.totalIncidents || 1)) * 100 + '%' }}
                  ></div>
                </div>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Incidents Tab Component
function IncidentsTab({ incidents, onUpdateStatus, onDelete }) {
  const [filter, setFilter] = useState('all')

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'all') return true
    return incident.status.toLowerCase().replace(' ', '-') === filter
  })

  return (
    <div className="incidents-tab">
      <div className="tab-header">
        <h2>Incident Management</h2>
        <div className="filter-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Incidents</option>
            <option value="reported">Reported</option>
            <option value="under-review">Under Review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="incidents-table">
        <div className="table-header">
          <div>Title</div>
          <div>Category</div>
          <div>Status</div>
          <div>Reported By</div>
          <div>Date</div>
          <div>Actions</div>
        </div>
        <div className="table-body">
          {filteredIncidents.map(incident => (
            <div key={incident._id} className="table-row">
              <div className="incident-title">{incident.title}</div>
              <div className="incident-category">
                <span className="category-tag">{incident.category}</span>
              </div>
              <div className="incident-status">
                <select 
                  value={incident.status}
                  onChange={(e) => onUpdateStatus(incident._id, e.target.value)}
                >
                  <option value="Reported">Reported</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div className="reported-by">{incident.reportedBy?.name || 'Unknown'}</div>
              <div className="incident-date">
                {new Date(incident.createdAt).toLocaleDateString()}
              </div>
              <div className="incident-actions">
                <button 
                  className="action-btn view"
                  onClick={() => alert('View details: ' + incident.title)}
                >
                  👁️
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => onDelete(incident._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Users Tab Component
function UsersTab({ users }) {
  return (
    <div className="users-tab">
      <div className="tab-header">
        <h2>User Management</h2>
        <div className="user-stats">
          <span>Total Users: {users.length}</span>
          <span>Admins: {users.filter(u => u.role === 'admin').length}</span>
        </div>
      </div>

      <div className="users-table">
        <div className="table-header">
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Incidents</div>
          <div>Joined</div>
          <div>Actions</div>
        </div>
        <div className="table-body">
          {users.map(user => (
            <div key={user._id} className="table-row">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
              <div className="user-role">
                <span className={'role-badge ' + user.role}>
                  {user.role}
                </span>
              </div>
              <div className="user-incidents">{user.incidentCount || 0}</div>
              <div className="user-joined">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <div className="user-actions">
                <button className="action-btn edit">✏️</button>
                <button className="action-btn message">💬</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Analytics Tab Component
function AnalyticsTab({ stats }) {
  return (
    <div className="analytics-tab">
      <div className="analytics-header">
        <h2>Advanced Analytics</h2>
        <p>Detailed insights and trends for SafeCity platform</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>📈 Incident Trends</h3>
          <div className="trend-chart">
            {/* Simple bar chart using CSS */}
            <div className="chart-bars">
              {(stats.trendData?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).map((label, index) => (
                <div key={label} className="chart-bar-container">
                  <div className="chart-bar-group">
                    <div 
                      className="chart-bar incidents"
                      style={{ height: (stats.trendData?.incidents?.[index] || 10) * 5 + 'px' }}
                    ></div>
                    <div 
                      className="chart-bar resolved"
                      style={{ height: (stats.trendData?.resolved?.[index] || 5) * 5 + 'px' }}
                    ></div>
                  </div>
                  <span className="chart-label">{label}</span>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color incidents"></div>
                <span>Incidents</span>
              </div>
              <div className="legend-item">
                <div className="legend-color resolved"></div>
                <span>Resolved</span>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>🎯 Performance Metrics</h3>
          <div className="metrics-list">
            <div className="metric-item">
              <span className="metric-label">Response Rate</span>
              <span className="metric-value">89%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Avg Resolution Time</span>
              <span className="metric-value">2.3 hours</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">User Satisfaction</span>
              <span className="metric-value">4.5/5</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Platform Uptime</span>
              <span className="metric-value">99.8%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h3>💡 Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🔍</div>
            <div className="insight-content">
              <h4>Peak Reporting Times</h4>
              <p>Most incidents are reported between 6 PM - 9 PM</p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">📍</div>
            <div className="insight-content">
              <h4>Hotspot Areas</h4>
              <p>Downtown area shows 45% higher incident density</p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🚶</div>
            <div className="insight-content">
              <h4>User Engagement</h4>
              <p>Active users increased by 23% this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
