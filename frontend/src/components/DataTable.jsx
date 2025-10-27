import React from 'react'
import './DataTable.css'

function DataTable({ data }) {
  if (!data || data.length === 0) {
    return <div className="no-data">No data available</div>
  }

  // Flatten the data for display
  const flattenedData = data.flat()

  return (
    <div className="data-table-container">
      <div className="data-grid">
        {flattenedData.map((cell, index) => (
          <div key={index} className="data-cell">
            <span className="cell-label">Cell {index + 1}:</span>
            <span className="cell-value">{cell || '(empty)'}</span>
          </div>
        ))}
      </div>

      {/* Also show as raw table for debugging */}
      <details className="raw-data">
        <summary>View Raw Data</summary>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  )
}

export default DataTable

