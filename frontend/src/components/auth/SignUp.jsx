import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react'
import Field from './Field'
import SocialButtons from './SocialButtons'
import PasswordStrength from './PasswordStrength'
import apiClient from '../../api/client'
import '../../css/SignUp.css'

export default function SignUp({ onAuthed }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [agree, setAgree] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const set = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }))
    setErrors(p => ({ ...p, [k]: '' }))
    setFormError('')
  }

  const validate = () => {
    const e = {}
    const fullEmail = form.email.includes('@') ? form.email.trim() : `${form.email.trim()}@gmail.com`
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fullEmail)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (!form.confirm) e.confirm = 'Please confirm your password'
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    if (!agree) e.agree = 'You must accept the terms to continue'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setFormError('')
    try {
      const fullEmail = form.email.includes('@') ? form.email.trim() : `${form.email.trim()}@gmail.com`
      const { data } = await apiClient.post('/api/auth/signup', { name: form.name, email: fullEmail, password: form.password })
      localStorage.setItem('vc_token', data.token)
      localStorage.setItem('vc_user', JSON.stringify(data.user))
      setIsSubmitting(false)
      onAuthed && onAuthed(data.user)
    } catch (err) {
      setIsSubmitting(false)
      setFormError(err.response?.data?.error || 'Sign up failed. Please try again.')
    }
  }

  const eyeBtn = (
    <button type="button" onClick={() => setShowPass(v => !v)} className="auth-pass-toggle">
      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  )

  return (
    <form onSubmit={submit} className="auth-view auth-signup-form" noValidate autoComplete="off">
      {/* decoy — absorbs browser email autofill so the real field stays empty */}
      <input type="email" tabIndex={-1} readOnly aria-hidden="true" autoComplete="username" className="auth-hidden" />
      <Field icon={User} type="text" name="name" autoComplete="off" placeholder="Full name"
        value={form.name} onChange={set('name')} error={errors.name} />

      <Field icon={Mail} type="text" name="email" autoComplete="off" placeholder="yourname"
        suffix="@gmail.com"
        value={form.email} onChange={set('email')} error={errors.email} />

      <div>
        <Field icon={Lock} type={showPass ? 'text' : 'password'} name="new-password" autoComplete="off" placeholder="Password"
          value={form.password} onChange={set('password')} error={errors.password} trailing={eyeBtn} />
        <PasswordStrength password={form.password} />
      </div>

      <Field icon={Lock} type={showPass ? 'text' : 'password'} name="confirm-password" autoComplete="off" placeholder="Confirm password"
        value={form.confirm} onChange={set('confirm')} error={errors.confirm} />

      <div>
        <label className="auth-terms-label">
          <span className={`auth-checkbox auth-checkbox--terms ${agree ? 'checked' : ''}`}>
            <input type="checkbox" className="auth-sr-only" checked={agree}
              onChange={(e) => { setAgree(e.target.checked); setErrors(p => ({ ...p, agree: '' })) }} />
            {agree && <Check size={12} className="auth-check-tick" />}
          </span>
          <span>
            I agree to the <a href="#" className="auth-link">Terms of Service</a> &amp;{' '}
            <a href="#" className="auth-link">Privacy Policy</a>
          </span>
        </label>
        {errors.agree && <p className="auth-terms-error">{errors.agree}</p>}
      </div>

      {formError && (
        <p className="auth-form-error">{formError}</p>
      )}

      <button type="submit" disabled={isSubmitting} className="auth-submit">
        {isSubmitting ? (
          <><Loader2 size={18} className="auth-spin" /> Creating account...</>
        ) : (
          <>Get Started Free <ArrowRight size={17} className="auth-submit-icon" /></>
        )}
      </button>

      <div className="auth-divider">
        <span className="auth-divider-line" />
        <span className="auth-divider-text">or sign up with</span>
        <span className="auth-divider-line" />
      </div>

      <SocialButtons />
    </form>
  )
}
