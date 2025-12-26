import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

console.log('Initializing socket connection to:', SOCKET_URL)

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Manual connection control
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  timeout: 10000,
})

// Debug listeners
socket.on('connect', () => {
  console.log('Socket connected successfully')
})

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error.message)
})

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason)
})