import React, { useState, useEffect, useRef } from 'react'
import './AppSplash.css'

function AppSplash({ onComplete }) {
  const [showLogo, setShowLogo] = useState(false)
  const canvasRef = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => {
    // Trigger animations
    setTimeout(() => setShowLogo(true), 100)
    setTimeout(() => onComplete(), 3300) // 1.3 seconds longer
  }, [onComplete])

  // Minimal particle field (respects reduced motion)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      canvas.width = canvas.clientWidth * DPR
      canvas.height = canvas.clientHeight * DPR
    }
    resize()
    window.addEventListener('resize', resize)

    const num = 70
    const parts = Array.from({ length: num }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2 * DPR,
      vy: (Math.random() - 0.5) * 0.2 * DPR,
      r: (Math.random() * 1.5 + 0.5) * DPR,
      a: Math.random() * 0.5 + 0.2
    }))

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#ffffff'
      parts.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.globalAlpha = p.a
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="splash-screen">
      <canvas ref={canvasRef} className="splash-canvas" />
      <div className={`logo-container ${showLogo ? 'show' : ''}`}>
        <div className="logo-wrap">
          <img src="/logo.png" alt="UTMUN" className="splash-logo" />
          <div className="liquid-bar" />
        </div>
        <h1 className="splash-title">UTMUN 2026</h1>
        <p className="splash-subtitle">Delegate Tracker</p>
      </div>
    </div>
  )
}

export default AppSplash

