import { v4 as uuidv4 } from 'uuid'

// In-memory storage for Phase 1 (will move to Redis/DB later)
const rooms = new Map()

export function handleRoomEvents(io, socket) {
  socket.on('join_room', ({ roomId, username }) => {
    console.log(`${username} (${socket.id}) joining room: ${roomId}`)

    // Create room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: new Map(),
        shapes: [],
        createdAt: new Date().toISOString(),
      })
      console.log(`Created new room: ${roomId}`)
    }

    const room = rooms.get(roomId)
    
    // Add user to room
    const userColor = generateUserColor()
    const user = {
      id: socket.id,
      name: username,
      color: userColor,
      joinedAt: new Date().toISOString(),
    }
    
    room.users.set(socket.id, user)
    socket.join(roomId)

    // Store room ID in socket data for easy access
    socket.data.roomId = roomId

    // Send current room state to the joining user
    socket.emit('room_joined', {
      roomId,
      shapes: room.shapes,
      users: Array.from(room.users.values())
    })

    // Notify others in the room
    socket.to(roomId).emit('user_joined', user)

    console.log(`${username} joined ${roomId}. Total users: ${room.users.size}`)
  })

  socket.on('leave_room', (roomId) => {
    handleLeaveRoom(socket, roomId)
  })

  // Handle disconnection cleanup
  socket.on('disconnecting', () => {
    const rooms = Array.from(socket.rooms).filter(room => room !== socket.id)
    rooms.forEach(roomId => {
      handleLeaveRoom(socket, roomId)
    })
  })
}

function handleLeaveRoom(socket, roomId) {
  const room = rooms.get(roomId)
  if (room) {
    const user = room.users.get(socket.id)
    room.users.delete(socket.id)
    socket.leave(roomId)
    socket.to(roomId).emit('user_left', socket.id)
    
    if (user) {
      console.log(`${user.name} left ${roomId}`)
    }
    
    // Clean up empty rooms
    if (room.users.size === 0) {
      rooms.delete(roomId)
      console.log(`Deleted empty room: ${roomId}`)
    }
  }
}

// Generate random color for user cursor
function generateUserColor() {
  const colors = [
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // emerald
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#14b8a6', // teal
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Export rooms for other handlers
export { rooms }