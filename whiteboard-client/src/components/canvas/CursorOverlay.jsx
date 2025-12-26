import { usePresenceStore } from '../../store/presenceStore'

export default function CursorOverlay({ socket }) {
  const cursors = usePresenceStore((state) => state.cursors)
  const users = usePresenceStore((state) => state.users)

  // Filter out own cursor
  const otherCursors = Object.entries(cursors).filter(
    ([userId]) => userId !== socket?.id
  )

  if (otherCursors.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {otherCursors.map(([userId, position]) => {
        const user = users.find((u) => u.id === userId)
        if (!user || !position) return null

        return (
          <Cursor
            key={userId}
            x={position.x}
            y={position.y}
            color={user.color}
            name={user.name}
          />
        )
      })}
    </div>
  )
}

function Cursor({ x, y, color, name }) {
  return (
    <div
      className="absolute transition-transform duration-100 ease-out"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-2px, -2px)',
      }}
    >
      {/* Cursor Arrow */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
      >
        <path
          d="M5.65376 12.3673L8.3748 17.6808C8.72886 18.3724 9.69264 18.4946 10.2037 17.9141L11.4501 16.5279C11.6909 16.2607 12.0444 16.1218 12.4103 16.1529L15.1678 16.3752C15.9621 16.4395 16.5197 15.6289 16.1429 14.9284L13.4214 9.61468C13.0685 8.95737 12.1262 8.82251 11.6069 9.38814L6.28632 15.1349C5.75155 15.7183 5.28723 11.6426 5.65376 12.3673Z"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* User Name Label */}
      <div
        className="absolute top-5 left-5 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap pointer-events-none"
        style={{
          backgroundColor: color,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {name}
      </div>
    </div>
  )
}