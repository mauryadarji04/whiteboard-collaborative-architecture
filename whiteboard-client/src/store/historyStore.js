import { create } from 'zustand'

const MAX_HISTORY = 50

export const useHistoryStore = create((set, get) => ({
  past: [],
  future: [],
  isUndoRedoAction: false, // Flag to prevent saving during undo/redo

  // Save current state to history
  saveState: (shapes) => {
    const { past, isUndoRedoAction } = get()
    
    // Don't save during undo/redo operations
    if (isUndoRedoAction) {
      console.log('⏸️ Skipping save: undo/redo in progress')
      return
    }
    
    // Deep clone to avoid reference issues
    const shapesClone = JSON.parse(JSON.stringify(shapes))
    
    // Don't save if empty
    if (shapesClone.length === 0 && past.length === 0) {
      console.log('⏭️ Skipping save: empty initial state')
      return
    }
    
    // Don't save if it's the same as the last state
    if (past.length > 0) {
      const lastState = past[past.length - 1]
      if (JSON.stringify(lastState) === JSON.stringify(shapesClone)) {
        console.log('⏭️ Skipping save: state unchanged (no-op)')
        return
      }
    }
    
    const newPast = [...past, shapesClone].slice(-MAX_HISTORY)
    
    set({
      past: newPast,
      future: [], // Clear future when new action is made
    })
    
    console.log('💾 History saved. Total states:', newPast.length, 'Shapes:', shapesClone.length)
  },

  // Undo action
  undo: () => {
    const { past } = get()
    
    if (past.length === 0) {
      console.log('↶ Nothing to undo')
      return null
    }

    // Get the previous state (before the last one)
    const targetIndex = past.length - 2
    const previousState = targetIndex >= 0 ? past[targetIndex] : []
    
    // Move current state to future
    const currentState = past[past.length - 1]
    const newPast = past.slice(0, -1)
    
    set({
      past: newPast,
      future: [currentState, ...get().future].slice(0, MAX_HISTORY),
      isUndoRedoAction: true,
    })

    // Reset flag after a short delay
    setTimeout(() => {
      set({ isUndoRedoAction: false })
    }, 100)

    console.log('↶ Undo executed. Remaining history:', newPast.length, 'Restored shapes:', previousState.length)
    return previousState
  },

  // Redo action
  redo: () => {
    const { past, future } = get()
    
    if (future.length === 0) {
      console.log('↷ Nothing to redo')
      return null
    }

    const nextState = future[0]
    const newFuture = future.slice(1)
    
    set({
      past: [...past, nextState].slice(-MAX_HISTORY),
      future: newFuture,
      isUndoRedoAction: true,
    })

    // Reset flag after a short delay
    setTimeout(() => {
      set({ isUndoRedoAction: false })
    }, 100)

    console.log('↷ Redo executed. Remaining future:', newFuture.length, 'Restored shapes:', nextState.length)
    return nextState
  },

  // Clear history
  clearHistory: () => {
    set({ past: [], future: [], isUndoRedoAction: false })
    console.log('🗑️ History cleared')
  },

  // Check if can undo/redo
  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}))