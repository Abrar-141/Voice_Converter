import { useEffect, useState } from 'react';
import apiClient from './api/client';

export default function App() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    apiClient.get('/health')
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'));
  }, []);

  const badge = {
    checking: { bg: '#f0ad4e', label: 'Checking...' },
    ok:       { bg: '#5cb85c', label: 'Backend: Connected ✓' },
    error:    { bg: '#d9534f', label: 'Backend: Unreachable ✗' },
  }[status];

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Voice Converter — Admin</h2>
      <span style={{ background: badge.bg, color: '#fff', padding: '6px 14px', borderRadius: 6 }}>
        {badge.label}
      </span>
    </div>
  );
}
