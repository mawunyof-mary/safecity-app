import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import './ReportForm.css'

function ReportForm({ onClose, onReportSubmitted }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Theft',
    address: '',
    location: {
      coordinates: [0, 0]
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const categories = [
    'Theft', 'Vandalism', 'Assault', 'Suspicious Activity', 
    'Environmental Hazard', 'Infrastructure Issue', 'Other'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              coordinates: [
                position.coords.longitude,
                position.coords.latitude
              ]
            }
          }))
          setSuccess('Location captured successfully!')
        },
        (error) => {
          setError('Unable to get your location. Please enable location services.')
        }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validate location
    if (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0) {
      setError('Please capture your location before submitting.')
      setLoading(false)
      return
    }

    try {
      await axios.post('/incidents', formData)
      setSuccess('Incident reported successfully!')
      setTimeout(() => {
        onClose()
        if (onReportSubmitted) {
          onReportSubmitted()
        }
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to report incident')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🚨 Report Safety Incident</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label>Incident Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Brief description of the incident"
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide detailed information about what happened..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Address (Optional)</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street address or landmark"
            />
          </div>

          <div className="location-section">
            <label>Location *</label>
            <button 
              type="button" 
              className="location-btn"
              onClick={getCurrentLocation}
            >
              📍 Capture Current Location
            </button>
            {formData.location.coordinates[0] !== 0 && (
              <div className="location-confirm">
                ✅ Location captured: {formData.location.coordinates[1].toFixed(4)}, {formData.location.coordinates[0].toFixed(4)}
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Reporting...' : '🚨 Report Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportForm
