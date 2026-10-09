import { useState, useEffect } from 'react'
import { Trash2, Plus, Star } from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const EMPTY = { name: '', comment: '', rating: 5 }

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch(`${API}/api/reviews`)
      .then(r => r.json())
      .then(data => { setReviews(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const add = async () => {
    if (!form.name.trim() || !form.comment.trim()) return showToast('✗ Name and comment required')
    try {
      const res = await fetch(`${API}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const newR = await res.json()
      setReviews(prev => [newR, ...prev])
      setForm(EMPTY)
      showToast('✓ Review added!')
    } catch { showToast('✗ Failed to add') }
  }

  const remove = async (id) => {
    try {
      await fetch(`${API}/api/reviews/${id}`, { method: 'DELETE' })
      setReviews(prev => prev.filter(r => r._id !== id))
      showToast('✓ Deleted')
    } catch { showToast('✗ Failed to delete') }
  }

  const initials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="adm-header">
        <h1 className="adm-page-title">Reviews</h1>
        <p className="adm-page-sub">Add or remove user reviews shown on the frontend landing page.</p>
      </div>

      {/* Add form */}
      <div className="adm-card" style={{ padding: '1.5rem' }}>
        <div className="adm-card-top" style={{ marginBottom: '1.2rem', padding: 0, border: 'none', background: 'none' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Add New Review</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="adm-field">
            <label>Name</label>
            <input className="adm-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="User name..." />
          </div>
          <div className="adm-field">
            <label>Rating</label>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setForm(p => ({ ...p, rating: n }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: n <= form.rating ? 'var(--accent)' : 'var(--border)', padding: 0, transition: 'color 0.2s' }}>
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="adm-field" style={{ marginTop: '1rem' }}>
          <label>Comment</label>
          <textarea className="adm-textarea" value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} placeholder="Write review comment..." style={{ minHeight: '70px' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="adm-save-btn" onClick={add} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={15} /> Add Review
          </button>
        </div>
      </div>

      {/* Reviews list */}
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {reviews.map(r => (
            <div key={r._id} className="adm-card" style={{ padding: '1.1rem 1.4rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-soft)', border: '2px solid var(--accent-border)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                {initials(r.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{r.name}</span>
                  <span style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{r.comment}</p>
              </div>
              <button onClick={() => remove(r._id)}
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', borderRadius: 8, padding: '0.4rem 0.6rem', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {toast && <div className="adm-toast">{toast}</div>}
    </div>
  )
}
