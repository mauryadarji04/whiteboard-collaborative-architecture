import { useHistoryStore } from '../../store/historyStore'
import { useBoardStore } from '../../store/boardStore'

export default function UndoRedoPanel() {
  const past = useHistoryStore((state) => state.past)
  const future = useHistoryStore((state) => state.future)
  const undo = useHistoryStore((state) => state.undo)
  const redo = useHistoryStore((state) => state.redo)
  const setShapes = useBoardStore((state) => state.setShapes)

  const canUndo = past.length > 0
  const canRedo = future.length > 0

  const handleUndo = () => {
    if (!canUndo) return
    
    const previousState = undo()
    if (previousState) {
      setShapes(previousState)
      console.log('↶ Undo button clicked - restored', previousState.length, 'shapes')
    }
  }

  const handleRedo = () => {
    if (!canRedo) return
    
    const nextState = redo()
    if (nextState) {
      setShapes(nextState)
      console.log('↷ Redo button clicked - restored', nextState.length, 'shapes')
    }
  }

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2 z-10">
      <button
        onClick={handleUndo}
        disabled={!canUndo}
        className={`px-3 py-2 rounded transition-colors flex items-center gap-2 ${
          canUndo
            ? 'text-gray-700 hover:bg-gray-100 cursor-pointer'
            : 'text-gray-300 cursor-not-allowed'
        }`}
        title={`Undo (Ctrl+Z) - ${past.length} actions`}
      >
        <span className="text-lg">↶</span>
        <span className="text-xs text-gray-500">{past.length}</span>
      </button>

      <div className="w-px h-6 bg-gray-300"></div>

      <button
        onClick={handleRedo}
        disabled={!canRedo}
        className={`px-3 py-2 rounded transition-colors flex items-center gap-2 ${
          canRedo
            ? 'text-gray-700 hover:bg-gray-100 cursor-pointer'
            : 'text-gray-300 cursor-not-allowed'
        }`}
        title={`Redo (Ctrl+Shift+Z) - ${future.length} actions`}
      >
        <span className="text-lg">↷</span>
        <span className="text-xs text-gray-500">{future.length}</span>
      </button>
    </div>
  )
}