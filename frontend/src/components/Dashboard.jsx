import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || ''
      const response = await axios.get(`${API_URL}/api/dashboard`)
      setData(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const MiniSparkline = ({ data }) => {
    if (!data || data.length === 0) return <div className="sparkline-empty">No data</div>
    
    const sparklineData = Array.isArray(data) ? data.map((val, i) => ({ value: val, index: i })) : []
    
    // Smooth out the data if it's noisy
    const smoothData = sparklineData.map((point, index) => {
      if (index === 0 || index === sparklineData.length - 1) return point
      const prev = sparklineData[index - 1].value
      const curr = point.value
      const next = sparklineData[index + 1]?.value || curr
      const smoothed = (prev + curr + next) / 3
      return { ...point, value: smoothed }
    })
    
    return (
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={smoothData}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#4a90e2" 
            strokeWidth={3} 
            dot={false} 
            strokeDasharray="0"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  const DelegationBarChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="sparkline-empty">No data</div>
    
    // Calculate proportions for the stacked horizontal bars
    const total = data.reduce((sum, val) => sum + Number(val), 0)
    const percentages = data.map(val => ((Number(val) / total) * 100).toFixed(1))
    
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ 
          display: 'flex', 
          width: '100%', 
          height: '40px', 
          borderRadius: '4px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ 
            width: `${percentages[0]}%`, 
            backgroundColor: '#FF6B35', // Orange
            height: '100%'
          }} />
          <div style={{ 
            width: `${percentages[1]}%`, 
            backgroundColor: '#4a90e2', // Blue
            height: '100%'
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#FF6B35', borderRadius: '2px' }} />
            <span>Large Delegations</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#4a90e2', borderRadius: '2px' }} />
            <span>Small Delegations</span>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!data) {
    return <div className="error">No data available</div>
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <img src="/logo.png" alt="UTMUN Logo" className="logo" />
          <div>
            <h1>UTMUN 2026</h1>
            <p>Delegate Tracker</p>
          </div>
        </div>
        <button onClick={fetchDashboardData} className="refresh-btn">
          <span>⟳</span> Refresh
        </button>
      </header>

      {/* Priority Stats */}
      <div className="priority-stats">
        <div className={`priority-card urgent ${data.stats?.delegatesToImport === '0' ? 'success' : ''}`}>
          <div className="priority-label">Delegates to Import</div>
          <div className="priority-value">{data.stats?.delegatesToImport || '0'}</div>
        </div>
        <div className={`priority-card urgent ${data.stats?.delegatesToSlot === '0' ? 'success' : ''}`}>
          <div className="priority-label">Delegates to Slot</div>
          <div className="priority-value">{data.stats?.delegatesToSlot || '0'}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-header">
          <span>Progress: {data.stats?.totalRegistrations || 0} / {data.stats?.goal || 1250}</span>
          <span>{data.stats?.progressPercentage || 0}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${data.stats?.progressPercentage || 0}%` }} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Registrations</div>
          <div className="stat-value">{data.stats?.totalRegistrations || '0'}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Today's Registration</div>
          <div className="stat-value">{data.stats?.todaysRegistration || '0'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Remaining Capacity</div>
          <div className="stat-value">{data.stats?.remainingCapacity || '0'}</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats-section">
        <h3>Quick Stats</h3>
        <div className="quick-stats-grid">
          <div className="quick-stat-card">
            <div className="quick-stat-icon">🏢</div>
            <div className="quick-stat-label">Avg Delegation Size</div>
            <div className="quick-stat-value">{data.quickStats?.averageDelegationSize || '0'}</div>
          </div>
          
          <div className="quick-stat-card">
            <div className="quick-stat-icon">⭐</div>
            <div className="quick-stat-label">Most Popular Committee</div>
            <div className="quick-stat-value">{data.quickStats?.mostPopularCommittee || 'N/A'}</div>
          </div>
          
          <div className="quick-stat-card">
            <div className="quick-stat-icon">📊</div>
            <div className="quick-stat-label">Experience Levels</div>
            <div className="quick-stat-breakdown">
              <span className="quick-stat-level">Beg: {data.quickStats?.experienceLevelBreakdown?.beginner || 0}</span>
              <span className="quick-stat-level">Int: {data.quickStats?.experienceLevelBreakdown?.intermediate || 0}</span>
              <span className="quick-stat-level">Adv: {data.quickStats?.experienceLevelBreakdown?.advanced || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Large to Small Delegations */}
      {data.delegationSparkline && data.delegationSparkline.length > 0 && (
        <div className="delegation-section">
          <h3>Large to Small Delegations</h3>
          <div className="delegation-sparkline">
            <DelegationBarChart data={data.delegationSparkline} />
          </div>
        </div>
      )}

      {/* Registration Phases */}
      <div className="registration-phases">
        {/* Early Registration */}
        <div className="phase-card phase-early">
          <div className="phase-content">
            <div className="phase-stats">
              <div className="phase-percentage phase-bg-green">{data.registrations?.early?.percentage || '0%'}</div>
              <div className="phase-number">{data.registrations?.early?.number || '0'}</div>
            </div>
            <div className="phase-info">
              <div className="phase-label">{data.registrations?.early?.label}</div>
              <div className="phase-date">{data.registrations?.early?.dateRange}</div>
            </div>
            <div className="phase-sparkline">
              <MiniSparkline data={data.registrations?.early?.sparklineData} />
            </div>
          </div>
        </div>

        {/* Regular Registration */}
        <div className="phase-card phase-regular">
          <div className="phase-content">
            <div className="phase-stats">
              <div className="phase-percentage phase-bg-yellow">{data.registrations?.regular?.percentage || '0%'}</div>
              <div className="phase-number">{data.registrations?.regular?.number || '0'}</div>
            </div>
            <div className="phase-info">
              <div className="phase-label">{data.registrations?.regular?.label}</div>
              <div className="phase-date">{data.registrations?.regular?.dateRange}</div>
            </div>
            <div className="phase-sparkline">
              <MiniSparkline data={data.registrations?.regular?.sparklineData} />
            </div>
          </div>
        </div>

        {/* Late Registration */}
        <div className="phase-card phase-late">
          <div className="phase-content">
            <div className="phase-stats">
              <div className="phase-percentage phase-bg-pink">{data.registrations?.late?.percentage || '0%'}</div>
              <div className="phase-number">{data.registrations?.late?.number || '0'}</div>
            </div>
            <div className="phase-info">
              <div className="phase-label">{data.registrations?.late?.label}</div>
              <div className="phase-date">{data.registrations?.late?.dateRange}</div>
            </div>
            <div className="phase-sparkline">
              <MiniSparkline data={data.registrations?.late?.sparklineData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

