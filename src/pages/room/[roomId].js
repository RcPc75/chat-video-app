import { useRouter } from 'next/router'
import { useEffect } from 'react'
import ChatBox from '../../components/ChatBox'
import VideoCall from '../../components/VideoCall'
import useSocket from '../../hooks/useSocket'


export default function RoomPage() {
  const router = useRouter()
  const { roomId } = router.query
  const socket = useSocket(roomId)

  // NEW: Enforce name check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("chat_name");
      if (!name) router.replace("/");
    }
  }, [router]);

  if (!roomId) return <div>Loading...</div>

  return (
    <>
      <button
    onClick={() => {
      localStorage.removeItem("chat_name");
      router.replace("/");
    }}
    style={{
      position: 'absolute',
      top: 16,
      right: 24,
      zIndex: 1000,
      padding: '8px 20px',
      borderRadius: 8,
      border: 'none',
      background: '#e34d4d',
      color: '#fff',
      fontWeight: 600,
      fontSize: 15,
      cursor: 'pointer'
    }}
  >
    Logout
  </button>
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'row',
      background: 'linear-gradient(120deg,#c2e9fb,#e0c3fc)',
      padding: '10px',
      minHeight: '100vh',
      minWidth: '100vw'
    }}>
      <div className="video-area" style={{
        flex: 7,
        minWidth: 0,
        minHeight: 0,
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <VideoCall socket={socket} roomId={roomId} />
      </div>
      <div className="chat-area" style={{
        flex: 3,
        minWidth: 0,
        minHeight: 0,
        height: '100%',
        ...((typeof window !== 'undefined' && window.innerWidth < 900) && {
          height: '45vh',
          minHeight: 220,
          maxHeight: '60vh'
        }),
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(248,250,253,0.9)'
      }}>
        <ChatBox socket={socket} roomId={roomId} />
      </div>
      {/* Responsive styles as before */}
      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow: hidden !important;
          background: #e0c3fc;
        }
        @media (max-width: 900px) {
            html, body, #__next {
            overflow: auto !important;
          }
          div[style*="flex-direction: row"] {
            flex-direction: column !important;
          }
          .video-area, .chat-area {
            flex: none !important;
            width: 100vw !important;
            max-width: 100vw !important;
            min-width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
          }
          body, html {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
    </>
  )
}
