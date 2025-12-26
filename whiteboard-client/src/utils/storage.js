/**
 * Local storage utilities for saving board state
 */

const STORAGE_KEYS = {
  USERNAME: 'whiteboard_username',
  RECENT_ROOMS: 'whiteboard_recent_rooms',
  PREFERENCES: 'whiteboard_preferences',
}

export const storage = {
  // Username
  getUsername: () => {
    return localStorage.getItem(STORAGE_KEYS.USERNAME)
  },

  setUsername: (username) => {
    localStorage.setItem(STORAGE_KEYS.USERNAME, username)
  },

  // Recent rooms
  getRecentRooms: () => {
    try {
      const rooms = localStorage.getItem(STORAGE_KEYS.RECENT_ROOMS)
      return rooms ? JSON.parse(rooms) : []
    } catch {
      return []
    }
  },

  addRecentRoom: (roomId) => {
    const rooms = storage.getRecentRooms()
    const updated = [roomId, ...rooms.filter(id => id !== roomId)].slice(0, 5)
    localStorage.setItem(STORAGE_KEYS.RECENT_ROOMS, JSON.stringify(updated))
  },

  // Preferences
  getPreferences: () => {
    try {
      const prefs = localStorage.getItem(STORAGE_KEYS.PREFERENCES)
      return prefs ? JSON.parse(prefs) : {}
    } catch {
      return {}
    }
  },

  setPreferences: (preferences) => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences))
  },

  // Clear all
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  },
}