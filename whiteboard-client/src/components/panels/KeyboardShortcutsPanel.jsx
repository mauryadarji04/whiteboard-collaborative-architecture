import { useState } from 'react'

export default function KeyboardShortcutsPanel() {
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts = [
    { keys: ['Delete', 'Backspace'], action: 'Delete selected shape' },
    { keys: ['Ctrl/Cmd', 'Z'], action: 'Undo' },
    { keys: ['Ctrl/Cmd', 'Shift', 'Z'], action: 'Redo' },
    { keys: ['Ctrl/Cmd', 'Y'], action: 'Redo (alternative)' },
    { keys: ['Esc'], action: 'Deselect shape' },
  ]

  return (
    <div className="absolute bottom-4 left-4 z-10">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white rounded-full shadow-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <span>⌨️</span>
        <span>Shortcuts</span>
      </button>

      {/* Shortcuts Panel */}
      {isOpen && (
        <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-xl p-4 w-80 animate-slide-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Keyboard Shortcuts
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm text-gray-600">{shortcut.action}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, i) => (
                    <span key={i}>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">
                        {key}
                      </kbd>
                      {i < shortcut.keys.length - 1 && (
                        <span className="mx-1 text-gray-400">+</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}