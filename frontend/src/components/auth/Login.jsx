import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react'
import Field from './Field'
import SocialButtons from './SocialButtons'
import apiClient from '../../api/client'
import '../../css/Login.css'

export default function Login({ onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const validate = () => {
    const e = {}
    const fullEmail = email.includes('@') ? email.trim() : `${email.trim()}@gmail.com`
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fullEmail)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setFormError('')
    try {
      const fullEmail = email.includes('@') ? email.trim() : `${email.trim()}@gmail.com`
      const { data } = await apiClient.post('/api/auth/login', { email: fullEmail, password })
      localStorage.setItem('vc_token', data.token)
      localStorage.setItem('vc_user', JSON.stringify(data.user))
      setIsSubmitting(false)
      onAuthed && onAuthed(data.user)
    } catch (err) {
      setIsSubmitting(false)
      setFormError(err.response?.data?.error || 'Login failed. Please try again.')
    }
  }

  return (
    <form onSubmit={submit} className="auth-view auth-form" noValidate autoComplete="off">
      {/* decoy — absorbs browser email autofill so the real field stays empty */}
      <input type="email" tabIndex={-1} readOnly aria-hidden="true" autoComplete="username" className="auth-hidden" />
      <Field
        icon={Mail} type="text" name="email" autoComplete="off"
        placeholder="yourname"
        suffix="@gmail.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); setFormError('') }}
        error={errors.email}
      />

      <Field
        icon={Lock} type={showPass ? 'text' : 'password'} name="password" autoComplete="off"
        placeholder="Password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); setFormError('') }}
        error={errors.password}
        trailing={
          <button type="button" onClick={() => setShowPass(v => !v)} className="auth-pass-toggle">
            {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        }
      />

      <div className="auth-row">
        <label className="auth-check-label">
          <span className={`auth-checkbox ${remember ? 'checked' : ''}`}>
            <input type="checkbox" className="auth-sr-only" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            {remember && <Check size={12} className="auth-check-tick" />}
          </span>
          Remember me
        </label>
        <a href="#" className="auth-link">Forgot password?</a>
      </div>

      {formError && <p className="auth-form-error">{formError}</p>}

      <button type="submit" disabled={isSubmitting} className="auth-submit">
        {isSubmitting ? (
          <><Loader2 size={18} className="auth-spin" /> Signing in...</>
        ) : (
          <>Sign In <ArrowRight size={17} className="auth-submit-icon" /></>
        )}
      </button>

      <div className="auth-divider">
        <span className="auth-divider-line" />
        <span className="auth-divider-text">or continue with</span>
        <span className="auth-divider-line" />
      </div>

      <SocialButtons withApple />
    </form>
  )
}
