export default function Controls({ onMute, onEnd }) {
    return (
      <div style={{ margin: "10px 0" }}>
        <button onClick={onMute}>Mute</button>
        <button onClick={onEnd} style={{ color: 'red' }}>End</button>
      </div>
    )
  }
  