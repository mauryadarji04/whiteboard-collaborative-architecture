import { useEffect } from 'react'
import { useBoardStore } from '../store/boardStore'
import { useHistoryStore } from '../store/historyStore'

export function useKeyboardShortcuts(socket) {
  const selectedShapeId = useBoardStore((state) => state.selectedShapeId)
  const deleteShape = useBoardStore((state) => state.deleteShape)
  const setSelectedShapeId = useBoardStore((state) => state.setSelectedShapeId)
  const setShapes = useBoardStore((state) => state.setShapes)
  
  const undo = useHistoryStore((state) => state.undo)
  const redo = useHistoryStore((state) => state.redo)
  const canUndo = useHistoryStore((state) => state.canUndo)
  const canRedo = useHistoryStore((state) => state.canRedo)

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent shortcuts when typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return
      }

      // Delete key - delete selected shape
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedShapeId) {
        e.preventDefault()
        deleteShape(selectedShapeId)
        
        // Emit to server
        if (socket) {
          socket.emit('delete_shape', selectedShapeId)
        }
        
        setSelectedShapeId(null)
        console.log('🗑️ Shape deleted via keyboard:', selectedShapeId)
      }

      // Undo - Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        
        if (canUndo()) {
          const previousState = undo()
          if (previousState) {
            setShapes(previousState)
            console.log('↶ Undo - restored state with', previousState.length, 'shapes')
          }
        } else {
          console.log('↶ Nothing to undo')
        }
      }

      // Redo - Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        e.preventDefault()
        
        if (canRedo()) {
          const nextState = redo()
          if (nextState) {
            setShapes(nextState)
            console.log('↷ Redo - restored state with', nextState.length, 'shapes')
          }
        } else {
          console.log('↷ Nothing to redo')
        }
      }

      // Escape - deselect
      if (e.key === 'Escape') {
        setSelectedShapeId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedShapeId, deleteShape, setSelectedShapeId, setShapes, socket, undo, redo, canUndo, canRedo])
}