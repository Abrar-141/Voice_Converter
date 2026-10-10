/* Brand social-auth buttons with sleek glass styling */

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
)

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.36 12.78c.03 3.04 2.67 4.05 2.7 4.06-.02.07-.42 1.45-1.4 2.87-.84 1.22-1.72 2.44-3.1 2.46-1.36.03-1.8-.81-3.35-.81-1.56 0-2.03.78-3.32.84-1.33.05-2.34-1.31-3.19-2.53-1.84-2.66-3.24-7.52-1.35-10.8.93-1.63 2.6-2.66 4.41-2.69 1.32-.03 2.56.88 3.35.88.79 0 2.29-1.09 3.86-.93.66.03 2.52.24 3.72 1.97-.1.06-2.22 1.3-2.19 3.88M14.2 4.6c.7-.85 1.17-2.02 1.04-3.2-1.04.04-2.3.7-3.03 1.55-.66.76-1.23 1.97-1.08 3.13 1.16.09 2.36-.6 3.07-1.48"/></svg>
)

export default function SocialButtons({ withApple = true }) {
  const list = [{ name: 'Google', Icon: GoogleIcon }]
  if (withApple) list.push({ name: 'Apple', Icon: AppleIcon })

  const cols = list.length === 1 ? '' : withApple ? 'auth-social-3' : 'auth-social-2'

  return (
    <div className={`auth-social ${cols}`}>
      {list.map(({ name, Icon }) => (
        <button
          key={name}
          type="button"
          aria-label={`Continue with ${name}`}
          className="auth-social-btn"
        >
          <span className="auth-social-icon"><Icon /></span>
          <span className="auth-social-label">{name}</span>
        </button>
      ))}
    </div>
  )
}

