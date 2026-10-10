import { useMemo } from 'react'
import '../../css/PasswordStrength.css'

/* Real-time password strength meter: Weak / Medium / Strong with colored bar */
export default function PasswordStrength({ password }) {
  const { label, fill, text, width } = useMemo(() => {
    if (!password) return { label: '', fill: 'auth-pw-fill--empty', width: '0%', text: 'auth-pw-label-value' }
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    if (s <= 1) return { label: 'Weak', fill: 'auth-pw-fill--weak', width: '28%', text: 'auth-pw-label-value auth-pw-label-value--weak' }
    if (s === 2) return { label: 'Medium', fill: 'auth-pw-fill--medium', width: '60%', text: 'auth-pw-label-value auth-pw-label-value--medium' }
    if (s === 3) return { label: 'Good', fill: 'auth-pw-fill--good', width: '82%', text: 'auth-pw-label-value auth-pw-label-value--good' }
    return { label: 'Strong', fill: 'auth-pw-fill--strong', width: '100%', text: 'auth-pw-label-value auth-pw-label-value--strong' }
  }, [password])

  if (!password) return null

  return (
    <div className="auth-pw">
      <div className="auth-pw-track">
        <div className={`auth-pw-fill ${fill}`} style={{ width }} />
      </div>
      <p className="auth-pw-label">
        Strength: <span className={text}>{label}</span>
      </p>
    </div>
  )
}
