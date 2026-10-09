import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import apiClient from './api/client'

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000')

export default function App() {
  const [status, setStatus] = useState('Checking...')

  useEffect(() => {
    apiClient.get('/health')
      .then(() => setStatus('Connected to Backend: OK ✓'))
      .catch(() => setStatus('Backend connection failed ✗'))

    socket.on('connect', () => console.log('Socket connected:', socket.id))
    return () => socket.disconnect()
  }, [])

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Voice Converter — Frontend</h2>
      <p>{status}</p>
    </div>
  )
}
