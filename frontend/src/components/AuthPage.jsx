import { useState } from 'react'
import {
  Mail, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight,
  Sparkles, Globe, Zap, Phone, Check
} from 'lucide-react'
import logo from '../services/pictures/Logo_App.png.jpg'
import '../css/AuthPage.css'

export default function AuthPage({ onBack, defaultTab = 'signup' }) {
  const [tab, setTab] = useState(defaultTab)
  const [method, setMethod] = useState('email')
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }))
    setErrors(prev => ({ ...prev, [k]: '' }))
  }

  // live password rule checks
  const pw = form.password
  const pwRules = [
    { ok: pw.length >= 8, label: 'At least 8 characters' },
    { ok: /[A-Z]/.test(pw), label: 'One uppercase letter (A-Z)' },
    { ok: /[a-z]/.test(pw), label: 'One lowercase letter (a-z)' },
    { ok: /[0-9]/.test(pw), label: 'One number (0-9)' },
    { ok: /[^A-Za-z0-9]/.test(pw), label: 'One special character (!@#$...)' },
  ]
  const pwValid = pwRules.every(r => r.ok)

  const validate = () => {
    const e = {}
    if (tab === 'signup' && !form.name.trim()) e.name = 'Name is required'
    if (method === 'email') {
      if (!form.email.trim()) e.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    } else {
      if (!form.phone.trim()) e.phone = 'Contact number is required'
      else if (!/^[0-9]{10,15}$/.test(form.phone.replace(/[\s\-()]/g, ''))) e.phone = 'Enter a valid contact number'
    }
    if (!form.password) e.password = 'Password is required'
    else if (!pwValid) e.password = 'Password does not meet all requirements'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev) => { ev.preventDefault(); if (validate()) { /* UI only for now */ } }

  const perks = [
    { icon: Globe, text: 'Real-time translation across 20+ languages' },
    { icon: Zap, text: 'Sub-second latency with edge AI' },
    { icon: Sparkles, text: 'End-to-end encrypted, zero data stored' },
  ]

  return (
    <div className="auth-root">

      {/* ambient glow blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      {/* top navbar */}
      <nav className="auth-nav">
        <button onClick={onBack} className="auth-nav-back">
          <ArrowLeft size={16} /> Back to Home
        </button>
        <div className="auth-nav-right">
          <span className="auth-nav-hint">
            {tab === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
            className="auth-nav-btn"
          >
            {tab === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </nav>

      <div className="auth-center">
        <div className="auth-card">

          {/* ── LEFT — brand showcase ── */}
          <div className="auth-left">
            <div className="auth-left-glow auth-left-glow-1" />
            <div className="auth-left-glow auth-left-glow-2" />

            <div className="auth-brand">
              <img src={logo} alt="logo" className="auth-brand-logo" />
              <span className="auth-brand-title">
                Voice <span className="auth-brand-accent">Converter</span>
              </span>
            </div>

            <div className="auth-hero">
              <h2 className="auth-hero-title">
                Break language<br />
                <span className="auth-hero-accent">barriers instantly.</span>
              </h2>
              <p className="auth-hero-sub">
                Join thousands communicating naturally across languages — on every call, in real time.
              </p>

              <ul className="auth-perks">
                {perks.map((p, i) => (
                  <li key={i} className="auth-perk">
                    <span className="auth-perk-icon">
                      <p.icon size={16} />
                    </span>
                    {p.text}
                  </li>
                ))}
              </ul>
            </div>

            <p className="auth-copy">© 2025 Voice Converter. All rights reserved.</p>
          </div>

          {/* ── RIGHT — form ── */}
          <div className="auth-right">

            {/* mobile logo */}
            <div className="auth-mobile-logo">
              <img src={logo} alt="logo" />
              <span className="auth-mobile-title">
                Voice <span className="auth-brand-accent">Converter</span>
              </span>
            </div>

            <h3 className="auth-title">
              {tab === 'login' ? 'Welcome back 👋' : 'Create your account'}
            </h3>
            <p className="auth-sub">
              {tab === 'login'
                ? 'Sign in to continue your conversations.'
                : 'Start translating your voice in seconds.'}
            </p>

            {/* tab switcher */}
            <div className="auth-tabs">
              {['login', 'signup'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`auth-tab ${tab === t ? 'active' : ''}`}
                >
                  {t === 'login' ? 'Login' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* google */}
            <button className="auth-google">
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continue with Google
            </button>

            <div className="auth-divider">
              <span className="auth-divider-line" />
              <span className="auth-divider-text">or</span>
              <span className="auth-divider-line" />
            </div>

            {/* form */}
            <form onSubmit={submit} className="auth-form" noValidate>
              {tab === 'signup' && (
                <div className="auth-field-block">
                  <Field icon={User} type="text" autoComplete="off" placeholder="Full Name" value={form.name} onChange={set('name')} error={errors.name} />
                  {errors.name && <span className="auth-error">{errors.name}</span>}
                </div>
              )}

              {/* method toggle — Email / Contact */}
              <div className="auth-method">
                {[
                  { key: 'email', icon: Mail, label: 'Email' },
                  { key: 'phone', icon: Phone, label: 'Contact' },
                ].map(m => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMethod(m.key)}
                    className={`auth-method-btn ${method === m.key ? 'active' : ''}`}
                  >
                    <m.icon size={15} /> {m.label}
                  </button>
                ))}
              </div>

              {method === 'email' ? (
                <div className="auth-field-block">
                  <Field icon={Mail} type="email" autoComplete="off" placeholder="Email Address" value={form.email} onChange={set('email')} error={errors.email} />
                  {errors.email && <span className="auth-error">{errors.email}</span>}
                </div>
              ) : (
                <div className="auth-field-block">
                  <Field icon={Phone} type="tel" autoComplete="off" placeholder="Contact Number" value={form.phone} onChange={set('phone')} error={errors.phone} />
                  {errors.phone && <span className="auth-error">{errors.phone}</span>}
                </div>
              )}

              <div className="auth-field-block">
                <div className="auth-pass-wrap">
                  <Field icon={Lock} type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={set('password')} error={errors.password} />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="auth-pass-toggle"
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <span className="auth-error">{errors.password}</span>}

                {/* live password requirements */}
                <ul className="pw-rules">
                  {pwRules.map((r, i) => (
                    <li key={i} className={r.ok ? 'ok' : ''}>
                      <span className="pw-tick">{r.ok ? <Check size={12} /> : <span className="pw-dot" />}</span>
                      {r.label}
                    </li>
                  ))}
                </ul>
              </div>

              {tab === 'login' ? (
                <div className="auth-row">
                  <label className="auth-check-label">
                    <input type="checkbox" className="auth-check" /> Remember me
                  </label>
                  <a href="#" className="auth-link">Forgot password?</a>
                </div>
              ) : (
                <label className="auth-terms">
                  <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="auth-check" />
                  <span>I agree to the <a href="#" className="auth-link">Terms</a> & <a href="#" className="auth-link">Privacy Policy</a></span>
                </label>
              )}

              <button type="submit" className="auth-submit">
                {tab === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={17} className="auth-submit-icon" />
              </button>
            </form>

            <p className="auth-switch">
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => setTab(tab === 'login' ? 'signup' : 'login')} className="auth-switch-btn">
                {tab === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── reusable input field ── */
function Field({ icon: Icon, error, ...props }) {
  return (
    <div className="auth-field">
      <Icon size={16} className="auth-field-icon" />
      <input {...props} className={`auth-input ${error ? 'error' : ''}`} />
    </div>
  )
}

