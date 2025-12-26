import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

export default function Home() {
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const createRoom = () => {
    const newRoomId = uuidv4().slice(0, 8)
    if (username.trim()) {
      localStorage.setItem('username', username)
      navigate(`/board/${newRoomId}`)
    } else {
      alert('Please enter your name')
    }
  }

  const joinRoom = () => {
    if (!roomId.trim()) {
      alert('Please enter a room ID')
      return
    }
    if (username.trim()) {
      localStorage.setItem('username', username)
      navigate(`/board/${roomId}`)
    } else {
      alert('Please enter your name')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (roomId.trim()) {
        joinRoom()
      } else {
        createRoom()
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎨 Whiteboard
          </h1>
          <p className="text-gray-600">Collaborate in real-time</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name"
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Button onClick={createRoom} className="w-full" variant="primary">
              Create New Board
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <Input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter Room ID"
              className="w-full"
            />

            <Button onClick={joinRoom} className="w-full" variant="secondary">
              Join Existing Board
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>✨ Multi-user drawing</p>
          <p>⏪ Time travel</p>
          <p>👥 Live cursors</p>
        </div>
      </div>
    </div>
  )
}