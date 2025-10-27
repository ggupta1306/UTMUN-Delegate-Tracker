import React, { useState } from 'react'
import axios from 'axios'
import './DelegateSearch.css'

function DelegateSearch() {
  const [delegateNumber, setDelegateNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!delegateNumber.trim()) {
      setError('Please enter a delegate number')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const API_URL = import.meta.env.VITE_API_URL || ''
      const response = await axios.post(`${API_URL}/api/delegate`, {
        delegateNumber,
        inputCell: "'Dash Board'!Q34", // Input cell for delegate code
        outputRange: "'Dash Board'!O35:Q42" // Output range with delegate info (including role and committee)
      })
      
      setData(response.data)
    } catch (err) {
      console.error('Error searching for delegate:', err)
      setError(err.response?.data?.error || 'Failed to search delegate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="delegate-search">
      <header className="search-header">
        <div className="header-content">
          <img src="/logo.png" alt="UTMUN Logo" className="logo" />
          <div>
            <h1>UTMUN 2026</h1>
            <p>Delegate Lookup</p>
          </div>
        </div>
      </header>

      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="input-group">
            <label>Enter Delegate Number</label>
            <input
              type="text"
              value={delegateNumber}
              onChange={(e) => setDelegateNumber(e.target.value)}
              placeholder="e.g., 1001"
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading} className="search-btn">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {data && data.success && (
          <div className="delegate-results">
            <h3>Delegate #{data.delegateNumber} Information</h3>
            <div className="info-grid">
              <div className="info-section">
                <h4>Basic Information</h4>
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{data.data.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Pronouns:</span>
                  <span className="info-value">{data.data.pronouns}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Grade:</span>
                  <span className="info-value">{data.data.grade}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Delegation:</span>
                  <span className="info-value">{data.data.delegation}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Committee:</span>
                  <span className="info-value">{data.data.committee}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Role:</span>
                  <span className="info-value">{data.data.role}</span>
                </div>
              </div>

              <div className="info-section">
                <h4>Registration Details</h4>
                <div className="info-row">
                  <span className="info-label">Experience Level:</span>
                  <span className="info-value">{data.data.experienceLevel}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Registration Period:</span>
                  <span className="info-value">{data.data.regPeriod}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Financial Aid:</span>
                  <span className="info-value">{data.data.financialAid}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Accessibility:</span>
                  <span className="info-value">{data.data.accessibility}</span>
                </div>
              </div>

              <div className="info-section">
                <h4>Contact Information</h4>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{data.data.delegateEmail}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Emergency Contact:</span>
                  <span className="info-value">{data.data.emergencyName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Emergency Number:</span>
                  <span className="info-value">{data.data.emergencyNumber}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Emergency Email:</span>
                  <span className="info-value">{data.data.emergencyEmail}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DelegateSearch

