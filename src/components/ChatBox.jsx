import { useState, useEffect, useRef } from 'react'

function formatTime(ts) {
  const date = new Date(ts)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatBox({ socket, roomId }) {
  if (!socket) return null

  // Get the user's name from localStorage
  const name = (typeof window !== "undefined" && localStorage.getItem("chat_name")) || "Anon"

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const chatBody = useRef(null)

  useEffect(() => {
    if (!socket) return;
    const handleMsg = msg => setMessages(msgs => [...msgs, msg]);
    socket.on('chat-message', handleMsg);
    return () => socket.off('chat-message', handleMsg);
  }, [socket, roomId]);

  useEffect(() => {
    chatBody.current?.scrollTo({ top: chatBody.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = e => {
    e.preventDefault()
    if (!input) return
    if (!socket) return

    const msgObj = {
      text: input,
      self: true,
      name,         // ADD NAME
      ts: Date.now(),
    }
    const emitObj = { roomId, text: input, name, ts: msgObj.ts }
    socket.emit('chat-message', emitObj)
    setMessages(msgs => [...msgs, msgObj])
    setInput("")
  }

  return (
    <div className="chatbox-outer" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
      background: 'transparent',
      overflow: 'hidden'
    }}>
      <h3 style={{ color: "#4f8cfb", margin: "18px 0 10px 18px", fontSize: 15 }}>Chat</h3>
      <div
        ref={chatBody}
        className="chatbox-messages"
        style={{
          flex: 1,
          minHeight: 0,
          maxHeight: '100%',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: 10,
          border: '1.5px solid #e0e4ea',
          padding: 12,
          margin: "0 12px",
          display: 'flex',
          flexDirection: 'column',
          gap: 7
        }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.self ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end',
            gap: 7
          }}>
            {!msg.self && (
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: '#4f8cfb22',
                color: '#4f8cfb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 14,
                marginRight: 3
              }}>{msg.name ? msg.name[0].toUpperCase() : "U"}</div>
            )}
            <div style={{
              background: msg.self ? '#4f8cfb' : '#e6f0fa',
              color: msg.self ? '#fff' : '#222',
              padding: '8px 13px',
              borderRadius: 14,
              minWidth: 30,
              maxWidth: 340,
              wordBreak: 'break-word',
              fontSize: 15,
              position: 'relative'
            }}>
              {/* Display Name for Others */}
              {!msg.self && (
                <div style={{
                  fontSize: 13,
                  color: "#4f8cfb",
                  fontWeight: 600,
                  marginBottom: 3
                }}>{msg.name}</div>
              )}
              {msg.text}
              <div style={{
                fontSize: 11,
                color: msg.self ? "#f0f7ff" : "#666",
                marginTop: 2,
                textAlign: 'right',
                opacity: 0.8
              }}>{formatTime(msg.ts || Date.now())}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Send form always at bottom */}
      <form onSubmit={sendMessage} style={{
        display: 'flex',
        gap: 10,
        marginTop: 12,
        borderTop: '1.5px solid #e0e4ea',
        padding: "10px 18px 18px 18px",
        background: 'rgba(248,250,253,0.9)'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            fontSize: 15,
            borderRadius: 8,
            border: '1px solid #c2e9fb',
            background: '#fff'
          }}
          placeholder="Type a message..."
        />
        <button type="submit"
          style={{
            padding: '0 24px',
            borderRadius: 8,
            background: '#4f8cfb',
            color: '#fff',
            fontWeight: 600,
            border: 0,
            fontSize: 15,
            cursor: 'pointer'
          }}>
          Send
        </button>
      </form>
      {/* ...styles... */}
    </div>
  )
}
