import React, { useState } from 'react'
import axios from 'axios'
import './DelegateSearch.css'

function DelegationSearch() {
  const [delegationName, setDelegationName] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!delegationName.trim()) {
      setError('Please enter a delegation name')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const API_URL = import.meta.env.VITE_API_URL || ''
      const response = await axios.post(`${API_URL}/api/delegation`, {
        delegationName
      })
      
      setData(response.data)
    } catch (err) {
      console.error('Error searching for delegation:', err)
      setError(err.response?.data?.error || 'Failed to search delegation')
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
            <p>Delegation Lookup</p>
          </div>
        </div>
      </header>

      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="input-group">
            <label htmlFor="delegation-name">Delegation Name</label>
            <input
              type="text"
              id="delegation-name"
              value={delegationName}
              onChange={(e) => setDelegationName(e.target.value)}
              placeholder="Enter delegation name"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search Delegation'}
          </button>
        </form>

        {data && (
          <div className="delegate-results">
            <h3>Delegation Information</h3>
            
            <div className="info-grid">
              {/* Contact Info */}
              <div className="info-section">
                <h4>Contact Information</h4>
                <div className="info-row">
                  <span className="info-label">Primary Contact:</span>
                  <span className="info-value">{data.data?.primaryContact || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Role:</span>
                  <span className="info-value">{data.data?.role || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{data.data?.email || 'N/A'}</span>
                </div>
              </div>

              {/* Delegation Details */}
              <div className="info-section">
                <h4>Delegation Details</h4>
                <div className="info-row">
                  <span className="info-label">Delegation Name:</span>
                  <span className="info-value">{data.data?.delegationName || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{data.data?.address || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Total Delegates:</span>
                  <span className="info-value">{data.data?.totalDels || 'N/A'}</span>
                </div>
              </div>

              {/* Administrative Info */}
              <div className="info-section">
                <h4>Administrative</h4>
                <div className="info-row">
                  <span className="info-label">Owner:</span>
                  <span className="info-value">{data.data?.owner || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Large/Small:</span>
                  <span className="info-value">{data.data?.lS || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DelegationSearch

