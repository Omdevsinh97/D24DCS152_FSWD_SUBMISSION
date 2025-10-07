import { useEffect, useMemo, useState } from 'react'

// LocalStorage keys
const LS_USERS = 'sm_users'
const LS_CURRENT_USER = 'sm_currentUserId'
const LS_MESSAGES = 'sm_messages'

// Helpers
const newId = () => Math.random().toString(36).slice(2) + Date.now().toString(36)
const chatIdFor = (a, b) => {
  if (!a || !b) return null
  return [a, b].sort().join('::')
}
const now = () => new Date().toISOString()

// Initial demo data on first load
const ensureSeedData = () => {
  const usersRaw = localStorage.getItem(LS_USERS)
  if (!usersRaw) {
    const alice = { id: newId(), username: 'alice', password: 'alice', avatarColor: '#6C5CE7' }
    const bob = { id: newId(), username: 'bob', password: 'bob', avatarColor: '#00B894' }
    const charlie = { id: newId(), username: 'charlie', password: 'charlie', avatarColor: '#FD79A8' }
    const users = [alice, bob, charlie]
    localStorage.setItem(LS_USERS, JSON.stringify(users))

    const messages = {}
    const ab = chatIdFor(alice.id, bob.id)
    messages[ab] = [
      { id: newId(), from: alice.id, to: bob.id, text: 'Hi Bob! Ready for the project?', timestamp: now() },
      { id: newId(), from: bob.id, to: alice.id, text: 'Hey Alice, yes! Let\'s sync at 5pm.', timestamp: now() },
    ]
    const ac = chatIdFor(alice.id, charlie.id)
    messages[ac] = [
      { id: newId(), from: charlie.id, to: alice.id, text: 'Lunch tomorrow?', timestamp: now() },
    ]
    localStorage.setItem(LS_MESSAGES, JSON.stringify(messages))
  }
}

// Storage API
const loadUsers = () => JSON.parse(localStorage.getItem(LS_USERS) || '[]')
const saveUsers = (u) => localStorage.setItem(LS_USERS, JSON.stringify(u))
const loadCurrentUserId = () => localStorage.getItem(LS_CURRENT_USER)
const saveCurrentUserId = (id) => localStorage.setItem(LS_CURRENT_USER, id || '')
const loadMessages = () => JSON.parse(localStorage.getItem(LS_MESSAGES) || '{}')
const saveMessages = (m) => localStorage.setItem(LS_MESSAGES, JSON.stringify(m))

function Avatar({ name, color, size = 36 }) {
  const initials = (name || '?').slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: color || '#999',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: size * 0.38,
      flex: '0 0 auto',
      boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.12)'
    }}>{initials}</div>
  )
}

function usePersistentState() {
  const [users, setUsers] = useState([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [messages, setMessages] = useState({})

  useEffect(() => {
    ensureSeedData()
    setUsers(loadUsers())
    setCurrentUserId(loadCurrentUserId() || '')
    setMessages(loadMessages())
  }, [])

  // Persist on change
  useEffect(() => {
    saveUsers(users)
  }, [users])
  useEffect(() => {
    saveCurrentUserId(currentUserId)
  }, [currentUserId])
  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  return { users, setUsers, currentUserId, setCurrentUserId, messages, setMessages }
}

function LoginSignup({ onLogin, onSignup }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const uname = username.trim().toLowerCase()
    if (!uname || !password) {
      setError('Enter username and password')
      return
    }
    if (mode === 'login') {
      const ok = onLogin(uname, password)
      if (!ok) setError('Invalid credentials')
    } else {
      const ok = onSignup(uname, password)
      if (!ok) setError('Username already exists')
    }
  }

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>{mode === 'login' ? 'Login' : 'Sign up'}</h2>
          <button style={styles.ghostBtn} onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Need an account?' : 'Have an account?'}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. alice" />
          </div>
          <div style={styles.inputGroup}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button style={styles.primaryBtn} type="submit">{mode === 'login' ? 'Login' : 'Create account'}</button>
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>Demo users: alice/alice, bob/bob, charlie/charlie</div>
        </form>
      </div>
    </div>
  )
}

function Sidebar({ users, currentUser, messages, selectedUserId, onSelectUser, onLogout }) {
  const otherUsers = useMemo(() => users.filter((u) => u.id !== currentUser?.id), [users, currentUser])

  const recent = useMemo(() => {
    // Build last-message per chat for current user
    const rows = []
    Object.keys(messages).forEach((cid) => {
      const arr = messages[cid]
      if (!arr || arr.length === 0) return
      const last = arr[arr.length - 1]
      // include only chats that involve currentUser
      if (last.from === currentUser.id || last.to === currentUser.id) {
        const otherId = last.from === currentUser.id ? last.to : last.from
        const other = users.find((u) => u.id === otherId)
        if (other) rows.push({ other, last })
      }
    })
    // Sort by latest timestamp desc
    rows.sort((a, b) => new Date(b.last.timestamp) - new Date(a.last.timestamp))
    return rows
  }, [messages, users, currentUser])

  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={currentUser.username} color={currentUser.avatarColor} size={36} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 700 }}>{currentUser.username}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Online</div>
          </div>
        </div>
        <button style={styles.secondaryBtn} onClick={onLogout}>Logout</button>
      </div>

      <div style={styles.sectionTitle}>Recent chats</div>
      <div style={styles.chatList}>
        {recent.length === 0 && (
          <div style={{ opacity: 0.65, fontSize: 14, padding: '8px 12px' }}>No recent chats</div>
        )}
        {recent.map(({ other, last }) => (
          <ChatRow key={other.id}
            user={other}
            lastMessage={last}
            active={selectedUserId === other.id}
            onClick={() => onSelectUser(other.id)}
          />
        ))}
      </div>

      <div style={styles.sectionTitle}>All users</div>
      <div style={styles.chatList}>
        {otherUsers.map((u) => (
          <ChatRow key={u.id}
            user={u}
            lastMessage={null}
            active={selectedUserId === u.id}
            onClick={() => onSelectUser(u.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ChatRow({ user, lastMessage, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      ...styles.chatRow,
      background: active ? 'rgba(80, 135, 255, 0.15)' : 'transparent',
      borderLeft: active ? '3px solid #5087FF' : '3px solid transparent'
    }}>
      <Avatar name={user.username} color={user.avatarColor} />
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontWeight: 600 }}>{user.username}</div>
          {lastMessage && (
            <div style={{ fontSize: 12, opacity: 0.6 }}>{formatTime(lastMessage.timestamp)}</div>
          )}
        </div>
        <div style={{ fontSize: 13, opacity: 0.75, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {lastMessage ? lastMessage.text : 'Start chatting'}
        </div>
      </div>
    </div>
  )
}

function ChatWindow({ currentUser, selectedUser, messages, onSend }) {
  if (!selectedUser) {
    return (
      <div style={styles.chatEmpty}>
        <div style={{ fontSize: 18, opacity: 0.75 }}>Select a chat to start messaging</div>
      </div>
    )
  }

  const chatId = chatIdFor(currentUser.id, selectedUser.id)
  const msgs = messages[chatId] || []

  return (
    <div style={styles.chatArea}>
      <div style={styles.chatHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={selectedUser.username} color={selectedUser.avatarColor} size={40} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedUser.username}</div>
            <div style={{ fontSize: 12, opacity: 0.65 }}>Last seen {msgs.length ? formatRelative(msgs[msgs.length - 1].timestamp) : 'recently'}</div>
          </div>
        </div>
      </div>

      <div style={styles.messages}>
        {msgs.map((m) => {
          const mine = m.from === currentUser.id
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
              <div style={{
                ...styles.bubble,
                background: mine ? '#5087FF' : '#2D2F33',
                color: 'white',
                borderTopLeftRadius: mine ? 12 : 4,
                borderTopRightRadius: mine ? 4 : 12,
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4, textAlign: 'right' }}>{formatTime(m.timestamp)}</div>
              </div>
            </div>
          )
        })}
      </div>

      <MessageInput onSend={onSend} disabled={!selectedUser} />
    </div>
  )
}

function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const handleSend = () => {
    const t = text.trim()
    if (!t) return
    onSend(t)
    setText('')
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  return (
    <div style={styles.inputBar}>
      <textarea
        style={styles.textarea}
        placeholder={disabled ? 'Select a user to chat' : 'Type a message'}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
      />
      <button style={styles.primaryBtn} disabled={disabled || !text.trim()} onClick={handleSend}>Send</button>
    </div>
  )
}

function App() {
  const { users, setUsers, currentUserId, setCurrentUserId, messages, setMessages } = usePersistentState()
  const [selectedUserId, setSelectedUserId] = useState('')

  const currentUser = useMemo(() => users.find((u) => u.id === currentUserId) || null, [users, currentUserId])
  const selectedUser = useMemo(() => users.find((u) => u.id === selectedUserId) || null, [users, selectedUserId])

  useEffect(() => {
    // Auto-select most recent chat when logging in
    if (currentUser && !selectedUserId) {
      // pick most recent chat partner if exists, otherwise first other user
      const partner = getMostRecentChatPartner(currentUser, users, messages) || users.find((u) => u.id !== currentUser.id)
      if (partner) setSelectedUserId(partner.id)
    }
  }, [currentUser, selectedUserId, users, messages])

  const login = (username, password) => {
    const user = users.find((u) => u.username === username && u.password === password)
    if (!user) return false
    setCurrentUserId(user.id)
    return true
  }
  const signup = (username, password) => {
    if (users.some((u) => u.username === username)) return false
    const palette = ['#E17055', '#0984E3', '#6C5CE7', '#00B894', '#E84393', '#FDCB6E']
    const newUser = { id: newId(), username, password, avatarColor: palette[Math.floor(Math.random() * palette.length)] }
    setUsers([...users, newUser])
    setCurrentUserId(newUser.id)
    return true
  }
  const logout = () => {
    setCurrentUserId('')
    setSelectedUserId('')
  }

  const sendMessage = (text) => {
    if (!currentUser || !selectedUser) return
    const cid = chatIdFor(currentUser.id, selectedUser.id)
    const arr = messages[cid] ? [...messages[cid]] : []
    arr.push({ id: newId(), from: currentUser.id, to: selectedUser.id, text, timestamp: now() })
    setMessages({ ...messages, [cid]: arr })
  }

  if (!currentUser) {
    return (
      <div style={styles.app}>
        <LoginSignup onLogin={login} onSignup={signup} />
      </div>
    )
  }

  return (
    <div style={styles.app}>
      <div style={styles.shell}>
        <Sidebar
          users={users}
          currentUser={currentUser}
          messages={messages}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
          onLogout={logout}
        />
        <ChatWindow
          currentUser={currentUser}
          selectedUser={selectedUser}
          messages={messages}
          onSend={sendMessage}
        />
      </div>
    </div>
  )
}

// Utils: formatting
function formatTime(ts) {
  try {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}
function formatRelative(ts) {
  const d = new Date(ts)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}
function getMostRecentChatPartner(currentUser, users, messages) {
  let best = null
  let bestTs = 0
  Object.keys(messages).forEach((cid) => {
    const arr = messages[cid]
    if (!arr || arr.length === 0) return
    const last = arr[arr.length - 1]
    if (last.from !== currentUser.id && last.to !== currentUser.id) return
    const otherId = last.from === currentUser.id ? last.to : last.from
    const other = users.find((u) => u.id === otherId)
    if (!other) return
    const t = new Date(last.timestamp).getTime()
    if (t > bestTs) {
      best = other
      bestTs = t
    }
  })
  return best
}

// Inline styles
const styles = {
  app: {
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(180deg, #0F1115 0%, #151821 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  shell: {
    width: 'min(1100px, 100vw)',
    height: 'min(800px, 100vh)',
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gridTemplateRows: '1fr',
    gap: 0,
    background: '#1C1F27',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  sectionTitle: {
    padding: '10px 12px',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  chatList: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    paddingBottom: 8,
    gap: 2,
  },
  chatRow: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr',
    gap: 10,
    alignItems: 'center',
    padding: '10px 12px',
    cursor: 'pointer',
  },
  chatArea: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    background: 'radial-gradient(1200px 600px at 20% -20%, rgba(80,135,255,0.12), rgba(0,0,0,0) 60%)',
  },
  bubble: {
    maxWidth: '62%',
    padding: '10px 12px',
    borderRadius: 12,
    lineHeight: 1.35,
  },
  inputBar: {
    display: 'flex',
    gap: 10,
    padding: 12,
    borderTop: '1px solid rgba(255,255,255,0.08)'
  },
  textarea: {
    flex: 1,
    resize: 'none',
    background: '#0F1115',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '10px 12px',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: 14,
  },
  primaryBtn: {
    background: '#5087FF',
    color: 'white',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 600,
  },
  secondaryBtn: {
    background: 'transparent',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.18)',
    padding: '6px 10px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  ghostBtn: {
    background: 'transparent',
    color: '#A1A6B3',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    textDecoration: 'underline',
  },
  authContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  authCard: {
    width: 360,
    background: '#1C1F27',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 12,
  },
  error: {
    background: 'rgba(255, 71, 87, 0.15)',
    border: '1px solid rgba(255, 71, 87, 0.35)',
    color: '#ff6b81',
    padding: '8px 10px',
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 13,
  },
  chatEmpty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#A1A6B3',
  }
}

export default App
