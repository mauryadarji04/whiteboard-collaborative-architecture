import { useToolStore } from '../../store/toolStore'

export default function ColorPicker() {
  const currentColor = useToolStore((state) => state.currentColor)
  const setColor = useToolStore((state) => state.setColor)

  const colors = [
    '#000000', // Black
    '#ef4444', // Red
    '#f59e0b', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#ec4899', // Pink
  ]

  return (
    <div className="px-2">
      {/* Color Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setColor(color)}
            className={`w-7 h-7 rounded transition-all ${
              currentColor === color
                ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110'
                : 'hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {/* Custom Color Input */}
      <div className="mt-2">
        <label className="text-xs text-gray-500 block mb-1">Custom</label>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-7 rounded border border-gray-300 cursor-pointer"
        />
      </div>
    </div>
  )
}