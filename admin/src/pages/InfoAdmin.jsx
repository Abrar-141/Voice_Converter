import { useState, useEffect } from 'react'
import { Plus, Save } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const ICON_OPTIONS = [
  'Zap','Globe','Lock','Radio','Mic2','BrainCircuit',
  'MessageCircle','ShieldCheck','Gauge','Globe2',
  'Sparkles','Cpu','Wifi','Volume2','Languages','Eye',
  'Headphones','Star','Rocket','Shield'
]

export default function InfoAdmin() {
  const [items, setItems] = useState([])
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/infosections`)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const update = (order, field, value) =>
    setItems(prev => prev.map(i => i.order === order ? { ...i, [field]: value } : i))

  const save = async () => {
    try {
      await Promise.all(
        items.map(i =>
          fetch(`${API}/api/infosections/${i.order}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ icon: i.icon, heading: i.heading, description: i.description }),
          })
        )
      )
      showToast('✓ Saved successfully!')
    } catch { showToast('✗ Save failed') }
  }

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading...</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <p className="adm-page-title">Info Section</p>
        <p className="adm-page-sub">Edit the 6 feature cards shown below the main features section on the frontend.</p>
      </div>

      <div className="adm-cards">
        {items.map((item) => {
          const Icon = LucideIcons[item.icon] || LucideIcons.Zap
          return (
            <div key={item.order} className="adm-card">
              <div className="adm-card-top">
                <div className="adm-card-label">
                  <span className="adm-card-num">0{item.order}</span>
                  <span className="adm-card-name">Card {item.order}</span>
                </div>
                {/* live icon preview */}
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="adm-fields-panel" style={{ paddingTop: '1rem' }}>
                {/* Icon picker */}
                <div className="adm-field">
                  <label>Icon</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.3rem' }}>
                    {ICON_OPTIONS.map(name => {
                      const Ic = LucideIcons[name] || LucideIcons.Zap
                      return (
                        <button key={name} onClick={() => update(item.order, 'icon', name)}
                          title={name}
                          style={{
                            width: 36, height: 36, borderRadius: 8, border: '1px solid',
                            borderColor: item.icon === name ? 'var(--accent)' : 'var(--border)',
                            background: item.icon === name ? 'var(--accent-soft)' : 'var(--bg-input)',
                            color: item.icon === name ? 'var(--accent)' : 'var(--text-muted)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}>
                          <Ic size={15} />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="adm-field">
                  <label>Heading</label>
                  <input className="adm-input" value={item.heading}
                    onChange={e => update(item.order, 'heading', e.target.value)}
                    placeholder="Card heading..." />
                </div>

                <div className="adm-field">
                  <label>Description</label>
                  <textarea className="adm-textarea" value={item.description}
                    onChange={e => update(item.order, 'description', e.target.value)}
                    placeholder="Card description..." />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="adm-save-bar">
        <button className="adm-save-btn" onClick={save}>
          <Save size={15} /> Save All Changes
        </button>
      </div>

      {toast && <div className="adm-toast">{toast}</div>}
    </div>
  )
}
