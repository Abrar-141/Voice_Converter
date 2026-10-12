import { useState, useEffect } from 'react'
import { Moon, Sun, LayoutGrid, Settings, MessageSquare, Image } from 'lucide-react'
import '../css/HomeAdmin.css'
import ReviewsAdmin from './ReviewsAdmin'
import Home2Admin from './Home2Admin'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default function HomeAdmin() {
  const [mode, setMode] = useState('dark')
  const [activePage, setActivePage] = useState('Features')
  const [features, setFeatures] = useState([])
  const [tagInputs, setTagInputs] = useState({})
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/features`)
      .then(r => r.json())
      .then(data => {
        setFeatures(data)
        const inputs = {}
        data.forEach(f => { inputs[f.order] = '' })
        setTagInputs(inputs)
        setLoading(false)
      })
      .catch(() => { setToast('✗ Failed to load. Is backend running?'); setLoading(false) })
  }, [])

  const toggleMode = (m) => {
    setMode(m)
    document.documentElement.setAttribute('data-mode', m)
  }

  const update = (order, field, value) =>
    setFeatures(prev => prev.map(f => f.order === order ? { ...f, [field]: value } : f))

  const handleImg = (order, e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update(order, 'img', reader.result)
    reader.readAsDataURL(file)
  }

  const addTag = (order) => {
    const val = tagInputs[order]?.trim()
    if (!val) return
    const feature = features.find(f => f.order === order)
    if (feature.tags.includes(val)) return
    update(order, 'tags', [...feature.tags, val])
    setTagInputs(prev => ({ ...prev, [order]: '' }))
  }

  const removeTag = (order, tag) => {
    const feature = features.find(f => f.order === order)
    update(order, 'tags', feature.tags.filter(t => t !== tag))
  }

  const save = async () => {
    try {
      await Promise.all(
        features.map(f =>
          fetch(`${API}/api/features/${f.order}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ heading: f.heading, description: f.description, tags: f.tags, img: f.img }),
          })
        )
      )
      setToast('✓ Changes saved successfully!')
    } catch {
      setToast('✗ Save failed. Try again.')
    }
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className="adm-root">

      {/* ── SIDEBAR ── */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-brand">
          <span className="adm-brand-title">Voice <span>Converter</span></span>
          <span className="adm-brand-badge">Admin Panel</span>
        </div>

        <nav className="adm-sidebar-nav">
          {[
            { icon: <LayoutGrid size={15} />, label: 'Features' },
            { icon: <MessageSquare size={15} />, label: 'Reviews' },
            { icon: <Image size={15} />, label: 'Home2 Admin' },
            { icon: <Settings size={15} />, label: 'Settings' },
          ].map(item => (
            <button
              key={item.label}
              className={`adm-nav-item ${activePage === item.label ? 'active' : ''}`}
              onClick={() => setActivePage(item.label)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <div className="adm-toggle">
            <button className={`adm-toggle-btn ${mode === 'dark' ? 'active' : ''}`} onClick={() => toggleMode('dark')}><Moon size={13} /></button>
            <button className={`adm-toggle-btn ${mode === 'light' ? 'active' : ''}`} onClick={() => toggleMode('light')}><Sun size={13} /></button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="adm-main">
        <div className="adm-topbar">
          <h2>{activePage}</h2>
        </div>

        <div className="adm-body">

          {/* ── FEATURES PAGE ── */}
          {activePage === 'Features' && (
            <>
              <p className="adm-page-title">Features Section</p>
              <p className="adm-page-sub">Edit the 3 feature blocks shown on the frontend landing page. Upload images, change text, manage tags — then hit Save.</p>

              {loading ? (
                <p style={{ color: 'var(--text-muted)', marginTop: '2rem' }}>Loading features...</p>
              ) : (
                <>
                  <div className="adm-cards">
                    {features.map((f) => (
                      <div key={f.order} className="adm-card">

                        {/* Card top bar */}
                        <div className="adm-card-top">
                          <div className="adm-card-label">
                            <span className="adm-card-num">0{f.order}</span>
                            <span className="adm-card-name">Feature {f.order}</span>
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="adm-card-body">

                          {/* Left — image */}
                          <div className="adm-img-panel">
                            <div className="adm-img-box">
                              {f.img
                                ? <img src={f.img} alt="preview" />
                                : <span>📷<br />No image<br />uploaded</span>
                              }
                            </div>
                            <p className="adm-img-hint">Recommended:<br />square image, min 400×400px</p>
                            <label className="adm-upload-btn">
                              Upload Image
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImg(f.order, e)} />
                            </label>
                          </div>

                          {/* Right — fields */}
                          <div className="adm-fields-panel">
                            <div className="adm-field">
                              <label>Heading</label>
                              <input
                                className="adm-input"
                                value={f.heading}
                                onChange={e => update(f.order, 'heading', e.target.value)}
                                placeholder="Feature heading..."
                              />
                            </div>

                            <div className="adm-field">
                              <label>Description</label>
                              <textarea
                                className="adm-textarea"
                                value={f.description}
                                onChange={e => update(f.order, 'description', e.target.value)}
                                placeholder="Feature description..."
                              />
                            </div>

                            <div className="adm-field">
                              <label>Tags</label>
                              <div className="adm-tag-row">
                                <input
                                  className="adm-input"
                                  value={tagInputs[f.order] || ''}
                                  onChange={e => setTagInputs(prev => ({ ...prev, [f.order]: e.target.value }))}
                                  onKeyDown={e => e.key === 'Enter' && addTag(f.order)}
                                  placeholder="Type tag & press Enter..."
                                />
                                <button className="adm-tag-add" onClick={() => addTag(f.order)}>+</button>
                              </div>
                              <div className="adm-tags-wrap">
                                {f.tags.map(t => (
                                  <span key={t} className="adm-tag">
                                    {t}
                                    <button onClick={() => removeTag(f.order, t)}>×</button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="adm-save-bar">
                    <button className="adm-save-btn" onClick={save}>💾 Save All Changes</button>
                  </div>
                </>
              )}
            </>
          )}

{activePage === 'Reviews' && <ReviewsAdmin />}

{activePage === 'Home2 Admin' && <Home2Admin />}

          {/* ── SETTINGS PAGE ── */}
          {activePage === 'Settings' && (
            <>
              <p className="adm-page-title">Settings</p>
              <p className="adm-page-sub">Admin settings coming soon.</p>
            </>
          )}

        </div>
      </main>

      {toast && <div className="adm-toast">{toast}</div>}
    </div>
  )
}
