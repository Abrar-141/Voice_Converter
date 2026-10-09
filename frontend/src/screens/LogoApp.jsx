import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import apiClient from '../api/client'
import logo from '../services/pictures/Logo_App.png.jpg'
import '../css/LogoApp.css'
import HomeScreen from './HomeScreen'

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000')

export default function LogoApp() {
  const [page, setPage] = useState('logo')

  useEffect(() => {
    apiClient.get('/health').catch(() => {})
    socket.on('connect', () => console.log('Socket connected:', socket.id))
    return () => socket.disconnect()
  }, [])

  if (page === 'next') return <HomeScreen />

  return (
    <div className="logo-page">

      <div className="logo-glow-wrapper" onClick={() => setPage('next')}>
        <div className="logo-glow" />
        <div className="logo-circle">
          <img src={logo} alt="Voice Converter Logo" />
        </div>
      </div>

      <div className="logo-text">
        <h1 className="logo-title">
          Voice<span> Converter</span>
        </h1>
        <p className="logo-subtitle">AI Voice Translation</p>
      </div>

    </div>
  )
}
