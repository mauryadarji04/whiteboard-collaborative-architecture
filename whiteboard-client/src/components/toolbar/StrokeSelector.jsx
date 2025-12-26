import { useToolStore } from '../../store/toolStore'

export default function StrokeSelector() {
  const strokeWidth = useToolStore((state) => state.strokeWidth)
  const setStrokeWidth = useToolStore((state) => state.setStrokeWidth)

  const widths = [1, 2, 4, 6, 8]

  return (
    <div className="px-2 space-y-1">
      {/* Quick Preset Buttons */}
      {widths.map((width) => (
        <button
          key={width}
          onClick={() => setStrokeWidth(width)}
          className={`w-full h-7 rounded flex items-center justify-center transition-colors ${
            strokeWidth === width
              ? 'bg-indigo-100'
              : 'hover:bg-gray-100'
          }`}
        >
          <div
            className="bg-gray-800 rounded-full"
            style={{
              width: '60%',
              height: `${Math.min(width * 2, 12)}px`,
            }}
          />
        </button>
      ))}

      {/* Custom Stroke Slider */}
      <div className="pt-2">
        <label className="text-xs text-gray-500 block mb-1">Custom ({strokeWidth}px)</label>
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="w-full h-1.5"
        />
      </div>
    </div>
  )
}
