import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import logo from '../../services/pictures/Logo_App.png.jpg'
import '../../css/AuthCard.css'
import '../../css/AuthModal.css'
import Login from './Login'
import SignUp from './SignUp'

export default function AuthModal({ onBack, onAuthed, defaultTab = 'signup' }) {
  const [view, setView] = useState(defaultTab === 'login' ? 'signin' : 'signup')
  const [success, setSuccess] = useState(false)

  // close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !success) onBack && onBack() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onBack, success])

  // mock success flow: checkmark animation, then go to Home2 (or fall back)
  const handleAuthed = () => {
    setSuccess(true)
    setTimeout(() => { setSuccess(false); (onAuthed || onBack) && (onAuthed || onBack)() }, 1900)
  }

  const indicatorStyle = {
    width: 'calc(50% - 4px)',
    transform: view === 'signin' ? 'translateX(0)' : 'translateX(100%)',
  }

  return (
    <div className="auth-modal-root">
      {/* floating background glow orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      {/* top navbar — Back to Home (left) + Login/Sign Up toggle (right) */}
      <nav className="auth-nav">
        <button onClick={onBack} className="auth-nav-back">
          <ArrowLeft size={16} /> Back to Home
        </button>
        <button onClick={() => setView(view === 'signin' ? 'signup' : 'signin')} className="auth-nav-toggle">
          {view === 'signin' ? 'Sign Up' : 'Login'}
        </button>
      </nav>

      {/* centered card */}
      <div className="auth-modal-body">
        <div className="auth-card-in authm-card">
        {/* brand */}
        <div className="authm-brand">
          <img src={logo} alt="Voice Converter" className="authm-brand-logo" />
          <span className="authm-brand-title">
            Voice <span className="authm-brand-accent">Converter</span>
          </span>
        </div>

        <h1 className="authm-title">
          {view === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="authm-sub">
          {view === 'signin'
            ? 'Sign in to continue your conversations.'
            : 'Start translating your voice in seconds.'}
        </p>

        {/* sliding tab switcher */}
        <div className="authm-tabs">
          <span className="authm-tab-indicator" style={indicatorStyle} />
          <button onClick={() => setView('signin')}
            className={`authm-tab ${view === 'signin' ? 'is-active' : ''}`}>
            Sign In
          </button>
          <button onClick={() => setView('signup')}
            className={`authm-tab ${view === 'signup' ? 'is-active' : ''}`}>
            Create Account
          </button>
        </div>

        {/* view */}
        <div className="authm-body">
          {view === 'signin'
            ? <Login onAuthed={handleAuthed} />
            : <SignUp onAuthed={handleAuthed} />}
        </div>
      </div>

      </div>

      {/* success overlay */}
      {success && (
        <div className="auth-success">
          <div className="auth-success-box authm-success-box">
            <svg width="96" height="96" viewBox="0 0 52 52">
              <circle className="auth-check-circle" cx="26" cy="26" r="24" fill="none" stroke="#22c55e" strokeWidth="2" />
              <path className="auth-check-mark" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" d="M14 27l8 8 16-16" />
            </svg>
            <p className="authm-success-title">{view === 'signin' ? 'Signed in!' : 'Account created!'}</p>
            <p className="authm-success-text">Redirecting you now…</p>
          </div>
        </div>
      )}
    </div>
  )
}
