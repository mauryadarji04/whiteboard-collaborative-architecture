import { create } from 'zustand'

export const usePresenceStore = create((set) => ({
  users: [],
  cursors: {},

  // Actions
  setUsers: (users) => set({ users }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users.filter(u => u.id !== user.id), user],
    })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
      cursors: Object.fromEntries(
        Object.entries(state.cursors).filter(([id]) => id !== userId)
      ),
    })),

  updateCursor: (userId, position) =>
    set((state) => ({
      cursors: {
        ...state.cursors,
        [userId]: position,
      },
    })),

  clearCursors: () => set({ cursors: {} }),
}))