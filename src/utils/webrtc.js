export function startWebRTC({
  socket,      // Now this is the real socket instance!
  roomId,
  localVideo,
  remoteVideo,
  camOn,
  micOn,
  setLocalStream,
}) {
  let pc
  // let localStream

  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      stream.getVideoTracks().forEach(track => (track.enabled = camOn))
      stream.getAudioTracks().forEach(track => (track.enabled = micOn))
      if (setLocalStream) setLocalStream(stream)

      localVideo.current.srcObject = stream
      // localStream = stream

      pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      })
      stream.getTracks().forEach(track => pc.addTrack(track, stream))

      pc.ontrack = event => {
        remoteVideo.current.srcObject = event.streams[0]
      }
      pc.onicecandidate = e => {
        if (e.candidate) socket.emit('webrtc-candidate', { roomId, candidate: e.candidate })
      }

      socket.on('webrtc-offer', async ({ offer }) => {
        await pc.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socket.emit('webrtc-answer', { roomId, answer })
      })

      socket.on('webrtc-answer', async ({ answer }) => {
        await pc.setRemoteDescription(new RTCSessionDescription(answer))
      })

      socket.on('webrtc-candidate', ({ candidate }) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate))
      })

      socket.on('ready-for-call', async () => {
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socket.emit('webrtc-offer', { roomId, offer })
      })

      socket.emit('ready-for-call', { roomId })
    })
    .catch(console.error)
}
