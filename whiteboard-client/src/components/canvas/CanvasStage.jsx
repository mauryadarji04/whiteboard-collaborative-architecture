import { useRef, useState, useEffect } from 'react'
import { Stage, Layer } from 'react-konva'
import { v4 as uuidv4 } from 'uuid'
import ShapeRenderer from './ShapeRendered'
import { useBoardStore } from '../../store/boardStore'
import { useToolStore } from '../../store/toolStore'
import { useDrawing } from '../../hooks/useDrawing'
import { useHistoryStore } from '../../store/historyStore'

export default function CanvasStage({ socket }) {
  const stageRef = useRef(null)
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 60, // Subtract header height
  })

  const shapes = useBoardStore((state) => state.shapes)
  const addShape = useBoardStore((state) => state.addShape)
  const updateShape = useBoardStore((state) => state.updateShape)
  const selectedShapeId = useBoardStore((state) => state.selectedShapeId)
  const setSelectedShapeId = useBoardStore((state) => state.setSelectedShapeId)

  const currentTool = useToolStore((state) => state.currentTool)
  const currentColor = useToolStore((state) => state.currentColor)
  const strokeWidth = useToolStore((state) => state.strokeWidth)

  const saveState = useHistoryStore((state) => state.saveState)

  // Debug: log when canvas re-renders and number of shapes
  useEffect(() => {
    console.log('🖼️ Canvas render — shapes:', shapes.length)
  }, [shapes])

  const { isDrawing, handleMouseDown, handleMouseMove, handleMouseUp } = useDrawing({
    currentTool,
    currentColor,
    strokeWidth,
    addShape,
    updateShape,
    socket,
    saveState,
    shapes,
  })

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 60,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle stage click for deselection
  const handleStageClick = (e) => {
    // If clicked on empty area, deselect
    if (e.target === e.target.getStage()) {
      setSelectedShapeId(null)
    }
  }

  return (
    <Stage
      ref={stageRef}
      width={dimensions.width}
      height={dimensions.height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleStageClick}
      style={{ cursor: getCursor(currentTool, isDrawing) }}
    >
      <Layer>
        {shapes.map((shape) => (
          <ShapeRenderer
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedShapeId}
            onSelect={() => setSelectedShapeId(shape.id)}
            onUpdate={(newAttrs) => {
              const updatedShape = { ...shape, ...newAttrs }
              updateShape(updatedShape)
              // Emit update to server
              if (socket) {
                socket.emit('update_shape', updatedShape)
              }
            }}
            tool={currentTool}
          />
        ))}
      </Layer>
    </Stage>
  )
}

function getCursor(tool, isDrawing) {
  if (isDrawing) return 'crosshair'
  
  switch (tool) {
    case 'select':
      return 'default'
    case 'rect':
    case 'circle':
    case 'line':
      return 'crosshair'
    case 'text':
      return 'text'
    default:
      return 'default'
  }
}