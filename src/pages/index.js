import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [room, setRoom] = useState("")
  const [name, setName] = useState("")

  const createRoom = () => {
    if (!name.trim()) {
      alert("Name is required!")
      return
    }
    const newRoomId = Math.random().toString(36).substr(2, 6)
    localStorage.setItem("chat_name", name.trim())
    router.push(`/room/${newRoomId}`)
  }

  const joinRoom = e => {
    e.preventDefault()
    if (!name.trim()) {
      alert("Name is required!")
      return
    }
    if (!room.trim()) {
      alert("Room ID is required!")
      return
    }
    localStorage.setItem("chat_name", name.trim())
    router.push(`/room/${room}`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg,#a1c4fd,#c2e9fb)'
    }}>
      <div style={{
        padding: 40,
        borderRadius: 16,
        background: 'white',
        boxShadow: '0 2px 20px rgba(0,0,0,0.10)',
        textAlign: 'center',
        minWidth: 350,
      }}>
        <h1 style={{marginBottom: 32, fontSize: 32}}>💬 Chat + Call App</h1>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter Your Name"
          style={{
            padding: 10,
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #c2e9fb',
            width: 220,
            marginBottom: 16
          }}
        />
        <button
          onClick={createRoom}
          style={{
            padding: '12px 28px',
            fontSize: 18,
            borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(90deg,#4f8cfb,#2355dd)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 24,
            marginLeft: 10
          }}>
          + Create New Room
        </button>
        <form onSubmit={joinRoom} style={{marginTop: 16}}>
          <input
            value={room}
            onChange={e => setRoom(e.target.value)}
            placeholder="Enter Room ID"
            style={{
              padding: 10,
              fontSize: 16,
              borderRadius: 8,
              border: '1px solid #c2e9fb',
              width: 160,
              marginRight: 12
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              fontSize: 16,
              borderRadius: 8,
              border: 'none',
              background: '#4f8cfb',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
            Join Room
          </button>
        </form>
      </div>
    </div>
  )
}
