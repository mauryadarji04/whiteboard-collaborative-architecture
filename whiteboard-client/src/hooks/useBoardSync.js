import { useEffect, useRef } from 'react'
import { useBoardStore } from '../store/boardStore'
import { usePresenceStore } from '../store/presenceStore'
import { useHistoryStore } from '../store/historyStore'

export function useBoardSync(socket, roomId) {
  const shapes = useBoardStore((state) => state.shapes)
  const setShapes = useBoardStore((state) => state.setShapes)
  const addShape = useBoardStore((state) => state.addShape)
  const updateShape = useBoardStore((state) => state.updateShape)
  const deleteShape = useBoardStore((state) => state.deleteShape)
  const clearShapes = useBoardStore((state) => state.clearShapes)

  const setUsers = usePresenceStore((state) => state.setUsers)
  const addUser = usePresenceStore((state) => state.addUser)
  const removeUser = usePresenceStore((state) => state.removeUser)

  const saveState = useHistoryStore((state) => state.saveState)
  const isUndoRedoAction = useHistoryStore((state) => state.isUndoRedoAction)
  
  const isRemoteUpdate = useRef(false)
  const saveTimeoutRef = useRef(null)

  // Save to history when shapes change (with debouncing)
  useEffect(() => {
    // Don't save during undo/redo
    if (isUndoRedoAction) {
      return
    }

    // Don't save if it's a remote update
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false
      return
    }

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Debounce history saves (wait 800ms after last change)
    saveTimeoutRef.current = setTimeout(() => {
      saveState(shapes)
    }, 800)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [shapes, saveState, isUndoRedoAction])

  useEffect(() => {
    if (!socket) return

    // When joining room, receive initial state
    socket.on('room_joined', ({ shapes, users }) => {
      console.log('📦 Received initial state:', { shapes: shapes.length, users: users.length })
      isRemoteUpdate.current = true
      setShapes(shapes)
      setUsers(users)
      if (shapes.length > 0) {
        saveState(shapes)
      }
    })

    // When new user joins
    socket.on('user_joined', (user) => {
      console.log('👤 User joined:', user.name)
      addUser(user)
    })

    // When user leaves
    socket.on('user_left', (userId) => {
      console.log('👋 User left:', userId)
      removeUser(userId)
    })

    // Shape events - mark as remote update
    socket.on('shape_created', (shape) => {
      // Ignore if it's our own echo (server may include userId) or if we already have the shape
      const currentShapes = useBoardStore.getState().shapes
      const exists = currentShapes.some((s) => s.id === shape.id)
      if (shape.userId && shape.userId === socket.id) {
        console.log('🔁 Ignoring own shape echo:', shape.id)
        return
      }
      if (exists) {
        console.log('🔁 Ignoring duplicate shape (already present):', shape.id)
        return
      }
      console.log('🎨 Remote shape created:', shape.id)
      isRemoteUpdate.current = true
      addShape(shape)
    })

    socket.on('shape_updated', (shape) => {
      // Ignore own echo or handle unknown shape
      const currentShapes = useBoardStore.getState().shapes
      const exists = currentShapes.some((s) => s.id === shape.id)
      if (shape.userId && shape.userId === socket.id) {
        console.log('🔁 Ignoring own update echo for:', shape.id)
        return
      }
      if (!exists) {
        console.log('⚠️ Received update for unknown shape, adding:', shape.id)
        isRemoteUpdate.current = true
        addShape(shape)
        return
      }
      isRemoteUpdate.current = true
      updateShape(shape)
    })

    socket.on('shape_deleted', (shapeId) => {
      console.log('🗑️ Remote shape deleted:', shapeId)
      isRemoteUpdate.current = true
      deleteShape(shapeId)
    })

    socket.on('board_cleared', () => {
      console.log('🧹 Board cleared remotely')
      isRemoteUpdate.current = true
      clearShapes()
    })

    return () => {
      socket.off('room_joined')
      socket.off('user_joined')
      socket.off('user_left')
      socket.off('shape_created')
      socket.off('shape_updated')
      socket.off('shape_deleted')
      socket.off('board_cleared')
    }
  }, [socket, roomId, addShape, updateShape, deleteShape, clearShapes, setShapes, setUsers, addUser, removeUser, saveState])
}