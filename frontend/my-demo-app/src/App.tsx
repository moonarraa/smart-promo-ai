import { useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! Ask me anything about the business dashboard.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { sender: 'user', text: input }
    setMessages((msgs) => [...msgs, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      const data = await res.json()
      setMessages((msgs) => [...msgs, { sender: 'ai', text: data.answer }])
    } catch (e) {
      setMessages((msgs) => [...msgs, { sender: 'ai', text: 'Sorry, there was an error.' }])
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#222' }}>
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 32 }}>
        <h2 style={{ textAlign: 'center', color: 'white' }}>Business Dashboard</h2>
        <div style={{ background: 'white', borderRadius: 8, boxShadow: '0 2px 8px #0002' }}>
          <iframe
            title="Power BI Report"
            width="900"
            height="600"
            src="https://app.powerbi.com/reportEmbed?reportId=623acb3e-2d34-4719-8852-fb75eba3bd34&autoAuth=true&ctid=e763b98e-4b7c-41f7-9105-0ab753568526"
            frameBorder="0"
            allowFullScreen={true}
            style={{ background: 'white', borderRadius: '8px' }}
          />
        </div>
      </div>
      <div style={{ flex: 1, background: '#181818', color: 'white', display: 'flex', flexDirection: 'column', padding: 24, minWidth: 350 }}>
        <h3 style={{ textAlign: 'center' }}>AI Chat Assistant</h3>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16, background: '#222', borderRadius: 8, padding: 12, border: '1px solid #333' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ margin: '8px 0', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
              <span style={{ background: msg.sender === 'user' ? '#4e8cff' : '#444', color: 'white', padding: '8px 12px', borderRadius: 16, display: 'inline-block', maxWidth: '90%' }}>
                {msg.text}
              </span>
            </div>
          ))}
          {loading && <div style={{ color: '#aaa', fontStyle: 'italic' }}>AI is typing...</div>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the dashboard..."
            style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #444', background: '#111', color: 'white' }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ padding: '10px 18px', borderRadius: 8, background: '#4e8cff', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
