import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import HeatmapLayer from './HeatmapLayer'
import HeatmapControls from './HeatmapControls'
import 'leaflet/dist/leaflet.css'
import './MapView.css'

// Fix for default markers in react-leaflet
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Incident type icons
const incidentIcons = {
  Theft: '👜',
  Vandalism: '🎨',
  Assault: '⚡',
  'Suspicious Activity': '👁️',
  'Environmental Hazard': '🌋',
  'Infrastructure Issue': '🚧',
  Other: '🚨'
}

const incidentColors = {
  Theft: '#e53e3e',
  Vandalism: '#d69e2e',
  Assault: '#c53030',
  'Suspicious Activity': '#d69e2e',
  'Environmental Hazard': '#38a169',
  'Infrastructure Issue': '#3182ce',
  Other: '#718096'
}

function MapController({ center }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 13)
  }, [center, map])
  return null
}

function MapView() {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [userLocation, setUserLocation] = useState([51.505, -0.09]) // Default London
  const [showReportForm, setShowReportForm] = useState(false)
  
  // Heatmap state
  const [heatmapEnabled, setHeatmapEnabled] = useState(true)
  const [heatmapSettings, setHeatmapSettings] = useState({
    intensity: 0.6,
    radius: 25,
    maxZoom: 17,
    gradient: 'default'
  })

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        () => {
          console.log('Using default location')
        }
      )
    }

    fetchIncidents()
  }, [])

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('/incidents')
      setIncidents(response.data)
    } catch (error) {
      console.error('Error fetching incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIncidentIcon = (category) => {
    const color = incidentColors[category] || '#718096'
    const icon = incidentIcons[category] || '🚨'
    
    return L.divIcon({
      html: '<div style="background: ' + color + '; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">' + icon + '</div>',
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })
  }

  const handleReportSubmitted = () => {
    setShowReportForm(false)
    fetchIncidents() // Refresh incidents
  }

  // Calculate incident statistics for insights
  const incidentStats = {
    total: incidents.length,
    byCategory: incidents.reduce((acc, incident) => {
      acc[incident.category] = (acc[incident.category] || 0) + 1
      return acc
    }, {}),
    today: incidents.filter(incident => {
      const today = new Date()
      const incidentDate = new Date(incident.createdAt)
      return incidentDate.toDateString() === today.toDateString()
    }).length
  }

  if (loading) {
    return (
      <div className="map-container">
        <div className="loading-map">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="map-page">
      <div className="map-sidebar">
        <h2>🗺️ Live Incident Map</h2>
        <p>View and report safety incidents in your community</p>
        
        {/* Heatmap Controls */}
        <HeatmapControls
          heatmapEnabled={heatmapEnabled}
          onToggle={setHeatmapEnabled}
          onSettingsChange={setHeatmapSettings}
        />

        {/* Incident Statistics */}
        <div className="stats-card">
          <h3>📊 Incident Insights</h3>
          <div className="stat-item">
            <span className="stat-value">{incidentStats.total}</span>
            <span className="stat-label">Total Incidents</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{incidentStats.today}</span>
            <span className="stat-label">Today</span>
          </div>
          <div className="category-breakdown">
            <h4>By Category:</h4>
            {Object.entries(incidentStats.byCategory).map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-icon">{incidentIcons[category]}</span>
                <span className="category-name">{category}</span>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-incidents">
          <h3>Recent Incidents ({incidents.length})</h3>
          <div className="incident-list">
            {incidents.slice(0, 5).map(incident => (
              <div 
                key={incident._id}
                className="incident-item"
                onClick={() => setSelectedIncident(incident)}
              >
                <span className="incident-icon">
                  {incidentIcons[incident.category]}
                </span>
                <div className="incident-details">
                  <strong>{incident.title}</strong>
                  <span className="incident-category">{incident.category}</span>
                  <span className="incident-time">
                    {new Date(incident.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="map-container">
        <MapContainer 
          center={userLocation} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapController center={userLocation} />
          
          {/* Heatmap Layer */}
          <HeatmapLayer
            incidents={incidents}
            enabled={heatmapEnabled}
            intensity={heatmapSettings.intensity}
            radius={heatmapSettings.radius}
            maxZoom={heatmapSettings.maxZoom}
          />
          
          {incidents.map(incident => (
            <Marker
              key={incident._id}
              position={[
                incident.location.coordinates[1], 
                incident.location.coordinates[0]
              ]}
              icon={getIncidentIcon(incident.category)}
            >
              <Popup>
                <div className="incident-popup">
                  <h4>{incidentIcons[incident.category]} {incident.title}</h4>
                  <p><strong>Category:</strong> {incident.category}</p>
                  <p><strong>Status:</strong> 
                    <span className={'status-' + incident.status.toLowerCase().replace(' ', '-')}>
                      {incident.status}
                    </span>
                  </p>
                  <p><strong>Description:</strong> {incident.description}</p>
                  <p><strong>Reported:</strong> {new Date(incident.createdAt).toLocaleString()}</p>
                  <p><strong>By:</strong> {incident.reportedBy?.name || 'Anonymous'}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="map-controls">
          <button 
            className="control-btn primary"
            onClick={() => setShowReportForm(true)}
          >
            📝 Report Incident
          </button>
          <button 
            className="control-btn"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  setUserLocation([position.coords.latitude, position.coords.longitude])
                })
              }
            }}
          >
            📍 My Location
          </button>
          <button 
            className={'control-btn ' + (heatmapEnabled ? 'active' : '')}
            onClick={() => setHeatmapEnabled(!heatmapEnabled)}
          >
            {heatmapEnabled ? '🔥 Hide Heatmap' : '🔥 Show Heatmap'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MapView
