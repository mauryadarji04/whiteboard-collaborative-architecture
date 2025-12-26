export function handleCursorEvents(io, socket) {
  socket.on('cursor_move', ({ x, y }) => {
    const roomId = socket.data.roomId
    
    if (roomId) {
      // Broadcast cursor position to others in the room (not sender)
      socket.to(roomId).emit('cursor_updated', {
        userId: socket.id,
        x,
        y,
      })
    }
  })
}