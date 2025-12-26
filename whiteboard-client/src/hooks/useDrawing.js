import { useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useBoardStore } from '../store/boardStore'

export function useDrawing({ currentTool, currentColor, strokeWidth, addShape, updateShape, socket, saveState, shapes }) {
  const [isDrawing, setIsDrawing] = useState(false)
  const currentShapeRef = useRef(null)

  const handleMouseDown = (e) => {
    if (currentTool === 'select') return

    setIsDrawing(true)
    const stage = e.target.getStage()
    const pos = stage.getPointerPosition()

    const newShape = {
      id: uuidv4(),
      x: pos.x,
      y: pos.y,
      fill: currentColor,
      stroke: currentColor,
      strokeWidth: strokeWidth,
    }

    if (currentTool === 'rect') {
      newShape.type = 'rect'
      newShape.width = 0
      newShape.height = 0
    } else if (currentTool === 'circle') {
      newShape.type = 'circle'
      newShape.radius = 0
    } else if (currentTool === 'line') {
      newShape.type = 'line'
      newShape.points = [0, 0]
    }

    currentShapeRef.current = newShape
    
    // Optimistic update - add to local state immediately
    addShape(newShape)
    
    // Emit to server
    if (socket) {
      socket.emit('draw_shape', newShape)
    }

    console.log('🎨 Started drawing:', newShape.type, newShape.id)
  }

  const handleMouseMove = (e) => {
    if (!isDrawing || currentTool === 'select') return

    const stage = e.target.getStage()
    const pos = stage.getPointerPosition()
    const shape = currentShapeRef.current

    if (!shape) return

    if (currentTool === 'rect') {
      const width = pos.x - shape.x
      const height = pos.y - shape.y
      
      const updatedShape = {
        ...shape,
        width,
        height,
      }
      
      updateShape(updatedShape)
      currentShapeRef.current = updatedShape
      
      // Emit update (throttled on server side)
      if (socket) {
        socket.emit('update_shape', updatedShape)
      }
    } else if (currentTool === 'circle') {
      const dx = pos.x - shape.x
      const dy = pos.y - shape.y
      const radius = Math.sqrt(dx * dx + dy * dy)
      
      const updatedShape = {
        ...shape,
        radius,
      }
      
      updateShape(updatedShape)
      currentShapeRef.current = updatedShape
      
      if (socket) {
        socket.emit('update_shape', updatedShape)
      }
    } else if (currentTool === 'line') {
      const newPoints = [...shape.points, pos.x - shape.x, pos.y - shape.y]
      
      const updatedShape = {
        ...shape,
        points: newPoints,
      }
      
      updateShape(updatedShape)
      currentShapeRef.current = updatedShape
      
      if (socket) {
        socket.emit('update_shape', updatedShape)
      }
    }
  }

  const handleMouseUp = () => {
    if (isDrawing) {
      console.log('🎨 Finished drawing:', currentShapeRef.current?.type, currentShapeRef.current?.id)
      // Immediate save after finishing drawing to ensure each completed shape is captured
      try {
        const currentShapes = useBoardStore.getState().shapes
        console.log('💾 Immediate history save (mouse up). Shapes:', currentShapes.length)
        if (saveState) saveState(currentShapes)
      } catch (err) {
        console.warn('⚠️ Error on immediate save:', err)
      }
    }
    setIsDrawing(false)
    currentShapeRef.current = null
  }

  return {
    isDrawing,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}
