import { rooms } from './roomHandlers.js'

export function handleShapeEvents(io, socket) {
  socket.on('draw_shape', (shape) => {
    const roomId = socket.data.roomId
    if (!roomId) {
      console.warn(`No room ID for socket ${socket.id}`)
      return
    }

    const room = rooms.get(roomId)
    if (!room) {
      console.warn(`Room not found: ${roomId}`)
      return
    }

    // Add timestamp and user info
    const enrichedShape = {
      ...shape,
      userId: socket.id,
      timestamp: new Date().toISOString(),
    }

    // Add shape to room's state
    room.shapes.push(enrichedShape)

    // Broadcast to all users in the room (including sender for confirmation)
    io.to(roomId).emit('shape_created', enrichedShape)

    console.log(`Shape created in ${roomId}: ${shape.type} (${shape.id})`)
  })

  socket.on('update_shape', (shape) => {
    const roomId = socket.data.roomId
    if (!roomId) return

    const room = rooms.get(roomId)
    if (!room) return

    // Update shape in room's state
    const index = room.shapes.findIndex(s => s.id === shape.id)
    if (index !== -1) {
      room.shapes[index] = {
        ...shape,
        updatedAt: new Date().toISOString(),
      }
      
      // Broadcast update
      io.to(roomId).emit('shape_updated', room.shapes[index])
      console.log(`Shape updated in ${roomId}: ${shape.id}`)
    }
  })

  socket.on('delete_shape', (shapeId) => {
    const roomId = socket.data.roomId
    if (!roomId) return

    const room = rooms.get(roomId)
    if (!room) return

    // Remove shape from room's state
    const initialLength = room.shapes.length
    room.shapes = room.shapes.filter(s => s.id !== shapeId)

    if (room.shapes.length < initialLength) {
      // Broadcast deletion
      io.to(roomId).emit('shape_deleted', shapeId)
      console.log(`Shape deleted in ${roomId}: ${shapeId}`)
    }
  })

  socket.on('clear_board', () => {
    const roomId = socket.data.roomId
    if (!roomId) return

    const room = rooms.get(roomId)
    if (!room) return

    // Clear all shapes
    room.shapes = []

    // Broadcast clear action
    io.to(roomId).emit('board_cleared')
    console.log(`Board cleared in ${roomId}`)
  })
}