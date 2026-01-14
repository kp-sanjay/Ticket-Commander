import { useState, useEffect } from 'react'
import { api } from '../api'

type Props = { initial: any, onSave: (c: any) => void }

export default function ConfigForm({ initial, onSave }: Props) {
  const [form, setForm] = useState<any>(initial)
  const [saving, setSaving] = useState(false)
  const [districts, setDistricts] = useState<{name: string, code: string}[]>([])
  const [availableTheatres, setAvailableTheatres] = useState<string[]>([])
  const [fetchingTheatres, setFetchingTheatres] = useState(false)

  // Load districts on mount
  useEffect(() => {
    api.get('/bms/districts').then(r => setDistricts(r.data)).catch(console.error)
  }, [])

  // Auto-fetch theatres when region changes to a valid code
  useEffect(() => {
    if (form.region && districts.some(d => d.code === form.region)) {
        setFetchingTheatres(true)
        api.get(`/bms/theatres/${form.region}`)
           .then(r => setAvailableTheatres(r.data.theatres))
           .catch(err => {
               console.error(err)
               setAvailableTheatres([])
           })
           .finally(() => setFetchingTheatres(false))
    }
  }, [form.region, districts])

  function update(path: string, value: any) {
    setForm((f: any) => {
      const next = { ...f }
      const parts = path.split('.')
      let cur: any = next
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]]
      cur[parts[parts.length - 1]] = value
      return next
    })
  }

  function toggleTheatre(name: string) {
      const exists = form.theatres.find((t: any) => t.name === name)
      if (exists) {
          // Remove
          update('theatres', form.theatres.filter((t: any) => t.name !== name))
      } else {
          // Add
          update('theatres', [...form.theatres, { name, priority: 1 }])
      }
  }

  async function save() {
    setSaving(true)
    try {
      const r = await api.post('/config', form)
      onSave(r.data)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <h2>Target Details</h2>
      
      <div className="row">
        <div className="col">
          <label>Movie Name</label>
          <input value={form.movieName} onChange={e => update('movieName', e.target.value)} placeholder="Enter Movie Title..." />
        </div>
        <div className="col">
          <label>Region / City</label>
          <select value={form.region} onChange={e => update('region', e.target.value)} style={{ padding: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }}>
            <option value="">Select District</option>
            {districts.map(d => (
                <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Theatre Discovery Section */}
      {form.region && (
          <div style={{ marginTop: 20, padding: 15, background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ fontSize: '1rem', margin: 0, color: '#46d369' }}>Available Theatres</h3>
                {fetchingTheatres && <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Scanning network...</span>}
            </div>
            
            <div style={{ maxHeight: 200, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {!fetchingTheatres && availableTheatres.length === 0 && <div style={{ gridColumn: 'span 2', color: '#666', fontStyle: 'italic' }}>No theatres found or select a region.</div>}
                {availableTheatres.map((t, i) => {
                    const isSelected = form.theatres.some((ft: any) => ft.name === t)
                    return (
                        <div key={i} 
                             onClick={() => toggleTheatre(t)}
                             style={{ 
                                 padding: '8px 12px', 
                                 background: isSelected ? 'rgba(229, 9, 20, 0.2)' : 'rgba(255,255,255,0.05)', 
                                 border: isSelected ? '1px solid #e50914' : '1px solid transparent',
                                 borderRadius: 4, 
                                 cursor: 'pointer',
                                 fontSize: '0.9rem',
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: 8
                             }}>
                            <div style={{ 
                                width: 14, height: 14, borderRadius: 2, 
                                border: '1px solid #666', 
                                background: isSelected ? '#e50914' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {isSelected && <span style={{ fontSize: 10, color: '#fff' }}>✓</span>}
                            </div>
                            {t}
                        </div>
                    )
                })}
            </div>
          </div>
      )}

      <div style={{ margin: '30px 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
        <h2 style={{ fontSize: '1.2rem', color: '#aaa' }}>Priority Targets</h2>
        
        <div className="row">
          <div className="col">
            <h3 style={{ fontSize: '1rem', marginBottom: 15 }}>Theatres (Selected)</h3>
            {form.theatres.length === 0 && <div style={{ color: '#666' }}>No theatres selected. Pick from above.</div>}
            {form.theatres.map((t: any, i: number) => (
              <div key={i} className="row" style={{ alignItems: 'center', marginBottom: 8 }}>
                <div className="col" style={{ flex: 2 }}>
                  <input readOnly value={t.name} style={{ background: 'rgba(0,0,0,0.2)', color: '#aaa' }} />
                </div>
                <div className="col">
                  <input type="number" placeholder="Pri" value={t.priority} onChange={e => {
                    const arr = [...form.theatres]; arr[i] = { ...t, priority: Number(e.target.value) }; update('theatres', arr)
                  }} />
                </div>
                <button onClick={() => toggleTheatre(t.name)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}>✕</button>
              </div>
            ))}
          </div>
          
          <div className="col">
            <h3 style={{ fontSize: '1rem', marginBottom: 15 }}>Show Times</h3>
            {form.showTimes.map((t: any, i: number) => (
              <div key={i} className="row" style={{ alignItems: 'center' }}>
                <div className="col" style={{ flex: 2 }}>
                  <input placeholder="Time (e.g. 18:00)" value={t.time} onChange={e => {
                    const arr = [...form.showTimes]; arr[i] = { ...t, time: e.target.value }; update('showTimes', arr)
                  }} />
                </div>
                <div className="col">
                  <input type="number" placeholder="Pri" value={t.priority} onChange={e => {
                    const arr = [...form.showTimes]; arr[i] = { ...t, priority: Number(e.target.value) }; update('showTimes', arr)
                  }} />
                </div>
              </div>
            ))}
            <button style={{ fontSize: '0.8rem', padding: '8px 16px', background: '#333' }} onClick={() => update('showTimes', [...form.showTimes, { time: '', priority: 0 }])}>+ Add Time</button>
          </div>
        </div>
      </div>

      <div style={{ margin: '30px 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
        <h2 style={{ fontSize: '1.2rem', color: '#aaa' }}>Seating Logistics</h2>
        <div className="row">
          <div className="col">
            <label>Row Pref</label>
            <select value={form.seatPreference.rowPreference} onChange={e => update('seatPreference.rowPreference', e.target.value)}>
              <option value="upper">Upper Deck</option>
              <option value="middle">Middle Deck</option>
              <option value="lower">Lower Deck</option>
            </select>
          </div>
          <div className="col">
            <label>Position</label>
            <select value={form.seatPreference.positionPreference} onChange={e => update('seatPreference.positionPreference', e.target.value)}>
              <option value="center">Center</option>
              <option value="left">Left Wing</option>
              <option value="right">Right Wing</option>
            </select>
          </div>
          <div className="col">
            <label>Count</label>
            <input type="number" value={form.seatPreference.count} onChange={e => update('seatPreference.count', Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, padding: 20, background: 'rgba(229, 9, 20, 0.1)', borderRadius: 8, border: '1px solid rgba(229, 9, 20, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <input 
            type="checkbox" 
            id="simCheck"
            style={{ width: '20px', height: '20px', margin: 0, accentColor: 'var(--primary-color)' }}
            checked={form.simulation} 
            onChange={e => update('simulation', e.target.checked)} 
          />
          <div>
            <label htmlFor="simCheck" style={{ margin: 0, color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>Simulation Mode</label>
            <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: 4 }}>Run checks without real browser interaction or booking.</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 30, textAlign: 'right' }}>
        <button onClick={save} disabled={saving} style={{ width: '100%', fontSize: '1.1rem', padding: '16px' }}>
          {saving ? 'Saving...' : 'Deploy Configuration'}
        </button>
      </div>
    </div>
  )
}
