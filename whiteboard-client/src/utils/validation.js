/**
 * Validation utilities
 */

export const validation = {
  isValidRoomId: (roomId) => {
    return roomId && typeof roomId === 'string' && roomId.length >= 4
  },

  isValidUsername: (username) => {
    return username && typeof username === 'string' && username.trim().length > 0
  },

  isValidColor: (color) => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return hexRegex.test(color)
  },

  sanitizeUsername: (username) => {
    return username.trim().slice(0, 30) // Max 30 characters
  },
}