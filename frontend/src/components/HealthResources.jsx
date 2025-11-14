import { useState, useEffect } from 'react';
import axios from 'axios';
import './HealthResources.css';

function HealthResources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [nearbyDistance, setNearbyDistance] = useState(5);

  const API_BASE = 'https://safecity-app-backend.onrender.com/api';

  useEffect(() => {
    fetchHealthResources();
  }, []);

  const fetchHealthResources = async () => {
    try {
      const response = await axios.get(`${API_BASE}/health-resources`);
      setResources(response.data);
      setFilteredResources(response.data);
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };

  const filterByType = (type) => {
    setSelectedType(type);
    if (type === 'All') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter(r => r.type === type));
    }
  };

  const resourceTypes = ['All', 'Hospital', 'Clinic', 'Emergency Center', 'Pharmacy', 'Blood Bank', 'Mental Health'];

  return (
    <div className="health-resources-container">
      <h2>🏥 Health Resources</h2>
      
      <div className="filters-section">
        <div className="type-filters">
          {resourceTypes.map(type => (
            <button
              key={type}
              className={`filter-btn ${selectedType === type ? 'active' : ''}`}
              onClick={() => filterByType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="resources-grid">
        {filteredResources.map(resource => (
          <div key={resource._id} className="resource-card">
            <div className="resource-header">
              <h3>{resource.name}</h3>
              <span className="resource-type">{resource.type}</span>
            </div>

            <div className="resource-details">
              <p>📍 {resource.address}</p>
              <p>📞 {resource.phone}</p>
              {resource.operatingHours && <p>⏰ {resource.operatingHours}</p>}
              {resource.isOpen24Hours && <p className="open-24">✅ Open 24 Hours</p>}
              {resource.services && (
                <div className="services">
                  <strong>Services:</strong> {resource.services.join(', ')}
                </div>
              )}
            </div>

            <div className="resource-actions">
              <a href={`tel:${resource.phone}`} className="call-btn">📞 Call</a>
              <a href={`https://maps.google.com/?q=${resource.address}`} target="_blank" rel="noopener noreferrer" className="directions-btn">🗺️ Map</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HealthResources;
