import { useState, useEffect } from 'react'
import { Upload, Trash2, ArrowUp, ArrowDown, RefreshCw, Frame, Image as ImageIcon } from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

/* Home2 Admin — manage the pictures of the frontend dashboard slideshow.
   Pictures are saved in MongoDB (base64) and shown in the Home2 slider. */
export default function Home2Admin() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [drag, setDrag] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/api/homepictures`)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      showToast('✗ Failed to load. Is backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const uploadFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { showToast('✗ Sirf image files allowed hain'); return }
    if (file.size > 5 * 1024 * 1024) { showToast('✗ Image too large (max 5MB)'); return }

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        setUploading(true)
        const res = await fetch(`${API}/api/homepictures`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result, alt: file.name.replace(/\.[^.]+$/, '') }),
        })
        if (!res.ok) throw new Error()
        showToast('✓ Picture saved & live on the app!')
        load()
      } catch {
        showToast('✗ Upload failed. Try again.')
      } finally {
        setUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // reset so the same file can be uploaded again
    uploadFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    uploadFile(e.dataTransfer.files?.[0])
  }

  const move = async (idx, dir) => {
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= items.length) return
    const a = items[idx], b = items[swap]
    try {
      await Promise.all([
        fetch(`${API}/api/homepictures/${a._id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: b.order }),
        }),
        fetch(`${API}/api/homepictures/${b._id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: a.order }),
        }),
      ])
      load()
    } catch { showToast('✗ Reorder failed') }
  }

  const remove = async (id) => {
    try {
      await fetch(`${API}/api/homepictures/${id}`, { method: 'DELETE' })
      showToast('✓ Picture deleted')
      load()
    } catch { showToast('✗ Delete failed') }
  }

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading pictures...</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <p className="adm-page-title">Home2 Slideshow Pictures</p>
        <p className="adm-page-sub">
          Upload pictures that auto-play in the Home2 dashboard slideshow on the frontend.
          Pictures seedhe database mein save hoti hain.
        </p>
      </div>

      {/* ── frame spec card — exact size jaisa frontend par dikhta hai ── */}
      <div className="adm-card">
        <div className="adm-card-top">
          <div className="adm-card-label">
            <span className="adm-card-num"><Frame size={13} /></span>
            <span className="adm-card-name">Slideshow Frame Specs</span>
          </div>
          <span className="adm-brand-badge">frontend frame ka exact size</span>
        </div>

        <div className="h2a-spec">
          <div className="h2a-frame-preview">
            <div className="h2a-frame-inner">
              <span className="h2a-frame-chip">100% width × 540px</span>
            </div>
            <p className="adm-img-hint">Home2 dashboard ka live slideshow frame (full left ↔ full right)</p>
          </div>

          <div className="h2a-spec-list">
            <div className="h2a-spec-row"><span className="h2a-spec-key">Desktop frame</span><span className="h2a-spec-val">Full width × 540px</span></div>
            <div className="h2a-spec-row"><span className="h2a-spec-key">Mobile frame</span><span className="h2a-spec-val">Full width × 420px</span></div>
            <div className="h2a-spec-row"><span className="h2a-spec-key">Orientation</span><span className="h2a-spec-val">Landscape (wide)</span></div>
            <div className="h2a-spec-row"><span className="h2a-spec-key">Recommended size</span><span className="h2a-spec-val hl">1920 × 540 px</span></div>
            <div className="h2a-spec-row"><span className="h2a-spec-key">Minimum size</span><span className="h2a-spec-val">1200 × 400 px</span></div>
            <div className="h2a-spec-row"><span className="h2a-spec-key">Format · max size</span><span className="h2a-spec-val">JPG · PNG · WebP · 5MB</span></div>
          </div>
        </div>

        <p className="h2a-note">
          Note: picture <code>object-fit: cover</code> se frame mein fit hoti hai — chhoti ya square image par
          kinare cut ho sakte hain, is liye <strong>wide landscape</strong> image behtar rahegi.
        </p>
      </div>

      {/* ── upload drop zone ── */}
      <label
        className={`h2a-drop ${drag ? 'drag' : ''} ${uploading ? 'disabled' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
      >
        <span className="h2a-drop-icon"><Upload size={20} /></span>
        <span className="h2a-drop-title">
          {uploading ? 'Uploading…' : 'Drag & drop picture here — ya click karke choose karo'}
        </span>
        <span className="h2a-drop-sub">
          Landscape recommended · 1920 × 540 px · max 5MB · JPG / PNG / WebP
        </span>
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
      </label>

      {/* ── actions bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="adm-save-btn" onClick={load} title="Refresh list">
          <RefreshCw size={14} /> Refresh
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {items.length} picture{items.length === 1 ? '' : 's'} in slideshow
        </span>
      </div>

      {/* pictures grid */}
      {items.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
          padding: '3rem 1rem', borderRadius: '1rem',
          border: '1px dashed var(--border)', color: 'var(--text-muted)',
        }}>
          <ImageIcon size={36} />
          <p style={{ fontSize: '0.9rem' }}>No pictures yet — upload one above.</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            Until you upload pictures here, the frontend shows the built-in default images.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {items.map((p, idx) => (
            <div key={p._id} className="adm-card" style={{ padding: '0.75rem' }}>
              {/* preview */}
              <div style={{
                width: '100%', height: 120, borderRadius: '0.75rem', overflow: 'hidden',
                background: 'var(--bg-input)', border: '1px solid var(--border-soft)',
              }}>
                <img src={p.image} alt={p.alt || 'picture'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* meta + actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem', gap: '0.5rem' }}>
                <span className="adm-card-num" style={{ fontSize: '0.8rem' }}>
                  #{p.order} {idx === 0 ? '(first shown)' : ''}
                </span>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    onClick={() => move(idx, 'up')} disabled={idx === 0}
                    title="Move up" className="adm-tag-add"
                    style={{ opacity: idx === 0 ? 0.35 : 1, cursor: idx === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30 }}
                  ><ArrowUp size={14} /></button>
                  <button
                    onClick={() => move(idx, 'down')} disabled={idx === items.length - 1}
                    title="Move down" className="adm-tag-add"
                    style={{ opacity: idx === items.length - 1 ? 0.35 : 1, cursor: idx === items.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30 }}
                  ><ArrowDown size={14} /></button>
                  <button
                    onClick={() => remove(p._id)}
                    title="Delete picture" className="adm-tag-add"
                    style={{ color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30 }}
                  ><Trash2 size={14} /></button>
                </div>
              </div>
              <p style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.alt || 'Picture'}
              </p>
            </div>
          ))}
        </div>
      )}

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Tip: nayi picture slideshow ke aakhir mein jati hai — ↑ ↓ buttons se order set karo.
        Frontend par turant nazar aa jayengi.
      </p>

      {toast && <div className="adm-toast">{toast}</div>}
    </div>
  )
}