import React, { useState, useEffect } from 'react'
import './AppSplash.css'

function AppSplash({ onComplete }) {
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    // Trigger animations
    setTimeout(() => setShowLogo(true), 100)
    setTimeout(() => onComplete(), 3300) // 1.3 seconds longer
  }, [onComplete])

  return (
    <div className="splash-screen">
      <div className={`logo-container ${showLogo ? 'show' : ''}`}>
        <img src="/logo.png" alt="UTMUN" className="splash-logo" />
        <h1 className="splash-title">UTMUN 2026</h1>
        <p className="splash-subtitle">Delegate Tracker</p>
      </div>
    </div>
  )
}

export default AppSplash

