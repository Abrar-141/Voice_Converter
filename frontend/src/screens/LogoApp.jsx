import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import apiClient from '../api/client'
import logo from '../services/pictures/Logo_App.png.jpg'
import '../css/LogoApp.css'
import HomeScreen from './HomeScreen'
import AuthModal from '../components/auth/AuthModal'
import Home2 from '../components/Home2'
import CallPage from '../components/CallPage'
import MeetingPage from '../components/MeetingPage'
import ChatPage from '../components/ChatPage'
import StudioPage from '../components/StudioPage'
import SettingsPage from '../components/SettingsPage'

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000')

export default function LogoApp() {
  const [page, setPage] = useState('logo')
  const [authTab, setAuthTab] = useState('signup')
  const [user, setUser] = useState(null)

  useEffect(() => {
    apiClient.get('/health').catch(() => {})
    socket.on('connect', () => console.log('Socket connected:', socket.id))
    return () => socket.disconnect()
  }, [])

  const openAuth = (tab) => { setAuthTab(tab); setPage('auth') }

  if (page === 'next') return <HomeScreen onSignIn={() => openAuth('login')} onSignUp={() => openAuth('signup')} />
  if (page === 'auth') return <AuthModal onBack={() => setPage('next')} onAuthed={(u) => { setUser(u); setPage('home2') }} defaultTab={authTab} />
  if (page === 'meeting') return <MeetingPage onBack={() => setPage('home2')} />
  if (page === 'settings') return <SettingsPage onBack={() => setPage('home2')} />
  if (page === 'studio') return <StudioPage onBack={() => setPage('home2')} />
  if (page === 'chat') return <ChatPage onBack={() => setPage('home2')} />
  if (page === 'call') return <CallPage onBack={() => setPage('home2')} />
  if (page === 'home2') return <Home2 user={user} onOpenCall={() => setPage('call')} onOpenMeeting={() => setPage('meeting')} onOpenChat={() => setPage('chat')} onOpenStudio={() => setPage('studio')} onOpenSettings={() => setPage('settings')} onLogout={() => { localStorage.removeItem('vc_token'); localStorage.removeItem('vc_user'); setUser(null); setPage('next') }} />

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
