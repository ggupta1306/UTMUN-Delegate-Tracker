import React, { useState } from 'react'
import './DelegateInput.css'

function DelegateInput({ onSubmit, loading }) {
  const [delegateNumber, setDelegateNumber] = useState('')
  const [config, setConfig] = useState({
    inputCell: 'A1',
    outputCellStart: 'B1',
    outputCellEnd: 'Z1'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (delegateNumber.trim()) {
      onSubmit(delegateNumber, config)
    }
  }

  return (
    <div className="delegate-input-container">
      <form onSubmit={handleSubmit} className="delegate-form">
        <div className="form-group">
          <label htmlFor="delegateNumber">Delegate Number:</label>
          <input
            id="delegateNumber"
            type="text"
            value={delegateNumber}
            onChange={(e) => setDelegateNumber(e.target.value)}
            placeholder="Enter delegate number"
            disabled={loading}
            required
          />
        </div>

        <div className="config-section">
          <h3>Configuration</h3>
          <div className="config-grid">
            <div className="form-group">
              <label htmlFor="inputCell">Input Cell (where delegate number goes):</label>
              <input
                id="inputCell"
                type="text"
                value={config.inputCell}
                onChange={(e) => setConfig({...config, inputCell: e.target.value})}
                placeholder="A1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="outputStart">Output Start Cell:</label>
              <input
                id="outputStart"
                type="text"
                value={config.outputCellStart}
                onChange={(e) => setConfig({...config, outputCellStart: e.target.value})}
                placeholder="B1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="outputEnd">Output End Cell:</label>
              <input
                id="outputEnd"
                type="text"
                value={config.outputCellEnd}
                onChange={(e) => setConfig({...config, outputCellEnd: e.target.value})}
                placeholder="Z1"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
      </form>
    </div>
  )
}

export default DelegateInput

