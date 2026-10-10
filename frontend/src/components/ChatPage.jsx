import { useState, useEffect, useRef } from 'react'
import {
  MessageSquare, Users, Mic, Square, Paperclip, Image as ImageIcon, FileText,
  Download, Play, Pause, Send, Plus, ArrowLeft, Languages, X, Check, UserPlus, Sparkles, Globe2,
} from 'lucide-react'
import '../css/ChatPage.css'

const CONTACTS = [
  { name: 'Aarav Sharma', lang: 'Urdu' },
  { name: 'Emma Wilson', lang: 'English' },
  { name: 'Diego Martín', lang: 'Spanish' },
  { name: 'Yuki Tanaka', lang: 'Japanese' },
  { name: 'Omar Ali', lang: 'Arabic' },
  { name: 'Sara Khan', lang: 'Urdu' },
]

const EMOJIS = ['🚀', '💬', '🔥', '🌍', '⭐', '🎧', '📚', '🎯']

const GROUPS_INIT = [
  {
    id: 1, name: 'Dev Team', emoji: '🚀', color: '#3B82F6', unread: 2,
    members: [
      { name: 'Aarav Sharma', lang: 'Urdu' },
      { name: 'Emma Wilson', lang: 'English' },
      { name: 'Diego Martín', lang: 'Spanish' },
    ],
  },
  {
    id: 2, name: 'Family', emoji: '🏠', color: '#8B5CF6', unread: 0,
    members: [
      { name: 'Sara Khan', lang: 'Urdu' },
      { name: 'Omar Ali', lang: 'Arabic' },
    ],
  },
]

const MESSAGES_INIT = [
  { id: 1, me: false, name: 'Aarav Sharma', lang: 'Urdu', original: 'سب ٹھیک ہے؟ میٹنگ کب شروع ہوگی؟', translated: 'Sab theek hai? Meeting kab shuru hogi?', time: '10:02 AM' },
  { id: 2, me: true, name: 'You', lang: 'Hindi', original: 'Sab badhiya! 2 baje shuru karte hain.', translated: 'All good! We start at 2 PM.', time: '10:04 AM' },
  { id: 3, me: false, name: 'Emma Wilson', lang: 'English', voice: true, secs: 12, transcript: 'Can you share the updated design file by today?', time: '10:06 AM' },
  { id: 4, me: false, name: 'Diego Martín', lang: 'Spanish', doc: { name: 'launch-plan-v2.pdf', size: '1.2 MB' }, time: '10:08 AM' },
]

const VOICE_NOTES = [
  'File abhi share kar raha hoon, check kar lo.',
  'Meeting notes bhej diye hain, dekh lena.',
  'Kal ki call 11 baje fix kar dete hain.',
]

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

/* ── Multilingual Group Chat — WhatsApp style (UI) ── */
export default function ChatPage({ onBack }) {
  const [stage, setStage] = useState('groups') // groups | create | chat
  const [groups, setGroups] = useState(GROUPS_INIT)
  const [activeGroup, setActiveGroup] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [showOriginal, setShowOriginal] = useState({})
  const [playingId, setPlayingId] = useState(null)
  const [recording, setRecording] = useState(false)
  const [recSecs, setRecSecs] = useState(0)
  const [voiceIdx, setVoiceIdx] = useState(0)
  const [attachment, setAttachment] = useState(null)
  const [membersPanel, setMembersPanel] = useState(false)
  const [addMember, setAddMember] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('🚀')
  const [newMembers, setNewMembers] = useState([])
  const fileRef = useRef(null)

  /* recording timer */
  useEffect(() => {
    if (!recording) return
    const t = setInterval(() => setRecSecs((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [recording])

  const openChat = (g) => {
    setActiveGroup(g)
    setMessages(g.isNew ? [] : MESSAGES_INIT)
    setDraft('')
    setAttachment(null)
    setMembersPanel(false)
    setShowOriginal({})
    setGroups((gs) => gs.map((x) => (x.id === g.id ? { ...x, unread: 0 } : x)))
    setStage('chat')
  }

  const createGroup = () => {
    if (!newName.trim()) return
    const g = {
      id: Date.now(),
      name: newName.trim(),
      emoji: newEmoji,
      color: '#3B82F6',
      unread: 0,
      isNew: true,
      members: newMembers.map((n) => ({ name: n, lang: CONTACTS.find((c) => c.name === n)?.lang || 'English' })),
    }
    setGroups((gs) => [g, ...gs])
    setNewName('')
    setNewEmoji('🚀')
    setNewMembers([])
    openChat(g)
  }

  const toggleMember = (name) =>
    setNewMembers((ms) => (ms.includes(name) ? ms.filter((x) => x !== name) : [...ms, name]))

  const stopRecording = () => {
    setMessages((ms) => [
      ...ms,
      { id: Date.now(), me: true, name: 'You', lang: 'Hindi', voice: true, secs: Math.max(1, recSecs), transcript: VOICE_NOTES[voiceIdx % VOICE_NOTES.length], time: now() },
    ])
    setVoiceIdx((v) => v + 1)
    setRecording(false)
    setRecSecs(0)
  }

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.type.startsWith('image/')) setAttachment({ kind: 'image', url: URL.createObjectURL(f), name: f.name })
    else setAttachment({ kind: 'doc', name: f.name, size: `${(f.size / 1024).toFixed(0)} KB` })
    e.target.value = ''
  }

  const send = () => {
    if (attachment) {
      setMessages((ms) => [
        ...ms,
        {
          id: Date.now(), me: true, name: 'You', lang: 'Hindi', time: now(),
          image: attachment.kind === 'image' ? attachment.url : undefined,
          doc: attachment.kind === 'doc' ? { name: attachment.name, size: attachment.size } : undefined,
        },
      ])
      setAttachment(null)
      return
    }
    sendText()
  }

  const removeMember = (name) => {
    setGroups((gs) => gs.map((g) => (g.id === activeGroup.id ? { ...g, members: g.members.filter((m) => m.name !== name) } : g)))
    setActiveGroup((g) => ({ ...g, members: g.members.filter((m) => m.name !== name) }))
  }

  const addMemberToGroup = () => {
    if (!addMember) return
    const c = CONTACTS.find((x) => x.name === addMember)
    setGroups((gs) => gs.map((g) => (g.id === activeGroup.id ? { ...g, members: [...g.members, c] } : g)))
    setActiveGroup((g) => ({ ...g, members: [...g.members, c] }))
    setAddMember('')
  }

  return (
    <div className="cg-root">
      <div className="cg-orb cg-orb-1" />
      <div className="cg-orb cg-orb-2" />

      {/* ── STAGE 1 — GROUP LIST ── */}
      {stage === 'groups' && (
        <div className="cg-wrap">
          <header className="cg-top">
            <button className="cg-back" onClick={onBack}><ArrowLeft size={16} /> Dashboard</button>
            <span className="cg-chip"><Sparkles size={13} /> AI Live Translation</span>
          </header>

          <div className="cg-head">
            <h1 className="cg-title">Multilingual <span>Group Chat</span></h1>
            <p className="cg-sub">
              Text aur voice notes ka group chat — jahan zabaan ki rukawat na ho. Har message sabki apni zabaan mein dikhega.
            </p>
          </div>

          <div className="cg-card">
            <h3 className="cg-card-title"><MessageSquare size={16} /> Your Groups</h3>
            <div className="cg-grouplist">
              {groups.map((g) => (
                <div key={g.id} className="cg-grouprow" onClick={() => openChat(g)}>
                  <div className="cg-gavatar" style={{ background: g.color }}>{g.emoji}</div>
                  <div className="cg-ginfo">
                    <span className="cg-gname">{g.name}</span>
                    <span className="cg-glast">{g.members.length + 1} members · multilingual chat</span>
                  </div>
                  <div className="cg-gmeta">
                    {g.unread > 0 && <span className="cg-gbadge">{g.unread}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="cg-start" onClick={() => setStage('create')}><Plus size={17} /> Create New Group</button>
        </div>
      )}

      {/* ── STAGE 2 — CREATE GROUP (avatar + members) ── */}
      {stage === 'create' && (
        <div className="cg-wrap cg-wrap-narrow">
          <header className="cg-top">
            <button className="cg-back" onClick={() => setStage('groups')}><ArrowLeft size={16} /> Groups</button>
          </header>

          <div className="cg-card">
            <h3 className="cg-card-title"><Users size={16} /> Create New Group</h3>

            <div className="cg-field">
              <label>Group name</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Project Team" />
            </div>

            <div className="cg-field">
              <label>Group avatar</label>
              <div className="cg-avatar-grid">
                {EMOJIS.map((e) => (
                  <button key={e} className={`cg-avatar-opt ${newEmoji === e ? 'on' : ''}`} onClick={() => setNewEmoji(e)}>{e}</button>
                ))}
              </div>
            </div>

            <div className="cg-field">
              <label>Add members</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {CONTACTS.map((c) => (
                  <label key={c.name} className={`cg-pickrow ${newMembers.includes(c.name) ? 'on' : ''}`}>
                    <input
                      type="checkbox"
                      checked={newMembers.includes(c.name)}
                      onChange={() => toggleMember(c.name)}
                    />
                    <span className="cg-pickname">{c.name}</span>
                    <span className="cg-picklang"><Languages size={11} /> {c.lang}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="cg-start" onClick={createGroup}><Check size={17} /> Create Group</button>
            <p className="cg-hint">Group avatar emoji + members select karo — baad mein bhi add/remove kar sakte ho.</p>
          </div>
        </div>
      )}

      {/* ── STAGE 3 — CHAT ── */}
      {stage === 'chat' && activeGroup && (
        <div className="cg-chat">
          <header className="cg-chat-head">
            <button className="cg-back" onClick={() => setStage('groups')}><ArrowLeft size={16} /></button>
            <div className="cg-gavatar" style={{ background: activeGroup.color }}>{activeGroup.emoji}</div>
            <div className="cg-chat-info">
              <span className="cg-gname">{activeGroup.name}</span>
              <button className="cg-members-btn" onClick={() => setMembersPanel((v) => !v)}>
                <Users size={12} /> {activeGroup.members.length + 1} members
              </button>
            </div>
            <span className="cg-chip"><Globe2 size={13} /> Auto-Translate ON</span>
          </header>

          {/* group management — members panel */}
          {membersPanel && (
            <div className="cg-card cg-members">
              <h3 className="cg-card-title"><UserPlus size={16} /> Group Members</h3>
              <div className="cg-mrow">
                <div className="cg-mavatar">A</div>
                <span className="cg-mname">You</span>
                <span className="cg-host-tag">HOST</span>
              </div>
              {activeGroup.members.map((m) => (
                <div key={m.name} className="cg-mrow">
                  <div className="cg-mavatar">{m.name.charAt(0)}</div>
                  <span className="cg-mname">{m.name}</span>
                  <span className="cg-mlang"><Languages size={11} /> {m.lang}</span>
                  <button className="cg-mremove" onClick={() => removeMember(m.name)} title="Remove"><X size={13} /></button>
                </div>
              ))}
              <div className="cg-madd">
                <select value={addMember} onChange={(e) => setAddMember(e.target.value)}>
                  <option value="">Add member...</option>
                  {CONTACTS.filter((c) => !activeGroup.members.some((m) => m.name === c.name)).map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
                <button className="cg-addbtn" onClick={addMemberToGroup}><Plus size={14} /> Add</button>
              </div>
            </div>
          )}

          <div className="cg-msgs">
            {messages.map((m) => (
              <div key={m.id} className={`cg-row ${m.me ? 'me' : ''}`}>
                <div className={`cg-bubble ${m.me ? 'me' : ''}`}>
                  <span className="cg-msg-name">{m.name} · {m.lang}</span>

                  {m.image && <img src={m.image} alt={m.name} className="cg-img" />}
                  {m.doc && (
                    <div className="cg-doc">
                      <FileText size={22} />
                      <div className="cg-doc-info">
                        <span className="cg-doc-name">{m.doc.name}</span>
                        <span className="cg-doc-size">{m.doc.size}</span>
                      </div>
                      <Download size={16} className="cg-doc-dl" />
                    </div>
                  )}
                  {m.voice && (
                    <>
                      <div className="cg-voice">
                        <button className="cg-play" onClick={() => setPlayingId(playingId === m.id ? null : m.id)}>
                          {playingId === m.id ? <Pause size={15} /> : <Play size={15} />}
                        </button>
                        <span className="cg-vsecs">0:{String(m.secs).padStart(2, '0')}</span>
                        <div className={`cg-vwave ${playingId === m.id ? 'playing' : ''}`}>
                          {[...Array(14)].map((_, i) => (
                            <span key={i} className="cg-vbar" style={{ animationDelay: `${i * 0.08}s` }} />
                          ))}
                        </div>
                      </div>
                      <p className="cg-transcript">📝 {m.transcript}</p>
                    </>
                  )}
                  {m.original !== undefined && (
                    <>
                      <p className="cg-msg-text">{showOriginal[m.id] ? m.original : (m.me ? m.original : m.translated)}</p>
                      {!m.me && (
                        <button className="cg-toggle" onClick={() => setShowOriginal((s) => ({ ...s, [m.id]: !s[m.id] }))}>
                          <Languages size={11} /> {showOriginal[m.id] ? 'Show Translated' : 'Show Original'}
                        </button>
                      )}
                      {m.me && <span className="cg-delivered"><Check size={11} /> Translated to all group languages</span>}
                    </>
                  )}
                  <span className="cg-time">{m.time}</span>
                </div>
              </div>
            ))}
          </div>

          {attachment && (
            <div className="cg-attach-chip">
              {attachment.kind === 'image' ? <ImageIcon size={14} /> : <FileText size={14} />}
              <span>{attachment.name}</span>
              <button onClick={() => setAttachment(null)}><X size={12} /></button>
            </div>
          )}

          <div className="cg-composer">
            <button className="cg-iconbtn" onClick={() => fileRef.current?.click()} title="Attach image / file"><Paperclip size={18} /></button>
            <input type="file" ref={fileRef} hidden onChange={onFile} />
            <input
              className="cg-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Message group (auto-translated)..."
            />
            <button className={`cg-iconbtn mic ${recording ? 'rec' : ''}`} onClick={recording ? stopRecording : () => setRecording(true)} title="Voice note">
              {recording ? <Square size={15} /> : <Mic size={18} />}
            </button>
            <button className="cg-iconbtn send" onClick={send} title="Send"><Send size={17} /></button>
          </div>
          {recording && (
            <p className="cg-rec-note">● Recording… {recSecs}s — dobara dabao bhejne ke liye (AI voice + transcript ke saath jayega)</p>
          )}
        </div>
      )}
    </div>
  )
}