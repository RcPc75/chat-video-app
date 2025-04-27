import { useEffect, useRef, useState } from 'react'
import { startWebRTC } from '../utils/webrtc'

export default function VideoCall({ socket, roomId }) {
  const localVideo = useRef()
  const remoteVideo = useRef()
  const [camOn, setCamOn] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [localStream, setLocalStream] = useState(null)

  useEffect(() => {
    if (socket && roomId)
      startWebRTC({
        socket,
        roomId,
        localVideo,
        remoteVideo,
        camOn,
        micOn,
        setLocalStream,
      })
  }, [socket, roomId, camOn, micOn])

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
    }
    setCamOn(c => !c)
  }

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
    }
    setMicOn(m => !m)
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }}>
      {/* Room Title */}
      <h2 style={{
        fontWeight: 700,
        color: "#4f8cfb",
        marginBottom: 20,
        marginTop: 0
      }}>
        Room: <span style={{ color: "#333" }}>{roomId}</span>
      </h2>
      {/* Stacked videos */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        minHeight: 0
      }}>
        <video
          ref={localVideo}
          autoPlay
          playsInline
          muted
          style={{
            // width: '100%',
            maxWidth: '100%',
            height: '33vw',
            maxHeight: 300,
            borderRadius: 16,
            background: '#222',
            // minHeight: 140,
            // objectFit: 'cover',
            // boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
        <video
          ref={remoteVideo}
          autoPlay
          playsInline
          style={{
            // width: '100%',
            maxWidth: '100%',
            height: '33vw',
            maxHeight: 300,
            borderRadius: 16,
            background: '#222',
            // minHeight: 140,
            // objectFit: 'cover',
            // boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
      </div>
      {/* Buttons bar at bottom */}
      <div
        style={{
          // position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          // background: '#111',
          display: 'flex',
          justifyContent: 'center',
          gap: 18,
          padding: '18px 0',
          zIndex: 10,
        }}
      >
        <button onClick={toggleCamera}
          style={{
            padding: '10px 28px',
            borderRadius: 10,
            background: camOn ? '#ff6868' : '#e6f0fa',
            color: camOn ? '#fff' : '#4f8cfb',
            border: 0,
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer'
          }}>
          {camOn ? "Camera Off" : "Camera On"}
        </button>
        <button onClick={toggleMic}
          style={{
            padding: '10px 28px',
            borderRadius: 10,
            background: micOn ? '#4f8cfb' : '#eee',
            color: micOn ? '#fff' : '#4f8cfb',
            border: 0,
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer'
          }}>
          {micOn ? "Mic Off" : "Mic On"}
        </button>
      </div>
      {/* Responsive: force full width, stacked videos */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .video-area {
            width: 100vw !important;
            height: auto !important;
            min-height: 0 !important;
            padding-bottom: 0 !important;
          }
          .video-area video {
            // width: 100vw !important;
            max-width: 100vw !important;
            min-width: 0 !important;
            height: 38vw !important;
            max-height: 210px !important;
          }
        }
      `}</style>
    </div>
  )
}
