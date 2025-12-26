import { handleRoomEvents } from './roomHandlers.js'
import { handleShapeEvents } from './shapeHandlers.js'
import { handleCursorEvents } from './cursorHandlers.js'

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    // Register event handlers
    handleRoomEvents(io, socket)
    handleShapeEvents(io, socket)
    handleCursorEvents(io, socket)

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.id} (${reason})`)
      
      // Notify room members
      const rooms = Array.from(socket.rooms).filter(room => room !== socket.id)
      rooms.forEach(roomId => {
        socket.to(roomId).emit('user_left', socket.id)
      })
    })

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error)
    })
  })

  console.log('Socket.io event handlers registered')
}