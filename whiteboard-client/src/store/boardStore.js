import { create } from 'zustand'

export const useBoardStore = create((set) => ({
  shapes: [],
  selectedShapeId: null,

  // Actions
  addShape: (shape) =>
    set((state) => {
      const newShapes = [...state.shapes, shape]
      console.log('➕ addShape - total shapes:', newShapes.length, 'id:', shape.id)
      return { shapes: newShapes }
    }),

  updateShape: (updatedShape) =>
    set((state) => {
      const newShapes = state.shapes.map((shape) =>
        shape.id === updatedShape.id ? updatedShape : shape
      )
      console.log('✏️ updateShape - id:', updatedShape.id)
      return { shapes: newShapes }
    }),

  deleteShape: (shapeId) =>
    set((state) => {
      const newShapes = state.shapes.filter((shape) => shape.id !== shapeId)
      console.log('🗑️ deleteShape - removed id:', shapeId, 'remaining:', newShapes.length)
      return { shapes: newShapes, selectedShapeId: state.selectedShapeId === shapeId ? null : state.selectedShapeId }
    }),

  setShapes: (shapes) => {
    console.log('🔁 setShapes - count:', shapes.length)
    return set({ shapes })
  },

  setSelectedShapeId: (id) => set({ selectedShapeId: id }),

  clearShapes: () => {
    console.log('🧹 clearShapes')
    return set({ shapes: [], selectedShapeId: null })
  },
}))
