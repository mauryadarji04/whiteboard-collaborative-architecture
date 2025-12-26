import { useToolStore } from '../../store/toolStore'
import ToolButton from './ToolButton'
import ColorPicker from './ColorPicker'
import StrokeSelector from './StrokeSelector'

export default function Toolbar({ onClear }) {
  const currentTool = useToolStore((state) => state.currentTool)
  const setTool = useToolStore((state) => state.setTool)

  const tools = [
    { id: 'select', icon: '↖️', label: 'Select' },
    { id: 'rect', icon: '⬜', label: 'Rectangle' },
    { id: 'circle', icon: '⭕', label: 'Circle' },
    { id: 'line', icon: '✏️', label: 'Draw' },
  ]

  return (
    <div className="absolute top-20 left-4 bg-white rounded-lg shadow-lg p-3 z-10 w-48 max-h-[calc(100vh-120px)] overflow-y-auto">
      {/* Tool Selection */}
      <div className="space-y-1 mb-3">
        <p className="text-xs font-medium text-gray-500 uppercase px-2 mb-2">Tools</p>
        {tools.map((tool) => (
          <ToolButton
            key={tool.id}
            icon={tool.icon}
            label={tool.label}
            isActive={currentTool === tool.id}
            onClick={() => setTool(tool.id)}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3"></div>

      {/* Color Picker */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 uppercase px-2 mb-2">Color</p>
        <ColorPicker />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3"></div>

      {/* Stroke Width */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 uppercase px-2 mb-2">Stroke</p>
        <StrokeSelector />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3"></div>

      {/* Clear Button - Now visible! */}
      <button
        onClick={onClear}
        className="w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors flex items-center justify-center gap-2"
      >
        <span>🗑️</span>
        <span>Clear Board</span>
      </button>
    </div>
  )
}