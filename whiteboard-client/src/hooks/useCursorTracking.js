import { useEffect, useCallback, useRef } from 'react'
import { usePresenceStore } from '../store/presenceStore'
import { throttle } from 'lodash'

export function useCursorTracking(socket, isConnected) {
  const updateCursor = usePresenceStore((state) => state.updateCursor)
  const lastEmitTime = useRef(0)

  // Throttled cursor emit function
  const emitCursorPosition = useCallback(
    throttle((x, y) => {
      if (socket && isConnected) {
        socket.emit('cursor_move', { x, y })
      }
    }, 50), // Throttle to 20 updates per second
    [socket, isConnected]
  )

  useEffect(() => {
    if (!socket || !isConnected) return

    // Listen for cursor updates from others
    const handleCursorUpdate = ({ userId, x, y }) => {
      updateCursor(userId, { x, y })
    }

    socket.on('cursor_updated', handleCursorUpdate)

    return () => {
      socket.off('cursor_updated', handleCursorUpdate)
    }
  }, [socket, isConnected, updateCursor])

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Get position relative to the canvas
      const x = e.clientX
      const y = e.clientY - 60 // Subtract header height

      // Emit to server (throttled)
      emitCursorPosition(x, y)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [emitCursorPosition])

  return { emitCursorPosition }
}