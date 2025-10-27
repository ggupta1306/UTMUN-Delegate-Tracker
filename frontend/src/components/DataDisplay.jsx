import React from 'react'
import DataTable from './DataTable'
import './DataDisplay.css'

function DataDisplay({ data }) {
  return (
    <div className="data-display-container">
      <h2>Delegate #{data.delegateNumber} Data</h2>
      
      <DataTable data={data.data} />
      
      {/* Future: Add charts and graphs here */}
      <div className="charts-placeholder">
        <p>Charts and graphs will be displayed here</p>
      </div>
    </div>
  )
}

export default DataDisplay

