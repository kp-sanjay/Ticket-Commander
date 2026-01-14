import { useEffect, useState } from 'react'
import { api } from './api'
import ConfigForm from './components/ConfigForm'
import LogsView from './components/LogsView'
import ToggleMonitoring from './components/ToggleMonitoring'

export default function App() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/config').then(r => { setConfig(r.data); setLoading(false) })
  }, [])

  if (loading) return <div style={{color: 'white', padding: 20}}>Initializing Command Center...</div>

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h1>AutoTicket Commander</h1>
          <div className="hero-subtitle">Production Grade Ticketing System</div>
        </div>
      </div>
      <div className="container">
        <div className="grid">
          <div>
            <ConfigForm initial={config} onSave={setConfig} />
          </div>
          <div>
            <ToggleMonitoring />
            <LogsView />
          </div>
        </div>
      </div>
    </>
  )
}
