import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import io from 'socket.io-client'
import './Notifications.css'

function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    if (!user) return

    // Connect to Socket.io server
    socketRef.current = io('http://localhost:5000')
    
    socketRef.current.on('connect', () => {
      console.log('🔌 Connected to server')
      setIsConnected(true)
      socketRef.current.emit('join_room', user.id)
    })

    socketRef.current.on('disconnect', () => {
      console.log('🔌 Disconnected from server')
      setIsConnected(false)
    })

    // Listen for new incidents
    socketRef.current.on('new_incident', (data) => {
      console.log('📢 New incident notification:', data)
      addNotification(data)
    })

    // Listen for incident updates
    socketRef.current.on('incident_updated', (data) => {
      console.log('📢 Incident update notification:', data)
      addNotification(data)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [user])

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      message: notification.message,
      type: notification.type || 'info',
      timestamp: new Date(),
      data: notification.incident
    }

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]) // Keep only 5 latest

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, 5000)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info': return 'ℹ️'
      case 'warning': return '⚠️'
      case 'success': return '✅'
      case 'error': return '❌'
      default: return '📢'
    }
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="notifications-container">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={'notification ' + notification.type}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="notification-icon">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="notification-content">
            <p className="notification-message">{notification.message}</p>
            <span className="notification-time">
              {notification.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <button 
            className="notification-close"
            onClick={(e) => {
              e.stopPropagation()
              removeNotification(notification.id)
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default Notifications
