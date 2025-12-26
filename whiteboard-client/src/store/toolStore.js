import { create } from 'zustand'

export const useToolStore = create((set) => ({
  currentTool: 'select',
  currentColor: '#000000',
  strokeWidth: 2,

  // Actions
  setTool: (tool) => set({ currentTool: tool }),
  setColor: (color) => set({ currentColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
}))