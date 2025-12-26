import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { config } from './config/env.js'
import { setupSocketHandlers } from './socket/index.js'

const app = express()
const server = createServer(app)

// Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}))
app.use(express.json())

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: config.clientUrl,
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

// Setup socket event handlers
setupSocketHandlers(io)

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  })
})

// API info route
app.get('/', (req, res) => {
  res.json({
    name: 'Whiteboard Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      socket: 'Socket.io connection available'
    }
  })
})

// Start server
server.listen(config.port, () => {
  console.log('=================================')
  console.log('Whiteboard Server Started')
  console.log('=================================')
  console.log(`Port: ${config.port}`)
  console.log(`Client URL: ${config.clientUrl}`)
  console.log(`Environment: ${config.nodeEnv}`)
  console.log(`Socket.io: Ready`)
  console.log('=================================')
})

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, closing server...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})