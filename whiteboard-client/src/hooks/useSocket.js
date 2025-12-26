import { useEffect, useState } from 'react'
import { socket } from '../services/socket'

export function useSocket(roomId, username) {
  const [isConnected, setIsConnected] = useState(socket.connected)

  useEffect(() => {
    function onConnect() {
      console.log('Socket connected:', socket.id)
      setIsConnected(true)
    }

    function onDisconnect() {
      console.log('Socket disconnected')
      setIsConnected(false)
    }

    function onConnectError(error) {
      console.error('Connection error:', error)
      setIsConnected(false)
    }

    // Register event listeners
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)

    // Connect socket if not already connected
    if (!socket.connected) {
      socket.connect()
    }

    // Cleanup
    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
    }
  }, [])

  return { socket, isConnected }
}