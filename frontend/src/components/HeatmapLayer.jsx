import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

function HeatmapLayer({ incidents, intensity = 0.6, radius = 25, maxZoom = 17, enabled = true }) {
  const map = useMap()
  const heatLayerRef = useRef(null)

  useEffect(() => {
    if (!enabled || !incidents || incidents.length === 0) {
      // Remove heatmap if disabled or no incidents
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current)
        heatLayerRef.current = null
      }
      return
    }

    // Prepare heatmap data
    const heatData = incidents
      .filter(incident => incident.location && incident.location.coordinates)
      .map(incident => {
        const [lng, lat] = incident.location.coordinates
        // Add weight based on incident severity
        let weight = 0.7
        switch (incident.category) {
          case 'Assault':
            weight = 1.0
            break
          case 'Theft':
            weight = 0.9
            break  
          case 'Vandalism':
            weight = 0.8
            break
          case 'Suspicious Activity':
            weight = 0.7
            break
          default:
            weight = 0.6
        }
        return [lat, lng, weight]
      })

    // Remove existing heatmap layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current)
    }

    // Create new heatmap layer
    if (heatData.length > 0) {
      heatLayerRef.current = L.heatLayer(heatData, {
        radius: radius,
        maxZoom: maxZoom,
        intensity: intensity,
        gradient: {
          0.2: 'blue',      // Low density
          0.4: 'cyan',      // Medium-low
          0.6: 'lime',      // Medium
          0.8: 'yellow',    // Medium-high
          1.0: 'red'        // High density
        },
        blur: 15,
        max: 1.0
      }).addTo(map)
    }

    // Cleanup function
    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current)
      }
    }
  }, [incidents, enabled, intensity, radius, maxZoom, map])

  return null
}

export default HeatmapLayer
