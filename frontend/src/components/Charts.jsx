import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import './Charts.css'

function Charts() {
  const [loading, setLoading] = useState(true)
  const [committees, setCommittees] = useState([])
  const [responsibility, setResponsibility] = useState([])
  const [trends, setTrends] = useState([])
  const [sevenDayData, setSevenDayData] = useState([])

  useEffect(() => {
    fetchData()
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || ''
      const [committeeRes, respRes, trendsRes, sevenDayRes] = await Promise.all([
        axios.get(`${API_URL}/api/committees`),
        axios.get(`${API_URL}/api/responsibility`),
        axios.get(`${API_URL}/api/registration-trends`),
        axios.get(`${API_URL}/api/7day-signup`)
      ])

      setCommittees(committeeRes.data.data || [])
      setResponsibility(respRes.data.data || [])
      setTrends(trendsRes.data.data || [])
      setSevenDayData(sevenDayRes.data.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="charts-container">
        <div className="loading">Loading charts...</div>
      </div>
    )
  }

  // Use the actual 7-day data from Google Sheets
  const signupData = sevenDayData

  // Prepare data for Total vs Daily Count
  const totalVsDaily = trends.map(entry => ({
    date: entry.date,
    total: entry.total || 0,
    dailyCount: entry.dailyCount || 0
  }))

  // Prepare data for stacked bar chart showing committee breakdown
  const chartData = committees
    .filter(c => c.name && c.total)
    .map(c => ({
      name: c.name.substring(0, 8),
      Beginner: Number(c.beginner) || 0,
      Intermediate: Number(c.intermediate) || 0,
      Advanced: Number(c.advanced) || 0,
      Total: Number(c.total) || 0
    }))
    .slice(0, 15) // Top 15 committees

  return (
    <div className="charts-container">
      <div className="charts-header">
        <h2>UTMUN 2026 Analytics</h2>
        <button onClick={fetchData} className="refresh-btn">Refresh</button>
      </div>

      {/* 7 Day Running Signup Chart */}
      {signupData.length > 0 && (
        <div className="chart-card">
          <h3>7 Day Running Signup</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={signupData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#0f1419', border: '1px solid #333', color: 'white' }} />
              <Legend wrapperStyle={{ color: 'white' }} />
              <Line type="monotone" dataKey="currentWeek" stroke="#4a90e2" strokeWidth={3} dot={{ fill: '#4a90e2', r: 5 }} name="Current Week" />
              <Line type="monotone" dataKey="previousWeek" stroke="#f8bbd0" strokeWidth={2} name="Previous Week" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Total vs Daily Count Chart */}
      {totalVsDaily.length > 0 && (
        <div className="chart-card">
          <h3>Total vs Daily Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={totalVsDaily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" angle={-90} textAnchor="end" height={100} />
              <YAxis yAxisId="left" stroke="#888" />
              <YAxis yAxisId="right" orientation="right" stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#0f1419', border: '1px solid #333', color: 'white' }} />
              <Legend wrapperStyle={{ color: 'white' }} />
              <Area type="monotone" dataKey="total" fill="#ff6b6b" fillOpacity={0.6} stroke="#ff6b6b" yAxisId="right" name="Total" />
              <Line type="monotone" dataKey="dailyCount" stroke="#4a90e2" strokeWidth={2} yAxisId="left" name="Daily Count" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

              {/* Stacked Bar Chart */}
              <div className="chart-card">
                <h3>First Choice Breakdown by Committee</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f1419', border: '1px solid #333' }} />
                    <Legend wrapperStyle={{ color: 'white' }} />
                    <Bar dataKey="Beginner" stackId="a" fill="#4ade80" />
                    <Bar dataKey="Intermediate" stackId="a" fill="#fbbf24" />
                    <Bar dataKey="Advanced" stackId="a" fill="#f87171" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

      {/* Committee Table */}
      <div className="table-card">
        <h3>Committee Assignments</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Committee</th>
                <th>Beginner</th>
                <th>Intermediate</th>
                <th>Advanced</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {committees.filter(c => c.name).map((committee, i) => {
                const getColorClass = (value) => {
                  const num = parseInt(value) || 0;
                  if (num >= 2) return 'cell-green';
                  if (num === 1) return 'cell-yellow';
                  return 'cell-red';
                };

                return (
                  <tr key={i}>
                    <td>{committee.name}</td>
                    <td className={getColorClass(committee.beginner)}>{committee.beginner}</td>
                    <td className={getColorClass(committee.intermediate)}>{committee.intermediate}</td>
                    <td className={getColorClass(committee.advanced)}>{committee.advanced}</td>
                    <td className="total-col">{committee.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsibility Summary */}
      {responsibility.length > 0 && (
        <div className="table-card">
          <h3>Delegate Responsibilities</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Responsibility</th>
                  <th>E. Delegates</th>
                  <th>A. Delegates</th>
                  <th>Delegations</th>
                </tr>
              </thead>
              <tbody>
                {responsibility.map((row, i) => (
                  <tr key={i}>
                    <td>{row.person}</td>
                    <td>{row.earlyDelegates}</td>
                    <td>{row.aDelegates}</td>
                    <td>{row.delegations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Charts

