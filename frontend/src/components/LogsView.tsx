import { useEffect, useState, useRef } from 'react'
import { api } from '../api'

export default function LogsView() {
  const [logs, setLogs] = useState<any[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchLogs = () => api.get('/logs').then(r => setLogs(r.data))
    fetchLogs()
    const interval = setInterval(fetchLogs, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, border: 'none', fontSize: '1.2rem' }}>Mission Log</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e676', boxShadow: '0 0 5px #00e676' }}></span>
            <span style={{ fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 }}>Live Feed</span>
        </div>
      </div>
      <div className="log-terminal">
        {logs.length === 0 && (
            <div style={{ color: '#444', fontStyle: 'italic', padding: 20, textAlign: 'center' }}>
                System initialized. Waiting for mission data...
            </div>
        )}
        {logs.map((l: any, i: number) => (
          <div key={l._id || i} className="log-entry">
            <span style={{ color: '#555', fontFamily: 'monospace', minWidth: '85px' }}>
                {new Date(l.createdAt).toLocaleTimeString()}
            </span>
            <span style={{ 
              color: l.level === 'error' ? '#ff1a3c' : l.level === 'warn' ? '#ffea00' : '#46d369',
              fontWeight: 'bold',
              minWidth: '60px',
              textTransform: 'uppercase',
              fontSize: '0.75rem'
            }}>{l.level}</span>
            <span style={{ color: '#ddd' }}>{l.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
