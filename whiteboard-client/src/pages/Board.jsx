import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'
import { useBoardSync } from '../hooks/useBoardSync'
import { useCursorTracking } from '../hooks/useCursorTracking'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts' // ← Hook (functionality)
import { useBoardStore } from '../store/boardStore'
import CanvasStage from '../components/canvas/CanvasStage'
import CursorOverlay from '../components/canvas/CursorOverlay'
import Toolbar from '../components/toolbar/Toolbar'
import UsersPanel from '../components/panels/UsersPanel'
import UndoRedoPanel from '../components/panels/UndoRedoPanel'
import KeyboardShortcutsPanel from '../components/panels/KeyboardShortcutsPanel' // ← UI Component (display)

export default function Board() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [username] = useState(localStorage.getItem('username') || 'Anonymous')
  const { socket, isConnected } = useSocket(roomId, username)
  
  const clearShapes = useBoardStore((state) => state.clearShapes)
  const selectedShapeId = useBoardStore((state) => state.selectedShapeId)

  // Setup real-time sync
  useBoardSync(socket, roomId)

  // Setup cursor tracking
  useCursorTracking(socket, isConnected)

  // Setup keyboard shortcuts (HOOK - makes keyboard work)
  useKeyboardShortcuts(socket)

  useEffect(() => {
    // Redirect if no username
    if (!localStorage.getItem('username')) {
      navigate('/')
      return
    }

    // Join room when socket connects
    if (socket && isConnected) {
      socket.emit('join_room', { roomId, username })
    }
  }, [socket, isConnected, roomId, username, navigate])

  const handleClearBoard = () => {
    if (window.confirm('Are you sure you want to clear the board? This action cannot be undone.')) {
      clearShapes()
      if (socket) {
        socket.emit('clear_board')
      }
    }
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    // Show toast notification
    const toast = document.createElement('div')
    toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    toast.textContent = '✓ Room ID copied!'
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2000)
  }

  const handleLeaveRoom = () => {
    if (window.confirm('Are you sure you want to leave this room?')) {
      if (socket) {
        socket.emit('leave_room', roomId)
      }
      navigate('/')
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-800">
            🎨 Whiteboard
          </h1>
          <button
            onClick={copyRoomId}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
            title="Click to copy"
          >
            Room: <span className="font-mono font-semibold">{roomId}</span>
            <span className="text-xs">📋</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              isConnected
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}
            />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>

          <span className="text-sm text-gray-600 font-medium px-3 py-1.5 bg-gray-100 rounded-full">
            {username}
          </span>

          <button
            onClick={handleLeaveRoom}
            className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
          >
            Leave
          </button>
        </div>
      </header>

      {/* Canvas Area */}
      <main className="flex-1 relative overflow-hidden">
        {isConnected ? (
          <>
            {/* Canvas */}
            <CanvasStage socket={socket} />
            
            {/* Cursor Overlay */}
            <CursorOverlay socket={socket} />
            
            {/* Toolbar (Left Side) */}
            <Toolbar onClear={handleClearBoard} />
            
            {/* Users Panel (Right Side) */}
            <UsersPanel />
            
            {/* Undo/Redo Panel (Top Center) */}
            <UndoRedoPanel />
            
            {/* Keyboard Shortcuts Panel (Bottom Left) - OPTIONAL UI */}
            <KeyboardShortcutsPanel />

            {/* Selection Indicator (Bottom Right) */}
            {selectedShapeId && (
              <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 text-sm text-gray-600 z-10">
                Shape selected • Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">Delete</kbd> to remove
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4 animate-bounce">🔌</div>
              <p className="text-2xl font-medium text-gray-600">Connecting to server...</p>
              <p className="text-sm text-gray-400">Please wait</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
