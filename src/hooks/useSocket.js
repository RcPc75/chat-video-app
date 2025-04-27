// hooks/useSocket.js

import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

const useSocket = (roomId) => {
  const socketRef = useRef(null)
  const [ready, setReady] = useState(false) // track when socket is connected

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL)

    socketRef.current.on('connect', () => setReady(true)) // mark as ready when connected

    if (roomId) {
      socketRef.current.emit('join-room', roomId)
    }

    return () => {
      socketRef.current?.disconnect()
      setReady(false)
    }
  }, [roomId])

  // Only return the socket instance once it's ready
  return ready ? socketRef.current : null
}

export default useSocket
