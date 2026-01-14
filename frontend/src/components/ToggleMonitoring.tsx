import { useState } from 'react'
import { api } from '../api'

export default function ToggleMonitoring() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  
  async function start() {
    setLoading(true)
    try {
        const r = await api.post('/monitor/start')
        setEnabled(r.data.enabled)
    } finally {
        setLoading(false)
    }
  }
  async function stop() {
    setLoading(true)
    try {
        const r = await api.post('/monitor/stop')
        setEnabled(false)
    } finally {
        setLoading(false)
    }
  }
  async function checkOnce() {
    setLoading(true)
    try {
        await api.post('/monitor/check')
    } finally {
        setLoading(false)
    }
  }
  
  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h2 style={{ margin: 0, border: 0, fontSize: '1.2rem' }}>Mission Status: 
          <span className={`status-badge ${enabled ? 'status-running' : 'status-stopped'}`} style={{ marginLeft: 15 }}>
            {enabled ? 'ACTIVE' : 'STANDBY'}
          </span>
        </h2>
        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: 4 }}>
          {enabled ? 'System is actively scanning targets.' : 'Systems are in standby mode.'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {!enabled ? (
          <button onClick={start} disabled={loading} style={{ background: '#46d369', color: '#000', boxShadow: '0 0 15px rgba(70, 211, 105, 0.4)' }}>
            {loading ? 'Initiating...' : 'Start Mission'}
          </button>
        ) : (
          <button onClick={stop} disabled={loading} style={{ background: '#ff1a3c' }}>
            {loading ? 'Aborting...' : 'Abort Mission'}
          </button>
        )}
        <button onClick={checkOnce} disabled={loading} style={{ background: 'transparent', border: '1px solid #444', color: '#ddd' }}>
            Single Scan
        </button>
      </div>
    </div>
  )
}
