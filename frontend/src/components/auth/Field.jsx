import { AlertCircle } from 'lucide-react'

/* Reusable input field with leading icon, optional trailing element, fixed suffix, and error message */
export default function Field({ icon: Icon, trailing, suffix, error, hint, ...props }) {
  const pad = suffix ? 'auth-input--suffix' : trailing ? 'auth-input--trailing' : ''
  return (
    <div>
      <div className="auth-field">
        {Icon && <Icon size={17} className="auth-field-icon" />}
        <input
          {...props}
          className={`auth-input ${Icon ? 'auth-input--icon' : ''} ${pad} ${error ? 'error' : ''}`}
        />
        {suffix && <span className="auth-input-suffix">{suffix}</span>}
        {trailing && <div className="auth-field-trailing">{trailing}</div>}
      </div>
      {error && (
        <p className="auth-error">
          <AlertCircle size={12} /> {error}
        </p>
      )}
      {hint && !error && <p className="auth-hint">{hint}</p>}
    </div>
  )
}
