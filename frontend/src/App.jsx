import React, { useState } from 'react'
import Dashboard from './components/Dashboard'
import DelegateSearch from './components/DelegateSearch'
import Charts from './components/Charts'
import AppSplash from './components/AppSplash'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <AppSplash onComplete={() => setShowSplash(false)} />
  }

  return (
    <div className="app">
      <nav className="app-nav">
        <button 
          className={currentPage === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentPage('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={currentPage === 'charts' ? 'active' : ''}
          onClick={() => setCurrentPage('charts')}
        >
          Charts
        </button>
        <button 
          className={currentPage === 'search' ? 'active' : ''}
          onClick={() => setCurrentPage('search')}
        >
          Search
        </button>
      </nav>

      <main className="app-main">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'charts' && <Charts />}
        {currentPage === 'search' && <DelegateSearch />}
      </main>
    </div>
  )
}

export default App

