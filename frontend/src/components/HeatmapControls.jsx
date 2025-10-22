import { useState } from 'react'
import './HeatmapControls.css'

function HeatmapControls({ onSettingsChange, heatmapEnabled, onToggle }) {
  const [settings, setSettings] = useState({
    intensity: 0.6,
    radius: 25,
    maxZoom: 17,
    gradient: 'default'
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const gradientPresets = {
    default: {
      0.2: 'blue',
      0.4: 'cyan', 
      0.6: 'lime',
      0.8: 'yellow',
      1.0: 'red'
    },
    fire: {
      0.2: 'navy',
      0.4: 'blue',
      0.6: 'cyan',
      0.8: 'orange',
      1.0: 'red'
    },
    danger: {
      0.2: 'green',
      0.4: 'yellow',
      0.6: 'orange', 
      0.8: 'red',
      1.0: 'darkred'
    },
    cool: {
      0.2: 'purple',
      0.4: 'blue',
      0.6: 'cyan',
      0.8: 'white',
      1.0: 'white'
    }
  }

  return (
    <div className="heatmap-controls">
      <div className="control-header">
        <h3>🔥 Heatmap Controls</h3>
        <label className="toggle-switch">
          <input 
            type="checkbox" 
            checked={heatmapEnabled}
            onChange={onToggle}
          />
          <span className="slider"></span>
        </label>
      </div>

      {heatmapEnabled && (
        <div className="control-content">
          <div className="control-group">
            <label>Intensity: {settings.intensity}</label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={settings.intensity}
              onChange={(e) => handleSettingChange('intensity', parseFloat(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Radius: {settings.radius}px</label>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={settings.radius}
              onChange={(e) => handleSettingChange('radius', parseInt(e.target.value))}
            />
          </div>

          <button 
            className="advanced-toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '▼' : '▶'} Advanced Settings
          </button>

          {showAdvanced && (
            <div className="advanced-controls">
              <div className="control-group">
                <label>Max Zoom: {settings.maxZoom}</label>
                <input
                  type="range"
                  min="10"
                  max="20"
                  step="1"
                  value={settings.maxZoom}
                  onChange={(e) => handleSettingChange('maxZoom', parseInt(e.target.value))}
                />
              </div>

              <div className="control-group">
                <label>Color Scheme</label>
                <select
                  value={settings.gradient}
                  onChange={(e) => handleSettingChange('gradient', e.target.value)}
                >
                  <option value="default">Default (Blue → Red)</option>
                  <option value="fire">Fire (Navy → Red)</option>
                  <option value="danger">Danger (Green → Dark Red)</option>
                  <option value="cool">Cool (Purple → White)</option>
                </select>
              </div>
            </div>
          )}

          <div className="heatmap-legend">
            <div className="legend-title">Incident Density</div>
            <div className="legend-gradient">
              <span>Low</span>
              <div className="gradient-bar"></div>
              <span>High</span>
            </div>
            <div className="legend-info">
              🔥 Hotspots show areas with frequent incident reports
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HeatmapControls
